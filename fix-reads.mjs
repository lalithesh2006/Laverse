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

async function fix() {
    console.log('Fetching posts to fix reads...');
    const { data: posts, error } = await supabase.from('posts').select('id, reads');
    if (error) { console.error('Error fetching:', error); return; }

    console.log(`Updating ${posts.length} posts...`);
    let count = 0;

    for (const post of posts) {
        // Give each post a random realistic read count between 12 and 150
        const realisticReads = Math.floor(Math.random() * 140) + 12;

        await supabase
            .from('posts')
            .update({ reads: realisticReads })
            .eq('id', post.id);

        count++;
        if (count % 5 === 0) console.log(`Updated ${count}/${posts.length} posts...`);
    }

    console.log('Finished updating realistic reads!');
}

fix();
