"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { useHasMounted } from "@/hooks/useHasMounted";

interface ThemeToggleProps {
  isScrolled?: boolean;
}

export function ThemeToggle({ isScrolled = true }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const mounted = useHasMounted();

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={`h-9 w-9 ${
          isScrolled ? "hover:bg-muted" : "hover:bg-white/10"
        }`}
      >
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  const iconColor = isScrolled ? "text-foreground" : "text-white";

  return (
    <Button
      variant="ghost"
      size="icon"
      className={`h-9 w-9 ${
        isScrolled ? "hover:bg-muted" : "hover:bg-white/10"
      }`}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? (
        <Sun className={`h-5 w-5 ${iconColor} transition-transform`} />
      ) : (
        <Moon className={`h-5 w-5 ${iconColor} transition-transform`} />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
