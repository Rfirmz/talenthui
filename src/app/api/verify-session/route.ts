import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia',
});

// Create server-side Supabase client with proper SSR support
async function createServerSupabaseClient() {
  const cookieStore = await cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { sessionId } = await request.json();
    
    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    // Get current user from session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Verify the checkout session with Stripe
    const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (stripeSession.payment_status === 'paid' && stripeSession.subscription) {
      // Get subscription details
      const subscription = await stripe.subscriptions.retrieve(
        stripeSession.subscription as string
      );

      // Store in Supabase
      const { error } = await supabase
        .from('user_subscriptions')
        .upsert({
          user_id: session.user.id,
          stripe_customer_id: stripeSession.customer as string,
          stripe_subscription_id: subscription.id,
          status: subscription.status === 'active' ? 'active' : 'inactive',
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id',
        });

      if (error) {
        console.error('Error storing subscription:', error);
        return NextResponse.json({ error: 'Failed to store subscription' }, { status: 500 });
      }

      return NextResponse.json({ 
        success: true, 
        hasAccess: subscription.status === 'active' 
      });
    }

    return NextResponse.json({ success: false, hasAccess: false });
  } catch (error: any) {
    console.error('Error verifying session:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

