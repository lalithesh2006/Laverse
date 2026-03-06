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
    console.log('Fetching top authors...');
    const { data, error } = await supabase
        .from('posts')
        .select('author_id, reads, profiles(id, full_name, username)')
        .eq('published', true);

    if (error) { console.error(error); return; }

    // Check initial posts array
    console.log(`Found ${data.length} posts.`);

    const authorMap = {};
    (data || []).forEach(post => {
        const p = post.profiles;
        if (!p) {
            console.log(`Warning: No profile found for post assigned to ${post.author_id}`);
            return;
        }
        if (!authorMap[post.author_id]) {
            authorMap[post.author_id] = {
                name: p.full_name || p.username || 'Anonymous',
                posts: 0,
                reads: 0,
            };
        }
        authorMap[post.author_id].posts += 1;
        authorMap[post.author_id].reads += (post.reads || 0);
    });

    console.log(JSON.stringify(authorMap, null, 2));
}

test();
