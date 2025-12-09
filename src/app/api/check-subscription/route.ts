import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

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

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Get current user session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      return NextResponse.json({ hasAccess: false }, { status: 200 });
    }

    // Check Supabase for active subscription
    const { data: subscription, error } = await supabase
      .from('user_subscriptions')
      .select('status')
      .eq('user_id', session.user.id)
      .eq('status', 'active')
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error checking subscription:', error);
    }

    return NextResponse.json({ 
      hasAccess: !!subscription && subscription.status === 'active' 
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error checking subscription:', error);
    return NextResponse.json({ hasAccess: false }, { status: 200 });
  }
}

