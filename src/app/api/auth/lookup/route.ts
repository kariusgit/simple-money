import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { identifier, type } = await req.json();

        if (!identifier || !type) {
            return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseKey) {
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

        let query = supabaseAdmin.from('profiles').select('email');

        if (type === 'username') {
            query = query.ilike('username', identifier);
        } else if (type === 'phone') {
            query = query.eq('phone', identifier);
        } else {
            return NextResponse.json({ error: 'Invalid lookup type' }, { status: 400 });
        }

        const { data, error } = await query.maybeSingle();

        if (error || !data?.email) {
            return NextResponse.json({ error: 'Account not found' }, { status: 404 });
        }

        return NextResponse.json({ email: data.email });

    } catch (err: unknown) {
        console.error("Lookup Email Exception:", err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
