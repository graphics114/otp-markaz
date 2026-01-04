import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const HeroSlider = () => {

    const texts = [
        {
            id: 1,
            title: "12+",
            subtitle: "Prestigious Institutions",
            description: "Leading the way in diverse educational fields."
        },
        {
            id: 2,
            title: "2000+",
            subtitle: "Active Students",
            description: "Empowering young minds for a brighter future."
        },
        {
            id: 3,
            title: "300+",
            subtitle: "Uthmani Scholars",
            description: "Preserving heritage through knowledge."
        },
        {
            id: 4,
            title: "500+",
            subtitle: "Hadiya Graduates",
            description: "Excellence in women's education."
        },
        {
            id: 5,
            title: "3000+",
            subtitle: "Alumni Network",
            description: "Making a global impact across industries."
        },
    ];

    const [index, setIndex] = useState(0);
    const videoRef = useRef(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % texts.length);
        }, 4000); // Slower, more elegant transition
        return () => clearInterval(interval);
    }, [texts.length]);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = 0.8; // Slightly grander slow-motion feel
        }
    }, []);

    const text = texts[index];

    return (
        <div className="relative h-[60vh] w-full overflow-hidden">
            {/* Extended height for grandeur */}

            {/* Video Background */}
            <div className="absolute inset-0 w-full h-full bg-black">
                <video
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                    autoPlay muted loop playsInline ref={videoRef}
                >
                    <source src="/home1.mp4" type="video/mp4" />
                </video>
                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            </div>

            {/* Content Container */}
            <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-center items-center text-center">

                <div key={index} className="animate-fade-in-up space-y-3 max-w-4xl">
                    <span className="inline-block py-1 px-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-blue-300 text-xs font-medium tracking-wide">
                        ESTD 1993
                    </span>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tighter drop-shadow-2xl">
                        {text.title}
                    </h1>

                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-100 tracking-tight">
                        {text.subtitle}
                    </h2>

                    <p className="text-base md:text-lg text-gray-300 max-w-xl mx-auto font-light leading-relaxed">
                        {text.description}
                    </p>

                    <div className="pt-4">
                        <Link to="/about" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-all hover:scale-105 shadow-lg shadow-blue-600/30 text-sm md:text-base">
                            Discover Our Legacy
                            <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default HeroSlider;