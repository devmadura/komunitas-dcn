import jsPDF from "jspdf";
import QRCode from "qrcode";
import { logo } from "./logo";
import { signature } from "./signature";

interface SertifikatData {
  nomor: string;
  nama: string;
  tipe: "pertemuan" | "quiz";
  pertemuanJudul?: string;
  pertemuanTanggal?: string;
  tanggalTerbit: string;
}

export const generateSertifikatPDF = async (data: SertifikatData) => {
  try {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const centerX = pageWidth / 2;

    // Background
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    // Outer border
    doc.setDrawColor(79, 70, 229);
    doc.setLineWidth(3);
    doc.rect(8, 8, pageWidth - 16, pageHeight - 16);

    doc.setDrawColor(199, 210, 254);
    doc.setLineWidth(1);
    doc.rect(12, 12, pageWidth - 24, pageHeight - 24);

    // Decorative corner ornaments
    const drawCorner = (x: number, y: number, flipX: number, flipY: number) => {
      doc.setDrawColor(79, 70, 229);
      doc.setLineWidth(1.5);

      const len = 20;
      doc.line(x, y, x + len * flipX, y);
      doc.line(x, y, x, y + len * flipY);

      doc.setLineWidth(0.8);
      doc.line(
        x + 3 * flipX,
        y + 3 * flipY,
        x + (len - 5) * flipX,
        y + 3 * flipY
      );
      doc.line(
        x + 3 * flipX,
        y + 3 * flipY,
        x + 3 * flipX,
        y + (len - 5) * flipY
      );
    };

    drawCorner(18, 18, 1, 1);
    drawCorner(pageWidth - 18, 18, -1, 1);
    drawCorner(18, pageHeight - 18, 1, -1);
    drawCorner(pageWidth - 18, pageHeight - 18, -1, -1);

    // Logo DCN
    const logoWidth = 45;
    const logoHeight = (logoWidth / 100) * 70;
    try {
      doc.addImage(
        logo,
        "PNG",
        centerX - logoWidth / 2,
        22,
        logoWidth,
        logoHeight
      );
    } catch (e) {
      console.warn("Failed to add logo:", e);
    }

    // Certificate number (di bawah logo)
    let currentY = 22 + logoHeight + 3;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175);
    doc.text(`No: ${data.nomor}`, centerX, currentY, { align: "center" });

    currentY += 6;

    // Organization name
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(107, 114, 128);
    doc.text("KOMUNITAS DCN UNIVERSITAS MADURA", centerX, currentY, {
      align: "center",
    });

    currentY += 14;

    // Main title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(36);
    doc.setTextColor(79, 70, 229);
    doc.text("SERTIFIKAT", centerX, currentY, { align: "center" });

    currentY += 8;

    // Subtitle
    doc.setFontSize(13);
    doc.setTextColor(75, 85, 99);
    const subtitle =
      data.tipe === "pertemuan" ? "PARTISIPASI EVENT" : "PENYELESAIAN QUIZ";
    doc.text(subtitle, centerX, currentY, { align: "center" });

    currentY += 10;

    // Decorative line
    doc.setDrawColor(79, 70, 229);
    doc.setLineWidth(0.5);
    doc.line(centerX - 50, currentY, centerX + 50, currentY);

    currentY += 10;

    // "Diberikan kepada"
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(107, 114, 128);
    doc.text("Diberikan kepada:", centerX, currentY, { align: "center" });

    currentY += 12;

    // Recipient name
    doc.setFont("helvetica", "bold");
    doc.setFontSize(30);
    doc.setTextColor(17, 24, 39);
    doc.text(data.nama, centerX, currentY, { align: "center" });

    currentY += 6;

    // Underline for name
    const nameWidth = doc.getTextWidth(data.nama);
    doc.setDrawColor(79, 70, 229);
    doc.setLineWidth(0.8);
    doc.line(
      centerX - nameWidth / 2 - 10,
      currentY,
      centerX + nameWidth / 2 + 10,
      currentY
    );

    currentY += 12;

    // Description
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(75, 85, 99);

    if (data.tipe === "pertemuan") {
      doc.text("Atas partisipasi aktif dalam kegiatan:", centerX, currentY, {
        align: "center",
      });
      currentY += 8;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(79, 70, 229);
      const judulText = data.pertemuanJudul ? `"${data.pertemuanJudul}"` : "";
      doc.text(judulText, centerX, currentY, { align: "center" });

      if (data.pertemuanTanggal) {
        currentY += 7;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(107, 114, 128);
        const tanggalFormatted = new Date(
          data.pertemuanTanggal
        ).toLocaleDateString("id-ID", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        doc.text(
          `yang diselenggarakan pada ${tanggalFormatted}`,
          centerX,
          currentY,
          { align: "center" }
        );
      }
    } else {
      doc.text(
        "Atas penyelesaian minimal 5 quiz pada program",
        centerX,
        currentY,
        { align: "center" }
      );
      currentY += 8;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(79, 70, 229);
      doc.text("Dicoding Community Network UNIRA", centerX, currentY, {
        align: "center",
      });
    }

    // Footer section - signature area
    const footerY = pageHeight - 55;

    // Date and location
    const tanggalTerbit = new Date(data.tanggalTerbit).toLocaleDateString(
      "id-ID",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(75, 85, 99);
    doc.text(`Pamekasan, ${tanggalTerbit}`, centerX, footerY, {
      align: "center",
    });

    // Signature image
    try {
      const sigWidth = 35;
      const sigHeight = 18;
      doc.addImage(
        signature,
        "PNG",
        centerX - sigWidth / 2,
        footerY + 2,
        sigWidth,
        sigHeight
      );
    } catch (e) {
      console.warn("Failed to add signature:", e);
    }

    // Signature line
    doc.setDrawColor(75, 85, 99);
    doc.setLineWidth(0.3);
    doc.line(centerX - 35, footerY + 22, centerX + 35, footerY + 22);

    // Name and title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(17, 24, 39);
    doc.text("Moh. Abroril Huda", centerX, footerY + 28, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(107, 114, 128);
    doc.text("Community Builder", centerX, footerY + 33, { align: "center" });

    // QR Code (bottom right) - posisi di dalam border, tidak mengganggu hiasan pojok
    const qrSize = 22;
    const qrX = pageWidth - 45; // lebih ke dalam dari pojok
    const qrY = pageHeight - 50; // lebih ke atas dari pojok

    try {
      const verifyUrl = `https://dcnunira.dev/sertifikat/verify/${data.nomor}`;
      const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
        width: 200,
        margin: 1,
        color: {
          dark: "#4F46E5",
          light: "#FFFFFF",
        },
      });

      doc.addImage(qrDataUrl, "PNG", qrX, qrY, qrSize, qrSize);

      // Teks di bawah QR code
      doc.setFontSize(6);
      doc.setTextColor(156, 163, 175);
      doc.text("Scan untuk verifikasi", qrX + qrSize / 2, qrY + qrSize + 4, {
        align: "center",
      });
    } catch (e) {
      console.warn("Failed to generate QR code:", e);
    }

    // Save
    const safeNama = data.nama.replace(/[^a-zA-Z0-9]/g, "_");
    const safeJudul =
      data.pertemuanJudul?.replace(/[^a-zA-Z0-9]/g, "_") || "Quiz";
    const fileName =
      data.tipe === "pertemuan"
        ? `Sertifikat_${safeNama}_${safeJudul}.pdf`
        : `Sertifikat_Quiz_${safeNama}.pdf`;

    doc.save(fileName);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
};
