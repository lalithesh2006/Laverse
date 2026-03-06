import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

let env = '';
try { env = fs.readFileSync('.env.local', 'utf-8'); } catch (e) { env = fs.readFileSync('.env', 'utf-8'); }

let supabaseUrl = '';
let supabaseKey = '';
env.split('\n').forEach(line => {
    if (line.startsWith('VITE_SUPABASE_URL=')) supabaseUrl = line.split('=')[1].trim();
    if (line.startsWith('VITE_SUPABASE_ANON_KEY=')) supabaseKey = line.split('=')[1].trim();
});

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
    console.log('Fetching random post...');
    const { data, error } = await supabase
        .from('posts')
        .select('id, title, reads')
        .limit(1);

    if (error) { console.error(error); return; }

    console.log("Current data:", data[0]);

    console.log("Attempting update without auth...");
    const { data: updateData, error: updateError } = await supabase
        .from('posts')
        .update({ reads: 100 })
        .eq('id', data[0].id)
        .select();

    console.log('Update result data length:', updateData?.length || 0);
    if (updateError) console.error('Update Error:', updateError);
}

test();
