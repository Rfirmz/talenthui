import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Valid promo code
const VALID_PROMO_CODE = 'hawaiitalent';

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
    // Try to get access token from Authorization header first
    const authHeader = request.headers.get('authorization');
    let user = null;

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const supabase = await createServerSupabaseClient();
      const { data: { user: authUser }, error: userError } = await supabase.auth.getUser(token);
      
      if (!userError && authUser) {
        user = authUser;
      }
    }

    // Fallback to session from cookies
    if (!user) {
      const supabase = await createServerSupabaseClient();
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session?.user) {
        return NextResponse.json({ error: 'Unauthorized. Please log in first.' }, { status: 401 });
      }
      
      user = session.user;
    }

    const { promoCode } = await request.json();
    
    if (!promoCode) {
      return NextResponse.json({ error: 'Promo code is required' }, { status: 400 });
    }

    // Check if promo code is valid (case-insensitive)
    if (promoCode.toLowerCase() !== VALID_PROMO_CODE.toLowerCase()) {
      return NextResponse.json({ error: 'Invalid promo code' }, { status: 400 });
    }

    // Get supabase client for database operations
    const supabase = await createServerSupabaseClient();

    // Check if user already has an active subscription
    const { data: existingSubscription } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (existingSubscription) {
      return NextResponse.json({ 
        success: true, 
        message: 'You already have access!' 
      });
    }

    // Grant access by creating a subscription record
    const { error: insertError } = await supabase
      .from('user_subscriptions')
      .upsert({
        user_id: user.id,
        stripe_customer_id: null,
        stripe_subscription_id: `promo_${Date.now()}`,
        status: 'active',
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id',
      });

    if (insertError) {
      console.error('Error granting access:', insertError);
      return NextResponse.json({ 
        error: 'Failed to grant access. Please try again.' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Promo code applied! You now have access.' 
    });
  } catch (error: any) {
    console.error('Error applying promo code:', error);
    return NextResponse.json({ 
      error: error.message || 'Internal server error' 
    }, { status: 500 });
  }
}

