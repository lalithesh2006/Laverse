-- Fix reads in the database directly
UPDATE public.posts
SET reads = floor(random() * (1500 - 100 + 1) + 100)::int
WHERE published = true;
