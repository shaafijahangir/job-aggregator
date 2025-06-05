
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Upload, Download, Wand2, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const COHERE_API_KEY = '8sLMtMJdaUja1V41aQ0VwFFZIsZa5jxKv3uj3g57';

export const CoverLetterGenerator = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [positionTitle, setPositionTitle] = useState('');
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('professional');
  const { toast } = useToast();

  const generateCoverLetter = async () => {
    if (!jobDescription.trim()) {
      toast({
        title: "Job description required",
        description: "Please paste the job description to generate a cover letter.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const prompt = `Generate a professional cover letter for the following job posting. Make it personalized and highlight relevant experience:

Job Description: ${jobDescription}
Company: ${companyName || 'the organization'}
Position: ${positionTitle || 'this position'}

Requirements:
- Professional tone
- Highlight relevant technical skills
- Show enthusiasm for the role
- Include specific examples of experience
- Keep it concise (under 400 words)
- Format for business letter style

Generate only the cover letter content without any additional formatting or explanations.`;

      const response = await fetch('https://api.cohere.ai/v1/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${COHERE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'command',
          prompt: prompt,
          max_tokens: 500,
          temperature: 0.7,
          k: 0,
          stop_sequences: [],
          return_likelihoods: 'NONE'
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const generatedText = data.generations[0].text.trim();
      
      setGeneratedLetter(generatedText);
      toast({
        title: "Cover letter generated!",
        description: "Your personalized cover letter is ready for review.",
      });
    } catch (error) {
      console.error('Error generating cover letter:', error);
      toast({
        title: "Generation failed",
        description: "Failed to generate cover letter. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadAsPDF = () => {
    // This would typically call a backend service to generate PDF
    toast({
      title: "PDF Download",
      description: "PDF generation requires backend service. The text version is ready for copy/paste.",
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLetter);
    toast({
      title: "Copied!",
      description: "Cover letter copied to clipboard.",
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

          {/* Company and Position */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="company-name">Company Name</Label>
              <Input 
                id="company-name"
                placeholder="e.g., City of Victoria"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="position-title">Position Title</Label>
              <Input 
                id="position-title"
                placeholder="e.g., Systems Analyst"
                value={positionTitle}
                onChange={(e) => setPositionTitle(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          {/* Job Description Input */}
          <div>
            <Label htmlFor="job-description">Job Description</Label>
            <Textarea
              id="job-description"
              placeholder="Paste the complete job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="mt-1 min-h-[200px]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button 
              onClick={generateCoverLetter}
              disabled={isGenerating || !jobDescription.trim()}
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
                  Generate with Cohere AI
                </>
              )}
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
                className="min-h-[400px] text-sm"
                placeholder="Your generated cover letter will appear here..."
              />
              
              <div className="flex space-x-3">
                <Button onClick={copyToClipboard} variant="outline" className="flex-1">
                  📋 Copy Text
                </Button>
                <Button onClick={downloadAsPDF} className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
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
              <p>Paste a job description and click "Generate" to create your cover letter</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
