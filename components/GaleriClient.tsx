"use client";

import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Images } from "lucide-react";
import Image from "next/image";
import { Galeri, GaleriImage } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

const parseImages = (
  images: GaleriImage[] | string | null | undefined
): GaleriImage[] => {
  if (!images) return [];
  if (typeof images === "string") {
    try {
      return JSON.parse(images);
    } catch {
      return [];
    }
  }
  return Array.isArray(images) ? images : [];
};

export default function GaleriClient() {
  const [galeriList, setGaleriList] = useState<Galeri[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlbum, setSelectedAlbum] = useState<Galeri | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [albumImages, setAlbumImages] = useState<GaleriImage[]>([]);

  useEffect(() => {
    fetchGaleri();
  }, []);

  const fetchGaleri = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/galeri?published=true");
      const result = await response.json();
      setGaleriList(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error("Error fetching galeri:", error);
    } finally {
      setLoading(false);
    }
  };

  const openLightbox = (album: Galeri) => {
    const images = parseImages(album.images);
    setSelectedAlbum(album);
    setAlbumImages(images);
    setCurrentImageIndex(0);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setSelectedAlbum(null);
    setAlbumImages([]);
    setCurrentImageIndex(0);
    document.body.style.overflow = "auto";
  };

  const nextImage = useCallback(() => {
    if (albumImages.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === albumImages.length - 1 ? 0 : prev + 1
      );
    }
  }, [albumImages]);

  const prevImage = useCallback(() => {
    if (albumImages.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? albumImages.length - 1 : prev - 1
      );
    }
  }, [albumImages]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedAlbum) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedAlbum, nextImage, prevImage]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (galeriList.length === 0) {
    return (
      <div className="text-center py-20">
        <Images className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground text-lg">
          Belum ada album galeri yang tersedia.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {galeriList.map((album, index) => (
          <motion.div
            key={album.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => openLightbox(album)}
            className="group cursor-pointer"
          >
            <div className="relative aspect-4/3 rounded-xl overflow-hidden shadow-lg">
              <Image
                src={album.cover_image}
                alt={album.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                unoptimized
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-bold text-lg">{album.title}</h3>
                <p className="text-white/80 text-sm">
                  {parseImages(album.images).length} foto
                </p>
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                  <Images className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedAlbum && albumImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-50 p-2 text-white/80 hover:text-white transition-colors"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Album Title */}
            <div className="absolute top-4 left-4 z-50">
              <h3 className="text-white font-bold text-xl">
                {selectedAlbum.title}
              </h3>
              <p className="text-white/70 text-sm">
                {currentImageIndex + 1} / {albumImages.length}
              </p>
            </div>

            {/* Navigation Buttons */}
            {albumImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-4 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-4 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}

            {/* Main Image */}
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="relative w-full h-full max-w-5xl max-h-[80vh] mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={albumImages[currentImageIndex]?.url || ""}
                alt={`${selectedAlbum.title} - ${currentImageIndex + 1}`}
                fill
                className="object-contain"
                priority
                unoptimized
              />
            </motion.div>

            {/* Thumbnails */}
            {albumImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[90vw] p-2">
                {albumImages.map((img, idx) => (
                  <button
                    key={img.uuid}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(idx);
                    }}
                    className={`relative w-16 h-16 rounded-lg overflow-hidden shrink-0 transition-all ${
                      idx === currentImageIndex
                        ? "ring-2 ring-white scale-110"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
