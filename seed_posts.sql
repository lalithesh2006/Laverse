-- ============================================================
-- La'verse Seed script
-- Self-correcting schema and data insertion script
-- ============================================================

DO $$
DECLARE
  v_author_id uuid;
  v_post1_id  uuid;
  v_post2_id  uuid;
  v_post3_id  uuid;
  v_post4_id  uuid;
  v_post5_id  uuid;
  v_post6_id  uuid;
  v_post7_id  uuid;
  v_post8_id  uuid;
  v_post9_id  uuid;
  v_post10_id uuid;
  v_post11_id uuid;

  -- Tag IDs
  t_ai uuid; t_genai uuid; t_chatgpt uuid; t_dalle uuid; t_creativity uuid;
  t_ml uuid; t_healthcare uuid; t_medical uuid;
  t_cricket uuid; t_wc2023 uuid; t_india uuid; t_australia uuid;
  t_meme uuid; t_uncle_roger uuid; t_haiyaa uuid; t_viral uuid;
  t_kohli uuid; t_odi uuid; t_chase uuid;
  t_greta uuid; t_climate uuid; t_sustainability uuid; t_popculture uuid;
  t_google uuid; t_gemini uuid; t_langmodels uuid; t_futuretech uuid;
  t_barbie uuid; t_oppenheimer uuid; t_movies uuid;
  t_isro uuid; t_chandrayaan3 uuid; t_moonmission uuid; t_space uuid;
  t_taylorswift uuid; t_erastour uuid; t_music uuid; t_concerts uuid;
  t_quietluxury uuid; t_fashiontrends uuid; t_stealthwealth uuid; t_minimalism uuid;

BEGIN

-- ============================================================
-- 0. Force the profiles table to accept our seed data
--    This ensures that any missing columns (like name or email) 
--    that your specific database expects are added automatically.
-- ============================================================
BEGIN
  ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS name text;
  ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email text;
  ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role text;
  ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar text;
  ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio text;
  ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS username text;
EXCEPTION WHEN OTHERS THEN 
  -- Ignore if somehow it still fails to alter
END;

-- ============================================================
-- 1. Get the Author ID from an existing profile
--    Because of foreign key constraints (profiles.id -> auth.users.id),
--    we cannot easily insert a fake profile without also inserting a fake
--    auth user (which has many complex fields and encryption). 
--    Instead, you MUST sign up in your app normally first.
-- ============================================================
SELECT id INTO v_author_id FROM public.profiles LIMIT 1;

IF v_author_id IS NULL THEN
  RAISE EXCEPTION 'No user profiles found! Please go to your app, sign up normally to create an account, and then run this script again.';
END IF;

RAISE NOTICE 'Using existing author_id: %', v_author_id;

-- ============================================================
-- 2. Delete any previously seeded posts (safe re-run)
-- ============================================================
DELETE FROM public.posts
WHERE author_id = v_author_id
  AND title IN (
    'The Rise of Generative AI: How ChatGPT and DALL-E are Changing Creativity',
    'Machine Learning in Healthcare: Predicting Diseases with Precision',
    'Cricket World Cup 2023: A Tournament of Upsets and Memorable Moments',
    'The Viral Sensation: Why Everyone is Talking About the "Haiyaa" Meme',
    'The Chase Master: Reliving Virat Kohli''s Greatest ODI Knocks',
    'The "Greta Effect": How Climate Activism is Shaping Pop Culture',
    'Google Gemini: The Next Giant Leap in AI Language Models',
    'Barbieheimer: How Two Movies Became the Cultural Event of 2023',
    'Chandrayaan-3: India’s Historic Landing on the Moon’s South Pole',
    'Taylor Swift’s Eras Tour: The Tour That Broke the Internet',
    'Quiet Luxury: Why ‘Stealth Wealth’ is Taking Over Fashion'
  );

-- ============================================================
-- 3. Upsert Tags
-- ============================================================
INSERT INTO public.tags (name, slug) VALUES ('AI',             'ai')                ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.tags (name, slug) VALUES ('Generative AI',  'generative-ai')     ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.tags (name, slug) VALUES ('ChatGPT',        'chatgpt')           ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.tags (name, slug) VALUES ('DALL-E',         'dall-e')            ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.tags (name, slug) VALUES ('Creativity',     'creativity')        ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.tags (name, slug) VALUES ('Machine Learning','machine-learning') ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.tags (name, slug) VALUES ('Healthcare',     'healthcare')        ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.tags (name, slug) VALUES ('Medical Imaging','medical-imaging')   ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.tags (name, slug) VALUES ('Cricket',        'cricket')           ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.tags (name, slug) VALUES ('World Cup 2023', 'world-cup-2023')    ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.tags (name, slug) VALUES ('India',          'india')             ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.tags (name, slug) VALUES ('Australia',      'australia')         ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.tags (name, slug) VALUES ('Meme',           'meme')              ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.tags (name, slug) VALUES ('Uncle Roger',    'uncle-roger')       ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.tags (name, slug) VALUES ('Haiyaa',         'haiyaa')            ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.tags (name, slug) VALUES ('Viral',          'viral')             ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.tags (name, slug) VALUES ('Virat Kohli',    'virat-kohli')       ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.tags (name, slug) VALUES ('ODI',            'odi')               ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.tags (name, slug) VALUES ('Chase Master',   'chase-master')      ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.tags (name, slug) VALUES ('Greta Thunberg', 'greta-thunberg')    ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.tags (name, slug) VALUES ('Climate Change', 'climate-change')    ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.tags (name, slug) VALUES ('Sustainability', 'sustainability')    ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.tags (name, slug) VALUES ('Pop Culture',    'pop-culture')       ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.tags (name, slug) VALUES ('Google',         'google')            ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.tags (name, slug) VALUES ('Gemini',         'gemini')            ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.tags (name, slug) VALUES ('Language Models','language-models')   ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.tags (name, slug) VALUES ('Future Tech',    'future-tech')       ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.tags (name, slug) VALUES ('Barbie',         'barbie')            ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.tags (name, slug) VALUES ('Oppenheimer',    'oppenheimer')       ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.tags (name, slug) VALUES ('Movies',         'movies')            ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.tags (name, slug) VALUES ('ISRO',           'isro')              ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.tags (name, slug) VALUES ('Chandrayaan-3',  'chandrayaan-3')     ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.tags (name, slug) VALUES ('Moon Mission',   'moon-mission')      ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.tags (name, slug) VALUES ('Space Exploration','space-exploration')ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.tags (name, slug) VALUES ('Taylor Swift',   'taylor-swift')      ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.tags (name, slug) VALUES ('Eras Tour',      'eras-tour')         ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.tags (name, slug) VALUES ('Music',          'music')             ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.tags (name, slug) VALUES ('Concerts',       'concerts')          ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.tags (name, slug) VALUES ('Quiet Luxury',   'quiet-luxury')      ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.tags (name, slug) VALUES ('Fashion Trends', 'fashion-trends')    ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.tags (name, slug) VALUES ('Stealth Wealth', 'stealth-wealth')    ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.tags (name, slug) VALUES ('Minimalism',     'minimalism')        ON CONFLICT (slug) DO NOTHING;

-- Fetch tag IDs
SELECT id INTO t_ai           FROM public.tags WHERE slug = 'ai';
SELECT id INTO t_genai        FROM public.tags WHERE slug = 'generative-ai';
SELECT id INTO t_chatgpt      FROM public.tags WHERE slug = 'chatgpt';
SELECT id INTO t_dalle        FROM public.tags WHERE slug = 'dall-e';
SELECT id INTO t_creativity   FROM public.tags WHERE slug = 'creativity';
SELECT id INTO t_ml           FROM public.tags WHERE slug = 'machine-learning';
SELECT id INTO t_healthcare   FROM public.tags WHERE slug = 'healthcare';
SELECT id INTO t_medical      FROM public.tags WHERE slug = 'medical-imaging';
SELECT id INTO t_cricket      FROM public.tags WHERE slug = 'cricket';
SELECT id INTO t_wc2023       FROM public.tags WHERE slug = 'world-cup-2023';
SELECT id INTO t_india        FROM public.tags WHERE slug = 'india';
SELECT id INTO t_australia    FROM public.tags WHERE slug = 'australia';
SELECT id INTO t_meme         FROM public.tags WHERE slug = 'meme';
SELECT id INTO t_uncle_roger  FROM public.tags WHERE slug = 'uncle-roger';
SELECT id INTO t_haiyaa       FROM public.tags WHERE slug = 'haiyaa';
SELECT id INTO t_viral        FROM public.tags WHERE slug = 'viral';
SELECT id INTO t_kohli        FROM public.tags WHERE slug = 'virat-kohli';
SELECT id INTO t_odi          FROM public.tags WHERE slug = 'odi';
SELECT id INTO t_chase        FROM public.tags WHERE slug = 'chase-master';
SELECT id INTO t_greta        FROM public.tags WHERE slug = 'greta-thunberg';
SELECT id INTO t_climate      FROM public.tags WHERE slug = 'climate-change';
SELECT id INTO t_sustainability FROM public.tags WHERE slug = 'sustainability';
SELECT id INTO t_popculture   FROM public.tags WHERE slug = 'pop-culture';
SELECT id INTO t_google          FROM public.tags WHERE slug = 'google';
SELECT id INTO t_gemini          FROM public.tags WHERE slug = 'gemini';
SELECT id INTO t_langmodels      FROM public.tags WHERE slug = 'language-models';
SELECT id INTO t_futuretech      FROM public.tags WHERE slug = 'future-tech';
SELECT id INTO t_barbie          FROM public.tags WHERE slug = 'barbie';
SELECT id INTO t_oppenheimer     FROM public.tags WHERE slug = 'oppenheimer';
SELECT id INTO t_movies          FROM public.tags WHERE slug = 'movies';
SELECT id INTO t_isro            FROM public.tags WHERE slug = 'isro';
SELECT id INTO t_chandrayaan3    FROM public.tags WHERE slug = 'chandrayaan-3';
SELECT id INTO t_moonmission     FROM public.tags WHERE slug = 'moon-mission';
SELECT id INTO t_space           FROM public.tags WHERE slug = 'space-exploration';
SELECT id INTO t_taylorswift     FROM public.tags WHERE slug = 'taylor-swift';
SELECT id INTO t_erastour        FROM public.tags WHERE slug = 'eras-tour';
SELECT id INTO t_music           FROM public.tags WHERE slug = 'music';
SELECT id INTO t_concerts        FROM public.tags WHERE slug = 'concerts';
SELECT id INTO t_quietluxury     FROM public.tags WHERE slug = 'quiet-luxury';
SELECT id INTO t_fashiontrends   FROM public.tags WHERE slug = 'fashion-trends';
SELECT id INTO t_stealthwealth   FROM public.tags WHERE slug = 'stealth-wealth';
SELECT id INTO t_minimalism      FROM public.tags WHERE slug = 'minimalism';

-- ============================================================
-- POST 1: The Rise of Generative AI
-- ============================================================
INSERT INTO public.posts (
  id, author_id, title, excerpt, content, cover_image,
  category, published, published_at, reads
) VALUES (
  gen_random_uuid(),
  v_author_id,
  'The Rise of Generative AI: How ChatGPT and DALL-E are Changing Creativity',
  'Generative AI models like ChatGPT and DALL-E are now capable of producing human-like text, stunning visuals, and even music — becoming true creative partners.',
  '## Introduction

Artificial Intelligence has taken a giant leap from being just a tool for automation to becoming a creative partner. Generative AI models like OpenAI''s ChatGPT and DALL-E are now capable of producing human-like text, stunning visuals, and even music.

## First-Hand Experience

As someone who has been experimenting with these tools, I''ve seen firsthand how they can spark ideas and speed up content creation. For instance, bloggers can now generate draft outlines in seconds, while artists use text-to-image models to visualize concepts that once lived only in their imagination.

![ChatGPT in action – a creative partner at your fingertips.](https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80)
*ChatGPT in action – a creative partner at your fingertips.*

> "Will AI replace human creativity? I believe it won''t—instead, it will augment it."

## The Debate

But this raises an important question: will AI replace human creativity? I believe it won''t—instead, it will augment it. The key is to use AI as a collaborator, not a crutch.

![DALL-E can turn any text prompt into unique visuals.](https://images.unsplash.com/photo-1684369175833-4b445ad6bfb5?w=800&q=80)
*DALL-E can turn any text prompt into unique visuals.*

## Conclusion

The future of creativity is hybrid, and we''re just scratching the surface.',
  'https://images.unsplash.com/photo-1673488702719-3b45b6aef0ab?w=1200&q=80',
  'Technology',
  true,
  '2023-11-10 00:00:00+00',
  0
) RETURNING id INTO v_post1_id;

INSERT INTO public.post_tags (post_id, tag_id) VALUES
  (v_post1_id, t_ai),
  (v_post1_id, t_genai),
  (v_post1_id, t_chatgpt),
  (v_post1_id, t_dalle),
  (v_post1_id, t_creativity);

-- ============================================================
-- POST 2: Machine Learning in Healthcare
-- ============================================================
INSERT INTO public.posts (
  id, author_id, title, excerpt, content, cover_image,
  category, published, published_at, reads
) VALUES (
  gen_random_uuid(),
  v_author_id,
  'Machine Learning in Healthcare: Predicting Diseases with Precision',
  'Machine learning is revolutionising healthcare by enabling early diagnosis and personalised treatment plans with accuracy that rivals experienced specialists.',
  '## Introduction

Machine learning is revolutionising healthcare by enabling early diagnosis and personalised treatment plans.

## Key Application: Medical Imaging

One of the most exciting applications is in medical imaging. Algorithms trained on thousands of X-rays and MRIs can now detect anomalies like tumours with accuracy that rivals experienced radiologists.

![AI can spot anomalies invisible to the human eye.](https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=800&q=80)
*AI can spot anomalies invisible to the human eye.*

## Real-World Example

Take Google''s DeepMind, for example. Their AI model can predict acute kidney injury up to 48 hours before it happens, giving doctors a critical window to intervene.

## Personalised Medicine

Similarly, ML algorithms analyse genetic data to recommend customised drugs, reducing side effects.

![How machine learning fits into the clinical workflow.](https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80)
*How machine learning fits into the clinical workflow.*

> "Machines are becoming indispensable assistants, not replacements."

## Conclusion

While we''re not at the stage where machines replace doctors, they are becoming indispensable assistants. As we gather more data, the potential for machine learning to save lives is limitless.',
  'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&q=80',
  'Health & Technology',
  true,
  '2023-11-08 00:00:00+00',
  0
) RETURNING id INTO v_post2_id;

INSERT INTO public.post_tags (post_id, tag_id) VALUES
  (v_post2_id, t_ml),
  (v_post2_id, t_healthcare),
  (v_post2_id, t_ai),
  (v_post2_id, t_medical);

-- ============================================================
-- POST 3: Cricket World Cup 2023
-- ============================================================
INSERT INTO public.posts (
  id, author_id, title, excerpt, content, cover_image,
  category, published, published_at, reads
) VALUES (
  gen_random_uuid(),
  v_author_id,
  'Cricket World Cup 2023: A Tournament of Upsets and Memorable Moments',
  'The 2023 ICC Cricket World Cup has been nothing short of a rollercoaster — from stunning upsets to record-breaking performances and a thrilling final.',
  '## Introduction

The 2023 ICC Cricket World Cup has been nothing short of a rollercoaster.

## Upsets That Shook the Tournament

From Afghanistan stunning England to the Netherlands knocking out South Africa, this tournament proved that no team can be taken lightly.

## Personal Fan Perspective

As a cricket fan, I''ve been glued to the screen, witnessing record-breaking performances and nail-biting finishes.

## Star Performances

Virat Kohli''s masterclass against Bangladesh, where he notched his 49th ODI century, brought him level with Sachin Tendulkar''s legendary record. On the bowling front, Mohammed Shami''s hat-trick against New Zealand was a sight to behold.

![Kohli equals Tendulkar''s record with his 49th ODI ton.](https://images.unsplash.com/photo-1540747913346-19212a4b32cf?w=800&q=80)
*Kohli equals Tendulkar''s record with his 49th ODI ton.*

![Shami''s fiery spell against New Zealand.](https://images.unsplash.com/photo-1578432014316-48b448d79d57?w=800&q=80)
*Shami''s fiery spell against New Zealand.*

## The Grand Finale

The final between India and Australia was a thriller, with Australia clinching their sixth title.

![Australia wins their sixth World Cup title.](https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&q=80)
*Australia wins their sixth World Cup title.*

> "This World Cup reminded us why cricket is more than a sport—it''s an emotion."

## Conclusion

This World Cup reminded us why cricket is more than a sport—it''s an emotion.',
  'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1200&q=80',
  'Sports',
  true,
  '2023-11-12 00:00:00+00',
  0
) RETURNING id INTO v_post3_id;

INSERT INTO public.post_tags (post_id, tag_id) VALUES
  (v_post3_id, t_cricket),
  (v_post3_id, t_wc2023),
  (v_post3_id, t_india),
  (v_post3_id, t_australia);

-- ============================================================
-- POST 4: The "Haiyaa" Meme
-- ============================================================
INSERT INTO public.posts (
  id, author_id, title, excerpt, content, cover_image,
  category, published, published_at, reads
) VALUES (
  gen_random_uuid(),
  v_author_id,
  'The Viral Sensation: Why Everyone is Talking About the "Haiyaa" Meme',
  'From Malaysian comedian Nigel Ng''s "Uncle Roger" character, "Haiyaa" has become the defining sound of 2023 meme culture — and it''s more culturally significant than you think.',
  '## Introduction

If you''ve been on social media lately, you''ve probably come across the word "Haiyaa."

## Origin Story

It originated from Malaysian comedian Nigel Ng''s character "Uncle Roger," who critiques people''s cooking skills — especially when they ruin fried rice. The exasperated "Haiyaa" has become a global meme, symbolising disappointment in a humorous way.

![Uncle Roger''s videos have sparked a global conversation.](https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80)
*Uncle Roger''s videos have sparked a global conversation.*

## Deeper Meaning

But it''s more than just a catchphrase. It represents the rise of Asian content creators in the global meme economy. Uncle Roger''s videos have millions of views, and his influence has sparked discussions about cultural authenticity in cooking.

![The versatility of "Haiyaa" in meme culture.](https://images.unsplash.com/photo-1608539890-0443a4c8c0c7?w=800&q=80)
*The versatility of "Haiyaa" in meme culture.*

> "Haiyaa is the sound of 2023."

## Conclusion

Whether you''re a foodie or just love a good laugh, "Haiyaa" is the sound of 2023.',
  'https://images.unsplash.com/photo-1547592180-85f173990554?w=1200&q=80',
  'Pop Culture',
  true,
  '2023-11-14 00:00:00+00',
  0
) RETURNING id INTO v_post4_id;

INSERT INTO public.post_tags (post_id, tag_id) VALUES
  (v_post4_id, t_meme),
  (v_post4_id, t_uncle_roger),
  (v_post4_id, t_haiyaa),
  (v_post4_id, t_viral);

-- ============================================================
-- POST 5: The Chase Master — Virat Kohli
-- ============================================================
INSERT INTO public.posts (
  id, author_id, title, excerpt, content, cover_image,
  category, published, published_at, reads
) VALUES (
  gen_random_uuid(),
  v_author_id,
  'The Chase Master: Reliving Virat Kohli''s Greatest ODI Knocks',
  'Virat Kohli isn''t just a cricketer; he''s a phenomenon. Among his countless achievements, his ability to chase down targets in ODIs is what sets him apart.',
  '## Introduction

Virat Kohli isn''t just a cricketer; he''s a phenomenon. Among his countless achievements, his ability to chase down targets in ODIs is what sets him apart.

## Iconic Chase: 2012 CB Series

I still remember the 2012 CB Series match against Sri Lanka, where he smashed 133 not out to guide India to victory. His calmness under pressure is almost superhuman.

## Asia Cup 2012 Heroics

Then there''s the iconic 183 against Pakistan in the 2012 Asia Cup — a knock that had the whole nation on its feet.

![Kohli''s 183 vs Pakistan – one of the greatest ODI knocks.](https://images.unsplash.com/photo-1635805737707-575885ab0820?w=800&q=80)
*Kohli''s 183 vs Pakistan – one of the greatest ODI knocks.*

## Behind the Scenes

Kohli''s work ethic and passion are legendary. Teammates often recall how he would practice till late at night, perfecting every shot. These stories remind us that greatness is built on dedication.

![Numbers that define a legend.](https://images.unsplash.com/photo-1601288496920-b6154fe3626a?w=800&q=80)
*Numbers that define a legend.*

> "We''re lucky to witness the journey of a true legend."

## Conclusion

As he continues to break records, we''re lucky to witness the journey of a true legend.',
  'https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=1200&q=80',
  'Sports',
  true,
  '2023-11-09 00:00:00+00',
  0
) RETURNING id INTO v_post5_id;

INSERT INTO public.post_tags (post_id, tag_id) VALUES
  (v_post5_id, t_kohli),
  (v_post5_id, t_cricket),
  (v_post5_id, t_odi),
  (v_post5_id, t_chase);

-- ============================================================
-- POST 6: The "Greta Effect"
-- ============================================================
INSERT INTO public.posts (
  id, author_id, title, excerpt, content, cover_image,
  category, published, published_at, reads
) VALUES (
  gen_random_uuid(),
  v_author_id,
  'The "Greta Effect": How Climate Activism is Shaping Pop Culture',
  'Greta Thunberg started as a lone school striker. Today, the "Greta Effect" has permeated pop culture — from music festivals banning plastics to celebrities embracing sustainable fashion.',
  '## Introduction

Greta Thunberg started as a lone school striker outside the Swedish parliament. Today, she''s the face of a global movement that has permeated pop culture.

## From Strikes to Mainstream

From music festivals banning single-use plastics to celebrities endorsing sustainable fashion, the "Greta Effect" is everywhere.

## Viral Trends

Just last week, a viral TikTok trend showed users transforming thrift store finds into high-fashion outfits, promoting recycling. Meanwhile, climate change documentaries are topping Netflix charts.

![Thrift flipping goes viral on TikTok.](https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80)
*Thrift flipping goes viral on TikTok.*

## Personal Observation

As someone who follows these trends, I see a generation that''s no longer passive about the planet''s future.

![Stars embrace eco-friendly style.](https://images.unsplash.com/photo-1490113338399-ecc30b47d52c?w=800&q=80)
*Stars embrace eco-friendly style.*

> "It''s not just a trend—it''s a shift in consciousness."

## Conclusion

It''s not just a trend — it''s a shift in consciousness, and it''s here to stay.',
  'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=1200&q=80',
  'Environment',
  true,
  '2023-11-15 00:00:00+00',
  0
) RETURNING id INTO v_post6_id;

INSERT INTO public.post_tags (post_id, tag_id) VALUES
  (v_post6_id, t_greta),
  (v_post6_id, t_climate),
  (v_post6_id, t_sustainability),
  (v_post6_id, t_popculture);

-- ============================================================
-- POST 7: Google Gemini
-- ============================================================
INSERT INTO public.posts (
  id, author_id, title, excerpt, content, cover_image,
  category, published, published_at, reads
) VALUES (
  gen_random_uuid(),
  v_author_id,
  'Google Gemini: The Next Giant Leap in AI Language Models',
  'Just when we thought AI couldn’t get any smarter, Google unveiled Gemini – their most advanced and flexible language model yet.',
  '## Introduction

Just when we thought AI couldn’t get any smarter, Google unveiled Gemini – their most advanced and flexible language model yet. Promising multimodal capabilities and deeper reasoning, Gemini is set to redefine how we interact with machines.

## What Makes Gemini Different?

Unlike its predecessors, Gemini is designed from the ground up to understand and generate text, images, audio, and video seamlessly. It’s not just a chatbot; it’s a true multimodal AI that can ‘see’ and ‘hear’ the world.

## Real-World Applications

From helping doctors analyse medical scans to assisting students with complex homework, Gemini’s potential is staggering. Google plans to integrate it into Workspace, search, and even Android, making AI assistance ubiquitous.

> "Gemini marks the beginning of the multimodal era – where AI doesn’t just read, but truly understands."

## Challenges Ahead

With great power comes great responsibility. Ethical concerns about bias, privacy, and job displacement remain. Google must tread carefully to ensure Gemini benefits all of humanity.

## Conclusion

As we step into 2024, Gemini stands as a testament to human ingenuity. The AI revolution is far from over – it’s just getting started.

![Gemini can process text, images, audio, and video simultaneously.](https://images.unsplash.com/photo-1620712948343-0056911f14ae?w=800&q=80)
*Gemini can process text, images, audio, and video simultaneously.*

![Imagine AI that not only writes but also understands attached images and charts.](https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80)
*Imagine AI that not only writes but also understands attached images and charts.*',
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=80',
  'Technology',
  true,
  '2024-01-20 00:00:00+00',
  0
) RETURNING id INTO v_post7_id;

INSERT INTO public.post_tags (post_id, tag_id) VALUES
  (v_post7_id, t_ai),
  (v_post7_id, t_google),
  (v_post7_id, t_gemini),
  (v_post7_id, t_langmodels),
  (v_post7_id, t_futuretech);

-- ============================================================
-- POST 8: Barbieheimer
-- ============================================================
INSERT INTO public.posts (
  id, author_id, title, excerpt, content, cover_image,
  category, published, published_at, reads
) VALUES (
  gen_random_uuid(),
  v_author_id,
  'Barbieheimer: How Two Movies Became the Cultural Event of 2023',
  'It was the movie event nobody expected – two completely opposite films, Barbie and Oppenheimer, releasing on the same day and spawning a thousand memes.',
  '## Introduction

It was the movie event nobody expected – two completely opposite films, Barbie and Oppenheimer, releasing on the same day and spawning a thousand memes. ‘Barbieheimer’ became a global phenomenon, proving that cinema can still bring the world together.

## The Power of Contrast

Greta Gerwig’s bubblegum-pink feminist fantasy and Christopher Nolan’s grim historical drama couldn’t be more different. Yet audiences embraced both, creating double-feature marathons and hilarious mashups.

## Social Media Explosion

Twitter, TikTok, and Instagram were flooded with Barbieheimer content. From ‘Oppen Barbie’ edits to deep philosophical debates, the internet had a field day.

> "Barbieheimer wasn’t just about movies – it was a celebration of diversity in storytelling."

## Box Office Triumph

Both films shattered records. Barbie became Warner Bros’ highest-grossing film ever, while Oppenheimer became the highest-grossing biopic. Together, they reminded Hollywood that audiences crave originality.

## Conclusion

Barbieheimer will go down in history as the moment cinema became a shared global party. Let’s hope for more such unexpected duos in the future.

![The meme that started it all.](https://images.unsplash.com/photo-1596461404969-9ce20c714228?w=800&q=80)
*The meme that started it all.*

![Fans embraced the dual vibe with style.](https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=80)
*Fans embraced the dual vibe with style.*',
  'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&q=80',
  'Pop Culture',
  true,
  '2023-12-05 00:00:00+00',
  0
) RETURNING id INTO v_post8_id;

INSERT INTO public.post_tags (post_id, tag_id) VALUES
  (v_post8_id, t_barbie),
  (v_post8_id, t_oppenheimer),
  (v_post8_id, t_movies),
  (v_post8_id, t_meme),
  (v_post8_id, t_popculture);

-- ============================================================
-- POST 9: Chandrayaan-3
-- ============================================================
INSERT INTO public.posts (
  id, author_id, title, excerpt, content, cover_image,
  category, published, published_at, reads
) VALUES (
  gen_random_uuid(),
  v_author_id,
  'Chandrayaan-3: India’s Historic Landing on the Moon’s South Pole',
  'On August 23, 2023, India etched its name in history. ISRO’s Chandrayaan-3 successfully soft-landed near the Moon’s uncharted south pole.',
  '## Introduction

On August 23, 2023, India etched its name in history. ISRO’s Chandrayaan-3 successfully soft-landed near the Moon’s uncharted south pole, making India the first nation to achieve this feat.

## The Journey

After the setback of Chandrayaan-2, ISRO scientists worked tirelessly to perfect every detail. The lander Vikram and rover Pragyan touched down precisely, sending back breathtaking images and valuable data.

## Scientific Significance

The south pole is believed to contain water ice, crucial for future lunar bases and deep space missions. Chandrayaan-3’s instruments are now analysing the surface, searching for signs of water and minerals.

> "India’s triumph is a victory for all of humanity’s quest to explore the cosmos."

## Global Acclaim

Leaders and space agencies worldwide congratulated India. The mission’s low cost (about $75 million) demonstrated that ambitious space exploration doesn’t have to break the bank.

## Conclusion

Chandrayaan-3 inspires millions, proving that with determination and ingenuity, the sky is not the limit – it’s just the beginning.

![Cheers at ISRO as Vikram touches down.](https://images.unsplash.com/photo-1541186877-bb5a745edde5?w=800&q=80)
*Cheers at ISRO as Vikram touches down.*

![First glimpses from the Moon’s south pole.](https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=800&q=80)
*First glimpses from the Moon’s south pole.*',
  'https://images.unsplash.com/photo-1517976487492-5750f3195933?w=1200&q=80',
  'Science',
  true,
  '2023-08-24 00:00:00+00',
  0
) RETURNING id INTO v_post9_id;

INSERT INTO public.post_tags (post_id, tag_id) VALUES
  (v_post9_id, t_isro),
  (v_post9_id, t_chandrayaan3),
  (v_post9_id, t_moonmission),
  (v_post9_id, t_space);

-- ============================================================
-- POST 10: Taylor Swift’s Eras Tour
-- ============================================================
INSERT INTO public.posts (
  id, author_id, title, excerpt, content, cover_image,
  category, published, published_at, reads
) VALUES (
  gen_random_uuid(),
  v_author_id,
  'Taylor Swift’s Eras Tour: The Tour That Broke the Internet',
  'Taylor Swift’s Eras Tour isn’t just a concert series – it’s a cultural juggernaut that shattered records and dominated social media.',
  '## Introduction

Taylor Swift’s Eras Tour isn’t just a concert series – it’s a cultural juggernaut. Spanning five continents and lasting over three hours each night, the tour has shattered records, crashed ticket sites, and dominated social media.

## A Journey Through Time

Swift takes fans on a musical journey through all ten of her ‘eras’, from debut to Midnights. Each segment features elaborate set design, costume changes, and surprise acoustic songs.

## Economic Impact

Cities hosting the tour have seen a massive boost in tourism and local revenue. The Eras Tour is projected to become the highest-grossing tour of all time, surpassing $1 billion.

> "Taylor Swift isn’t just a pop star – she’s an economic force of nature."

## Swiftie Mania

Fans (Swifties) have turned each show into a celebration, trading friendship bracelets and dressing up as their favourite era. The sense of community is unprecedented.

## Conclusion

The Eras Tour is more than a concert – it’s a phenomenon that unites millions. Whether you’re a Swiftie or not, you can’t ignore her impact.

![Ten eras, one unforgettable night.](https://images.unsplash.com/photo-1540039155732-d674140af323?w=800&q=80)
*Ten eras, one unforgettable night.*

![Swifties bring the magic to every show.](https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80)
*Swifties bring the magic to every show.*',
  'https://images.unsplash.com/photo-1470229722913-7c090be5c275?w=1200&q=80',
  'Entertainment',
  true,
  '2023-11-20 00:00:00+00',
  0
) RETURNING id INTO v_post10_id;

INSERT INTO public.post_tags (post_id, tag_id) VALUES
  (v_post10_id, t_taylorswift),
  (v_post10_id, t_erastour),
  (v_post10_id, t_music),
  (v_post10_id, t_concerts);

-- ============================================================
-- POST 11: Quiet Luxury
-- ============================================================
INSERT INTO public.posts (
  id, author_id, title, excerpt, content, cover_image,
  category, published, published_at, reads
) VALUES (
  gen_random_uuid(),
  v_author_id,
  'Quiet Luxury: Why ‘Stealth Wealth’ is Taking Over Fashion',
  'Move over logos and flashy branding. The latest trend in fashion is ‘quiet luxury’ – understated, high-quality pieces that whisper wealth rather than shout it.',
  '## Introduction

Move over logos and flashy branding. The latest trend in fashion is ‘quiet luxury’ – understated, high-quality pieces that whisper wealth rather than shout it. Inspired by shows like Succession, this aesthetic is everywhere.

## What is Quiet Luxury?

It’s about investing in timeless, impeccably crafted garments – think cashmere sweaters, tailored blazers, leather bags without logos. The focus is on fabric, fit, and subtle details that only connoisseurs notice.

## Why Now?

In an era of economic uncertainty, many are seeking authenticity and durability. Fast fashion is falling out of favour; people want clothes that last and don’t scream for attention.

> "True luxury doesn’t need a logo – it’s felt, not seen."

## How to Embrace It

Start with classic pieces: a well-fitted trench coat, quality leather shoes, a simple gold necklace. Mix and match with basics. Remember, it’s not about price tag – it’s about timeless style.

## Conclusion

Quiet luxury is more than a trend – it’s a mindset. It celebrates craftsmanship and personal style over fleeting hype.

![Key pieces for a quiet luxury wardrobe.](https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80)
*Key pieces for a quiet luxury wardrobe.*

![Sometimes less really is more.](https://images.unsplash.com/photo-1515347619114-1e233ef0e4c6?w=800&q=80)
*Sometimes less really is more.*',
  'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=1200&q=80',
  'Fashion',
  true,
  '2024-02-10 00:00:00+00',
  0
) RETURNING id INTO v_post11_id;

INSERT INTO public.post_tags (post_id, tag_id) VALUES
  (v_post11_id, t_quietluxury),
  (v_post11_id, t_fashiontrends),
  (v_post11_id, t_stealthwealth),
  (v_post11_id, t_minimalism);

RAISE NOTICE 'Seed complete. Posts inserted: %, %, %, %, %, %, %, %, %, %, %',
  v_post1_id, v_post2_id, v_post3_id, v_post4_id, v_post5_id, v_post6_id, v_post7_id, v_post8_id, v_post9_id, v_post10_id, v_post11_id;

END $$;
