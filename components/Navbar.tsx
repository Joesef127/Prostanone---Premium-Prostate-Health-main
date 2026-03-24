import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingCart } from "lucide-react";
import { NAV_LINKS } from "../lib/constants.ts";
import Button from "./Button";
import { useApp } from "../context/AppContext";
import { images } from "@/lib";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isProductPage, setIsProductPage] = useState(false);

  const location = useLocation();
  const { cart } = useApp();

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setIsProductPage(location.pathname === "/product");
  }, [location]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 
            ${
              scrolled || isOpen
                ? `${isProductPage ? "bg-primary/90" : "bg-white/90"} 
            backdrop-blur-md shadow-md py-4`
                : "bg-transparent py-6"
            }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center z-50">
            <img
              src={images.logo}
              alt="Prostanone Logo"
              className={`h-10 w-auto ${isProductPage ? (isOpen ? "" : "brightness-0 invert") : ""}`}
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-8">
            {/* {isProductPage ? (
                <Link
                    to={"#"}
                    className={`text-sm py-1 lg:py-1.5 px-1.5 lg:px-2.5 font-medium hover:text-primary transition-colors ${
                        location.pathname !== "/product"
                            ? "text-primary font-bold"
                            : "text-gray-600"
                    } ${isProductPage && "text-white hover:bg-white hover:text-primary rounded-lg"}`}
                >
                    Product
                </Link>
            ) : (
              <> */}
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-xs lg:text-sm py-1 lg:py-1.5 px-1.5 lg:px-2.5 font-medium hover:text-primary transition-colors ${
                      location.pathname === link.path
                        ? `${isProductPage ? "bg-white text-primary!" : "text-primary font-bold"}`
                        : "text-gray-600"
                    } ${isProductPage && "text-white hover:bg-white hover:text-primary rounded-lg"}`}
                  >
                    {link.label}
                  </Link>
                ))}
              {/* </>
            )} */}
            <Link to="/summary">
              <div
                className={`relative py-1.5 px-2 ${isProductPage && "text-white hover:bg-white hover:text-primary rounded-lg"}`}
              >
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-accent text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </div>
            </Link>
            <Link to="/quiz">
              <Button size="sm" className={`${isProductPage && "text-primary! bg-white border border-transparent hover:text-white! hover:bg-transparent hover:border-white rounded-lg"}`}>Check Prostate Health</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4 z-50">
            <Link to="/summary" className="relative text-gray-800">
              <div
                  className={`py-1.5 px-2 ${isProductPage && `${isOpen ? "text-primary hover:bg-primary hover:text-white" : "text-white hover:bg-white hover:text-primary"} rounded-lg`}`}
              >
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                    <span className="absolute top-0 right-0 bg-accent text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </div>
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`py-1 px-1.5 ${isProductPage && `${isOpen ? "text-primary hover:bg-primary hover:text-white" : "text-white hover:bg-white hover:text-primary"} rounded-lg`} focus:outline-none`}
            >
              {isOpen ? (
                <X className="w-8 h-8" />
              ) : (
                <Menu className="w-8 h-8" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-white z-40 pt-20 pb-8 px-6 md:hidden flex flex-col items-center space-y-3 h-fit">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-xl font-medium text-gray-800 hover:text-white p-2 hover:bg-primary w-full rounded-lg text-center ${
                  location.pathname === link.path
                      ? "bg-primary text-white!"
                      : "text-gray-600"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link to="/quiz" className="w-full">
            <Button fullWidth size="md">
              Check Prostate Health
            </Button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
