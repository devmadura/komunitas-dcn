"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import { useSyncExternalStore } from "react";

function useIsMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export default function ImageLogo() {
  const { theme, resolvedTheme } = useTheme();
  const mounted = useIsMounted();

  const logo_light = "/logo500x350.png";
  const logo_dark = "/logo500x350dark.png";

  const currentTheme = theme === "system" ? resolvedTheme : theme;
  const imgUrl = currentTheme === "light" ? logo_light : logo_dark;

  return (
    <div className="relative overflow-hidden rounded">
      {mounted ? (
        <Image src={imgUrl} alt="DCN Unira Logo" width={120} height={120} />
      ) : (
        <div className="animate-pulse bg-gray-300 dark:bg-gray-700 w-full h-full rounded" />
      )}
    </div>
  );
}
