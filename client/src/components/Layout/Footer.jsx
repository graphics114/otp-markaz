import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import { FaThreads, FaFacebook, FaInstagram, FaYoutube, FaWhatsapp } from "react-icons/fa6";
import { Link } from "react-router-dom";

const Footer = () => {

    const socialLinks = [
        { icon: FaFacebook, href: "https://www.facebook.com/MarkazOttapalam/", color: "text-blue-600" },
        { icon: FaYoutube, href: "https://www.youtube.com/@ottapalammarkazlive4915", color: "text-red-600" },
        { icon: FaInstagram, href: "https://www.instagram.com/ottapalam_markaz?igsh=Y3Axam1leHo3dGtt", color: "text-pink-600" },
        { icon: FaThreads, href: "https://www.threads.net/@ottapalam_markaz", color: "text-neutral-900 dark:text-neutral-100" },
        { icon: FaWhatsapp, href: "https://chat.whatsapp.com/DiIpWbN0SeeFvJGbKtP7ft", color: "text-green-500" },
    ];

    return (
        <footer className="mt-20 border-t border-border bg-secondary/5 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-12">

                    {/* Brand / About */}
                    <div className="lg:col-span-4 space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <img src="/navelogo.png" alt="Markaz Logo" className="h-10 w-auto" />
                            <span className="font-bold text-xl tracking-tight">OTTAPALAM MARKAZ</span>
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
                            Dedicated to excellence in education and spiritual growth.
                            Nurturing the generation of tomorrow with values and knowledge.
                        </p>
                    </div>

                    {/* Quick Link 1 */}
                    <div className="lg:col-span-2 lg:col-start-6">
                        <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
                        <ul className="space-y-2.5 text-sm text-muted-foreground">
                            <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
                            <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link to="/institutions" className="hover:text-primary transition-colors">Institutions</Link></li>
                            <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Quick Link 2 (Academic or other) - using placeholders for now if needed, or mere duplication of context */}
                    <div className="lg:col-span-2">
                        <h4 className="font-semibold text-foreground mb-4">Academics</h4>
                        <ul className="space-y-2.5 text-sm text-muted-foreground">
                            <li><a href="#" className="hover:text-primary transition-colors">Admissions</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Results</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Publications</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Events</a></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="lg:col-span-3">
                        <h4 className="font-semibold text-foreground mb-4">Contact Us</h4>
                        <ul className="space-y-4 text-sm text-muted-foreground">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                <span>Mayilumpuram, Thottakkara PO,<br />Ottapalam, Palakkad - 679103</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-primary shrink-0" />
                                <span>+91 70348 91852</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-primary shrink-0" />
                                <span>markazotp@gmail.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-muted-foreground">
                        &copy; {new Date().getFullYear()} OTP Markaz. All rights reserved.
                    </p>

                    {/* Social Icons */}
                    <div className="flex items-center gap-4">
                        {socialLinks.map((social, index) => (
                            <a
                                key={index}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`p-2 rounded-full hover:bg-secondary transition-colors ${social.color} bg-background border border-border/50 shadow-sm`}
                            >
                                <social.icon size={18} />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;