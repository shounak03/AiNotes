import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({error: 'Unauthorized'}, {status: 401})
    }

    try {
        const {name, title, content, summary} = await req.json();
        console.log(title, content, summary);
        
        if (!title || !content || !name) {
            return NextResponse.json({error: 'Title and content are required'}, {status: 400})
        }
        
        // First query - use different variable names
        const {data: notebookData, error: notebookError} = await supabase
            .from('notebooks')
            .select('id')
            .eq('user_id', user.id)
            .eq('name', name)
            .single()

        const notebook_id = notebookData?.id;

        // Second query - use different variable names
        const {data: pageData, error: pageError} = await supabase
            .from('pages')
            .insert([
                {title, content, summary, user_id: user.id, notebook_id: notebook_id}
            ])
    
        if (pageError)
            return NextResponse.json({
                success: false,
                error: pageError,
                message: "Error saving notes"
            }, {status: 500});

        return NextResponse.json({
            success: true,
            message: "notes saved successfully"
        }, {status: 200});

    } catch (error) {
        console.error('Error creating page:', error);
        return NextResponse.json({
            success: false,
            error: 'Internal Server Error'
        }, {status: 500});
    }
}

export async function GET(req: NextRequest) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if(!user){
        return NextResponse.json({error: 'Unauthorized'}, {status: 401})
    }   
    try {
        const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('user_id', user.id);
        if(error)
            return NextResponse.json({success:false,error,message:"Error fetching notes"}, {status: 500});
        return NextResponse.json({sucess:true,data});
    } catch (error) {
        console.error('Error fetching pages:', error);
        return NextResponse.json({success:false, error: 'Internal Server Error' }, { status: 500 });
    }

}