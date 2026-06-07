import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { logger } from "@/utils/logger";

function buildFilename(projectName: string): string {
  const slug = projectName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `devcheck-${slug || "report"}-report.pdf`;
}

export async function exportReportPdf(element: HTMLElement, projectName: string): Promise<void> {
  try {
    const canvas = await html2canvas(element, {
      backgroundColor: "#ffffff",
      scale: 2,
      useCORS: true,
      logging: false,
    });

    const imageData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 32;

    const renderableWidth = pageWidth - margin * 2;
    const imgHeight = (canvas.height / canvas.width) * renderableWidth;

    let heightLeft = imgHeight;
    let position = margin;

    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, 0, pageWidth, pageHeight, "F");
    pdf.addImage(imageData, "PNG", margin, position, renderableWidth, imgHeight);
    heightLeft -= pageHeight - margin * 2;

    while (heightLeft > 0) {
      pdf.addPage();
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 0, pageWidth, pageHeight, "F");
      position = margin - (imgHeight - heightLeft);
      pdf.addImage(imageData, "PNG", margin, position, renderableWidth, imgHeight);
      heightLeft -= pageHeight - margin * 2;
    }

    pdf.save(buildFilename(projectName));
  } catch (error) {
    logger.error("PDF export failed", error);
    throw error;
  }
}
