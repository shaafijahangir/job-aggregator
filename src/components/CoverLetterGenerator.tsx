
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Upload, Download, Wand2, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const CoverLetterGenerator = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('professional');
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!jobDescription.trim()) {
      toast({
        title: "Job description required",
        description: "Please paste the job description to generate a cover letter.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    // Mock AI generation - in real app, this would call your backend API
    setTimeout(() => {
      const mockLetter = `Dear Hiring Manager,

I am writing to express my strong interest in the Systems Analyst position at your organization. With my extensive background in systems analysis, process optimization, and technical documentation, I am confident that I would be a valuable addition to your team.

In my previous roles, I have successfully:
• Analyzed complex business requirements and translated them into technical specifications
• Implemented system improvements that resulted in 25% increased efficiency
• Led cross-functional teams in delivering high-quality solutions on time and within budget
• Developed comprehensive documentation and provided user training for new systems

My experience aligns well with your requirements for:
- Strong analytical and problem-solving skills demonstrated through successful system optimization projects
- Database management expertise with advanced SQL proficiency
- Excellent communication skills evidenced by my role in stakeholder management and team leadership

I am particularly drawn to this opportunity because of your organization's commitment to innovation and process improvement. I would welcome the chance to discuss how my background in systems analysis and passion for continuous improvement can contribute to your team's success.

Thank you for your consideration. I look forward to hearing from you.

Sincerely,
[Your Name]`;

      setGeneratedLetter(mockLetter);
      setIsGenerating(false);
      toast({
        title: "Cover letter generated!",
        description: "Your personalized cover letter is ready for review.",
      });
    }, 2000);
  };

  const handleDownloadPDF = () => {
    toast({
      title: "PDF Download",
      description: "PDF generation would be handled by your backend service.",
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wand2 className="h-5 w-5" />
            <span>Cover Letter Generator</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Template Selection */}
          <div>
            <Label htmlFor="template">Cover Letter Template</Label>
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="creative">Creative</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="government">Government</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Job Description Input */}
          <div>
            <Label htmlFor="job-description">Job Description</Label>
            <Textarea
              id="job-description"
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="mt-1 min-h-[200px]"
            />
          </div>

          {/* Additional Options */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="company-name">Company Name</Label>
              <Input 
                id="company-name"
                placeholder="e.g., City of Victoria"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="position-title">Position Title</Label>
              <Input 
                id="position-title"
                placeholder="e.g., Systems Analyst"
                className="mt-1"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex-1"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Generate Cover Letter
                </>
              )}
            </Button>
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Upload Resume
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Output Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Generated Cover Letter</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {generatedLetter ? (
            <div className="space-y-4">
              <Textarea
                value={generatedLetter}
                onChange={(e) => setGeneratedLetter(e.target.value)}
                className="min-h-[400px] font-mono text-sm"
                placeholder="Your generated cover letter will appear here..."
              />
              
              <div className="flex space-x-3">
                <Button onClick={handleDownloadPDF} className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Button variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
              </div>

              {/* Style Preview */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">PDF Style Preview</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>• Professional letterhead with your contact information</p>
                  <p>• Clean, readable font (Times New Roman, 11pt)</p>
                  <p>• Proper spacing and margins</p>
                  <p>• Company address formatting</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Generate a cover letter to see it here</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
