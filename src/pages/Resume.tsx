
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { FileText, Upload, X, CheckCircle, AlertCircle, Download } from 'lucide-react';
import { generatePDF, downloadReport, ResumeAnalysis } from '@/utils/pdfGenerator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DocumentUploadForm from '@/components/DocumentUploadForm';

type UploadType = 'resume' | 'document';

const Resume = () => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [uploadType, setUploadType] = useState<UploadType>('resume');
  const [showDocumentForm, setShowDocumentForm] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resumeReportRef = useRef<HTMLDivElement>(null);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf' || 
          selectedFile.type === 'application/msword' || 
          selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        setFile(selectedFile);
      } else {
        toast({
          title: "Invalid file format",
          description: "Please upload a PDF, DOC, or DOCX file.",
          variant: "destructive",
        });
      }
    }
  };
  
  const handleUpload = () => {
    if (!file) return;
    
    setUploading(true);
    
    // Simulate upload - in a real app, you'd send to a server
    setTimeout(() => {
      setUploading(false);
      setAnalyzing(true);
      
      // Simulate analysis
      setTimeout(() => {
        setAnalyzing(false);
        setAnalyzed(true);
        
        toast({
          title: "Resume analyzed",
          description: "Your resume has been successfully analyzed.",
        });
      }, 2000);
    }, 1500);
  };
  
  const handleRemoveFile = () => {
    setFile(null);
    setAnalyzed(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleDownloadAnalysis = async () => {
    if (!resumeReportRef.current) return;
    
    try {
      setGeneratingPdf(true);
      
      const analysisData: ResumeAnalysis = {
        skills: ["JavaScript", "React", "Technical Communication"],
        strengths: ["Strong Technical Skills", "Clear Work History"],
        improvements: ["Add more quantifiable achievements"],
        filename: file?.name || "resume"
      };
      
      const pdfUrl = await generatePDF(resumeReportRef, analysisData);
      downloadReport(pdfUrl, `hrbotics-resume-analysis-${Date.now()}.png`);
      
      toast({
        title: "Analysis Downloaded",
        description: "Your resume analysis has been downloaded successfully.",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Download Failed",
        description: "An error occurred while generating your analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGeneratingPdf(false);
    }
  };
  
  const handleUploadTypeChange = (value: string) => {
    setUploadType(value as UploadType);
    
    if (value === 'document') {
      setShowDocumentForm(true);
    } else {
      setShowDocumentForm(false);
    }
  };
  
  const handleCancelDocumentUpload = () => {
    setShowDocumentForm(false);
    setUploadType('resume');
  };
  
  return (
    <div className="container mx-auto py-8 px-4 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Resume Analysis</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Upload your resume for personalized interview insights</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Upload Document</CardTitle>
              <CardDescription>
                Select the type of document you want to upload
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Select defaultValue="resume" onValueChange={handleUploadTypeChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="resume">Resume</SelectItem>
                    <SelectItem value="document">Other Documents</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {uploadType === 'resume' && !showDocumentForm ? (
                !file ? (
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="flex flex-col items-center">
                      <Upload className="h-10 w-10 text-gray-400 mb-2" />
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        PDF, DOC, or DOCX (Max 10MB)
                      </p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={handleFileChange}
                    />
                  </div>
                ) : (
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="bg-virtualhr-purple/10 p-2 rounded mr-3">
                          <FileText className="h-6 w-6 text-virtualhr-purple" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{file.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={handleRemoveFile}
                        className="text-gray-400 hover:text-gray-600 p-1"
                      >
                        <X size={20} />
                      </button>
                    </div>
                    
                    <div className="mt-4">
                      {!uploading && !analyzing && !analyzed ? (
                        <Button
                          className="w-full bg-virtualhr-purple hover:bg-virtualhr-purple-dark"
                          onClick={handleUpload}
                        >
                          Upload and Analyze
                        </Button>
                      ) : uploading ? (
                        <Button disabled className="w-full">
                          <div className="flex items-center">
                            <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                            Uploading...
                          </div>
                        </Button>
                      ) : analyzing ? (
                        <Button disabled className="w-full">
                          <div className="flex items-center">
                            <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                            Analyzing...
                          </div>
                        </Button>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 p-2 rounded">
                            <CheckCircle className="h-5 w-5 mr-2" />
                            <span className="text-sm font-medium">Analysis Complete</span>
                          </div>
                          <Button 
                            variant="outline"
                            className="flex items-center gap-2"
                            onClick={handleDownloadAnalysis}
                            disabled={generatingPdf}
                          >
                            <Download size={16} />
                            {generatingPdf ? "Generating..." : "Download"}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              ) : (
                <DocumentUploadForm 
                  onCancel={handleCancelDocumentUpload}
                  onComplete={() => {
                    setShowDocumentForm(false);
                    setUploadType('resume');
                  }}
                />
              )}
            </CardContent>
          </Card>
          
          {analyzed && (
            <div ref={resumeReportRef}>
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Key Insights</CardTitle>
                  <CardDescription>
                    What we found in your resume
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-green-50 dark:bg-green-900/30 p-2 rounded mr-3">
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium dark:text-gray-200">Strong Technical Skills</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Your technical skills are well presented and relevant for today's market.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-amber-50 dark:bg-amber-900/30 p-2 rounded mr-3">
                      <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium dark:text-gray-200">Improve Quantifiable Achievements</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Consider adding more measurable results and achievements to strengthen your experience section.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-green-50 dark:bg-green-900/30 p-2 rounded mr-3">
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium dark:text-gray-200">Clear Work History</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Your career progression is easy to follow and well-structured.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Why Upload Your Resume?</CardTitle>
              <CardDescription>
                Get personalized interview preparation based on your experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start">
                <div className="bg-virtualhr-purple/10 p-3 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-virtualhr-purple">
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                    <line x1="16" x2="16" y1="2" y2="6"></line>
                    <line x1="8" x2="8" y1="2" y2="6"></line>
                    <line x1="3" x2="21" y1="10" y2="10"></line>
                    <path d="m9 16 2 2 4-4"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-200">Tailored Practice Questions</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    We'll generate interview questions specific to your job history and career path.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-virtualhr-blue-soft p-3 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-virtualhr-blue-bright">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-200">Skills Gap Analysis</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Identify potential skill gaps and get suggestions for improvement before your interview.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700 dark:text-gray-300">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" x2="8" y1="13" y2="13"></line>
                    <line x1="16" x2="8" y1="17" y2="17"></line>
                    <line x1="10" x2="8" y1="9" y2="9"></line>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-200">Resume Enhancement Tips</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Get suggestions on how to improve your resume to stand out to recruiters and ATS systems.
                  </p>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="bg-gray-50 dark:bg-gray-800 border-t p-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p className="font-medium mb-1">Your privacy is important</p>
                <p>We use advanced encryption to protect your resume data. Your information is never shared with third parties.</p>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Resume;
