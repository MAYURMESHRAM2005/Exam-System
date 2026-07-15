const PDFDocument = require("pdfkit");
const ExcelJS = require("exceljs");

/* =========================================================
   GENERIC TABLE EXPORTERS
   Every report (results, violations, attendance, AI risk) is fundamentally
   "a title + a list of columns + a list of rows" — these three functions
   are the only place that knows how to turn that shape into an actual
   CSV/XLSX/PDF file, so reportController.js just describes the data once
   per report type and picks whichever renderer matches `?format=`.
   Each streams straight to the Express response — no temp files on disk.
========================================================= */

function csvEscape(value) {
  const str = value === null || value === undefined ? "" : String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function sendCsv(res, filename, columns, rows) {
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

  const header = columns.map((c) => csvEscape(c.label)).join(",");
  const lines = rows.map((row) => columns.map((c) => csvEscape(row[c.key])).join(","));
  // Leading UTF-8 BOM so Excel (which the "Excel" checkbox in most exam
  // tools implies people will actually open this in) doesn't mangle
  // non-ASCII names/characters.
  res.send("\uFEFF" + [header, ...lines].join("\n"));
}

async function sendXlsx(res, filename, { title, columns, rows }) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "ExamSecure AI";
  workbook.created = new Date();

  const sheet = workbook.addWorksheet(title.slice(0, 31) || "Report"); // Excel's 31-char sheet name limit

  sheet.columns = columns.map((c) => ({ header: c.label, key: c.key, width: c.width || 18 }));
  sheet.getRow(1).font = { bold: true };
  sheet.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFE0E7FF" },
  };
  rows.forEach((row) => sheet.addRow(row));
  sheet.autoFilter = { from: "A1", to: `${String.fromCharCode(64 + columns.length)}1` };

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

  await workbook.xlsx.write(res);
  res.end();
}

// A simple, readable table layout — title/subtitle, generated-at
// timestamp, then a header row and data rows with basic pagination
// across pages when the table runs long. Deliberately plain (no exam
// branding/logo) since this is an internal audit artifact, not a
// certificate — legibility matters more than styling here.
function sendPdfTable(res, filename, { title, subtitle, columns, rows, meta }) {
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

  const doc = new PDFDocument({ margin: 40, size: "A4", layout: rows.length && columns.length > 6 ? "landscape" : "portrait" });
  doc.pipe(res);

  doc.fontSize(18).font("Helvetica-Bold").text(title);
  if (subtitle) {
    doc.moveDown(0.2).fontSize(11).font("Helvetica").fillColor("#475569").text(subtitle);
  }
  doc.moveDown(0.2).fontSize(9).fillColor("#94a3b8").text(`Generated ${new Date().toLocaleString()}`);
  if (meta) {
    doc.moveDown(0.3).fontSize(9).fillColor("#475569").text(meta);
  }
  doc.fillColor("#000000");
  doc.moveDown(0.8);

  const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
  const colWidth = pageWidth / columns.length;
  const rowHeight = 20;

  const drawHeader = () => {
    const y = doc.y;
    doc.font("Helvetica-Bold").fontSize(9).fillColor("#1e293b");
    columns.forEach((c, i) => {
      doc.text(c.label, doc.page.margins.left + i * colWidth, y, { width: colWidth - 4, ellipsis: true });
    });
    doc.moveDown(0.6);
    doc
      .moveTo(doc.page.margins.left, doc.y)
      .lineTo(doc.page.width - doc.page.margins.right, doc.y)
      .strokeColor("#cbd5e1")
      .stroke();
    doc.moveDown(0.3);
  };

  drawHeader();
  doc.font("Helvetica").fontSize(8.5).fillColor("#334155");

  if (rows.length === 0) {
    doc.moveDown(1).fontSize(10).fillColor("#64748b").text("No records match the current filters.");
  }

  rows.forEach((row) => {
    if (doc.y + rowHeight > doc.page.height - doc.page.margins.bottom) {
      doc.addPage();
      drawHeader();
      doc.font("Helvetica").fontSize(8.5).fillColor("#334155");
    }
    const y = doc.y;
    columns.forEach((c, i) => {
      const value = row[c.key];
      doc.text(value === null || value === undefined ? "" : String(value), doc.page.margins.left + i * colWidth, y, {
        width: colWidth - 4,
        ellipsis: true,
      });
    });
    doc.moveDown(0.85);
  });

  doc.end();
}

module.exports = { sendCsv, sendXlsx, sendPdfTable };
