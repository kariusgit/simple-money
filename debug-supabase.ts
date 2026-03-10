import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log(`URL: ${url}`);
console.log(`Key length: ${key?.length || 0}`);

if (!url || !key) {
    console.error("Missing env vars in .env.local");
    process.exit(1);
}

const supabase = createClient(url, key);

async function test() {
    console.log("Testing connection...");
    try {
        const { data, error } = await supabase.from('profiles').select('id').limit(1);
        if (error) {
            console.error("Supabase Error:", error);
        } else {
            console.log("Success! Fetched data:", data);
        }
    } catch (err) {
        console.error("Exception caught:", err);
    }
}

test();
