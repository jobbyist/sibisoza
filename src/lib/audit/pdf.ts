import type { Report } from "./report";

type ReportForPdf = Report & { summary?: string };

// Sibiso brand colors (approximate — matches the on-screen gradient endpoints).
const BRAND_START: [number, number, number] = [124, 58, 237]; // violet-600
const BRAND_END: [number, number, number] = [236, 72, 153]; // pink-500
const INK: [number, number, number] = [15, 15, 15];
const MUTED: [number, number, number] = [110, 110, 120];
const LINE: [number, number, number] = [230, 230, 235];

function mix(a: [number, number, number], b: [number, number, number], t: number): [number, number, number] {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

export async function downloadReportPdf(
  report: ReportForPdf,
  meta: { firstName: string; businessName: string },
) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 48;
  let y = 0;

  // ---------- Header band with gradient ----------
  const bandH = 140;
  const steps = 120;
  for (let i = 0; i < steps; i++) {
    const [r, g, b] = mix(BRAND_START, BRAND_END, i / (steps - 1));
    doc.setFillColor(r, g, b);
    doc.rect((pageW / steps) * i, 0, pageW / steps + 1, bandH, "F");
  }

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("SIBISO MARKETING", margin, 44);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Growth Strategy Report", margin, 60);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  const title = `${meta.firstName || "Your"} — ${meta.businessName || "Growth read-out"}`;
  doc.text(doc.splitTextToSize(title, pageW - margin * 2), margin, 100);

  y = bandH + 36;

  // ---------- Score block ----------
  doc.setTextColor(...MUTED);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("GROWTH SCORE", margin, y);
  y += 6;

  doc.setTextColor(...BRAND_START);
  doc.setFontSize(52);
  doc.setFont("helvetica", "bold");
  doc.text(`${report.score}`, margin, y + 44);
  doc.setTextColor(...MUTED);
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("/ 100", margin + 82, y + 44);

  if (report.industryLabel) {
    doc.setTextColor(...INK);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(report.industryLabel.toUpperCase(), pageW - margin, y + 20, { align: "right" });
  }

  y += 70;

  // ---------- Summary ----------
  if (report.summary) {
    doc.setTextColor(...INK);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const lines = doc.splitTextToSize(report.summary, pageW - margin * 2);
    doc.text(lines, margin, y);
    y += lines.length * 15 + 14;
  }

  // ---------- Pillars ----------
  const ensureSpace = (h: number) => {
    if (y + h > pageH - 60) {
      doc.addPage();
      y = margin;
    }
  };

  ensureSpace(30);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...INK);
  doc.text("Pillar scores", margin, y);
  y += 16;

  for (const p of report.pillars) {
    ensureSpace(56);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...INK);
    doc.text(p.label, margin, y);
    doc.text(`${p.value}`, pageW - margin, y, { align: "right" });

    // bar bg
    const barY = y + 6;
    doc.setFillColor(...LINE);
    doc.roundedRect(margin, barY, pageW - margin * 2, 6, 3, 3, "F");
    // bar fill (single brand color — PDF gradient is expensive)
    const barW = ((pageW - margin * 2) * p.value) / 100;
    doc.setFillColor(...BRAND_START);
    doc.roundedRect(margin, barY, barW, 6, 3, 3, "F");

    y = barY + 16;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...MUTED);
    const note = doc.splitTextToSize(p.note, pageW - margin * 2);
    doc.text(note, margin, y);
    y += note.length * 13 + 12;
  }

  y += 6;

  // ---------- Recommendations ----------
  ensureSpace(30);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...INK);
  doc.text("Personalised recommendations", margin, y);
  y += 16;

  report.recommendations.forEach((r, i) => {
    ensureSpace(70);
    // pillar tag
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...BRAND_START);
    doc.text(`${String(i + 1).padStart(2, "0")}  ·  ${r.pillar.toUpperCase()}`, margin, y);
    y += 12;

    doc.setFontSize(12);
    doc.setTextColor(...INK);
    const titleLines = doc.splitTextToSize(r.title, pageW - margin * 2);
    doc.text(titleLines, margin, y);
    y += titleLines.length * 14 + 4;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...MUTED);
    const detailLines = doc.splitTextToSize(r.detail, pageW - margin * 2);
    doc.text(detailLines, margin, y);
    y += detailLines.length * 13 + 14;

    // divider
    doc.setDrawColor(...LINE);
    doc.line(margin, y - 6, pageW - margin, y - 6);
  });

  // ---------- Watermark + footer on every page ----------
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    // Diagonal branded watermark (light, non-intrusive)
    const gState = (doc as unknown as {
      GState?: new (o: { opacity: number }) => unknown;
      setGState?: (g: unknown) => void;
    });
    if (gState.GState && gState.setGState) {
      gState.setGState(new gState.GState({ opacity: 0.06 }));
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(72);
    doc.setTextColor(...BRAND_START);
    doc.text("SIBISO MARKETING", pageW / 2, pageH / 2, {
      align: "center",
      angle: 30,
    });
    if (gState.GState && gState.setGState) {
      gState.setGState(new gState.GState({ opacity: 1 }));
    }

    // Footer
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...MUTED);
    doc.text("Sibiso Marketing · Turn Your Visibility Into Revenue", margin, pageH - 24);
    doc.text(`Page ${i} of ${pageCount}`, pageW - margin, pageH - 24, { align: "right" });
  }

  const safeBiz = (meta.businessName || "sibiso").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  doc.save(`growth-report-${safeBiz || "sibiso"}.pdf`);
}
