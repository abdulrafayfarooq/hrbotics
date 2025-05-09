
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Briefcase, User, UserPlus, Users, FileText } from "lucide-react";

export interface InterviewMode {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  questions: string[];
}

const interviewModes: InterviewMode[] = [
  {
    id: "general",
    name: "General Interview",
    description: "Standard questions suitable for any position",
    icon: <User className="h-6 w-6 text-virtualhr-blue-bright" />,
    questions: [
      "Tell me about yourself.",
      "Why are you interested in this position?",
      "What are your greatest strengths and weaknesses?",
      "Where do you see yourself in 5 years?",
      "Describe a challenge you faced at work and how you overcame it."
    ]
  },
  {
    id: "technical",
    name: "Technical Interview",
    description: "For software development and IT positions",
    icon: <Briefcase className="h-6 w-6 text-green-600" />,
    questions: [
      "Explain your most challenging project and how you approached it.",
      "How do you stay updated with the latest technologies?",
      "Describe your approach to debugging a complex issue.",
      "How do you ensure code quality and performance?",
      "Describe your experience with [specific technology]."
    ]
  },
  {
    id: "hr",
    name: "HR Interview",
    description: "Focus on cultural fit and soft skills",
    icon: <Users className="h-6 w-6 text-amber-500" />,
    questions: [
      "How do you handle conflict in the workplace?",
      "Describe your ideal work environment.",
      "How do you prioritize tasks when you have multiple deadlines?",
      "Tell me about a time you went above and beyond at work.",
      "How would your colleagues describe your work style?"
    ]
  },
  {
    id: "leadership",
    name: "Leadership Interview",
    description: "For management and leadership roles",
    icon: <UserPlus className="h-6 w-6 text-red-600" />,
    questions: [
      "How do you motivate your team?",
      "Describe your leadership style.",
      "How do you handle underperforming team members?",
      "Tell me about a successful project you led.",
      "How do you delegate tasks and responsibilities?"
    ]
  }
];

interface InterviewModeSelectorProps {
  selectedMode: string;
  onSelectMode: (mode: InterviewMode) => void;
}

const InterviewModeSelector = ({ selectedMode, onSelectMode }: InterviewModeSelectorProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Interview Mode</CardTitle>
        <CardDescription>Choose the type of interview you want to practice</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedMode}
          onValueChange={(value) => {
            const selected = interviewModes.find(mode => mode.id === value);
            if (selected) onSelectMode(selected);
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {interviewModes.map((mode) => (
              <div key={mode.id} className="flex">
                <RadioGroupItem
                  value={mode.id}
                  id={`mode-${mode.id}`}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={`mode-${mode.id}`}
                  className="flex flex-col p-4 w-full rounded-lg border-2 cursor-pointer
                    peer-data-[state=checked]:border-virtualhr-purple
                    hover:bg-slate-50 dark:hover:bg-slate-900
                    peer-data-[state=checked]:bg-virtualhr-purple-soft"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {mode.icon}
                      <span className="font-medium">{mode.name}</span>
                    </div>
                    <div className="h-4 w-4 rounded-full border flex items-center justify-center
                      peer-data-[state=checked]:border-virtualhr-purple
                      peer-data-[state=checked]:bg-virtualhr-purple-soft">
                      {selectedMode === mode.id && <span className="h-2 w-2 rounded-full bg-virtualhr-purple" />}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">{mode.description}</p>
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export { InterviewModeSelector, interviewModes };
