import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl!, supabaseKey!);

async function checkSync() {
    console.log('--- Database Sync Check ---');
    
    // Check Task Items
    const { count: itemsCount, error: itemsErr } = await supabase
        .from('task_items')
        .select('*', { count: 'exact', head: true });
    
    // Check Profiles
    const { count: profilesCount, error: profilesErr } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

    // Check Levels
    const { count: levelsCount, error: levelsErr } = await supabase
        .from('levels')
        .select('*', { count: 'exact', head: true });

    console.log(`Task Items: ${itemsCount} items found.`);
    console.log(`Profiles: ${profilesCount} users found.`);
    console.log(`Levels: ${levelsCount} levels found.`);
    
    if (itemsErr) console.error('Items Err:', itemsErr);
    if (profilesErr) console.error('Profiles Err:', profilesErr);
    if (levelsErr) console.error('Levels Err:', levelsErr);
}

checkSync();
