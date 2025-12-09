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
  // front는 기존 이미지 사용, 나머지만 AI 생성
  const generatedAngles: Angle[] = ['side', 'back', 'detail'];
  const allAngles: Angle[] = ['front', 'side', 'back', 'detail'];
  
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>(
    allAngles.map((angle) => ({
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
        allAngles.map((angle, index) => ({
          angle,
          url: cachedImages[index],
          isLoading: false,
        }))
      );
      setHasGenerated(true);
    }
  }, [productId, color]);

  // 기존 이미지를 base64로 변환
  const getImageAsDataUrl = useCallback(async (imageUrl: string): Promise<string> => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Failed to convert image to base64:', error);
      throw error;
    }
  }, []);

  const generateImage = useCallback(async (angle: Angle, existingImageBase64: string): Promise<string | null> => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-product-images', {
        body: { productName, category, angle, existingImageUrl: existingImageBase64 },
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
  }, [productName, category]);

  const generateAllImages = useCallback(async () => {
    if (isGenerating || hasGenerated) return;

    // Check cache first
    const cachedImages = getFromCache(productId, color);
    if (cachedImages && cachedImages.length === 4) {
      setGalleryImages(
        allAngles.map((angle, index) => ({
          angle,
          url: cachedImages[index],
          isLoading: false,
        }))
      );
      setHasGenerated(true);
      return;
    }

    setIsGenerating(true);

    // front 이미지는 기존 이미지 그대로, 나머지만 로딩 상태로
    setGalleryImages(
      allAngles.map((angle) => ({
        angle,
        url: mainImage,
        isLoading: angle !== 'front',
      }))
    );

    // 기존 이미지를 base64로 변환
    let existingImageBase64: string;
    try {
      existingImageBase64 = await getImageAsDataUrl(mainImage);
    } catch {
      console.error('Failed to load existing image');
      setIsGenerating(false);
      setGalleryImages(
        allAngles.map((angle) => ({
          angle,
          url: mainImage,
          isLoading: false,
          error: angle !== 'front' ? 'Failed to load base image' : undefined,
        }))
      );
      return;
    }

    // Generate images sequentially to avoid rate limits (front는 생성하지 않음)
    const generatedUrls: string[] = [mainImage]; // front는 기존 이미지
    
    for (const angle of generatedAngles) {
      const imageUrl = await generateImage(angle, existingImageBase64);
      
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
  }, [isGenerating, hasGenerated, productId, color, mainImage, generateImage, getImageAsDataUrl]);

  return {
    galleryImages,
    selectedImage,
    setSelectedImage,
    generateAllImages,
    isGenerating,
    hasGenerated,
  };
};
