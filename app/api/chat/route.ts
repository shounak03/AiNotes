
export async function POST(req: NextRequest) {
  try {
      const body = await req.json();
      const { messages, notebookId } = body;

      console.log("messages = ",messages);
      console.log("notebookId = ", notebookId);
      
      
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

      // Fetch notebook content
      const { data: notebookPages, error: notebookError } = await supabase
          .from('pages')
          .select('title, content, summary')
          .eq('notebook_id', notebookId)
          .eq('user_id', user.id);

      if (notebookError) {
          return NextResponse.json({ error: notebookError.message }, { status: 500 });
      }

      const { response, error } = await generateChatResponse(messages, notebookPages);

      if (error) {
          return NextResponse.json({ error }, { status: 500 });
      }

      return NextResponse.json({ response });

  } catch (error) {
      console.log('Chat API error:', error);
      return NextResponse.json(
          { error: 'Internal server error' },
          { status: 500 }
      );
  }
}

import { createClient } from '@/utils/supabase/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);
// const model = genAI.getGenerativeModel({ model: 'gemini-pro' });


interface ChatMessage {
  type: 'user' | 'assistant';
  content: string;
}

interface NotebookPage {
  title: string;
  content: string;
  summary: string;
}

export async function generateChatResponse(
  messages: ChatMessage[],
  notebookPages: NotebookPage[]
): Promise<{ response: string; error: string | null }> {
  try {
      if (!Array.isArray(messages) || messages.length === 0) {
          return {
              response: '',
              error: 'No messages provided'
          };
      }

      // Get the latest user message
      const userQuery = messages[messages.length - 1].content;

      // Create context from notebook pages
      const context = notebookPages.map(page => `
          Title: ${page.title}
          Content: ${page.content}
          Summary: ${page.summary}
          ---
      `).join('\n');

      // Create conversation history
      const conversationHistory = messages
          .slice(0, -1) // Exclude the latest message as it will be part of the prompt
          .map(m => `${m.type}: ${m.content}`)
          .join('\n');

      // Create the prompt
      const prompt = `You are an AI assistant helping users with their notes. 
      Below is the content from their notebook:
      
      ${context}
      
      Previous conversation:
      ${conversationHistory}
      
      When answering:
      1. Use the information from the provided notes
      2. If the answer isn't in the notes, say so
      3. Reference specific notes/sections in your answer
      4. Keep responses clear and concise
      
      User's question: ${userQuery}`;

      const model = genAI.getGenerativeModel({
          model: "gemini-pro",
          safetySettings: [
              {
                  category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                  threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
              },
              {
                  category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                  threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
              },
          ],
      });

      // Generate response
      const result = await model.generateContent(prompt);
      const response = await result.response;

      return {
          response: response.text(),
          error: null
      };

  } catch (error) {
      console.error('Error generating chat response:', error);
      return {
          response: '',
          error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
  }
}