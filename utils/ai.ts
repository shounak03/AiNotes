import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import { createClient } from './supabase/server';
import { PostgrestError } from '@supabase/supabase-js';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });


function formatSummary(text: string): string {
  let cleanText = text
    .replace(/^\*\*Summary:\*\* /, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  // Split into overview and features sections
  let [overview, features] = cleanText.split(/Key Features:|Main Features:|Key Points:/i);

  // If there are no explicit features section, try to identify bullet points
  if (!features) {
    const bulletPoints = overview.match(/•[^•]+/g) || [];
    if (bulletPoints.length > 0) {
      features = bulletPoints.join('');
      overview = overview.replace(/•[^•]+/g, '').trim();
    }
  }

  // Format the overview paragraph
  overview = overview.trim();

  // Format the features section if it exists
  if (features) {
    // Convert various bullet point styles to consistent format
    features = features
      .replace(/[•∙●]/g, '•') // Standardize bullet points
      .split('•')
      .filter(point => point.trim()) // Remove empty points
      .map(point => `• ${point.trim()}`) // Add bullet point with proper spacing
      .join('\n\n') // Add double line break between points
      .trim();

    // Combine overview and features with proper spacing
    return `${overview}\n\nKey Features:\n\n${features}`;
  }

  return overview;
}

export async function generateEmbeddings(text: string): Promise<number[]> {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const result = await model.embedContent(text);
  return result.embedding;
}


export async function generateSummary(content: string): Promise<string> {
  const prompt = `
    Please provide a concise summary of the following text. 
    Structure the response in two parts:
    1. First, write a clear overview paragraph.
    2. Then, list 4-6 key features or points, each on a new line starting with a bullet point.
    
    Use this format:
    [Overview paragraph]
    
    Key Features:
    
    • [First point]
    
    • [Second point]
    
    • [Third point]
    
    Text to summarize:
    ${content}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return formatSummary(response.text());
}

interface Page {
  id: string;
  title: string;
  content: string;
  ai_summary: string;
  embedding: number[];
}

interface ChatMessage {
  type: 'user' | 'assistant';
  content: string;
}

interface ChatOptions {
  notebookId: string;
  userId: string;
  maxResults?: number;
  similarityThreshold?: number;
}

// export async function searchSimilarPages(
//   query: string,
//   notebookId: string,
//   userId: string,
//   maxResults: number = 5,
//   similarityThreshold: number = 0.7
// ): Promise<{ data: Page[] | null; error: PostgrestError | null }> {
//   try {
//     const supabase = await createClient();
//     // Generate embedding for the query using Google AI
//     const queryEmbedding = await generateEmbeddings(query);

//     // Search for similar pages using vector similarity
//     const { data, error } = await supabase.rpc('match_page_embeddings', {
//       query_embedding: queryEmbedding,
//       similarity_threshold: similarityThreshold,
//       match_count: maxResults,
//       p_notebook_id: notebookId,
//       p_user_id: userId
//     });

//     return { data, error };
//   } catch (error) {
//     console.error('Error searching similar pages:', error);
//     return { data: null, error: error as PostgrestError };
//   }
// }

export async function searchSimilarPages(
  query: string,
  notebookId: string,
  userId: string,
  maxResults: number = 5,
  similarityThreshold: number = 0.7
): Promise<{ data: Page[] | null; error: PostgrestError | null }> {
  try {
    const supabase = await createClient();
    const embeddings = await generateEmbeddings(query);
    
    // console.log("embeddings = ",embeddings);
    
    const queryEmbedding = embeddings.values;

    const { data, error } = await supabase.rpc('match_page_embeddings', {
      query_embedding: queryEmbedding, // Pass the array directly
      similarity_threshold: similarityThreshold,
      match_count: maxResults,
      p_notebook_id: notebookId,
      p_user_id: userId
    });

    return { data, error };
  } catch (error) {
    console.error('Error searching similar pages:', error);
    return { data: null, error: error as PostgrestError };
  }
}

export async function generateChatResponse(
  messages: ChatMessage[],
  options: ChatOptions
): Promise<{ response: string; error: string | null }> {
  try {

    console.log("messages = ",messages.length);
    
    if (!Array.isArray(messages) || messages.length === 0) {
      return {
        response: '',
        error: 'No messages provided'
      };
    }

    console.log("messages = ",messages[0].type);
    console.log("messages = ",messages[0].content);
    
    let userQuery = '';
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].type === 'user') {
        userQuery = messages[i].content;
        break;
      }
    }


    if (!userQuery) {
      userQuery = messages[0].content;
    }

    console.log("query = ",userQuery);
    
    const { data: relevantPages, error: searchError } = await searchSimilarPages(
      userQuery,
      options.notebookId,
      options.userId,
      options.maxResults,
      options.similarityThreshold
    );

    if (searchError) throw searchError;
    if (!relevantPages || relevantPages.length === 0) {
      return {
        response: "I couldn't find any relevant information in your notes to answer this question.",
        error: null
      };
    }

    // Create context from relevant pages
    const context = relevantPages.map(page => `
          Title: ${page.title}
          Content: ${page.content}
          Summary: ${page.ai_summary}
          ---
        `).join('\n');


    const conversationHistory = messages
      .filter(m => m.content?.trim()) 
      .map(m => `${m.type}: ${m.content}`)
      .join('\n');

    const prompt = `You are an AI assistant helping users with their notes. 
    Below is the relevant content from their notebook, found through semantic search:
    
    ${context}
    
    Previous conversation:
    ${conversationHistory}
    
    When answering:
    1. Only use information from the provided notes
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