-- ==============================================================================
-- Prompt 8: Error Logging Table for Production Monitoring
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.error_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  message text NOT NULL,
  stack text,
  route text,
  additional_metadata jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.error_logs ENABLE ROW LEVEL SECURITY;

-- Allow anyone (public clients) to insert error logs (so we can log client-side errors)
DROP POLICY IF EXISTS "Public insert error_logs" ON public.error_logs;
CREATE POLICY "Public insert error_logs" ON public.error_logs FOR INSERT WITH CHECK (true);

-- Allow only admin to view error logs
DROP POLICY IF EXISTS "Admin read error_logs" ON public.error_logs;
CREATE POLICY "Admin read error_logs" ON public.error_logs FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);
