import { FaThreads, FaFacebook, FaInstagram, FaYoutube, FaWhatsapp } from "react-icons/fa6";
import { Mail, Phone, MapPin, MessageSquare, ExternalLink } from "lucide-react";

const ContactUs = () => {

    const contactInfo = [
        {
            icon: MapPin,
            title: "Visit Us",
            details: ["Mayilumpuram, Thottakkara PO,", "Ottapalam, Palakkad - 679103"],
            color: "text-red-500"
        },
        {
            icon: Phone,
            title: "Call Us",
            details: ["+91 70348 91852", "0466-2933641"],
            color: "text-blue-500"
        },
        {
            icon: Mail,
            title: "Email Us",
            details: ["markazotp@gmail.com"],
            color: "text-yellow-500"
        }
    ];

    const socialLinks = [
        { icon: FaFacebook, href: "https://www.facebook.com/MarkazOttapalam/", color: "text-blue-600", name: "Facebook" },
        { icon: FaYoutube, href: "https://www.youtube.com/@ottapalammarkazlive4915", color: "text-red-600", name: "YouTube" },
        { icon: FaInstagram, href: "https://www.instagram.com/ottapalam_markaz?igsh=Y3Axam1leHo3dGtt", color: "text-pink-600", name: "Instagram" },
        { icon: FaThreads, href: "https://www.threads.net/@ottapalam_markaz", color: "text-black dark:text-white", name: "Threads" },
    ];

    return (
        <div className="min-h-screen bg-background pt-24 pb-12">

            {/* Header */}
            <div className="text-center mb-16 px-2">
                <span className="text-blue-600 font-semibold tracking-wide uppercase text-sm mb-2 block animate-fade-in-up">
                    Get in Touch
                </span>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in-up delay-100">
                    We'd Love to Hear from You
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto animate-fade-in-up delay-200">
                    Have questions about admissions, academics, or events? Reach out to us directly or visit our campus.
                </p>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">

                    {/* Contact Info Cards */}
                    <div className="lg:col-span-1 space-y-6">
                        {contactInfo.map((item, index) => (
                            <div key={index} className="flex gap-4 p-6 bg-secondary/5 border border-border/50 rounded-2xl hover:bg-secondary/10 transition-colors animate-fade-in-up">
                                <div className={`p-3 rounded-full bg-background shadow-sm h-fit ${item.color}`}>
                                    <item.icon size={24} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                                    {item.details.map((line, i) => (
                                        <p key={i} className="text-muted-foreground">{line}</p>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {/* WhatsApp CTA */}
                        <div className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl animate-fade-in-up delay-300">
                            <h3 className="font-semibold text-green-800 dark:text-green-300 mb-2 flex items-center gap-2">
                                <FaWhatsapp /> Quick Chat
                            </h3>
                            <p className="text-sm text-green-700 dark:text-green-400 mb-4">
                                Need instant assistance? Chat with our support team on WhatsApp.
                            </p>
                            <a
                                href="https://wa.me/+917034891852"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium shadow-md shadow-green-600/20"
                            >
                                Start Chat <ExternalLink size={16} />
                            </a>
                        </div>
                    </div>

                    {/* Google Map */}
                    <div className="lg:col-span-2 h-[400px] lg:h-auto min-h-[400px] bg-secondary/10 rounded-2xl overflow-hidden border border-border/50 shadow-lg animate-fade-in-up delay-200">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d31355.67098484183!2d76.368636!3d10.776077!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba7d1007a10a175%3A0xe51a704944fb1775!2sMarkazul%20Hidhaya%20Education%20Complex!5e0!3m2!1sen!2sin!4v1709638421052!5m2!1sen!2sin"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Markaz Location"
                            className="grayscale hover:grayscale-0 transition-all duration-700"
                        ></iframe>
                    </div>

                </div>

                {/* Social Media Section */}
                <div className="text-center border-t border-border pt-12 animate-fade-in-up delay-300">
                    <h2 className="text-2xl font-bold mb-8">Follow Our Journey</h2>
                    <div className="flex flex-wrap justify-center gap-6">
                        {socialLinks.map((social, index) => (
                            <a
                                key={index}
                                href={social.href}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-3 px-6 py-3 bg-secondary/5 hover:bg-white dark:hover:bg-secondary/20 border border-border/50 rounded-xl transition-all hover:-translate-y-1 hover:shadow-lg group"
                            >
                                <social.icon size={24} className={`${social.color} transition-transform group-hover:scale-110`} />
                                <span className="font-medium">{social.name}</span>
                            </a>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ContactUs;