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

export const useProductGallery = ({
  productId,
  productName,
  category,
  mainImage,
}: UseProductGalleryProps) => {
  const generatedAngles: Angle[] = ['side', 'back', 'detail'];
  const allAngles: Angle[] = ['front', 'side', 'back', 'detail'];
  
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>(
    allAngles.map((angle) => ({
      angle,
      url: mainImage,
      isLoading: angle !== 'front', // front는 로딩 아님
    }))
  );
  const [selectedImage, setSelectedImage] = useState(mainImage);
  const [isGenerating, setIsGenerating] = useState(false);

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
        body: { productId, productName, category, angle, existingImageUrl: existingImageBase64 },
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
  }, [productId, productName, category]);

  // 마운트 시 DB에서 이미지 확인 및 자동 생성
  useEffect(() => {
    const loadOrGenerateImages = async () => {
      // 1. DB에서 기존 이미지 확인
      const { data: existingImages, error } = await supabase
        .from('product_gallery_images')
        .select('angle, image_url')
        .eq('product_id', productId);

      if (error) {
        console.error('Failed to load gallery images:', error);
      }

      // 2. 이미지가 이미 있으면 바로 표시
      if (existingImages && existingImages.length >= 3) {
        const imageMap = new Map(existingImages.map(img => [img.angle, img.image_url]));
        setGalleryImages(
          allAngles.map((angle) => ({
            angle,
            url: angle === 'front' ? mainImage : (imageMap.get(angle) || mainImage),
            isLoading: false,
          }))
        );
        return;
      }

      // 3. 이미지가 없으면 생성 시작
      setIsGenerating(true);

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

      // 4. 이미지 순차 생성 (rate limit 방지)
      for (const angle of generatedAngles) {
        const imageUrl = await generateImage(angle, existingImageBase64);
        
        if (imageUrl) {
          setGalleryImages((prev) =>
            prev.map((img) =>
              img.angle === angle
                ? { ...img, url: imageUrl, isLoading: false }
                : img
            )
          );
        } else {
          setGalleryImages((prev) =>
            prev.map((img) =>
              img.angle === angle
                ? { ...img, url: mainImage, isLoading: false, error: 'Failed to generate' }
                : img
            )
          );
        }
      }

      setIsGenerating(false);
    };

    loadOrGenerateImages();
  }, [productId, mainImage, getImageAsDataUrl, generateImage]);

  return {
    galleryImages,
    selectedImage,
    setSelectedImage,
    isGenerating,
  };
};
