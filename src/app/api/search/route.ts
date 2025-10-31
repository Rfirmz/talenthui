import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  // Get search parameters
  const query = searchParams.get('q') || '';
  const island = searchParams.get('island') || '';
  const school = searchParams.get('school') || '';
  const title = searchParams.get('title') || '';
  const limit = parseInt(searchParams.get('limit') || '10');

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Start timer for performance tracking
    const startTime = Date.now();

    // Use the search_profiles function if query is provided
    if (query) {
      const { data, error } = await supabase.rpc('search_profiles', {
        search_query: query || null,
        filter_island: island || null,
        filter_school: school || null,
        filter_title: title || null,
        result_limit: limit,
      });

      if (error) {
        console.error('Search error:', error);
        return NextResponse.json(
          { error: 'Search failed', details: error.message },
          { status: 500 }
        );
      }

      const duration = Date.now() - startTime;

      return NextResponse.json({
        results: data || [],
        count: data?.length || 0,
        duration_ms: duration,
        query: {
          q: query,
          island,
          school,
          title,
          limit,
        },
      });
    } else {
      // Simple filter query without text search
      let queryBuilder = supabase
        .from('profiles')
        .select('id, first_name, last_name, full_name, username, current_title, current_company, city, island, school, skills, linkedin_url, avatar_url, years_experience')
        .eq('visibility', true);

      if (island) {
        queryBuilder = queryBuilder.eq('island', island);
      }

      if (school) {
        queryBuilder = queryBuilder.ilike('school', `%${school}%`);
      }

      if (title) {
        queryBuilder = queryBuilder.ilike('current_title', `%${title}%`);
      }

      queryBuilder = queryBuilder
        .order('years_experience', { ascending: false, nullsFirst: false })
        .limit(limit);

      const { data, error } = await queryBuilder;

      if (error) {
        console.error('Filter error:', error);
        return NextResponse.json(
          { error: 'Filter failed', details: error.message },
          { status: 500 }
        );
      }

      const duration = Date.now() - startTime;

      return NextResponse.json({
        results: data || [],
        count: data?.length || 0,
        duration_ms: duration,
        query: {
          island,
          school,
          title,
          limit,
        },
      });
    }
  } catch (error: any) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// Optional: POST endpoint for more complex search
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, filters, limit = 10 } = body;

    const supabase = createClient(supabaseUrl, supabaseKey);
    const startTime = Date.now();

    const { data, error } = await supabase.rpc('search_profiles', {
      search_query: query || null,
      filter_island: filters?.island || null,
      filter_school: filters?.school || null,
      filter_title: filters?.title || null,
      result_limit: limit,
    });

    if (error) {
      console.error('Search error:', error);
      return NextResponse.json(
        { error: 'Search failed', details: error.message },
        { status: 500 }
      );
    }

    const duration = Date.now() - startTime;

    return NextResponse.json({
      results: data || [],
      count: data?.length || 0,
      duration_ms: duration,
      query: {
        q: query,
        filters,
        limit,
      },
    });
  } catch (error: any) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

