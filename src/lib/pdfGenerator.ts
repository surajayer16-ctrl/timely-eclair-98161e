import { jsPDF } from 'jspdf';

export interface EnrollmentData {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  course: string;
  batch?: string;
  experience?: string;
  purpose?: string;
  createdAt?: string;
  seatNumber?: string;
}

/**
 * Generates an Official Seat Booking & Enrollment Confirmation PDF Receipt
 */
export function generateEnrollmentPDF(data: EnrollmentData) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Background Header Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 40, 'F');

  // Decorative Accent Bar
  doc.setFillColor(245, 158, 11); // amber-500
  doc.rect(0, 38, pageWidth, 2, 'F');

  // Header Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('SURENDRA AIR (TELECOM & OPTICAL FIBER)', 14, 16);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('National Institute of Technical & Vocational Training (NITVT)', 14, 23);
  doc.text('Affiliated with CTEVT | Mahalaxmi-2, Lalitpur, Nepal | Tel: 01-5203522', 14, 29);

  // Status Badge
  doc.setFillColor(16, 185, 129); // emerald-500
  doc.roundedRect(pageWidth - 55, 12, 42, 16, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('SEAT BOOKED', pageWidth - 50, 19);
  doc.text('CONFIRMED', pageWidth - 48, 24);

  // Document Title
  doc.setTextColor(30, 41, 59); // slate-800
  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.text('OFFICIAL ENROLLMENT & SEAT BOOKING RECEIPT', 14, 50);

  // Divider line
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.setLineWidth(0.5);
  doc.line(14, 54, pageWidth - 14, 54);

  // Seat & Token Info Box
  doc.setFillColor(254, 243, 199); // amber-100
  doc.setDrawColor(245, 158, 11); // amber-500
  doc.roundedRect(14, 58, pageWidth - 28, 22, 3, 3, 'FD');

  doc.setTextColor(180, 83, 9); // amber-700
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`CONFIRMED SEAT NO: ${data.seatNumber || 'SEAT-29'}`, 20, 67);
  doc.text(`REGISTRATION TOKEN: ${data.id || 'NITVT-842910'}`, pageWidth / 2 + 10, 67);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Booking Date: ${data.createdAt || new Date().toLocaleString()}`, 20, 74);
  doc.text('Status: Active & Verified', pageWidth / 2 + 10, 74);

  // Student & Course Details Section
  let y = 90;

  const drawRow = (label: string, value: string, isAlternate: boolean = false) => {
    if (isAlternate) {
      doc.setFillColor(248, 250, 252);
      doc.rect(14, y - 5, pageWidth - 28, 9, 'F');
    }
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(label, 18, y);

    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'normal');
    doc.text(value, 70, y);

    y += 10;
  };

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('STUDENT & COURSE INFORMATION', 14, y);
  y += 6;

  drawRow('Full Name:', data.fullName, true);
  drawRow('Contact Phone:', data.phone, false);
  drawRow('Email Address:', data.email || 'N/A', true);
  drawRow('Selected Course:', data.course, false);
  drawRow('Preferred Batch:', data.batch || 'Morning Batch (7:00 - 9:00 AM)', true);
  drawRow('Prior Experience:', data.experience || 'Beginner / New Student', false);
  drawRow('Primary Objective:', data.purpose || 'Skill Test & CTEVT Certification', true);

  y += 5;

  // Important Instructions Section
  doc.setFillColor(241, 245, 249); // slate-100
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, y, pageWidth - 28, 45, 3, 3, 'FD');

  y += 8;
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('IMPORTANT INSTRUCTIONS FOR APPLICANT:', 18, y);

  y += 7;
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);

  const instructions = [
    '1. Please present this printed PDF receipt or digital copy at the institute admission desk.',
    '2. Required documents for admission: 2 PP size photos, citizenship/ID copy, SEE/SLC marksheet.',
    '3. Seat reservation is guaranteed for 3 working days from the date of booking.',
    '4. Practical tools, PPE safety gear, optical fiber splicing kits, and manuals will be provided in lab.',
    '5. Venue: Surendra Air Telecom Training Lab, Mahalaxmi-2, Imadol Road, Lalitpur (Ph: 01-5203522).'
  ];

  instructions.forEach((inst) => {
    doc.text(inst, 18, y);
    y += 6;
  });

  // Footer Signatures
  const footerY = 250;
  doc.setDrawColor(203, 213, 225);
  doc.line(20, footerY, 70, footerY);
  doc.line(pageWidth - 70, footerY, pageWidth - 20, footerY);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Applicant Signature', 30, footerY + 5);
  doc.text('Authorized Seal & Signature', pageWidth - 65, footerY + 5);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(148, 163, 184);
  doc.text('Surendra Air Official Digital Admissions System | Computer Generated Valid Receipt', pageWidth / 2, 280, { align: 'center' });

  // Save the PDF
  const filename = `Surendra_Air_Enrollment_${data.id || 'Receipt'}.pdf`;
  doc.save(filename);
}

/**
 * Exports the complete Enrollments Database as a structured PDF Document
 */
export function exportAllEnrollmentsPDF(enrollments: EnrollmentData[], stats?: { totalCapacity: number; booked: number; remaining: number }) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Header Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setFillColor(245, 158, 11);
  doc.rect(0, 26, pageWidth, 2, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('SURENDRA AIR - ONLINE SEAT BOOKING & ENROLLMENTS DATABASE', 14, 12);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Official Register Report | Generated Date: ${new Date().toLocaleString('en-US')}`, 14, 19);

  // Statistics Bar
  doc.setFillColor(241, 245, 249);
  doc.rect(14, 32, pageWidth - 28, 12, 'F');

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  const totalBooked = stats?.booked || enrollments.length;
  const remaining = stats?.remaining !== undefined ? stats.remaining : Math.max(0, 45 - totalBooked);
  doc.text(`Total Records: ${enrollments.length}  |  Total Seats Booked: ${totalBooked}  |  Available Seats: ${remaining}`, 18, 40);

  // Table Headers
  let y = 52;
  doc.setFillColor(30, 41, 59);
  doc.rect(14, y - 5, pageWidth - 28, 8, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');

  doc.text('S.N.', 16, y);
  doc.text('Reg Token', 28, y);
  doc.text('Seat No', 52, y);
  doc.text('Student Full Name', 72, y);
  doc.text('Mobile Phone', 122, y);
  doc.text('Course Selected', 157, y);
  doc.text('Batch Timing', 215, y);
  doc.text('Date & Time', 255, y);

  y += 7;

  // Table Rows
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);

  enrollments.forEach((item, index) => {
    if (y > 185) {
      doc.addPage();
      y = 20;

      // Repeat Table Header
      doc.setFillColor(30, 41, 59);
      doc.rect(14, y - 5, pageWidth - 28, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'bold');
      doc.text('S.N.', 16, y);
      doc.text('Reg Token', 28, y);
      doc.text('Seat No', 52, y);
      doc.text('Student Full Name', 72, y);
      doc.text('Mobile Phone', 122, y);
      doc.text('Course Selected', 157, y);
      doc.text('Batch Timing', 215, y);
      doc.text('Date & Time', 255, y);
      y += 7;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
    }

    if (index % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(14, y - 4, pageWidth - 28, 7, 'F');
    }

    doc.setTextColor(30, 41, 59);
    doc.text(`${index + 1}`, 16, y);
    doc.text(item.id || 'N/A', 28, y);
    doc.text(item.seatNumber || 'N/A', 52, y);
    doc.text((item.fullName || '').substring(0, 25), 72, y);
    doc.text(item.phone || 'N/A', 122, y);
    doc.text((item.course || '').substring(0, 30), 157, y);
    doc.text((item.batch || '').substring(0, 22), 215, y);
    doc.text(item.createdAt || 'Recent', 255, y);

    y += 7;
  });

  // Footer Page Count
  const pageCount = (doc.internal as any).getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(`Page ${i} of ${pageCount} | Surendra Air Admissions Register`, pageWidth / 2, 202, { align: 'center' });
  }

  doc.save(`Surendra_Air_Enrollments_Database_${new Date().toISOString().slice(0, 10)}.pdf`);
}
