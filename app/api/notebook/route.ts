import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const supabase = await createClient()

  try {
    const { name, description } = await req.json();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('notebooks')
      .insert([
        { name, description, user_id: user.id }
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating notebook:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
export async function GET(req: NextRequest) {
  const supabase = await createClient()
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    } 
    const { data, error } = await supabase
      .from('notebooks')
      .select()
      .eq('user_id', user.id);  
    if (error) throw error;
    return NextResponse.json(data);
    } catch (error) {
    console.error('Error fetching notebooks:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
    
}