import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-runners.jpg";

const Hero = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Urban runners in motion"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        <h1 className="mb-4 text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tighter animate-fade-in">
          RUN YOUR
          <br />
          <span className="text-accent">RHYTHM</span>
        </h1>
        <p className="mb-8 max-w-2xl text-base md:text-lg text-muted-foreground font-light tracking-wide animate-slide-up">
          Performance meets style in every stride. Discover urban running apparel
          engineered for the modern athlete.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 animate-slide-up">
          <Button variant="hero" size="xl">
            Shop Collection
          </Button>
          <Button variant="hero-outline" size="xl">
            Explore Performance
          </Button>
        </div>
        <p className="mt-12 text-xs text-muted-foreground tracking-widest uppercase">
          Free Shipping on Orders Over $150
        </p>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="h-12 w-6 rounded-full border-2 border-primary/50 flex items-start justify-center p-2">
          <div className="h-2 w-1 bg-primary/50 rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
