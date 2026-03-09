import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase credentials missing.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function dumpLevels() {
  const { data, error } = await supabase.from('levels').select('id, name, commission_rate').order('id', { ascending: true });
  if (error) {
    console.error(error);
  } else {
    console.log('--- Current DB Levels ---');
    console.table(data);
  }
}

dumpLevels();
