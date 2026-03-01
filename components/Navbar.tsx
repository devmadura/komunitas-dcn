"use client";
import { useState, useCallback, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import ImageLogo from "./shared/image-logo";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { name: "Beranda", href: "/" },
    { name: "Tentang", href: "/#about" },
    { name: "Program", href: "/#programs" },
    { name: "Events", href: "/event" },
    { name: "Blogs", href: "/blog" },
    { name: "Team", href: "/team" },
    { name: "Galeri", href: "/galeri" },
  ];

  const isActive = (href: string) => {
    if (href.startsWith("/#")) return pathname === "/";
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

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
      } else {
        setIsOpen(false);
      }
    },
    []
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-background/95 backdrop-blur-lg shadow-lg">
      <div className="container mx-auto px-4 relative z-50">
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
                className={`relative px-4 py-2 transition-colors rounded-lg font-medium ${isActive(item.href)
                  ? isScrolled
                    ? "text-primary"
                    : "text-white"
                  : isScrolled
                    ? "text-foreground/70 hover:text-foreground hover:bg-muted"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
              >
                {item.name}
                {/* Active underline dot */}
                {isActive(item.href) && (
                  <span className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${isScrolled ? "bg-primary" : "bg-white"}`} />
                )}
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
          <div className="flex md:hidden items-center space-x-1 relative z-50">
            <ThemeToggle isScrolled={isScrolled} />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-lg transition-colors ${isScrolled ? "hover:bg-muted" : "hover:bg-white/10"
                }`}
            >
              {isOpen ? (
                <X className="w-6 h-6 text-foreground" />
              ) : (
                <Menu className="w-6 h-6 text-foreground" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Full-Screen Mobile Menu Overlay */}
      <div
        className={`fixed top-0 w-screen h-[100dvh] mobile-nav-overlay z-40 flex flex-col pt-24 px-6 md:hidden transition-all duration-500 ease-in-out ${isOpen
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-full pointer-events-none"
          }`}
      >
        <div className="flex flex-col space-y-2 flex-grow">
          {menuItems.map((item, index) => (
            <a
              key={item.name}
              href={item.href}
              onClick={(e) => handleSmoothScroll(e, item.href)}
              className={`text-2xl font-bold transition-all duration-300 transform flex items-center gap-3 py-2 border-l-4 pl-4 ${isActive(item.href)
                ? "text-blue-400 border-blue-400"
                : "text-foreground/70 hover:text-foreground border-transparent hover:border-muted-foreground/30"
                } ${isOpen
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
                }`}
              style={{ transitionDelay: `${index * 60}ms` }}
            >
              {item.name}
            </a>
          ))}
        </div>

        <div className={`pb-12 transition-all duration-500 delay-500 transform ${isOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
          <Button asChild variant="default" size="lg" className="w-full text-lg h-14 rounded-xl">
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
    </nav>
  );
}

