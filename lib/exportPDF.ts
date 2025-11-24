import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { logo } from "./logo";

// --- PERBAIKAN 1: TAMBAHKAN BASE64 LOGO ANDA DI SINI ---
// Ganti string di bawah ini dengan Base64 dari logo Anda
const logoBase64 = logo;

// --- Deklarasi modul untuk lastAutoTable (sudah benar dari sebelumnya) ---
declare module "jspdf" {
  interface jsPDF {
    lastAutoTable: {
      finalY: number;
    };
  }
}

// --- Tipe data (sudah benar dari sebelumnya) ---
interface ExportData {
  pertemuan: {
    judul: string | null;
    tanggal: string | null;
    berita_acara: string | null;
  };
  absensi: Array<{
    nim: string;
    nama: string;
    angkatan: string;
    status: string;
    poin: number;
    keterangan?: string;
  }>;
}

type KontributorData = {
  nim: string;
  nama: string;
  angkatan: string;
  total_poin: number;
};

// --- PERBAIKAN 2: BUAT FUNGSI PEMBANTU UNTUK HEADER ---
// Fungsi ini akan digunakan oleh kedua fungsi ekspor untuk menghindari duplikasi kode.
const addHeaderToPDF = (doc: jsPDF, title: string) => {
  // Tambahkan Logo
  // Ukuran logo (lebar 30, tinggi disesuaikan agar proporsional)
  const logoWidth = 40;
  const logoHeight = (logoWidth / 100) * 50; // Misal rasio aspek 2:1, sesuaikan jika perlu

  doc.addImage(logoBase64, "PNG", 15, 10, logoWidth, logoHeight);

  // Tambahkan Judul
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text(title, 105, 25, { align: "center" }); // Posisi Y disesuaikan

  // Tambahkan Sub-judul
  doc.setFontSize(16);
  doc.setFont("helvetica", "normal");
  doc.text("Komunitas DCN", 105, 33, { align: "center" }); // Posisi Y disesuaikan
};

export const exportAbsensiToPDF = (data: ExportData) => {
  const doc = new jsPDF();

  // Gunakan fungsi pembantu untuk header
  addHeaderToPDF(doc, "BERITA ACARA PERTEMUAN");

  // --- PERBAIKAN 3: SESUAIKAN POSISI Y ELEMEN BERIKUTNYA ---
  // Karena header sekarang lebih tinggi (karena ada logo), kita perlu menurunkan posisi elemen-elemen berikutnya.
  let currentY = 45; // Posisi Y untuk elemen pertama setelah header

  // Info Pertemuan
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Judul: ${data.pertemuan.judul || "Tidak ada judul"}`, 20, currentY);
  currentY += 7; // Tambah 7 untuk baris berikutnya

  let tanggalString = "Tanggal Tidak Tersedia";
  if (data.pertemuan.tanggal) {
    tanggalString = new Date(data.pertemuan.tanggal).toLocaleDateString(
      "id-ID",
      {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );
  }
  doc.text(`Tanggal: ${tanggalString}`, 20, currentY);
  currentY += 10; // Tambah jarak sebelum berita acara

  // Berita Acara
  if (data.pertemuan.berita_acara) {
    doc.setFont("helvetica", "bold");
    doc.text("Berita Acara:", 20, currentY);
    currentY += 7;
    doc.setFont("helvetica", "normal");

    const splitText = doc.splitTextToSize(data.pertemuan.berita_acara, 170);
    doc.text(splitText, 20, currentY);
    currentY += splitText.length * 5 + 5; // Sesuaikan Y berdasarkan jumlah baris
  }

  // Tabel Absensi
  doc.setFont("helvetica", "bold");
  doc.text("Daftar Kehadiran:", 20, currentY);
  const tableStartY = currentY + 5;

  const tableData = data.absensi.map((item, index) => [
    index + 1,
    item.nim,
    item.nama,
    item.angkatan,
    item.status.toUpperCase(),
    item.poin,
    item.keterangan || "-",
  ]);

  autoTable(doc, {
    startY: tableStartY,
    head: [["No", "NIM", "Nama", "Angkatan", "Status", "Poin", "Keterangan"]],
    body: tableData,
    theme: "grid",
    headStyles: {
      fillColor: [79, 70, 229], // Indigo-600
      textColor: 255,
      fontStyle: "bold",
      halign: "center",
    },
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    columnStyles: {
      0: { cellWidth: 10, halign: "center" },
      1: { cellWidth: 25, halign: "center" },
      2: { cellWidth: 45 },
      3: { cellWidth: 20, halign: "center" },
      4: { cellWidth: 20, halign: "center" },
      5: { cellWidth: 15, halign: "center" },
      6: { cellWidth: 35 },
    },
  });

  // Summary
  const finalY = doc.lastAutoTable.finalY + 10;
  const totalHadir = data.absensi.filter((a) => a.status === "hadir").length;
  const totalIzin = data.absensi.filter((a) => a.status === "izin").length;
  const totalAlpha = data.absensi.filter((a) => a.status === "alpha").length;

  doc.setFont("helvetica", "bold");
  doc.text("Ringkasan:", 20, finalY);
  doc.setFont("helvetica", "normal");
  doc.text(`Total Hadir: ${totalHadir} orang`, 20, finalY + 7);
  doc.text(`Total Izin: ${totalIzin} orang`, 20, finalY + 14);
  doc.text(`Total Alpha: ${totalAlpha} orang`, 20, finalY + 21);

  // Footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(8);
  doc.setTextColor(128);
  doc.text(
    `Dicetak pada: ${new Date().toLocaleString("id-ID")}`,
    105,
    pageHeight - 10,
    { align: "center" }
  );

  // Save PDF
  const judulFileName = (data.pertemuan.judul || "Tanpa_Judul").replace(
    /\s+/g,
    "_"
  );

  let tanggalFileName = new Date().toISOString().split("T")[0];
  if (data.pertemuan.tanggal) {
    tanggalFileName = new Date(data.pertemuan.tanggal)
      .toISOString()
      .split("T")[0];
  }

  const fileName = `Laporan_${judulFileName}_${tanggalFileName}.pdf`;
  doc.save(fileName);
};

export const exportLeaderboardToPDF = (kontributor: KontributorData[]) => {
  const doc = new jsPDF();

  // Gunakan fungsi pembantu untuk header
  addHeaderToPDF(doc, "LEADERBOARD KONTRIBUTOR");

  // Tabel Leaderboard
  // Posisi `startY` disesuaikan karena header sekarang lebih tinggi
  autoTable(doc, {
    startY: 45,
    head: [["Rank", "NIM", "Nama", "Angkatan", "Total Poin", "Tier"]],
    body: kontributor.map((item, index) => {
      let tier = "Member";
      if (item.total_poin >= 300) tier = "Gold";
      else if (item.total_poin >= 200) tier = "Silver";
      else if (item.total_poin >= 100) tier = "Bronze";

      return [
        index + 1,
        item.nim,
        item.nama,
        item.angkatan,
        item.total_poin,
        tier,
      ];
    }),
    theme: "striped",
    headStyles: {
      fillColor: [79, 70, 229],
      textColor: 255,
      fontStyle: "bold",
      halign: "center",
    },
    styles: {
      fontSize: 10,
      cellPadding: 4,
    },
    columnStyles: {
      0: { cellWidth: 15, halign: "center", fontStyle: "bold" },
      1: { cellWidth: 25, halign: "center" },
      2: { cellWidth: 60 },
      3: { cellWidth: 25, halign: "center" },
      4: { cellWidth: 25, halign: "center", fontStyle: "bold" },
      5: { cellWidth: 25, halign: "center" },
    },
  });

  // Footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(8);
  doc.setTextColor(128);
  doc.text(
    `Dicetak pada: ${new Date().toLocaleString("id-ID")}`,
    105,
    pageHeight - 10,
    { align: "center" }
  );

  // Save PDF
  doc.save(`Leaderboard_DCN_${new Date().toISOString().split("T")[0]}.pdf`);
};
