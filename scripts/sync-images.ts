import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase URL or Service Role Key in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const IMAGE_DIR = path.join(process.cwd(), 'public', 'items', 'premium');

async function syncImages() {
    console.log('--- Starting Image Sync to Database ---');

    if (!fs.existsSync(IMAGE_DIR)) {
        console.error(`Directory not found: ${IMAGE_DIR}`);
        return;
    }

    const files = fs.readdirSync(IMAGE_DIR).filter(file => 
        ['.png', '.jpg', '.jpeg', '.webp'].includes(path.extname(file).toLowerCase())
    );

    console.log(`Found ${files.length} images in ${IMAGE_DIR}`);

    // Fetch existing task items to avoid duplicates
    const { data: existingItems, error: fetchErr } = await supabase
        .from('task_items')
        .select('image_url');
    
    if (fetchErr) {
        console.error('Error fetching existing items:', fetchErr);
        return;
    }

    const existingUrls = new Set(existingItems?.map(item => item.image_url) || []);
    console.log(`Database already has ${existingUrls.size} unique image URLs.`);

    const newFiles = files.filter(file => {
        const url = `/items/premium/${file}`;
        return !existingUrls.has(url);
    });

    console.log(`${newFiles.length} new images to sync.`);

    if (newFiles.length === 0) {
        console.log('No new images to sync. Exiting.');
        return;
    }

    // Level distribution - OMITTED because task_items doesn't have level_id in schema.sql
    const itemsToInsert = newFiles.map((file, index) => {
        const name = path.parse(file).name.replace(/[-_]/g, ' ');
        const capitalizedName = name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        
        return {
            title: capitalizedName,
            image_url: `/items/premium/${file}`,
            description: `A premium ${name} product curated for performance.`,
            category: 'premium',
            is_active: true
        };
    });

    // Bulk insert in chunks of 100
    const CHUNK_SIZE = 100;
    for (let i = 0; i < itemsToInsert.length; i += CHUNK_SIZE) {
        const chunk = itemsToInsert.slice(i, i + CHUNK_SIZE);
        console.log(`Inserting chunk ${Math.floor(i / CHUNK_SIZE) + 1}...`);
        const { error: insertErr } = await supabase
            .from('task_items')
            .insert(chunk);
        
        if (insertErr) {
            console.error(`Error inserting chunk starting at ${i}:`, insertErr);
        }
    }

    console.log('--- Sync Completed ---');
}

syncImages();
