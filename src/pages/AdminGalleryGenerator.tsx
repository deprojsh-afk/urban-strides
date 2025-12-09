import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { products } from "@/data/products";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";

const AdminGalleryGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState<string[]>([]);

  const generateAllGalleryImages = async () => {
    setIsGenerating(true);
    setProgress(["이미지 생성을 시작합니다..."]);

    try {
      // 각 상품의 원본 이미지를 base64로 변환
      const existingImageUrls: Record<string, string> = {};

      for (const product of products) {
        setProgress(prev => [...prev, `${product.name} 원본 이미지 로딩 중...`]);
        
        try {
          const response = await fetch(product.image);
          const blob = await response.blob();
          const base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
          existingImageUrls[product.id] = base64;
        } catch (error) {
          setProgress(prev => [...prev, `❌ ${product.name} 이미지 로딩 실패`]);
        }
      }

      setProgress(prev => [...prev, "AI 갤러리 이미지 생성 중... (약 2-3분 소요)"]);

      const { data, error } = await supabase.functions.invoke('batch-generate-gallery', {
        body: { existingImageUrls },
      });

      if (error) {
        throw error;
      }

      setProgress(prev => [
        ...prev,
        "=== 완료 ===",
        `생성됨: ${data.generated}`,
        `스킵됨: ${data.skipped}`,
        `실패: ${data.failed}`,
      ]);

      toast.success(`갤러리 이미지 생성 완료! (${data.generated}개 생성)`);
    } catch (error) {
      console.error("Generation error:", error);
      setProgress(prev => [...prev, `❌ 오류: ${error instanceof Error ? error.message : 'Unknown error'}`]);
      toast.error("이미지 생성 중 오류가 발생했습니다.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">갤러리 이미지 일괄 생성</h1>
        
        <div className="space-y-4">
          <Button 
            onClick={generateAllGalleryImages} 
            disabled={isGenerating}
            size="lg"
          >
            {isGenerating ? "생성 중..." : "모든 상품 갤러리 이미지 생성"}
          </Button>

          {progress.length > 0 && (
            <div className="bg-muted p-4 rounded-lg max-h-96 overflow-y-auto">
              {progress.map((log, index) => (
                <p key={index} className="text-sm font-mono">
                  {log}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminGalleryGenerator;
