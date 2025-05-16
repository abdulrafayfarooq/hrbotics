
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { FileText } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().optional(),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  file: z.instanceof(File, {
    message: "Please upload a document.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface DocumentUploadFormProps {
  onCancel: () => void;
  onComplete: () => void;
}

const DocumentUploadForm = ({ onCancel, onComplete }: DocumentUploadFormProps) => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      email: "",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      form.setValue("file", selectedFile);
    }
  };

  const onSubmit = async (data: FormValues) => {
    setUploading(true);
    
    try {
      // In a real application, this would be an API call to send the email
      // For now, we'll simulate the process
      console.log("Document submission data:", data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Document submitted successfully",
        description: `Your document "${data.title}" will be sent to ${data.email}`,
      });
      
      // Reset form and notify parent component
      form.reset();
      setFile(null);
      onComplete();
    } catch (error) {
      console.error("Error submitting document:", error);
      toast({
        title: "Submission failed",
        description: "There was an error submitting your document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Document Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter document title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter a short description of the document" 
                  className="resize-none" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input 
                  type="email" 
                  placeholder="Where should we send this document?" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                We'll send the document to this email address
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="file"
          render={() => (
            <FormItem>
              <FormLabel>Upload Document</FormLabel>
              <FormControl>
                <div className="flex items-center">
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt,.rtf,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md p-6 w-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    {!file ? (
                      <div className="text-center">
                        <FileText className="mx-auto h-10 w-10 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          PDF, DOC, DOCX, TXT, RTF (Max 10MB)
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <FileText className="h-6 w-6 text-virtualhr-purple" />
                        <div>
                          <p className="text-sm font-medium">{file.name}</p>
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                    )}
                  </label>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2 pt-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="bg-virtualhr-purple hover:bg-virtualhr-purple-dark"
            disabled={uploading || !file}
          >
            {uploading ? "Submitting..." : "Submit Document"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default DocumentUploadForm;
