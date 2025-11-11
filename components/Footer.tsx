"use client";
import {
  Mail,
  MapPin,
  Phone,
  Instagram,
  Github,
  Linkedin,
  Code2,
} from "lucide-react";
import { Button } from "./ui/button";

export default function Footer() {
  const socialLinks = [
    {
      icon: Instagram,
      href: "https://instagram.com/dcn.unira",
      label: "Instagram",
    },
    { icon: Github, href: "", label: "GitHub" },
    {
      icon: Linkedin,
      href: "",
      label: "LinkedIn",
    },
  ];

  const quickLinks = [
    { name: "Beranda", href: "#home" },
    { name: "Tentang", href: "#about" },
    { name: "Program", href: "#programs" },
    { name: "Events", href: "#events" },
  ];

  return (
    <footer
      id="contact"
      className="relative bg-linear-to-br from-foreground to-foreground/95 text-background pt-20 pb-8 overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-linear(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-lg bg-linear-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">DCN Unira</span>
            </div>
            <p className="text-background/70 text-sm leading-relaxed">
              Komunitas developer Universitas Madura yang berfokus pada
              pembelajaran dan pengembangan teknologi bersama.
            </p>
            {/* Social Links */}
            <div className="flex space-x-3 pt-2">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-10 h-10 rounded-lg bg-background/10 hover:bg-linear-to-br hover:from-primary hover:to-secondary flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                  >
                    <Icon className="w-5 h-5 text-background/70 group-hover:text-white transition-colors" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-background/70 hover:text-background transition-colors text-sm flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-primary transition-all duration-300 mr-0 group-hover:mr-2" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Kontak</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3 text-sm text-background/70">
                <Mail className="w-5 h-5 shrink-0 text-primary mt-0.5" />
                <span>info@dcnunira.dev</span>
              </li>
              <li className="flex items-start space-x-3 text-sm text-background/70">
                <Phone className="w-5 h-5 shrink-0 text-secondary mt-0.5" />
                <span>+62</span>
              </li>
              <li className="flex items-start space-x-3 text-sm text-background/70">
                <MapPin className="w-5 h-5 shrink-0 text-accent mt-0.5" />
                <span>Universitas Madura, Pamekasan, Jawa Timur</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Support by: </h3>
            <Button
              size="lg"
              className="hover:bg-white text-blue-600"
              onClick={() => window.open("https://codverse.site", "_blank")}
            >
              CodVerse
            </Button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-background/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-background/70 text-sm">
              &copy; 2025 Dicoding Community Network Unira. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-background/70">
              <a href="#" className="hover:text-background transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-background transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
