import { generateEmbeddings, generateSummary } from "@/utils/ai";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (req: NextRequest) => {
    try {
        const supabase = await createClient();

        const id = req.nextUrl.searchParams.get('id');
        if (!id)
            return new Response('Missing id parameter', { status: 404 });

        const { data: Page, error } = await supabase.from('pages').select('content, embedding').eq('id', id).single();
        if (error) {
            return NextResponse.json({
                success: false,
                error: error.message,
                message: "Error Fetching Page"
            }, { status: 500 });
        }
        if (!Page) {
            return NextResponse.json({
                success: false,
                message: "Page not found"
            }, { status: 404 });
        }

        if (!Page.embedding) {
            const embeddings = await generateEmbeddings(Page.content);
            await supabase.from('pages').update({ embeddings }).eq('id', id)
        }
        const summary = await generateSummary(Page.content);

        
        return NextResponse.json({ success: true, summary }, { status: 200 });
    } catch (error) {

        return NextResponse.json({ success: false, message: "Something went wrong" }, { status: 500 });
    }
}

export const GET = async (req: NextRequest) => {
    try {
        const supabase = await createClient();
        const id = req.nextUrl.searchParams.get('id');
        if (!id)
            return new Response('Missing id parameter', { status: 404 });

        const { data: Page, error } = await supabase.from('pages').select('summary').eq('id', id).single();
        
        if (error) {
            return NextResponse.json({
                success: false,
                error: error.message,
                message: "Error Fetching Page"
            }, { status: 500 });
        }
        if (!Page) {
            return NextResponse.json({
                success: false,
                message: "Page not found"
            }, { status: 404 });
        }
        return NextResponse.json({ success: true, summary: Page.summary }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Something went wrong" }, { status: 500 });
    }
}

export const POST = async (req: NextRequest) => {
    try {
        const supabase = await createClient();
        const body = await req.json();
        const { pageId, summary} = body;
        if (!pageId || !summary)
            return new Response('Missing id or summary', { status: 400 });
       
        const { data, error } = await supabase.from('pages').update({ summary }).eq('id',pageId)
        if (error) {
            return NextResponse.json({
                success: false,
                error: error.message,
                message: "Error Updating Page"
                }, { status: 500 });
        }
        return NextResponse.json({ success: true, message: "Page updated successfully" }, { status:200})
    } catch (error) {

        return NextResponse.json({ success: false, message: "Something went wrong",error }, { status: 500 });
        
    }
}