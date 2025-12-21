/* eslint-disable react/no-unknown-property */
import ceoImg from "../../assets/images/ecutz-ceo.png";
import cofounderImg from "../../assets/images/ecutz-cofounder.jpeg"; // Added Co-founder import
// import aboutCardimg from "../../assets/images/about-card1.png";
import { Facebook, Twitter, Instagram } from "lucide-react";
import PropTypes from "prop-types";

/**
 * A reusable component for team member portraits with hover effects
 */
const ProfileCard = ({ image, alt }) => (
  <div className="relative group perspective-1000 w-full sm:w-[280px] lg:w-[320px]">
    <div className="relative overflow-hidden rounded-3xl shadow-xl transition-all duration-700 border-2 border-transparent hover:border-blue-100 transform hover:rotate-1 hover:scale-[1.02] bg-white">
      {/* Glossy Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-blue-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-20" />
      
      <img
        src={image}
        alt={alt}
        className="w-full h-[400px] object-cover object-top filter grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 ease-in-out"
      />

      {/* Animated Glare Effect */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-30">
        <div className="absolute top-0 left-0 w-1/2 h-full bg-white/30 skew-x-[-35deg] -translate-x-[150%] group-hover:animate-glare" />
      </div>
    </div>

    {/* Optional Float Card (Experience/Stats Badge) */}
    {/* {showBadge && (
      <div className="absolute z-40 -bottom-6 -right-4 w-[180px] md:w-[220px] transition-all duration-700 group-hover:translate-y-[-10px]">
        <img
          src={aboutCardimg}
          alt="Achievement Badge"
          className="w-full rounded-xl shadow-2xl border-4 border-white"
        />
      </div>
    )} */}
  </div>
);

ProfileCard.propTypes = {
  image: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
};
function About() {
  return (
    <section className="py-16 lg:py-24 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">
          
          {/* ============= IMAGES SECTION ========= */}
          <div className="w-full lg:w-1/2 flex flex-col sm:flex-row gap-8 sm:gap-4 items-center justify-center lg:justify-start">
            <ProfileCard image={ceoImg} alt="Saddiq Ahmed - CEO" showBadge={true} />
            <div className="sm:mt-12"> {/* Offset the second image for a professional "gallery" feel */}
               <ProfileCard image={cofounderImg} alt="Co-Founder" />
            </div>
          </div>

          {/* ============= CONTENT SECTION ========= */}
          <div className="w-full lg:w-1/2">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Meet the Visionaries <br /> 
              <span className="text-blue-600">Behind Trimz</span>
            </h2>
            
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Trimz is the brainchild of Saddiq Ahmed, Benjamin and their founding team—forward-thinking entrepreneurs passionate
              about blending technology with everyday convenience.
            </p>
            
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              Recognizing the challenges people face in accessing quality grooming services, 
              the team envisioned Trimz as more than just an app; it’s a lifestyle solution 
              designed to bridge the gap between skilled professionals and modern clients.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center space-x-6">
              <span className="text-sm font-semibold uppercase tracking-widest text-gray-400">Follow Our Journey:</span>
              <div className="flex space-x-4">
                {[
                  { Icon: Facebook, color: "hover:text-blue-600", href: "#" },
                  { Icon: Twitter, color: "hover:text-sky-400", href: "#" },
                  { Icon: Instagram, color: "hover:text-pink-500", href: "#" },
                ].map(({ Icon, color, href }, idx) => (
                  <a key={idx} href={href} className={`text-gray-400 transition-colors duration-300 ${color}`}>
                    <Icon size={24} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global Styles for the Glare Animation */}
      <style>{`
        @keyframes glare {
          0% { transform: skewX(-35deg) translateX(-150%); }
          100% { transform: skewX(-35deg) translateX(250%); }
        }
        .animate-glare {
          animation: glare 1.5s ease-in-out;
        }
      `}</style>
    </section>
  );
}

export default About;