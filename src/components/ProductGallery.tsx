import { useProductGallery } from "@/hooks/useProductGallery";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageIcon, Sparkles } from "lucide-react";

interface ProductGalleryProps {
  productId: string;
  productName: string;
  category: string;
  mainImage: string;
  selectedColor?: string;
}

const angleLabels: Record<string, string> = {
  front: '정면',
  side: '측면',
  back: '후면',
  detail: '디테일',
};

const ProductGallery = ({
  productId,
  productName,
  category,
  mainImage,
  selectedColor,
}: ProductGalleryProps) => {
  const {
    galleryImages,
    selectedImage,
    setSelectedImage,
    generateAllImages,
    isGenerating,
    hasGenerated,
  } = useProductGallery({
    productId,
    productName,
    category,
    mainImage,
    color: selectedColor || 'black',
  });

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
        <img
          src={selectedImage}
          alt={productName}
          className="h-full w-full object-cover transition-opacity duration-300"
        />
      </div>

      {/* Generate Button */}
      {!hasGenerated && !isGenerating && (
        <Button
          onClick={generateAllImages}
          variant="outline"
          className="w-full gap-2"
        >
          <Sparkles className="h-4 w-4" />
          AI로 다양한 각도 보기
        </Button>
      )}

      {/* Thumbnail Gallery */}
      {(hasGenerated || isGenerating) && (
        <div className="grid grid-cols-4 gap-2">
          {galleryImages.map((image) => (
            <button
              key={image.angle}
              onClick={() => !image.isLoading && setSelectedImage(image.url)}
              className={`relative aspect-square overflow-hidden rounded-md bg-muted transition-all hover:opacity-80 ${
                selectedImage === image.url
                  ? 'ring-2 ring-primary ring-offset-2 ring-offset-background'
                  : ''
              }`}
              disabled={image.isLoading}
            >
              {image.isLoading ? (
                <div className="flex h-full w-full items-center justify-center">
                  <Skeleton className="h-full w-full" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  </div>
                </div>
              ) : (
                <>
                  <img
                    src={image.url}
                    alt={`${productName} ${angleLabels[image.angle]}`}
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute bottom-0 left-0 right-0 bg-background/80 px-1 py-0.5 text-center text-xs text-foreground">
                    {angleLabels[image.angle]}
                  </span>
                </>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Loading State Message */}
      {isGenerating && (
        <p className="text-center text-sm text-muted-foreground">
          AI가 다양한 각도의 이미지를 생성 중입니다...
        </p>
      )}
    </div>
  );
};

export default ProductGallery;
