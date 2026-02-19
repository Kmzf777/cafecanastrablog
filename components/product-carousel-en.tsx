import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useEffect } from "react";

// Premium fonts suggested (add in _document.tsx or via Google Fonts):
// 'Playfair Display' for titles, 'Inter' for text

const products = [
  {
    name: "Canastra Classic",
    description:
      "100% Arabica Coffee – Special Type +80 SCA. Dark roast intensity 8 and medium-fine grind, ideal for filter. Full-bodied with caramelized and chocolate notes.",
    image: "/cafe-classico.png",
    imageAlt: "Canastra Classic Photo",
    gradient: "radial-gradient(circle at 60% 55%, #232526 0%, #414345 100%)",
    textColor: "text-white/90",
    properties: [4, 3, 5, 5],
    propertyLabels: ["Sweetness", "Acidity", "Body", "Bitterness"],
    propertyStar: "text-yellow-400",
    button: "bg-white text-[#232526] hover:bg-gray-200",
  },
  {
    name: "Canastra Smooth",
    description:
      "100% Arabica Coffee – Special Type +80 SCA. Medium roast intensity 7 and medium-fine grind, ideal for filter. Full-bodied with chocolate notes and citrus finish.",
    image: "/cafe-suave.png",
    imageAlt: "Canastra Smooth Photo",
    gradient: "radial-gradient(circle at 60% 55%, #e9d5b4 0%, #c6a77d 100%)",
    textColor: "text-[#3b2c1a]",
    properties: [3, 4, 4, 3],
    propertyLabels: ["Sweetness", "Acidity", "Body", "Bitterness"],
    propertyStar: "text-yellow-500",
    button: "bg-[#3b2c1a] text-white hover:bg-[#a88b6a]",
  },
  {
    name: "Canastra Cinnamon",
    description:
      "100% Arabica Coffee – Special Type +80 SCA. Dark roast intensity 7. Full-bodied with caramelized notes and added natural cinnamon.",
    image: "/cafe-canela.png",
    imageAlt: "Canastra Cinnamon Photo",
    gradient: "radial-gradient(circle at 60% 55%, #e44c2c 0%, #ffb199 100%)",
    textColor: "text-white",
    properties: [3, 3, 4, 3],
    propertyLabels: ["Sweetness", "Acidity", "Body", "Bitterness"],
    propertyStar: "text-yellow-400",
    button: "bg-white text-[#e44c2c] hover:bg-[#f16a4d]",
  },
  {
    name: "Canastra Microlot",
    description:
      "100% Special Arabica Coffee with 86 SCA points. Medium body, cocoa, molasses notes and gently citrus finish.",
    image: "/microlote-png.png",
    imageAlt: "Microlot Photo",
    gradient: "radial-gradient(circle at 60% 55%, #e5d3b3 0%, #bba37e 100%)",
    textColor: "text-[#5c4630]",
    properties: [2, 4, 4, 3],
    propertyLabels: ["Sweetness", "Acidity", "Body", "Bitterness"],
    propertyStar: "text-yellow-500",
    button: "bg-[#5c4630] text-white hover:bg-[#bba37e]",
  },
];

export default function ProductCarouselEn({ scrollToSection }: { scrollToSection?: (id: string) => void }) {
  useEffect(() => {
    // Customize Swiper buttons for minimalism
    const style = document.createElement('style');
    style.innerHTML = `
      .swiper-button-next, .swiper-button-prev {
        width: 40px;
        height: 40px;
        background: none !important;
        border: none;
        color: #fff;
        opacity: 0.7;
        transition: opacity 0.2s;
        top: 50%;
        transform: translateY(-50%);
      }
      .swiper-button-next:hover, .swiper-button-prev:hover {
        opacity: 1;
      }
      .swiper-button-next:after, .swiper-button-prev:after {
        font-size: 2rem;
        font-weight: bold;
        color: #fff;
        text-shadow: 0 2px 8px rgba(0,0,0,0.18);
      }
      .swiper-button-next, .swiper-rtl .swiper-button-prev {
        right: 16px;
        left: auto;
      }
      .swiper-button-prev, .swiper-rtl .swiper-button-next {
        left: 16px;
        right: auto;
      }
      .swiper-pagination-bullet {
        background: #fff;
        opacity: 0.5;
        width: 8px;
        height: 8px;
        margin: 0 4px !important;
      }
      .swiper-pagination-bullet-active {
        opacity: 1;
        background: #fff;
      }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  return (
    <div className="w-screen min-h-screen overflow-hidden md:h-[88vh] flex flex-col items-center">
      <Swiper
        modules={[Navigation, Pagination, A11y]}
        navigation
        pagination={false}
        loop={true}
        className="w-screen h-screen md:h-[88vh]"
      >
        {products.map((product) => (
          <SwiperSlide key={product.name}>
            <section
              className="w-screen h-screen md:h-[88vh] relative flex items-center justify-center overflow-hidden"
              style={{ background: product.gradient }}
            >
              {/* Product title - top left corner, responsive, never stuck */}
              <div
                className={`absolute z-20 ${product.textColor}`}
                style={{
                  fontFamily: 'Inter, sans-serif',
                  left: 'clamp(1rem, 5vw, 3.5rem)',
                  top: 'clamp(1.2rem, 8vw, 4.5rem)',
                  maxWidth: 'min(60vw, 420px)',
                  paddingRight: '1.5rem',
                  wordBreak: 'break-word',
                  lineHeight: 1.1,
                  pointerEvents: 'none',
                }}
              >
                <h1
                  className="font-extrabold tracking-tight"
                  style={{
                    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                    margin: 0,
                  }}
                >
                  <span className="hidden md:inline">Canastra<br/>{product.name.replace(/^Canastra\s?/, '')}</span>
                  <span className="inline md:hidden">{product.name}</span>
                </h1>
              </div>
              {/* Centered image, responsive, never cropped */}
              <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center w-full min-h-[320px] md:min-h-[180px] flex-grow"
                style={{ maxWidth: 'min(98vw, 440px)' }}
              >
                <img
                  src={product.image}
                  alt={product.imageAlt}
                  className="object-contain drop-shadow-2xl transition-transform duration-500"
                  style={{
                    width: 'clamp(200px, 70vw, 340px)',
                    height: 'clamp(240px, 38vh, 400px)',
                    background: 'none',
                    marginBottom: 'clamp(1.5rem, 6vw, 2.5rem)',
                  }}
                />
                {/* Description and button centered */}
                <div
                  className="flex flex-col justify-between items-center w-full min-h-[120px] md:min-h-[180px]"
                  style={{ maxWidth: 'min(98vw, 420px)' }}
                >
                  <p
                    className="font-light drop-shadow-md opacity-90 text-center"
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: 'clamp(1rem, 2.5vw, 1.35rem)',
                      marginBottom: 'clamp(1.2rem, 3vw, 2rem)',
                      color: product.name === 'Canastra Classic' ? 'rgba(255,255,255,0.9)' : 
                             product.name === 'Canastra Cinnamon' ? 'rgba(255,255,255,0.9)' : undefined,
                      lineHeight: 1.4,
                    }}
                  >
                    {product.description}
                  </p>
                  <Button
                    className={`rounded-full font-bold shadow-lg transition-all ${product.button}`}
                    style={{
                      fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                      padding: 'clamp(0.75rem,2vw,1.1rem) clamp(2.2rem,6vw,3.5rem)',
                      minWidth: 'min(80vw, 220px)',
                      boxShadow: '0 2px 16px 0 rgba(0,0,0,0.10)',
                    }}
                    onClick={scrollToSection ? () => scrollToSection('contato') : undefined}
                  >
                    Buy Now
                  </Button>
                </div>
              </div>
            </section>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
} 