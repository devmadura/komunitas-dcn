import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { logo } from "./logo";

interface AttendanceData {
  month: string;
  hadir: number;
  izin: number;
  alpha: number;
  total: number;
}

interface QuizData {
  month: string;
  avgScore: number;
  totalSubmissions: number;
}

interface ExportData {
  attendanceData: AttendanceData[];
  quizData: QuizData[];
  totalStats: {
    hadir: number;
    izin: number;
    alpha: number;
    totalQuiz: number;
  };
}

// Export to PDF
export const exportToPDF = (data: ExportData) => {
  const doc = new jsPDF();

  // Header with logo
  try {
    doc.addImage(logo, "PNG", 15, 10, 30, 21);
  } catch (e) {
    console.warn("Failed to add logo:", e);
  }

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Laporan Analytics", 50, 20);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Komunitas DCN Universitas Madura", 50, 27);
  doc.text(`Dicetak: ${new Date().toLocaleDateString("id-ID")}`, 50, 33);

  let currentY = 45;

  // Total Stats
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Ringkasan Total", 15, currentY);
  currentY += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Total Hadir: ${data.totalStats.hadir}`, 15, currentY);
  doc.text(`Total Izin: ${data.totalStats.izin}`, 70, currentY);
  doc.text(`Total Alpha: ${data.totalStats.alpha}`, 120, currentY);
  currentY += 15;

  // Attendance Table
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Statistik Kehadiran per Bulan", 15, currentY);
  currentY += 5;

  autoTable(doc, {
    startY: currentY,
    head: [["Bulan", "Hadir", "Izin", "Alpha", "Total"]],
    body: data.attendanceData.map((row) => [
      row.month,
      row.hadir,
      row.izin,
      row.alpha,
      row.total,
    ]),
    theme: "grid",
    headStyles: {
      fillColor: [79, 70, 229],
      textColor: 255,
      fontStyle: "bold",
    },
    styles: { fontSize: 9 },
  });

  currentY =
    (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable
      .finalY + 15;

  // Quiz Table
  if (data.quizData.length > 0) {
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Trend Skor Quiz per Bulan", 15, currentY);
    currentY += 5;

    autoTable(doc, {
      startY: currentY,
      head: [["Bulan", "Rata-rata Skor", "Total Submissions"]],
      body: data.quizData.map((row) => [
        row.month,
        `${row.avgScore}%`,
        row.totalSubmissions,
      ]),
      theme: "grid",
      headStyles: {
        fillColor: [79, 70, 229],
        textColor: 255,
        fontStyle: "bold",
      },
      styles: { fontSize: 9 },
    });
  }

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128);
    doc.text(
      `Halaman ${i} dari ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
  }

  doc.save(`Analytics_DCN_${new Date().toISOString().split("T")[0]}.pdf`);
};

// Export to XLSX
export const exportToXLSX = (data: ExportData) => {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Kehadiran
  const attendanceSheet = XLSX.utils.json_to_sheet(
    data.attendanceData.map((row) => ({
      Bulan: row.month,
      Hadir: row.hadir,
      Izin: row.izin,
      Alpha: row.alpha,
      Total: row.total,
    }))
  );
  XLSX.utils.book_append_sheet(wb, attendanceSheet, "Kehadiran");

  // Sheet 2: Quiz
  if (data.quizData.length > 0) {
    const quizSheet = XLSX.utils.json_to_sheet(
      data.quizData.map((row) => ({
        Bulan: row.month,
        "Rata-rata Skor (%)": row.avgScore,
        "Total Submissions": row.totalSubmissions,
      }))
    );
    XLSX.utils.book_append_sheet(wb, quizSheet, "Quiz");
  }

  // Sheet 3: Ringkasan
  const summarySheet = XLSX.utils.json_to_sheet([
    { Kategori: "Total Hadir", Jumlah: data.totalStats.hadir },
    { Kategori: "Total Izin", Jumlah: data.totalStats.izin },
    { Kategori: "Total Alpha", Jumlah: data.totalStats.alpha },
    { Kategori: "Total Quiz Submissions", Jumlah: data.totalStats.totalQuiz },
  ]);
  XLSX.utils.book_append_sheet(wb, summarySheet, "Ringkasan");

  XLSX.writeFile(
    wb,
    `Analytics_DCN_${new Date().toISOString().split("T")[0]}.xlsx`
  );
};

// Export to CSV
export const exportToCSV = (data: ExportData) => {
  // Kehadiran CSV
  let csv = "STATISTIK KEHADIRAN PER BULAN\n";
  csv += "Bulan,Hadir,Izin,Alpha,Total\n";
  data.attendanceData.forEach((row) => {
    csv += `${row.month},${row.hadir},${row.izin},${row.alpha},${row.total}\n`;
  });

  csv += "\nTREND SKOR QUIZ\n";
  csv += "Bulan,Rata-rata Skor (%),Total Submissions\n";
  data.quizData.forEach((row) => {
    csv += `${row.month},${row.avgScore},${row.totalSubmissions}\n`;
  });

  csv += "\nRINGKASAN\n";
  csv += `Total Hadir,${data.totalStats.hadir}\n`;
  csv += `Total Izin,${data.totalStats.izin}\n`;
  csv += `Total Alpha,${data.totalStats.alpha}\n`;
  csv += `Total Quiz,${data.totalStats.totalQuiz}\n`;

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `Analytics_DCN_${new Date().toISOString().split("T")[0]}.csv`;
  link.click();
};
