import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutSection = () => {
    return (
        <section className="py-20 px-6 bg-gradient-to-b from-background to-secondary/5">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Left Side: Content */}
                    <div className="space-y-6 animate-slide-in-left">
                        <div className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-semibold tracking-wide">
                            WHO WE ARE
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                            A Tradition of Excellence Since 1993
                        </h2>
                        <div className="space-y-4 text-muted-foreground leading-relaxed text-lg">
                            <p>
                                Ottappalam Markaz is a beacon of knowledge located in the heart of Palakkad.
                                For over three decades, we have been at the forefront of combining religious values
                                with secular education to mold a generation of capable, ethical leaders.
                            </p>
                            <p className="hidden md:block">
                                From humble beginnings, we have grown into a center of excellence, serving
                                thousands of students and illuminating countless families through tailored social
                                service initiatives. Our journey is one of resilience, empowerment, and community upliftment.
                            </p>
                        </div>

                        <div className="pt-4">
                            <Link to="/about"
                                className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all duration-300 group">
                                Read Our Full Story
                                <ArrowRight className="w-5 h-5 group-hover:text-blue-600" />
                            </Link>
                        </div>
                    </div>

                    {/* Right Side: Visual/Stats (Placeholder for now, or just a nice card) */}
                    <div className="relative h-full min-h-[400px] rounded-2xl overflow-hidden shadow-2xl animate-fade-in-up">
                        {/* Placeholder gradient/image since no specific image provided for this section, using a gradient block pattern */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-900">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                            <div className="flex flex-col items-center justify-center h-full text-white text-center p-8">
                                <span className="text-6xl font-bold mb-2">32+</span>
                                <span className="text-xl font-medium tracking-wider opacity-90">Years of Service</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}

export default AboutSection;