import { useProductGallery } from "@/hooks/useProductGallery";
import { Skeleton } from "@/components/ui/skeleton";

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
    isGenerating,
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

      {/* Thumbnail Gallery */}
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
              <img
                src={image.url}
                alt={`${productName} ${angleLabels[image.angle]}`}
                className="h-full w-full object-cover"
              />
            )}
          </button>
        ))}
      </div>

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
