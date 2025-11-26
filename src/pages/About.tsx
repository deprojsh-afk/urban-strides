import Navigation from "@/components/Navigation";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const About = () => {
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
                About STRIDE
              </h1>
              <p className="text-muted-foreground text-lg">
                도시를 누비는 현대적인 러너를 위한 브랜드
              </p>
            </div>

            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">Our Story</h2>
                <p className="text-muted-foreground leading-relaxed">
                  STRIDE는 도시의 거리를 자신만의 트랙으로 만드는 
                  열정적인 러너들을 위해 탄생했습니다. 
                  우리는 단순히 운동복을 만드는 것이 아니라, 
                  스타일과 퍼포먼스가 완벽하게 조화를 이루는 
                  러닝 라이프스타일을 제안합니다.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed">
                  모든 러너가 자신의 리듬을 찾고 자신감 있게 달릴 수 있도록, 
                  혁신적인 기술과 세련된 디자인을 결합한 제품을 만듭니다. 
                  20-30대 도시 러너들의 라이프스타일에 완벽하게 맞는 
                  러닝 어패럴을 제공하는 것이 우리의 미션입니다.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Our Values</h2>
                <ul className="space-y-4 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="mr-3 text-foreground font-bold">•</span>
                    <span><strong className="text-foreground">Performance:</strong> 최고의 기능성과 편안함</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 text-foreground font-bold">•</span>
                    <span><strong className="text-foreground">Style:</strong> 트렌디하고 세련된 디자인</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 text-foreground font-bold">•</span>
                    <span><strong className="text-foreground">Innovation:</strong> 지속적인 기술 혁신</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 text-foreground font-bold">•</span>
                    <span><strong className="text-foreground">Sustainability:</strong> 환경을 생각하는 제작</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;
