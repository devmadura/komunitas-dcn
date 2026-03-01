import NotFoundContent from "@/components/screen/not-found/content";

export const metadata = {
  title: "404 Not Found",
  description: "Halaman yang Anda cari tidak ditemukan.",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      <NotFoundContent />
    </div>
  );
}
