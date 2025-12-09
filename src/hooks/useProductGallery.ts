import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

type Angle = 'front' | 'side' | 'back' | 'detail';

interface GalleryImage {
  angle: Angle;
  url: string;
  isLoading: boolean;
  error?: string;
}

interface UseProductGalleryProps {
  productId: string;
  productName: string;
  category: string;
  mainImage: string;
  color?: string;
}

const CACHE_PREFIX = 'product_gallery_';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

const getCacheKey = (productId: string, color: string) => 
  `${CACHE_PREFIX}${productId}_${color}`;

const getFromCache = (productId: string, color: string): string[] | null => {
  try {
    const cached = localStorage.getItem(getCacheKey(productId, color));
    if (cached) {
      const { images, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_EXPIRY) {
        return images;
      }
      localStorage.removeItem(getCacheKey(productId, color));
    }
  } catch {
    // Ignore cache errors
  }
  return null;
};

const saveToCache = (productId: string, color: string, images: string[]) => {
  try {
    localStorage.setItem(
      getCacheKey(productId, color),
      JSON.stringify({ images, timestamp: Date.now() })
    );
  } catch {
    // Ignore cache errors
  }
};

export const useProductGallery = ({
  productId,
  productName,
  category,
  mainImage,
  color = 'black',
}: UseProductGalleryProps) => {
  const angles: Angle[] = ['front', 'side', 'back', 'detail'];
  
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>(
    angles.map((angle) => ({
      angle,
      url: mainImage, // Default to main image
      isLoading: false,
    }))
  );
  const [selectedImage, setSelectedImage] = useState(mainImage);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  // Check cache on mount
  useEffect(() => {
    const cachedImages = getFromCache(productId, color);
    if (cachedImages && cachedImages.length === 4) {
      setGalleryImages(
        angles.map((angle, index) => ({
          angle,
          url: cachedImages[index],
          isLoading: false,
        }))
      );
      setHasGenerated(true);
    }
  }, [productId, color]);

  const generateImage = useCallback(async (angle: Angle): Promise<string | null> => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-product-images', {
        body: { productName, category, color, angle },
      });

      if (error) {
        console.error(`Error generating ${angle} image:`, error);
        return null;
      }

      return data?.imageUrl || null;
    } catch (err) {
      console.error(`Failed to generate ${angle} image:`, err);
      return null;
    }
  }, [productName, category, color]);

  const generateAllImages = useCallback(async () => {
    if (isGenerating || hasGenerated) return;

    // Check cache first
    const cachedImages = getFromCache(productId, color);
    if (cachedImages && cachedImages.length === 4) {
      setGalleryImages(
        angles.map((angle, index) => ({
          angle,
          url: cachedImages[index],
          isLoading: false,
        }))
      );
      setHasGenerated(true);
      return;
    }

    setIsGenerating(true);

    // Set all to loading
    setGalleryImages(
      angles.map((angle) => ({
        angle,
        url: mainImage,
        isLoading: true,
      }))
    );

    // Generate images sequentially to avoid rate limits
    const generatedUrls: string[] = [];
    
    for (let i = 0; i < angles.length; i++) {
      const angle = angles[i];
      const imageUrl = await generateImage(angle);
      
      if (imageUrl) {
        generatedUrls.push(imageUrl);
        setGalleryImages((prev) =>
          prev.map((img) =>
            img.angle === angle
              ? { ...img, url: imageUrl, isLoading: false }
              : img
          )
        );
      } else {
        generatedUrls.push(mainImage);
        setGalleryImages((prev) =>
          prev.map((img) =>
            img.angle === angle
              ? { ...img, url: mainImage, isLoading: false, error: 'Failed to generate' }
              : img
          )
        );
      }
    }

    // Cache the results
    saveToCache(productId, color, generatedUrls);
    setIsGenerating(false);
    setHasGenerated(true);
  }, [isGenerating, hasGenerated, productId, color, mainImage, generateImage, angles]);

  return {
    galleryImages,
    selectedImage,
    setSelectedImage,
    generateAllImages,
    isGenerating,
    hasGenerated,
  };
};
