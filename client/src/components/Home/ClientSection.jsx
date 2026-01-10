import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';

const ClientSection = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const testimonials = [
        {
            id: 1,
            name: "Ahmed Al-Rashid",
            role: "Parent, Hifzul Qur'an College",
            image: "/client1.jpg",
            rating: 5,
            text: "Ottappalam Markaz has been a blessing for our family. My son not only memorized the Qur'an but also developed strong moral values. The teachers are dedicated and caring.",
        },
        {
            id: 2,
            name: "Fatima Hassan",
            role: "Alumni, Uthmaniyya College",
            image: "/client2.jpg",
            rating: 5,
            text: "The education I received at Markaz shaped my entire life. The combination of religious and secular education prepared me for both this world and the hereafter.",
        },
        {
            id: 3,
            name: "Ibrahim Malik",
            role: "Parent, Islamic Central School",
            image: "/client3.jpg",
            rating: 5,
            text: "Exceptional institution with a perfect blend of modern education and Islamic values. My daughter excels academically while staying rooted in her faith.",
        },
        {
            id: 4,
            name: "Aisha Rahman",
            role: "Student, Hadiya Women's College",
            image: "/client4.jpg",
            rating: 5,
            text: "Hadiya Women's College empowered me to pursue higher education while maintaining my Islamic identity. The supportive environment is truly remarkable.",
        },
        {
            id: 5,
            name: "Yusuf Abdullah",
            role: "Community Member",
            image: "/client5.jpg",
            rating: 5,
            text: "For over 30 years, Ottappalam Markaz has been serving our community with excellence. Their social initiatives have transformed countless lives.",
        },
    ];

    const nextTestimonial = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    // Auto-rotate testimonials every 5 seconds
    useEffect(() => {
        const interval = setInterval(nextTestimonial, 5000);
        return () => clearInterval(interval);
    }, []);

    const current = testimonials[currentIndex];

    return (
        <section className="py-20 px-6 bg-gradient-to-b from-secondary/5 to-background relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-16 animate-fade-in-up">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-semibold tracking-wide mb-4">
                        TESTIMONIALS
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">
                        What Our Clients Say
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Hear from parents, students, and community members about their experiences with Ottappalam Markaz
                    </p>
                </div>

                {/* Main Testimonial Card */}
                <div className="relative max-w-5xl mx-auto">
                    <div className="glass-panel p-8 md:p-12 rounded-3xl shadow-2xl">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">

                            {/* Left: Client Image */}
                            <div className="flex justify-center md:col-span-1">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full blur-xl opacity-30"></div>
                                    <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-blue-500/30 shadow-xl">
                                        <img
                                            src={current.image}
                                            alt={current.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(current.name)}&size=200&background=3b82f6&color=fff&bold=true`;
                                            }}
                                        />
                                    </div>
                                    {/* Quote Icon */}
                                    <div className="absolute -top-4 -right-4 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                                        <Quote className="w-8 h-8 text-white" fill="currentColor" />
                                    </div>
                                </div>
                            </div>

                            {/* Right: Testimonial Content */}
                            <div className="md:col-span-2 space-y-6">
                                {/* Rating Stars */}
                                <div className="flex gap-1">
                                    {[...Array(current.rating)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                    ))}
                                </div>

                                {/* Testimonial Text */}
                                <p className="text-lg md:text-xl leading-relaxed text-foreground italic">
                                    "{current.text}"
                                </p>

                                {/* Client Info */}
                                <div className="pt-4 border-t border-border/50">
                                    <h4 className="text-xl font-bold text-foreground">{current.name}</h4>
                                    <p className="text-muted-foreground">{current.role}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-center gap-4 mt-8">
                        <button
                            onClick={prevTestimonial}
                            className="p-3 rounded-full bg-secondary hover:bg-blue-600 hover:text-white border border-border transition-all duration-300 active:scale-95 group"
                            aria-label="Previous testimonial"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>

                        {/* Dots Indicator */}
                        <div className="flex items-center gap-2">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex
                                            ? 'w-8 bg-blue-600'
                                            : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                                        }`}
                                    aria-label={`Go to testimonial ${index + 1}`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={nextTestimonial}
                            className="p-3 rounded-full bg-secondary hover:bg-blue-600 hover:text-white border border-border transition-all duration-300 active:scale-95 group"
                            aria-label="Next testimonial"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
                    {[
                        { number: "10,000+", label: "Students Educated" },
                        { number: "32+", label: "Years of Service" },
                        { number: "10+", label: "Institutions" },
                        { number: "98%", label: "Satisfaction Rate" },
                    ].map((stat, index) => (
                        <div
                            key={index}
                            className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200/30 dark:border-blue-800/30 hover:scale-105 transition-transform duration-300"
                        >
                            <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                                {stat.number}
                            </div>
                            <div className="text-sm text-muted-foreground font-medium">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ClientSection;
