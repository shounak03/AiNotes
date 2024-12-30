import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

export async function generateEmbeddings(text: string): Promise<number[]> {
    const model = genAI.getGenerativeModel({ model: "embedding-001" });
    const result = await model.embedContent(text);
    return result.embedding;
}

export async function generateSummary(content: string): Promise<string> {
    const prompt = `Please provide a concise summary of the following text. Focus on the main points and key takeaways:\n\n${content}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
}
  