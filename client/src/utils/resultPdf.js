import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const downloadResultPDF = (r) => {
  const doc = new jsPDF();

  const isPassed = r.hifiz_marks >= 30 && r.hizb_marks >= 30;

  /* ===== PROFESSIONAL HEADER ===== */
  doc.setFont("helvetica", "bold");

  doc.setFontSize(20);
  doc.text("OTTAPALAM MARKAZ", 105, 20, { align: "center" });

  doc.setFontSize(13);
  doc.setFont("helvetica", "normal");
  doc.text("Student Exam Result", 105, 27, { align: "center" });

  /* subtle divider line */
  doc.setDrawColor(180);
  doc.setLineWidth(0.5);
  doc.line(40, 32, 170, 32);

  /* ===== STUDENT DETAILS ===== */
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  
  const leftX = 17;
  const valueX = 50;
  let y = 45;
  
  /* Student Name */
  doc.text("Student Name :", leftX, y);
  doc.setFont("helvetica", "normal");
  doc.text(r.full_name, valueX, y);
  
  /* Register No */
  y += 10;
  doc.setFont("helvetica", "bold");
  doc.text("Register No :", leftX, y);
  doc.setFont("helvetica", "normal");
  doc.text(r.reg_number, valueX, y);
  
  /* Institution */
  y += 10;
  doc.setFont("helvetica", "bold");
  doc.text("Institution :", leftX, y);
  doc.setFont("helvetica", "normal");
  doc.text(r.institution, valueX, y);

  /* ===== MARKS TABLE ===== */
  autoTable(doc, {
    startY: y + 10,
    head: [["Subject", "Marks"]],
    body: [
      ["Hifiz", r.hifiz_marks],
      ["Hizb", r.hizb_marks],
      ["Total", r.hifiz_marks + r.hizb_marks],
    ],
    styles: {
      halign: "center",
      fontSize: 12,
    },
    headStyles: {
      fillColor: [37, 99, 235],
      textColor: 255,
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
  });

  /* ===== RESULT STATUS (CENTER ALIGNED & COLOR) ===== */
  const resultY = doc.lastAutoTable.finalY + 20;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);

  if (isPassed) {
    doc.setTextColor(22, 163, 74); // Green
    doc.text("RESULT STATUS : PASSED", 105, resultY, { align: "center" });
  } else {
    doc.setTextColor(220, 38, 38); // Red
    doc.text("RESULT STATUS : FAILED", 105, resultY, { align: "center" });
  }

  /* ===== FOOTER ===== */
  doc.setTextColor(120);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(
    "This is a system generated result sheet. No signature required.",
    105,
    285,
    { align: "center" }
  );

  /* ===== SAVE ===== */
  doc.save(`Exam_Result_${r.reg_number}.pdf`);
};