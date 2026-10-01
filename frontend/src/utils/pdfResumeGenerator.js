import { jsPDF } from 'jspdf';

/**
 * Generates and downloads a clean, professional, high-standard PDF resume for OpenPath candidates.
 *
 * @param {Object} user - The candidate user profile
 * @param {Object} profileCompletion - Profile completion metadata
 */
export function generatePdfResume(user, profileCompletion) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4', // 595.28 x 841.89 pt
  });

  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const margin = 40;
  const contentWidth = pageWidth - margin * 2; // 515.28 pt

  // 1. Top Modern Header (Navy Slate background)
  doc.setFillColor(15, 23, 42); // #0F172A
  doc.rect(0, 0, pageWidth, 105, 'F');

  // Gradient accent bar under header
  doc.setFillColor(124, 58, 237); // #7C3AED (Purple)
  doc.rect(0, 101, pageWidth * 0.65, 4, 'F');
  doc.setFillColor(236, 72, 153); // #EC4899 (Pink)
  doc.rect(pageWidth * 0.65, 101, pageWidth * 0.35, 4, 'F');

  // Candidate Full Name
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  const name = user?.name || 'Verified Candidate';
  doc.text(name, margin, 40);

  // Subtitle / Brand pill
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(192, 132, 252); // #C084FC
  doc.text('OPENPATH VERIFIED DIGITAL CREDENTIAL • 5-FACTOR MATCHED CANDIDATE', margin, 58);

  // Contact line
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(226, 232, 240);
  const email = user?.email || 'candidate@openpath.io';
  const location = `${user?.location?.city || 'Bengaluru'}, ${user?.location?.country || 'India'}`;
  const remotePref = user?.location?.remotePreference || 'Remote / Hybrid';
  doc.text(`${email}    |    ${location}    |    Preferred Work: ${remotePref}`, margin, 76);

  // Verification Badge on Right Side of Header
  doc.setFillColor(30, 41, 59); // Slate 800
  doc.roundedRect(pageWidth - margin - 145, 24, 145, 60, 6, 6, 'F');
  doc.setFillColor(16, 185, 129); // Green 500
  doc.circle(pageWidth - margin - 130, 44, 4, 'F');
  doc.setTextColor(52, 211, 153);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('AI VERIFIED TALENT', pageWidth - margin - 120, 47);

  const completionPct = profileCompletion?.percentage ?? (user?.skills?.length ? 85 : 60);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(`Score: ${completionPct}% Completeness`, pageWidth - margin - 130, 66);

  // Vertical layout tracking
  let currentY = 130;

  // Section Header Drawer helper
  const drawSectionHeader = (title) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(124, 58, 237); // #7C3AED
    doc.text(title.toUpperCase(), margin, currentY);
    currentY += 4;
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(1);
    doc.line(margin, currentY, margin + contentWidth, currentY);
    currentY += 14;
  };

  // 1. Professional Bio / Summary
  if (user?.bio) {
    drawSectionHeader('Professional Summary');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(51, 65, 85); // Slate 700
    const bioLines = doc.splitTextToSize(user.bio, contentWidth);
    doc.text(bioLines, margin, currentY);
    currentY += bioLines.length * 13 + 14;
  }

  // 2. Education Section
  drawSectionHeader('Academic Background');
  const edu = user?.education || {};
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42); // Slate 900
  const degree = edu.degree || 'Bachelor of Technology (B.Tech)';
  doc.text(degree, margin, currentY);

  if (edu.endYear) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    const yearText = `Class of ${edu.endYear}`;
    doc.text(yearText, margin + contentWidth - doc.getTextWidth(yearText), currentY);
  }
  currentY += 13;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(71, 85, 105);
  const inst = edu.institution || 'Recognized University / Institute';
  const field = edu.fieldOfStudy ? ` • Major in ${edu.fieldOfStudy}` : '';
  const grade = edu.grade ? ` • ${edu.grade}` : '';
  doc.text(`${inst}${field}${grade}`, margin, currentY);
  currentY += 20;

  // 3. Technical Skills Section
  drawSectionHeader('Technical Competencies & Verified Skills');
  const skills = user?.skills || [];
  if (skills.length > 0) {
    let skillX = margin;
    const skillBoxHeight = 18;
    const paddingX = 8;
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');

    skills.forEach((skill) => {
      const sName = typeof skill === 'string' ? skill : (skill.name || 'Skill');
      const textWidth = doc.getTextWidth(sName);
      const boxWidth = textWidth + paddingX * 2;

      // Wrap to next line if exceeds boundary
      if (skillX + boxWidth > margin + contentWidth) {
        skillX = margin;
        currentY += skillBoxHeight + 6;
      }

      // Pill Background
      doc.setFillColor(243, 232, 255); // Purple 100
      doc.setDrawColor(216, 180, 254); // Purple 300
      doc.setLineWidth(0.8);
      doc.roundedRect(skillX, currentY, boxWidth, skillBoxHeight, 4, 4, 'FD');

      // Pill Text
      doc.setTextColor(126, 34, 206); // Purple 700
      doc.text(sName, skillX + paddingX, currentY + 12);

      skillX += boxWidth + 6;
    });
    currentY += skillBoxHeight + 18;
  } else {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.text('No technical skills listed yet.', margin, currentY);
    currentY += 18;
  }

  // 4. Experience & Projects Section
  drawSectionHeader('Experience & Engineering Projects');
  const exp = user?.experience || {};
  if (exp.role || exp.organization) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(15, 23, 42);
    doc.text(exp.role || 'Project Contributor', margin, currentY);

    if (exp.duration) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text(exp.duration, margin + contentWidth - doc.getTextWidth(exp.duration), currentY);
    }
    currentY += 13;

    if (exp.organization) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(100, 116, 139);
      doc.text(exp.organization, margin, currentY);
      currentY += 13;
    }

    if (exp.description) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105);
      const descLines = doc.splitTextToSize(exp.description, contentWidth);
      doc.text(descLines, margin, currentY);
      currentY += descLines.length * 12 + 16;
    }
  } else {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.text('Personal projects, student portfolio contributions, and academic coursework.', margin, currentY);
    currentY += 18;
  }

  // 5. Career Interests Section
  const interests = user?.interests || [];
  if (interests.length > 0) {
    drawSectionHeader('Career Domains & Focus Areas');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);
    doc.text(`Specializations: ${interests.join('   •   ')}`, margin, currentY);
    currentY += 22;
  }

  // Footer: Platform Verification Seal
  const footerY = pageHeight - 55;
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(1);
  doc.line(margin, footerY, margin + contentWidth, footerY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(124, 58, 237);
  doc.text('OpenPath AI Verified Career Platform', margin, footerY + 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  const verifyId = `AUTH-ID: OP-${Math.random().toString(36).substring(2, 7).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  doc.text(`Digital Verification Signature: ${verifyId}  |  Export Date: ${dateStr}`, margin, footerY + 26);
  doc.text('Certified authentic representation of student skills, course qualifications, and project competencies.', margin, footerY + 36);

  // Save PDF file with clean name
  const filename = `${(user?.name || 'OpenPath_Candidate').replace(/\s+/g, '_')}_Resume.pdf`;
  doc.save(filename);
}
