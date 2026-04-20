import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const downloadResultPDF = (r) => {
  const doc = new jsPDF();

  const isBlank = (value) => value === null || value === undefined || value === "";
  const hifizBlank = isBlank(r.hifiz_marks);
  const hizbBlank = isBlank(r.hizb_marks);
  const hifizValid = !hifizBlank && Number(r.hifiz_marks) >= 30;
  const hizbValid = !hizbBlank && Number(r.hizb_marks) >= 30;
  
  const validHifiz = r.hifiz_marks !== null && r.hifiz_marks !== undefined && r.hifiz_marks !== "" && r.hifiz_marks !== 1;
  const validHizb = r.hizb_marks !== null && r.hizb_marks !== undefined && r.hizb_marks !== "" && r.hizb_marks !== 1;

  const memorySubjects = [
    { name: "Hifiz", val: r.hifiz_marks, valid: validHifiz, pass: hifizValid || r.hifiz_marks === 1 },
    { name: "Hizb", val: r.hizb_marks, valid: validHizb, pass: hizbValid || r.hizb_marks === 1 }
  ];

  const academicSubjects = [
    { name: "Competition", val: r.competitions, pass: (r.competitions ?? 0) >= 0 },
    { name: "Presentation Skill", val: r.presentation_skill, pass: (r.presentation_skill ?? 0) >= 0 },
    { name: "Writing Skill", val: r.writing_skill, pass: (r.writing_skill ?? 0) >= 0 },
    { name: "Reading Skill", val: r.reading_skill, pass: (r.reading_skill ?? 0) >= 0 },
    { name: "Attendance", val: r.attendance, pass: (r.attendance ?? 0) >= 13 }
  ];

  const allApplicableSubjects = [
    ...memorySubjects.filter(s => s.valid),
    ...academicSubjects.filter(s => s.val !== null && s.val !== undefined && s.val !== "")
  ];

  const isPassed = allApplicableSubjects.length > 0 && allApplicableSubjects.every(s => s.pass);
  const subjectsCount = allApplicableSubjects.length;

  let totalObtained = 0;
  let totalMax = 0;

  if (validHifiz) {
    totalObtained += r.hifiz_marks === 0 ? 0 : Number(r.hifiz_marks);
    totalMax += 100;
  }
  
  if (validHizb) {
    totalObtained += r.hizb_marks === 0 ? 0 : Number(r.hizb_marks);
    totalMax += 100;
  }

  // Additional Fields
  const additionalFields = [
    { name: "Competition", val: r.competitions, max: 20 },
    { name: "Presentation Skill", val: r.presentation_skill, max: 20 },
    { name: "Writing Skill", val: r.writing_skill, max: 20 },
    { name: "Reading Skill", val: r.reading_skill, max: 20 },
    { name: "Attendance", val: r.attendance, max: 20 },
  ];

  additionalFields.forEach(f => {
    if (f.val !== null && f.val !== undefined && f.val !== "") {
      totalObtained += Number(f.val);
      totalMax += f.max;
    }
  });

  const overallPercentage = totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(2) : "0.00";

  /* ===== PROFESSIONAL HEADER ===== */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text("OTTAPALAM MARKAZ", 105, 20, { align: "center" });

  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105); // slate-500
  doc.text("Academic Examination Result", 105, 28, { align: "center" });

  // Line
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.setLineWidth(0.5);
  doc.line(15, 35, 195, 35);

  /* ===== STUDENT DETAILS ===== */
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(15, 42, 180, 28, 3, 3, "F");

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);

  doc.text("Name:", 20, 52);
  doc.setFont("helvetica", "normal");
  doc.text(r.full_name || "N/A", 35, 52);

  doc.setFont("helvetica", "bold");
  doc.text("Reg No:", 110, 52);
  doc.setFont("helvetica", "normal");
  doc.text(r.reg_number || "N/A", 128, 52);

  doc.setFont("helvetica", "bold");
  doc.text("Institution:", 20, 62);
  doc.setFont("helvetica", "normal");
  doc.text(r.institution || "N/A", 42, 62);

  const formattedDate = r.exam_date ? new Date(r.exam_date).toLocaleDateString("en-GB").replace(/\//g, "-") : "N/A";
  doc.setFont("helvetica", "bold");
  doc.text("Date:", 110, 62);
  doc.setFont("helvetica", "normal");
  doc.text(formattedDate, 122, 62);

  /* ===== OVERALL PERFORMANCE ===== */
  let y = 80;

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("OVERALL PERFORMANCE", 15, y);

  y += 6;
  // Outer performance box
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(15, y, 180, 32, 3, 3, "FD");

  // Status badge
  if (isPassed) {
    doc.setFillColor(37, 99, 235); // Blue background from image
    doc.roundedRect(20, y + 6, 22, 7, 2, 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text("Passed", 23, y + 11);
  } else {
    doc.setFillColor(239, 68, 68); // Red background
    doc.roundedRect(20, y + 6, 22, 7, 2, 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text("Failed", 25, y + 11);
  }

  // Stats
  doc.setTextColor(37, 99, 235); // Blue percentage text
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text(`${overallPercentage}%`, 20, y + 26);

  // Separator line
  doc.setDrawColor(226, 232, 240);
  doc.line(70, y + 6, 70, y + 26);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text("Total Marks", 78, y + 14);

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(`${totalObtained} / ${totalMax}`, 78, y + 23);

  // Separator line 2
  doc.setDrawColor(226, 232, 240);
  doc.line(130, y + 6, 130, y + 26);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text("Subjects", 138, y + 14);

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(`${subjectsCount}`, 138, y + 23);

  y += 45;

  /* ===== SUBJECT-WISE RESULTS ===== */
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("SUBJECT-WISE RESULTS", 15, y);

  const tableRows = [];

  const createSubjectRow = (name, mark) => {
      if (mark === null || mark === undefined || mark === "" || mark === 1) return;
      const isAbsent = mark === 0;
      const obtained = isAbsent ? 0 : Number(mark);
      const isAcademic = !["Hifiz", "Hizb"].includes(name);
      const pass = name === "Attendance" ? obtained >= 13 : (isAcademic ? obtained >= 0 : obtained >= 30);
      const pct = isAbsent ? "0.00" : `${((obtained / max) * 100).toFixed(2)}`;
      
      tableRows.push([
          name,
          100, // Max Marks
          isAbsent ? "A" : obtained, // Obtained
          `${pct}%`, // Percentage
          pass ? "Pass" : "Fail" // Status
      ]);
  };

  createSubjectRow("Hifiz", r.hifiz_marks);
  createSubjectRow("Hizb", r.hizb_marks);

  // Helper for skill-based rows
  const addSkillRow = (name, mark, max) => {
    if (mark === null || mark === undefined || mark === "") return;
    const obtained = Number(mark);
    const pct = `${((obtained / max) * 100).toFixed(2)}`;
    tableRows.push([
        name,
        max,
        obtained,
        `${pct}%`,
        obtained >= (name === "Attendance" ? 13 : 0) ? "Pass" : "Fail"
    ]);
  };

  addSkillRow("Competition", r.competitions, 20);
  addSkillRow("Presentation Skill", r.presentation_skill, 20);
  addSkillRow("Writing Skill", r.writing_skill, 20);
  addSkillRow("Reading Skill", r.reading_skill, 20);
  addSkillRow("Attendance", r.attendance, 20);

  if (tableRows.length > 0) {
    tableRows.push([
        "OVERALL",
        totalMax,
        totalObtained,
        `${overallPercentage}%`,
        isPassed ? "PASSED" : "FAILED"
    ]);
  }

  autoTable(doc, {
    startY: y + 6,
    head: [["Subject", "Max Marks", "Obtained", "Percentage", "Status"]],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: [248, 250, 252],
      textColor: [15, 23, 42],
      fontStyle: "bold",
      lineColor: [226, 232, 240],
      lineWidth: 0.1,
    },
    bodyStyles: {
      textColor: [51, 65, 85],
      lineColor: [226, 232, 240],
      lineWidth: 0.1,
      fontSize: 10,
      cellPadding: 3,
    },
    columnStyles: {
      0: { fontStyle: "bold", textColor: [15, 23, 42] },
      1: { halign: "center" },
      2: { halign: "center", fontStyle: "bold" },
      3: { halign: "center", fontStyle: "bold" }, 
      4: { halign: "center", fontStyle: "bold" },
    },
    didParseCell: function(data) {
      if (data.section === 'body') {
          const isLastRow = data.row.index === tableRows.length - 1;
          
          if (isLastRow) {
              data.cell.styles.fillColor = [248, 250, 252];
              data.cell.styles.fontStyle = 'bold';
              data.cell.styles.textColor = [15, 23, 42];
              
              if (data.column.index === 4) {
                  if (data.cell.raw === "PASSED") {
                      data.cell.styles.textColor = [255, 255, 255]; // White Text
                      data.cell.styles.fillColor = [37, 99, 235]; // Solid Blue Box
                  } else {
                      data.cell.styles.textColor = [255, 255, 255]; // White Text
                      data.cell.styles.fillColor = [239, 68, 68]; // Solid Red Box
                  }
              }
              if (data.column.index === 3) {
                   data.cell.styles.textColor = [37, 99, 235]; // Blue
              }
          } else {
              if (data.column.index === 3) { // Percentage
                  const val = parseFloat(data.cell.raw);
                  if (val === 0) {
                      data.cell.styles.textColor = [239, 68, 68];
                  } else {
                      data.cell.styles.textColor = [22, 163, 74];
                  }
              }
              if (data.column.index === 4) { // Status
                  if (data.cell.raw === "Pass") {
                      data.cell.styles.textColor = [255, 255, 255];
                      data.cell.styles.fillColor = [37, 99, 235];
                  } else {
                      data.cell.styles.textColor = [255, 255, 255];
                      data.cell.styles.fillColor = [239, 68, 68];
                  }
              }
          }
      }
    }
  });

  /* ===== FOOTER ===== */
  const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 20 : y + 60;
  
  doc.setTextColor(148, 163, 184); // slate-400
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(
    "This is a system generated result document. No signature is required.",
    105,
    finalY,
    { align: "center" }
  );

  /* ===== SAVE ===== */
  doc.save(`Exam_Result_${r.reg_number}.pdf`);
};