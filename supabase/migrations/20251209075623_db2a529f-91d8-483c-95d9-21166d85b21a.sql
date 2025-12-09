-- Create table for storing generated product gallery images
CREATE TABLE public.product_gallery_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id TEXT NOT NULL,
  angle TEXT NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(product_id, angle)
);

-- Enable RLS
ALTER TABLE public.product_gallery_images ENABLE ROW LEVEL SECURITY;

-- Allow public read access (product images are public)
CREATE POLICY "Anyone can view product gallery images"
ON public.product_gallery_images
FOR SELECT
USING (true);

-- Allow insert from edge functions (service role)
CREATE POLICY "Service role can insert gallery images"
ON public.product_gallery_images
FOR INSERT
WITH CHECK (true);

-- Create index for faster lookups
CREATE INDEX idx_product_gallery_product_id ON public.product_gallery_images(product_id);