import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";


const InstitutionsSlider = () => {
    const sliderRef = useRef(null);

    const scroll = (direction) => {
        if (sliderRef.current) {
            const scrollAmount = 400; // Wider scroll for larger cards
            sliderRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    }

    const Institusions = [
        { id: 1, image: "/Hifiz2.jpg", title: "Hifzul Qur'an College", link: "/institutions/hifzulquran" },
        { id: 2, image: "/uth2.jpg", title: "Uthmaniyya College", link: "/institutions/uthmaniyya" },
        { id: 3, image: "/ics.jpg", title: "Islamic Central School", link: "/institutions/ics" },
        { id: 4, image: "/nios.jpg", title: "NIOS", link: "/institutions/nios" },
        { id: 5, image: "/thibyan.jpg", title: "Thibyan Pre School", link: "/institutions/thibyan" },
        { id: 6, image: "/MOC.jpg", title: "Markaz Oriental College", link: "/institutions/moc" },
        { id: 7, image: "/hadiya.jpg", title: "Hadiya Women's College", link: "/institutions/hadiya" },
        { id: 8, image: "/madrasa.jpg", title: "Isha'Athul Islam Madrasa", link: "/institutions/madrasa" },
        { id: 9, image: "/santh.png", title: "Santhwana Kendram", link: "/institutions/santhwanam" },
        { id: 10, image: "/mas.jpg", title: "Msjidul Isha'a", link: "/institutions/masjid" },
    ]

    return (
        <section className="py-12 bg-background relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">

                {/* Header */}
                <div className="flex items-end justify-between mb-12">
                    <div>
                        <span className="text-blue-600 font-semibold tracking-wide uppercase text-sm">
                            Our Ecosystem
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold mt-2 text-foreground">
                            Institutions & Centers
                        </h2>
                    </div>

                    {/* Controls */}
                    <div className="hidden md:flex gap-3">
                        <button onClick={() => scroll("left")}
                            className="p-3 rounded-full border border-border hover:bg-secondary transition-all active:scale-95">
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button onClick={() => scroll("right")}
                            className="p-3 rounded-full border border-border hover:bg-secondary transition-all active:scale-95">
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Slider */}
                <div
                    ref={sliderRef}
                    className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x snap-mandatory"
                >
                    {Institusions.map((item) => (
                        <Link
                            key={item.id}
                            to={item.link}
                            className="flex-shrink-0 w-80 snap-center group"
                        >
                            <div className="h-[400px] relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
                                {/* Image */}
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />

                                {/* Gradient Overlay */}
                                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />

                                {/* Content */}
                                <div className="absolute inset-x-0 bottom-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                    <div className="w-12 h-1 bg-blue-500 mb-4 rounded-full origin-left transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                                    <h3 className="text-2xl font-bold text-white leading-tight mb-2">
                                        {item.title}
                                    </h3>
                                    <span className="text-sm font-medium text-blue-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 flex items-center gap-2">
                                        Explore Campus <ChevronRight size={14} />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

            </div>
        </section>
    );
}

export default InstitutionsSlider;