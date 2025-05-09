
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export interface FeedbackReport {
  timestamp: string;
  overallScore: number;
  emotionData: {
    time: number;
    faceEmotion: string;
    voiceEmotion: string;
    faceScore: number;
    voiceScore: number;
  }[];
  feedback: {
    type: string;
    text: string;
  }[];
  interviewMode?: string;
}

export const generatePDF = async (
  reportRef: React.RefObject<HTMLDivElement>,
  reportData: FeedbackReport
): Promise<string> => {
  if (!reportRef.current) {
    throw new Error("Report element not found");
  }

  try {
    // Create a new jsPDF instance
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Add report header
    doc.setFontSize(22);
    doc.setTextColor(102, 45, 145); // Purple color
    doc.text("HRbotics Interview Feedback", 20, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${reportData.timestamp}`, 20, 30);
    if (reportData.interviewMode) {
      doc.text(`Interview Mode: ${reportData.interviewMode}`, 20, 37);
    }

    // Add overall score
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(`Overall Performance: ${reportData.overallScore}%`, 20, 47);
    
    // Generate canvas from the report element
    const canvas = await html2canvas(reportRef.current, {
      scale: 2,
      logging: false,
      useCORS: true,
    });
    
    // Convert the canvas to an image
    const imgData = canvas.toDataURL("image/png");
    
    // Calculate dimensions to fit the page
    const imgWidth = 170;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Add the image to the PDF
    doc.addImage(imgData, "PNG", 20, 55, imgWidth, imgHeight);
    
    // Add feedback section
    let yPosition = 60 + imgHeight;
    
    doc.setFontSize(16);
    doc.text("Interview Feedback", 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(12);
    reportData.feedback.forEach((item) => {
      let icon = "•";
      if (item.type === "positive") icon = "✓";
      if (item.type === "improvement") icon = "↗";
      if (item.type === "tip") icon = "💡";
      
      // Check if we need a new page
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.text(`${icon} ${item.text}`, 20, yPosition);
      yPosition += 8;
    });
    
    // Add footer
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text("Powered by HRbotics - Practice makes perfect", 20, 285);
    
    // Generate PDF as a blob URL
    const pdfBlob = doc.output("bloburl");
    return pdfBlob;

  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error("Failed to generate PDF report");
  }
};
