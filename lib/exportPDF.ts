import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { logo } from "./logo";
import { signature } from "./signature";

const logoBase64 = logo;
const signatureBase64 = signature;

declare module "jspdf" {
  interface jsPDF {
    lastAutoTable: {
      finalY: number;
    };
  }
}

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

const addHeaderToPDF = (doc: jsPDF, title: string) => {
  const logoWidth = 40;
  const logoHeight = (logoWidth / 100) * 50;

  doc.addImage(logoBase64, "PNG", 15, 10, logoWidth, logoHeight);

  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text(title, 105, 25, { align: "center" });

  doc.setFontSize(16);
  doc.setFont("helvetica", "normal");
  doc.text("Komunitas DCN Universitas Madura", 105, 33, { align: "center" });
};

const addSignatureToPDF = (doc: jsPDF, startY: number) => {
  const pageHeight = doc.internal.pageSize.height;

  // Check if we need a new page for signature
  let signatureY = startY;
  if (startY + 60 > pageHeight - 20) {
    doc.addPage();
    signatureY = 30;
  }

  doc.setFontSize(10);
  doc.setTextColor(0);
  doc.setFont("helvetica", "normal");
  doc.text("Mengetahui,", 150, signatureY, { align: "center" });
  doc.text("Builder Komunitas DCN UNIRA", 150, signatureY + 7, {
    align: "center",
  });

  // Add signature image
  const sigWidth = 40;
  const sigHeight = 25;
  doc.addImage(
    signatureBase64,
    "PNG",
    130,
    signatureY + 12,
    sigWidth,
    sigHeight
  );

  // Signature line
  doc.setDrawColor(0);
  doc.line(120, signatureY + 40, 180, signatureY + 40);

  doc.setFont("helvetica", "bold");
  doc.text("( MOH. ARORIL HUDA )", 150, signatureY + 47, { align: "center" });
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
      fillColor: [79, 70, 229],
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

  // Signature
  addSignatureToPDF(doc, finalY + 35);

  // Footer on all pages
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(8);
    doc.setTextColor(128);
    doc.text(
      `Dicetak pada: ${new Date().toLocaleString("id-ID")}`,
      105,
      pageHeight - 10,
      { align: "center" }
    );
  }

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

  const fileName = `Laporan_Event_${judulFileName}_${tanggalFileName}.pdf`;
  doc.save(fileName);
};

export const exportLeaderboardToPDF = (kontributor: KontributorData[]) => {
  const doc = new jsPDF();

  addHeaderToPDF(doc, "LEADERBOARD KONTRIBUTOR");

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

  // Signature
  addSignatureToPDF(doc, doc.lastAutoTable.finalY + 20);

  // Footer on all pages
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(8);
    doc.setTextColor(128);
    doc.text(
      `Dicetak pada: ${new Date().toLocaleString("id-ID")}`,
      105,
      pageHeight - 10,
      { align: "center" }
    );
  }

  doc.save(`Leaderboard_DCN_${new Date().toISOString().split("T")[0]}.pdf`);
};

export const exportAllKontributorToPDF = (kontributor: KontributorData[]) => {
  const doc = new jsPDF();

  addHeaderToPDF(doc, "DAFTAR SEMUA KONTRIBUTOR");

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(`Total Kontributor: ${kontributor.length} orang`, 20, 43);

  autoTable(doc, {
    startY: 50,
    head: [["No", "NIM", "Nama", "Angkatan", "Total Poin", "Tier"]],
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
    theme: "grid",
    headStyles: {
      fillColor: [79, 70, 229],
      textColor: 255,
      fontStyle: "bold",
      halign: "center",
    },
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    columnStyles: {
      0: { cellWidth: 12, halign: "center" },
      1: { cellWidth: 25, halign: "center" },
      2: { cellWidth: 55 },
      3: { cellWidth: 22, halign: "center" },
      4: { cellWidth: 25, halign: "center", fontStyle: "bold" },
      5: { cellWidth: 22, halign: "center" },
    },
  });

  // Signature
  addSignatureToPDF(doc, doc.lastAutoTable.finalY + 20);

  // Footer on all pages
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(8);
    doc.setTextColor(128);
    doc.text(
      `Halaman ${i} dari ${pageCount} | Dicetak pada: ${new Date().toLocaleString(
        "id-ID"
      )}`,
      105,
      pageHeight - 10,
      { align: "center" }
    );
  }

  doc.save(
    `Semua_Kontributor_DCN_${new Date().toISOString().split("T")[0]}.pdf`
  );
};

interface QuizResultData {
  quiz: {
    judul: string;
    deskripsi: string | null;
    created_at: string;
  };
  submissions: Array<{
    nama_peserta: string;
    skor: number;
    total_soal: number;
    poin: number;
    submitted_at: string;
  }>;
}

export const exportQuizResultToPDF = (data: QuizResultData) => {
  const doc = new jsPDF();

  addHeaderToPDF(doc, "HASIL KUIS");

  let currentY = 45;

  // Quiz Info
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(data.quiz.judul, 20, currentY);
  currentY += 7;

  if (data.quiz.deskripsi) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const splitDesc = doc.splitTextToSize(data.quiz.deskripsi, 170);
    doc.text(splitDesc, 20, currentY);
    currentY += splitDesc.length * 5 + 3;
  }

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const tanggalKuis = new Date(data.quiz.created_at).toLocaleDateString(
    "id-ID",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );
  doc.text(`Diselenggarakan: ${tanggalKuis}`, 20, currentY);
  currentY += 5;
  doc.text(`Total Peserta: ${data.submissions.length} orang`, 20, currentY);
  currentY += 10;

  // Table
  autoTable(doc, {
    startY: currentY,
    head: [["No", "Nama Peserta", "Skor", "Persentase", "Poin"]],
    body: data.submissions.map((sub, index) => [
      index + 1,
      sub.nama_peserta,
      `${sub.skor}/${sub.total_soal}`,
      `${Math.round((sub.skor / sub.total_soal) * 100)}%`,
      `+${sub.poin}`,
    ]),
    theme: "grid",
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
      0: { cellWidth: 15, halign: "center" },
      1: { cellWidth: 70 },
      2: { cellWidth: 25, halign: "center" },
      3: { cellWidth: 30, halign: "center" },
      4: { cellWidth: 25, halign: "center", fontStyle: "bold" },
    },
  });

  // Signature
  addSignatureToPDF(doc, doc.lastAutoTable.finalY + 20);

  // Footer on all pages
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const pageH = doc.internal.pageSize.height;
    doc.setFontSize(8);
    doc.setTextColor(128);
    doc.text(
      `Dicetak pada: ${new Date().toLocaleString("id-ID")}`,
      105,
      pageH - 10,
      { align: "center" }
    );
  }

  const judulFileName = data.quiz.judul.replace(/\s+/g, "_").substring(0, 30);
  doc.save(
    `Hasil_Kuis_${judulFileName}_${new Date().toISOString().split("T")[0]}.pdf`
  );
};
