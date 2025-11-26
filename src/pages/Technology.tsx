import Navigation from "@/components/Navigation";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Technology = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-24 px-4 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            홈으로
          </Button>
          
          <div className="space-y-12">
            <div>
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
                Performance Technology
              </h1>
              <p className="text-muted-foreground text-lg">
                혁신적인 기술로 당신의 러닝을 한 단계 업그레이드하세요
              </p>
            </div>

            <div className="space-y-8">
              <div className="border border-border rounded-lg p-8 bg-card">
                <h2 className="text-2xl font-bold mb-4">
                  Advanced Cushioning System
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  독자적으로 개발한 쿠셔닝 시스템이 발의 충격을 흡수하고 
                  에너지를 반환하여 더 편안하고 효율적인 러닝을 가능하게 합니다.
                </p>
              </div>

              <div className="border border-border rounded-lg p-8 bg-card">
                <h2 className="text-2xl font-bold mb-4">
                  Breathable Fabric Technology
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  통기성이 뛰어난 프리미엄 원단이 체온을 조절하고 땀을 빠르게 배출하여 
                  어떤 환경에서도 쾌적함을 유지합니다.
                </p>
              </div>

              <div className="border border-border rounded-lg p-8 bg-card">
                <h2 className="text-2xl font-bold mb-4">
                  Reflective Safety Design
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  야간 러닝 시 안전을 위한 반사 소재가 전략적으로 배치되어 
                  어두운 환경에서도 뛰어난 시인성을 제공합니다.
                </p>
              </div>

              <div className="border border-border rounded-lg p-8 bg-card">
                <h2 className="text-2xl font-bold mb-4">
                  Sustainable Materials
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  재활용 소재를 활용한 친환경 제작 방식으로 
                  성능과 환경 보호를 동시에 실현합니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Technology;
