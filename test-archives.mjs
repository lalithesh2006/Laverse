import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

let env = '';
try {
    env = fs.readFileSync('.env.local', 'utf-8');
} catch (e) {
    env = fs.readFileSync('.env', 'utf-8');
}

let supabaseUrl = '';
let supabaseKey = '';

env.split('\n').forEach(line => {
    if (line.startsWith('VITE_SUPABASE_URL=')) supabaseUrl = line.split('=')[1].trim();
    if (line.startsWith('VITE_SUPABASE_ANON_KEY=')) supabaseKey = line.split('=')[1].trim();
});

if (!supabaseUrl || !supabaseKey) {
    console.log('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
    const { data, error } = await supabase
        .from('posts')
        .select('id, title, category, profiles(full_name)')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(3);

    console.log('Error:', error?.message || 'None');
    console.log('Data:', JSON.stringify(data, null, 2));

    // Also check stats
    const { data: statsData, error: statsErr } = await supabase
        .from('posts')
        .select('id, category, author_id, created_at')
        .eq('published', true);

    console.log('Stats Error:', statsErr?.message || 'None');
    console.log('Stats length:', statsData?.length);
    if (statsData) {
        console.log('Unique authors:', new Set(statsData.map(p => p.author_id)).size);
    }
}

test();
