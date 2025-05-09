
import html2canvas from 'html2canvas';

export interface FeedbackReport {
  timestamp: string;
  overallScore: number;
  emotionData: any[];
  feedback: any[];
  interviewMode: string;
}

export const generatePDF = async (
  reportRef: React.RefObject<HTMLDivElement>, 
  report: FeedbackReport
): Promise<string> => {
  if (!reportRef.current) {
    throw new Error('Report element not found');
  }

  try {
    // Capture the report as canvas
    const canvas = await html2canvas(reportRef.current, {
      scale: 2,
      logging: false,
      useCORS: true,
      allowTaint: true
    });

    // Convert the canvas to a data URL (PNG image)
    const imageData = canvas.toDataURL('image/png');
    
    // Return the URL to be used for download
    return imageData;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};
