import { useEffect, useRef, useContext, useState } from "react";
import logo from "../../assets/images/trimz.png";
import { NavLink, Link } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { BiMenu, BiX, BiStore, BiCog, BiEnvelope, BiInfoCircle, BiLockAlt } from "react-icons/bi";
import { FaHome } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import NotificationIcon from "./NotificationIcon.jsx";
import ThemeToggle from './ThemeToggle';
import Portal from '../Portal';

const navLinks = [
  {
    path: "/home",
    display: "Home",
    icon: <FaHome className="text-xl" />,
  },
  {
    path: "/barbers",
    display: "Providers",
    icon: <BiStore className="text-xl" />,
  },
  {
    path: "/services",
    display: "Services",
    icon: <BiCog className="text-xl" />,
  },
  {
    path: "/contact",
    display: "Contact",
    icon: <BiEnvelope className="text-xl" />,
  },
  {
    path: "/aboutus",
    display: "About Us",
    icon: <BiInfoCircle className="text-xl" />,
  },
];

const Header = () => {
  const headerRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, role, token } = useContext(AuthContext);
  const location = useLocation();
  const firstLinkRef = useRef(null);
  const panelRef = useRef(null);

  const handleStickyHeader = () => {
    const threshold = headerRef.current?.offsetHeight || 80;
    const scrollTop = document.body.scrollTop || document.documentElement.scrollTop || window.scrollY || 0;
    if (scrollTop > threshold) {
      headerRef.current.classList.add("sticky__header");
    } else {
      headerRef.current.classList.remove("sticky__header");
    }
  };

  useEffect(() => {
    const onScroll = () => handleStickyHeader();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu when location changes (navigation) to avoid stale menu state
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // focus the first link when menu opens
  useEffect(() => {
    if (isMenuOpen) {
      setTimeout(() => {
        firstLinkRef.current?.focus?.();
      }, 50);
    }
  }, [isMenuOpen]);

  // Focus trap for mobile menu
  useEffect(() => {
    if (!isMenuOpen) return;
    const panel = panelRef.current;
    if (!panel) return;

    const focusableSelector = 'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])';
    const focusable = Array.from(panel.querySelectorAll(focusableSelector)).filter(el => !el.hasAttribute('disabled'));
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const handleKey = (e) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isMenuOpen]);

  // Lock body scroll when mobile menu is open (use counter-based helper)
  useEffect(() => {
    if (isMenuOpen) {
      import('../../utils/scrollLock').then(({ lockScroll }) => lockScroll());
    } else {
      import('../../utils/scrollLock').then(({ unlockScroll }) => unlockScroll());
    }
    return () => {
      // ensure unlock on unmount
      import('../../utils/scrollLock').then(({ unlockScroll }) => unlockScroll());
    };
  }, [isMenuOpen]);

  // Close menu on Escape key for better UX
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header flex items-center z-[12] py-3 dark:bg-slate-900 dark:border-b dark:border-slate-800" ref={headerRef}>
      <div className="container">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <div>
            <Link to="/home" className="flex items-center gap-2">
              <img src={logo} alt="Trimz Logo" style={{ width: "140px", height: "100px" }} />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <ul className="menu flex items-center gap-[3rem]">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <NavLink
                    to={link.path}
                    className={(navClass) =>
                      navClass.isActive
                        ? "text-primaryColor text-[15px] leading-7 font-[600] flex items-center gap-1.5 transition-colors duration-200"
                        : "text-textColor dark:text-gray-300 text-[15px] leading-7 font-[500] hover:text-primaryColor flex items-center gap-1.5 transition-colors duration-200"
                    }
                  >
                    {link.icon}
                    <span>{link.display}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Right section with profile/login, notification, and menu button */}
          <div className="flex items-center gap-5">
            <ThemeToggle />
            {token && user && <NotificationIcon />}

            {token && user ? (
              <div className="flex items-center gap-4">
                {role === "superadmin" && (
                  <Link
                    to="/superadmin/dashboard"
                    className="hidden lg:block text-[15px] font-[600] text-blue-500 hover:text-blue-600 transition-colors"
                  >
                    SuperAdmin Panel
                  </Link>
                )}
                {role === "admin" && (
                  <Link
                    to="/admin/providers"
                    className="hidden lg:block text-[15px] font-[600] text-primaryColor hover:text-blue-700 transition-colors"
                  >
                    Admin Panel
                  </Link>
                )}
                <Link to={`${role === "provider" ? "/barbers/profile/me" : "/users/profile/me"}`}>
                  <figure className="w-[44px] h-[44px] rounded-full cursor-pointer overflow-hidden ring-2 ring-primaryColor/20 hover:ring-primaryColor/40 transition-all duration-200">
                    <img
                      src={user.profilePicture?.url}
                      className="w-full h-full rounded-full object-cover block"
                      alt="User"
                    />
                  </figure>
                </Link>
              </div>
            ) : (
              <Link to="/login">
                <button className="bg-primaryColor py-2 px-6 text-white font-[600] h-[44px] flex items-center justify-center rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg">
                  Login
                </button>
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors duration-200"
              onClick={toggleMenu}
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? (
                <BiX className="w-6 h-6 cursor-pointer text-textColor dark:text-gray-200" aria-hidden="true" />
              ) : (
                <BiMenu className="w-6 h-6 cursor-pointer text-textColor dark:text-gray-200" aria-hidden="true" />
              )}
            </button>
          </div>

        </div>


        {/* Mobile Navigation Menu (fixed overlay) */}
        {isMenuOpen && (
          <Portal id="mobile-nav-portal">
            <div
              className="md:hidden mobile-nav-backdrop"
              role="dialog"
              aria-modal="true"
              onClick={() => setIsMenuOpen(false)}
            >
              <div
                // stop clicks inside menu from closing overlay
                onClick={(e) => e.stopPropagation()}
                className="mobile-nav-panel"
                ref={panelRef}
                style={{ paddingTop: headerRef.current?.offsetHeight || 80 }}
              >
                <div className="px-5 py-4 flex items-center justify-between border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-white to-gray-50 dark:from-slate-800 dark:to-slate-750">
                  <Link to="/home" className="flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
                    <img src={logo} alt="Trimz" className="w-28 h-auto" />
                  </Link>
                  <button aria-label="Close menu" onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition-colors duration-200">
                    <BiX className="w-6 h-6 text-textColor dark:text-gray-200" />
                  </button>
                </div>

                <ul className="mobile-nav-panel__content">
                  {navLinks.map((link, index) => (
                    <li key={index} className="border-b border-gray-100 dark:border-slate-700 last:border-none">
                      <NavLink
                        to={link.path}
                        ref={index === 0 ? firstLinkRef : null}
                        className={(navClass) =>
                          navClass.isActive
                            ? "text-primaryColor text-[17px] leading-7 font-[700] flex items-center gap-3 px-5 py-3 bg-primaryColor/10 border-l-3 border-primaryColor"
                            : "text-textColor dark:text-gray-200 text-[17px] leading-7 font-[600] hover:text-primaryColor flex items-center gap-3 px-5 py-3 hover:bg-gray-100 dark:hover:bg-slate-700 border-l-3 border-transparent transition-all duration-200"
                        }
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span className="text-xl">{link.icon}</span>
                        <span>{link.display}</span>
                      </NavLink>
                    </li>
                  ))}
                  {role === "superadmin" && (
                    <li className="border-b border-gray-100 dark:border-slate-700 last:border-none">
                      <NavLink
                        to="/superadmin/dashboard"
                        className={(navClass) =>
                          navClass.isActive
                            ? "text-blue-500 text-[17px] leading-7 font-[700] flex items-center gap-3 px-5 py-3 bg-blue-500/10 border-l-3 border-blue-500"
                            : "text-textColor dark:text-gray-200 text-[17px] leading-7 font-[600] hover:text-blue-500 flex items-center gap-3 px-5 py-3 hover:bg-gray-100 dark:hover:bg-slate-700 border-l-3 border-transparent transition-all duration-200"
                        }
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span className="text-xl"><BiLockAlt /></span>
                        <span>SuperAdmin Panel</span>
                      </NavLink>
                    </li>
                  )}
                  {role === "admin" && (
                    <li className="border-b border-gray-100 dark:border-slate-700 last:border-none">
                      <NavLink
                        to="/admin/providers"
                        className={(navClass) =>
                          navClass.isActive
                            ? "text-primaryColor text-[17px] leading-7 font-[700] flex items-center gap-3 px-5 py-3 bg-primaryColor/10 border-l-3 border-primaryColor"
                            : "text-textColor dark:text-gray-200 text-[17px] leading-7 font-[600] hover:text-primaryColor flex items-center gap-3 px-5 py-3 hover:bg-gray-100 dark:hover:bg-slate-700 border-l-3 border-transparent transition-all duration-200"
                        }
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span className="text-xl"><BiLockAlt /></span>
                        <span>Admin Panel</span>
                      </NavLink>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </Portal>
        )}
      </div>
    </header>
  );
};

export default Header;
