-- ============================================
-- La'verse Complete Database Schema (SAFE RE-RUN)
-- Run this in your Supabase SQL Editor
-- Handles existing tables/policies gracefully
-- ============================================

-- 1. Create/Update profiles table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  full_name text,
  bio text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add new columns if they don't exist
do $$ begin
  alter table public.profiles add column if not exists website text;
  alter table public.profiles add column if not exists social_twitter text;
  alter table public.profiles add column if not exists social_github text;
  alter table public.profiles add column if not exists role text default 'author';
  alter table public.profiles add column if not exists is_admin boolean default false;
  alter table public.profiles add column if not exists tip_link text;
exception when others then null;
end $$;

-- 2. Create/Update posts table
create table if not exists public.posts (
  id uuid default gen_random_uuid() primary key,
  author_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  content text not null default '',
  excerpt text,
  cover_image text,
  category text default 'Personal',
  published boolean default false,
  reads integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add new columns to posts
do $$ begin
  alter table public.posts add column if not exists slug text;
  alter table public.posts add column if not exists published_at timestamp with time zone;
  alter table public.posts add column if not exists scheduled_at timestamp with time zone;
exception when others then null;
end $$;

-- 3. Create tags table
create table if not exists public.tags (
  id uuid default gen_random_uuid() primary key,
  name text unique not null,
  slug text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Create post_tags junction table
create table if not exists public.post_tags (
  post_id uuid references public.posts(id) on delete cascade not null,
  tag_id uuid references public.tags(id) on delete cascade not null,
  primary key (post_id, tag_id)
);

-- 5. Create comments table (threaded)
create table if not exists public.comments (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references public.posts(id) on delete cascade not null,
  author_id uuid references public.profiles(id) on delete cascade not null,
  parent_id uuid references public.comments(id) on delete cascade,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Create likes table
create table if not exists public.likes (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references public.posts(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (post_id, user_id)
);

-- 7. Create bookmarks table
create table if not exists public.bookmarks (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references public.posts(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (post_id, user_id)
);

-- 8. Create follows table
create table if not exists public.follows (
    follower_id uuid references public.profiles(id) on delete cascade not null,
    following_id uuid references public.profiles(id) on delete cascade not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    primary key (follower_id, following_id)
);

-- ============================================
-- Enable Row Level Security
-- ============================================
alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.tags enable row level security;
alter table public.post_tags enable row level security;
alter table public.comments enable row level security;
alter table public.likes enable row level security;
alter table public.bookmarks enable row level security;
alter table public.follows enable row level security;

-- ============================================
-- DROP ALL EXISTING POLICIES (safe re-run)
-- ============================================
drop policy if exists "Profiles are viewable by everyone" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Users can insert own profile" on public.profiles;
drop policy if exists "Published posts are viewable by everyone" on public.posts;
drop policy if exists "Users can insert own posts" on public.posts;
drop policy if exists "Users can update own posts" on public.posts;
drop policy if exists "Users can delete own posts" on public.posts;
drop policy if exists "Users and admins can delete posts" on public.posts;
drop policy if exists "Tags are viewable by everyone" on public.tags;
drop policy if exists "Authenticated users can create tags" on public.tags;
drop policy if exists "Post tags are viewable by everyone" on public.post_tags;
drop policy if exists "Post authors can manage post tags" on public.post_tags;
drop policy if exists "Post authors can delete post tags" on public.post_tags;
drop policy if exists "Comments are viewable by everyone" on public.comments;
drop policy if exists "Authenticated users can add comments" on public.comments;
drop policy if exists "Users can update own comments" on public.comments;
drop policy if exists "Users can delete own comments" on public.comments;
drop policy if exists "Likes are viewable by everyone" on public.likes;
drop policy if exists "Authenticated users can like" on public.likes;
drop policy if exists "Users can unlike" on public.likes;
drop policy if exists "Users can view own bookmarks" on public.bookmarks;
drop policy if exists "Authenticated users can bookmark" on public.bookmarks;
drop policy if exists "Users can remove bookmarks" on public.bookmarks;
drop policy if exists "Follows are viewable by everyone" on public.follows;
drop policy if exists "Users can follow others" on public.follows;
drop policy if exists "Users can unfollow others" on public.follows;

-- ============================================
-- Profiles Policies
-- ============================================
create policy "Profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert with check (auth.uid() = id);

-- ============================================
-- Posts Policies
-- ============================================
create policy "Published posts are viewable by everyone"
  on public.posts for select
  using (published = true or author_id = auth.uid() or (select is_admin from public.profiles where id = auth.uid()) = true);

create policy "Users can insert own posts"
  on public.posts for insert
  with check (auth.uid() = author_id);

create policy "Users can update own posts"
  on public.posts for update
  using (auth.uid() = author_id);

create policy "Users and admins can delete posts"
  on public.posts for delete
  using (auth.uid() = author_id or (select is_admin from public.profiles where id = auth.uid()) = true);

-- ============================================
-- Tags Policies
-- ============================================
create policy "Tags are viewable by everyone"
  on public.tags for select using (true);

create policy "Authenticated users can create tags"
  on public.tags for insert
  with check (auth.role() = 'authenticated');

-- ============================================
-- Post Tags Policies
-- ============================================
create policy "Post tags are viewable by everyone"
  on public.post_tags for select using (true);

create policy "Post authors can manage post tags"
  on public.post_tags for insert
  with check (
    auth.uid() = (select author_id from public.posts where id = post_id)
  );

create policy "Post authors can delete post tags"
  on public.post_tags for delete
  using (
    auth.uid() = (select author_id from public.posts where id = post_id)
  );

-- ============================================
-- Comments Policies
-- ============================================
create policy "Comments are viewable by everyone"
  on public.comments for select using (true);

create policy "Authenticated users can add comments"
  on public.comments for insert
  with check (auth.uid() = author_id);

create policy "Users can update own comments"
  on public.comments for update
  using (auth.uid() = author_id);

create policy "Users can delete own comments"
  on public.comments for delete
  using (auth.uid() = author_id);

-- ============================================
-- Likes Policies
-- ============================================
create policy "Likes are viewable by everyone"
  on public.likes for select using (true);

create policy "Authenticated users can like"
  on public.likes for insert
  with check (auth.uid() = user_id);

create policy "Users can unlike"
  on public.likes for delete
  using (auth.uid() = user_id);

-- ============================================
-- Bookmarks Policies
-- ============================================
create policy "Users can view own bookmarks"
  on public.bookmarks for select
  using (auth.uid() = user_id);

create policy "Authenticated users can bookmark"
  on public.bookmarks for insert
  with check (auth.uid() = user_id);

create policy "Users can remove bookmarks"
  on public.bookmarks for delete
  using (auth.uid() = user_id);

-- ============================================
-- Follows Policies
-- ============================================
create policy "Follows are viewable by everyone"
    on public.follows for select using (true);

create policy "Users can follow others"
    on public.follows for insert
    with check (auth.uid() = follower_id);

create policy "Users can unfollow others"
    on public.follows for delete
    using (auth.uid() = follower_id);

-- ============================================
-- Auto-create profile on user signup
-- ============================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- Auto-generate slug from title
-- ============================================
create or replace function public.generate_slug()
returns trigger as $$
begin
  if new.slug is null or new.slug = '' then
    new.slug := lower(regexp_replace(new.title, '[^a-zA-Z0-9]+', '-', 'g'));
    new.slug := trim(both '-' from new.slug);
    new.slug := new.slug || '-' || substr(new.id::text, 1, 8);
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_post_slug on public.posts;
create trigger set_post_slug
  before insert or update on public.posts
  for each row execute procedure public.generate_slug();

-- ============================================
-- Full-text search function
-- ============================================
create or replace function public.search_posts(search_query text)
returns setof public.posts as $$
  select * from public.posts
  where published = true
    and (
      title ilike '%' || search_query || '%'
      or content ilike '%' || search_query || '%'
      or excerpt ilike '%' || search_query || '%'
      or category ilike '%' || search_query || '%'
    )
  order by created_at desc;
$$ language sql stable;

-- ============================================
-- Indexes for performance
-- ============================================
create index if not exists idx_posts_author on public.posts(author_id);
create index if not exists idx_posts_published on public.posts(published);
create index if not exists idx_posts_category on public.posts(category);
create index if not exists idx_posts_created on public.posts(created_at desc);
create index if not exists idx_posts_slug on public.posts(slug);
create index if not exists idx_comments_post on public.comments(post_id);
create index if not exists idx_comments_parent on public.comments(parent_id);
create index if not exists idx_likes_post on public.likes(post_id);
create index if not exists idx_likes_user on public.likes(user_id);
create index if not exists idx_bookmarks_user on public.bookmarks(user_id);
create index if not exists idx_post_tags_post on public.post_tags(post_id);
create index if not exists idx_post_tags_tag on public.post_tags(tag_id);
create index if not exists idx_tags_slug on public.tags(slug);
create index if not exists idx_follows_follower on public.follows(follower_id);
create index if not exists idx_follows_following on public.follows(following_id);