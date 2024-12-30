import { GoogleGenerativeAI } from '@google/generative-ai';

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
    const model = genAI.getGenerativeModel({ model: "embedding-001" });
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
  