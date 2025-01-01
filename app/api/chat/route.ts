// File: app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateChatResponse } from '@/utils/ai';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { messages, notebookId } = body;

    console.log('messages:', messages);
    console.log('notebookId:', notebookId);
    
    const supabase = await createClient();
    

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.log(session.user.id);
    


    const { response, error } = await generateChatResponse(messages, {
      notebookId,
      userId: session.user.id,
      maxResults: 5,
      similarityThreshold: 0.7
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    // Return response
    return new Response(response, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}