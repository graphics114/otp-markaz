import Heroslider from "../components/Home/HeroSection";
import DonationSection from "../components/Home/DonationSection";
import AboutSection from "../components/Home/AboutSecton";
import InstitutionsSlider from "../components/Home/InstitutionsSlider";
import FeatureSection from "../components/Home/FeatureSection";
import VisionAndMission from "../components/Home/VisionMission";

const Index = () => {

    return (
        <div className="min-h-screen pt-20">
            <Heroslider />
            <AboutSection />
            <InstitutionsSlider />
            <VisionAndMission />
            <FeatureSection />
            <DonationSection />
        </div>
    );
}

export default Index;