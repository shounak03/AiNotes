import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const pageId = req.nextUrl.searchParams.get('pageId');
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('pages')
            .select('title, content, summary,updated_at')
            .eq('id', pageId)
            .single();

        if (error) {

            return NextResponse.json({ success: false, error, message: "Error fetching notes" }, { status: 500 });
        }

        return NextResponse.json({ sucess: true, data }, { status: 200 });
    } catch (error) {
        console.error('Error fetching pages:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });

    }

}

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const body = await req.json();
        const { pageId, content} = body;
        console.log(pageId, content);
        
        const { data, error } = await supabase
        .from("pages")
        .update({ content })
        .eq("id", pageId)
        .single();

        if (error) {
            console.log(error);
            
            return NextResponse.json({ success: false, error, message: "Error updating notes" }, { status: 500 });
        }
        return NextResponse.json({ success: true, data }, { status: 200 });
    

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
