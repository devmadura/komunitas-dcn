"use client";
import { useState, useCallback, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import ImageLogo from "./shared/image-logo";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const menuItems = [
    { name: "Beranda", href: "/" },
    { name: "Tentang", href: "#about" },
    { name: "Program", href: "#programs" },
    { name: "Events", href: "#events" },
    { name: "Blogs", href: "/blog" },
    { name: "Team", href: "/team" },
    { name: "Galeri", href: "/galeri" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSmoothScroll = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      if (href.startsWith("#")) {
        e.preventDefault();
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        setIsOpen(false);
      }
    },
    []
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-background/95 backdrop-blur-lg shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <ImageLogo />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleSmoothScroll(e, item.href)}
                className={`px-4 py-2 transition-colors rounded-lg ${isScrolled
                  ? "text-foreground/80 hover:text-foreground hover:bg-muted"
                  : "text-white/90 hover:text-white hover:bg-white/10"
                  }`}
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Right Side: Theme Toggle + CTA */}
          <div className="hidden md:flex items-center space-x-2">
            <ThemeToggle isScrolled={isScrolled} />
            <Button
              asChild
              variant={isScrolled ? "glass" : "default"}
              size="sm"
              className={
                isScrolled ? "" : "text-white/90 hover:bg-white/20 border-0"
              }
            >
              <Link
                href="https://pendaftaran.dcnunira.dev"
                target="_blank"
                rel="noopener noreferrer"
              >
                Gabung Sekarang
              </Link>
            </Button>
          </div>

          {/* Mobile: Theme Toggle + Menu Button */}
          <div className="flex md:hidden items-center space-x-1">
            <ThemeToggle isScrolled={isScrolled} />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-lg transition-colors ${isScrolled ? "hover:bg-muted" : "hover:bg-white/10"
                }`}
            >
              {isOpen ? (
                <X
                  className={`w-6 h-6 ${isScrolled ? "text-foreground" : "text-white"
                    }`}
                />
              ) : (
                <Menu
                  className={`w-6 h-6 ${isScrolled ? "text-foreground" : "text-white"
                    }`}
                />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 animate-fade-in">
            <div className="flex flex-col space-y-2">
              {menuItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleSmoothScroll(e, item.href)}
                  className="px-4 py-3 text-foreground/80 hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                >
                  {item.name}
                </a>
              ))}
              <div className="px-4 pt-2">
                <Button asChild variant="glass" className="w-full">
                  <Link
                    href="https://pendaftaran.dcnunira.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Gabung Sekarang
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
