export function generatePDF() {
  if (typeof window.html2pdf === 'undefined') {
    console.error('Error: html2pdf.js library not loaded.');
    return Promise.reject(new Error('PDF library not loaded'));
  }

  const resumeContent = document.getElementById('resumeContent');

  // Store original styles
  const originalStyles = {
    maxWidth: resumeContent.style.maxWidth,
    margin: resumeContent.style.margin,
    padding: resumeContent.style.padding,
    boxShadow: resumeContent.style.boxShadow,
    borderRadius: resumeContent.style.borderRadius,
    background: resumeContent.style.background,
  };

  // Apply override styles for PDF generation
  resumeContent.style.maxWidth = 'none';
  resumeContent.style.margin = '0';
  resumeContent.style.padding = '0';
  resumeContent.style.boxShadow = 'none';
  resumeContent.style.borderRadius = '0';
  resumeContent.style.background = 'white';

  document.body.classList.add('generating-pdf');

  const opt = {
    margin: [10, 10, 10, 10],
    filename: 'Mario_Faundez_CV.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      logging: true,
      useCORS: true,
      scrollX: 0,
      scrollY: 0,
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['css', 'legacy'], avoid: '.pdf-avoid-break' },
  };

  return window
    .html2pdf()
    .from(resumeContent)
    .set(opt)
    .save()
    .then(() => {
      // Restore original styles
      resumeContent.style.maxWidth = originalStyles.maxWidth;
      resumeContent.style.margin = originalStyles.margin;
      resumeContent.style.padding = originalStyles.padding;
      resumeContent.style.boxShadow = originalStyles.boxShadow;
      resumeContent.style.borderRadius = originalStyles.borderRadius;
      resumeContent.style.background = originalStyles.background;
      document.body.classList.remove('generating-pdf');
    })
    .catch((error) => {
      console.error('Error generating PDF with html2pdf:', error);
      // Restore original styles even on error
      resumeContent.style.maxWidth = originalStyles.maxWidth;
      resumeContent.style.margin = originalStyles.margin;
      resumeContent.style.padding = originalStyles.padding;
      resumeContent.style.boxShadow = originalStyles.boxShadow;
      resumeContent.style.borderRadius = originalStyles.borderRadius;
      resumeContent.style.background = originalStyles.background;
      document.body.classList.remove('generating-pdf');
      throw error;
    });
}
