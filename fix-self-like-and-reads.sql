-- Fix: Allow authors to like their own posts
-- The existing policy already allows any authenticated user to like any post.
-- If you're seeing errors, the issue is likely the unique constraint.
-- This script ensures the policy is correct.

DROP POLICY IF EXISTS "Authenticated users can like" ON public.likes;

CREATE POLICY "Authenticated users can like"
  ON public.likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Also ensure the increment_reads RPC exists (prevents fallback errors)
CREATE OR REPLACE FUNCTION public.increment_reads(post_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE public.posts
  SET reads = COALESCE(reads, 0) + 1
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
