import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {

        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError) {
            console.error('Auth error:', authError);
            return NextResponse.json({
                success: false,
                error: `Authentication error: ${authError.message}`
            }, {status: 401});
        }

        if (!user) {
            return NextResponse.json({
                success: false,
                error: 'No authenticated user found'
            }, {status: 401});
        }

        const body = await req.json();
        console.log('Received request body:', body);
        
        const {name, title, content, summary} = body;
        
        if (!name || !title || !content) {
            return NextResponse.json({
                success: false,
                error: `Missing required fields: ${!name ? 'name ' : ''}${!title ? 'title ' : ''}${!content ? 'content' : ''}`
            }, {status: 400});
        }

        // 5. Get notebook data
        console.log('Fetching notebook with name:', name);
        const {data: notebookData, error: notebookError} = await supabase
            .from('notebooks')
            .select('id')
            .eq('user_id', user.id)
            .eq('name', name)
            .single();

        if (notebookError) {
            console.error('Notebook fetch error:', notebookError);
            return NextResponse.json({
                success: false,
                error: `Error fetching notebook: ${notebookError.message}`
            }, {status: 500});
        }

        if (!notebookData) {
            return NextResponse.json({
                success: false,
                error: `No notebook found with name: ${name}`
            }, {status: 404});
        }

        // 6. Insert page
        console.log('Inserting new page with notebook_id:', notebookData.id);
        const {data: pageData, error: pageError} = await supabase
            .from('pages')
            .insert([{
                title,
                content,
                summary,
                user_id: user.id,
                notebook_id: notebookData.id
            }])
            .select()
            .single();

        if (pageError) {
            console.error('Page creation error:', pageError);
            return NextResponse.json({
                success: false,
                error: `Error creating page: ${pageError.message}`
            }, {status: 500});
        }

        // 7. Success response
        return NextResponse.json({
            success: true,
            message: "Note saved successfully",
            data: pageData
        }, {status: 200});

    } catch (error: any){
        // 8. Catch any unexpected errors
        console.error('Unexpected error in POST /api/page:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown server error',
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, {status: 500});
    }
}
export async function GET(req: NextRequest) {
    const supabase = await createClient();

    const notebook_id = req.nextUrl.searchParams.get('notebookId');
    console.log('notebook_id:', notebook_id);

    try {
        const { data, error } = await supabase
            .from('pages')
            .select('*')
            .eq('notebook_id', notebook_id)
            .order('created_at', { ascending: false });
        if (error)
            return NextResponse.json({ success: false, error, message: "Error fetching notes" }, { status: 500 });
        return NextResponse.json({ sucess: true, data });
    } catch (error) {
        console.error('Error fetching pages:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }

}

export async function DELETE(req: NextRequest) {

    const supabase = await createClient();
    const page_id = req.nextUrl.searchParams.get('pageId');
    const notebook_id = req.nextUrl.searchParams.get('notebookId');


    try {
        const { data, error } = await supabase
            .from('pages')
            .delete()
            .eq('id', page_id)
            .eq('notebook_id', notebook_id);
        if (error)
            return NextResponse.json({ success: false, error, message: "Error deleting note" }, { status: 500 });
        return NextResponse.json({ success: true, message: "Page deleted successfully" });
    } catch (error) {
        console.error('Error deleting page:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}