import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import { RiLinkedinFill } from 'react-icons/ri';
import { AiFillYoutube, AiOutlineInstagram } from 'react-icons/ai';
import { ChevronRight } from 'lucide-react';

const socialLinks = [
  {
    path: "#",
    icon: <AiFillYoutube className="w-4 h-4 sm:w-5 sm:h-5" />,
    color: "hover:bg-red-600"
  },
  {
    path: "https://www.instagram.com/ecutzhairsaloon?igsh=NXR3NTAyaTJqMmNr&utm_source=qr",
    icon: <AiOutlineInstagram className="w-4 h-4 sm:w-5 sm:h-5" />,
    color: "hover:bg-pink-600"
  },
  {
    path: "#",
    icon: <RiLinkedinFill className="w-4 h-4 sm:w-5 sm:h-5" />,
    color: "hover:bg-blue-700"
  },
];

const quickLinks01 = [
  { path: "/home", display: "Home" },
  { path: "/barbers", display: "Marketplace" },
  { path: "/services", display: "Services" },
  { path: "/aboutus", display: "About Us" },
  { path: "/", display: "Blog" },
];

const quickLinks02 = [
  { path: "/barbers", display: "Find a Barber" },
  { path: "/", display: "Find a location" },
  { path: "/", display: "Get a Opinion" },
];

const quickLinks03 = [
  { path: "/", display: "Donate" },
  { path: "/contact", display: "Contact Us" },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-[#CDF0F3] to-[#FFF5DF] border-t border-gray-100 dark:from-slate-800 dark:to-slate-900 dark:border-slate-700">
      <div className="container mx-auto px-4 py-10 lg:py-16">
        {/* Main footer content */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Logo and social section */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-4">
            <div className="mb-6">
              <Link to="/" className="inline-block transition-transform hover:scale-105 mb-4">
                <img src={logo} alt="zeal logo" className="h-10 sm:h-12 lg:h-14 w-auto object-contain" />
              </Link>
              <p className="text-sm text-textColor dark:text-gray-300 leading-relaxed mb-8 max-w-sm">
                We&apos;re committed to providing exceptional barbering services and creating a welcoming community for all our clients.
              </p>
              
              <div className="flex gap-3">
                {socialLinks.map((link, index) => (
                  <Link
                    to={link.path}
                    key={index}
                    className={`w-10 h-10 rounded-xl bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-black/10 dark:border-slate-700 flex items-center justify-center transition-all duration-300 group ${link.color} hover:text-white hover:border-transparent hover:-translate-y-1 shadow-sm`}
                  >
                    {link.icon}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="col-span-1 lg:col-span-3">
            <h2 className="text-base lg:text-lg font-bold text-headingColor dark:text-gray-100 mb-6">
              Quick Links
            </h2>
            <ul className="space-y-4">
              {quickLinks01.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.path}
                    className="text-sm text-textColor dark:text-gray-300 hover:text-primaryColor flex items-center group transition-colors duration-300"
                  >
                    <ChevronRight className="w-3 h-3 mr-1 opacity-0 group-hover:opacity-100 transition-all -ml-4 group-hover:ml-0 text-primaryColor" />
                    {item.display}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Links Column */}
          <div className="col-span-1 lg:col-span-3">
            <h2 className="text-base lg:text-lg font-bold text-headingColor dark:text-gray-100 mb-6">
              I want to:
            </h2>
            <ul className="space-y-4">
              {quickLinks02.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.path}
                    className="text-sm text-textColor hover:text-primaryColor flex items-center group transition-colors duration-300"
                  >
                    <ChevronRight className="w-3 h-3 mr-1 opacity-0 group-hover:opacity-100 transition-all -ml-4 group-hover:ml-0 text-primaryColor" />
                    {item.display}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support section */}
          <div className="col-span-2 sm:col-span-1 lg:col-span-2">
            <h2 className="text-base lg:text-lg font-bold text-headingColor dark:text-gray-100 mb-6">
              Support
            </h2>
            <ul className="space-y-4">
              {quickLinks03.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.path}
                    className="text-sm text-textColor hover:text-primaryColor flex items-center group transition-colors duration-300"
                  >
                    <ChevronRight className="w-3 h-3 mr-1 opacity-0 group-hover:opacity-100 transition-all -ml-4 group-hover:ml-0 text-primaryColor" />
                    {item.display}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Legal Links Section */}
        <div className="border-t border-black/10 mt-12 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
            <p className="text-xs sm:text-sm text-textColor dark:text-gray-300">
              Copyright © {year} developed by <span className="font-semibold text-headingColor">Zeal Craft Innovation</span>. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <Link 
                to="/privacy-policy" 
                className="text-xs sm:text-sm text-textColor dark:text-gray-300 hover:text-primaryColor transition-colors duration-300"
              >
                Privacy Policy
              </Link>
              <div className="w-1 h-1 bg-gray-400 rounded-full" />
              <Link 
                to="/terms-conditions" 
                className="text-xs sm:text-sm text-textColor dark:text-gray-300 hover:text-primaryColor transition-colors duration-300"
              >
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;