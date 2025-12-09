-- Create storage bucket for product gallery images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-gallery', 'product-gallery', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to product gallery images
CREATE POLICY "Anyone can view product gallery images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-gallery');

-- Allow service role to upload images
CREATE POLICY "Service role can upload product gallery images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-gallery');

-- Clear existing base64 data (it's too large)
DELETE FROM product_gallery_images;