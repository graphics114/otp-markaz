import { Quote } from 'lucide-react';

const About = () => {
    return (
        <div className="min-h-screen bg-background pt-20">
            {/* Header Section */}
            <div className="bg-secondary/20 py-10 md:py-12">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <span className="text-blue-600 font-semibold tracking-wide uppercase text-sm mb-3 block">
                        Our History & Legacy
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 font-serif">
                        About Markaz
                    </h1>
                    <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                        A journey of transforming lives through education, spirituality, and community service since 1992.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start mb-20">

                    {/* Text Content */}
                    <div className="space-y-6 text-lg text-muted-foreground leading-relaxed text-justify">
                        <p>
                            <span className="text-foreground font-semibold text-xl">Ottappalam Markaz</span> is a prominent educational institution located in Palakkad
                            district, famously known as the granary of Kerala. Established in 1993, the Markaz has, over the past three decades,
                            made consistent progress in both religious and secular education.
                        </p>
                        <p>
                            Along with its remarkable charitable initiatives, it has transformed into a widely respected center
                            of excellence. Standing as a pillar of support for the region, Ottappalam Markaz has illuminated
                            the lives of thousands of families through its unparalleled social service activities, currently catering
                            to the educational needs of more than two thousand students.
                        </p>
                        <p>
                            The story of Ottappalam Markaz is one of inspiration and resilience—an extraordinary journey of empowering
                            a community that once lagged behind. Through education, the institution has enabled the community to rise
                            with confidence and equip itself to face the challenges of the modern era.
                        </p>
                    </div>

                    {/* Highlight Box / Quote */}
                    <div className="relative bg-secondary/10 p-8 rounded-2xl border-l-4 border-blue-600">
                        <Quote className="absolute top-6 left-6 text-blue-200 w-12 h-12 -z-10 opacity-50" />
                        <h3 className="text-2xl font-bold text-foreground mb-4">A Vision of Transformation</h3>
                        <p className="italic text-muted-foreground mb-6">
                            "The initial phase was filled with challenges. However, driven by the confidence that an entire community
                            could be transformed, the leadership of Ottappalam Markaz overcame every obstacle."
                        </p>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 text-sm font-medium text-foreground">
                                <div className="w-2 h-2 rounded-full bg-blue-600" /> Quality Education
                            </li>
                            <li className="flex items-center gap-3 text-sm font-medium text-foreground">
                                <div className="w-2 h-2 rounded-full bg-blue-600" /> Charitable Initiatives
                            </li>
                            <li className="flex items-center gap-3 text-sm font-medium text-foreground">
                                <div className="w-2 h-2 rounded-full bg-blue-600" /> Intellectual Leadership
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Leadership Section */}
                <div className="border-t border-border pt-16">
                    <h2 className="text-3xl font-bold text-center mb-12">Our Leadership</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">

                        {/* Leader 1 */}
                        <div className="group p-6 rounded-2xl hover:bg-secondary/20 transition-all duration-300">
                            <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-white shadow-lg group-hover:scale-105 transition-transform">
                                <img src="/apUsthad.jpg" alt="A.P. Aboobacker Musliyar" className="w-full h-full object-cover" />
                            </div>
                            <h3 className="text-lg font-bold text-foreground">A.P. Aboobacker Musliyar</h3>
                            <p className="text-blue-600 font-medium text-sm mt-1">Kanthapuram</p>
                            <span className="inline-block mt-3 px-3 py-1 bg-secondary rounded-full text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                Chairman
                            </span>
                        </div>

                        {/* Leader 2 */}
                        <div className="group p-6 rounded-2xl hover:bg-secondary/20 transition-all duration-300">
                            <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-white shadow-lg group-hover:scale-105 transition-transform">
                                <img src="/t2.jpg" alt="K.P. Muhammed Musliyar" className="w-full h-full object-cover" />
                            </div>
                            <h3 className="text-lg font-bold text-foreground">K.P. Muhammed Musliyar</h3>
                            <p className="text-blue-600 font-medium text-sm mt-1">Kombam</p>
                            <span className="inline-block mt-3 px-3 py-1 bg-secondary rounded-full text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                President
                            </span>
                        </div>

                        {/* Leader 3 */}
                        <div className="group p-6 rounded-2xl hover:bg-secondary/20 transition-all duration-300">
                            <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-white shadow-lg group-hover:scale-105 transition-transform">
                                <img src="/t3.jpg" alt="M.V. Sidheeq Kamil Saquafi" className="w-full h-full object-cover" />
                            </div>
                            <h3 className="text-lg font-bold text-foreground">M.V. Sidheeq Kamil Saquafi</h3>
                            <p className="text-blue-600 font-medium text-sm mt-1">Ottapalam</p>
                            <span className="inline-block mt-3 px-3 py-1 bg-secondary rounded-full text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                General Secretary
                            </span>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}

export default About;