import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Upload, FileText, Trash2, Download, Plus, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CoverLetterTemplate {
  id: string;
  name: string;
  content: string;
}

interface CustomDocument {
  id: string;
  name: string;
  file: File;
  type: string;
}

interface DocumentsData {
  resume?: File;
  coverLetterTemplates: CoverLetterTemplate[];
  customDocuments: CustomDocument[];
}

interface DocumentsSectionProps {
  data: DocumentsData;
  onChange: (data: Partial<DocumentsData>) => void;
}

export const DocumentsSection: React.FC<DocumentsSectionProps> = ({ data, onChange }) => {
  const { toast } = useToast();
  const [newTemplateName, setNewTemplateName] = useState('');
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);

  const handleResumeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.type.includes('document')) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a PDF or Word document.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "File size must be less than 5MB.",
        variant: "destructive",
      });
      return;
    }

    onChange({ resume: file });
    toast({
      title: "Resume Uploaded",
      description: "Your resume has been uploaded successfully.",
    });
  };

  const addCoverLetterTemplate = () => {
    if (!newTemplateName.trim()) return;

    const newTemplate: CoverLetterTemplate = {
      id: Date.now().toString(),
      name: newTemplateName.trim(),
      content: '',
    };

    onChange({ 
      coverLetterTemplates: [...data.coverLetterTemplates, newTemplate] 
    });
    
    setNewTemplateName('');
    setShowTemplateForm(false);
    setEditingTemplate(newTemplate.id);
  };

  const updateTemplate = (id: string, updates: Partial<CoverLetterTemplate>) => {
    onChange({
      coverLetterTemplates: data.coverLetterTemplates.map(template => 
        template.id === id ? { ...template, ...updates } : template
      )
    });
  };

  const deleteTemplate = (id: string) => {
    onChange({
      coverLetterTemplates: data.coverLetterTemplates.filter(template => template.id !== id)
    });
    if (editingTemplate === id) {
      setEditingTemplate(null);
    }
  };

  const handleCustomDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "File size must be less than 10MB.",
        variant: "destructive",
      });
      return;
    }

    const customDoc: CustomDocument = {
      id: Date.now().toString(),
      name: file.name,
      file,
      type: file.type,
    };

    onChange({
      customDocuments: [...data.customDocuments, customDoc]
    });

    toast({
      title: "Document Uploaded",
      description: `${file.name} has been uploaded successfully.`,
    });
  };

  const deleteCustomDocument = (id: string) => {
    onChange({
      customDocuments: data.customDocuments.filter(doc => doc.id !== id)
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Resume Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Resume</CardTitle>
          <CardDescription>
            Upload your current resume for AI-powered customization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.resume ? (
            <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/20">
              <div className="flex items-center space-x-3">
                <FileText className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="font-medium text-foreground">{data.resume.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(data.resume.size)} • Uploaded
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const url = URL.createObjectURL(data.resume!);
                    window.open(url, '_blank');
                  }}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Resume</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete your resume? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => onChange({ resume: undefined })}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                Drag and drop your resume here, or click to browse
              </p>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeUpload}
                className="hidden"
                id="resume-upload"
              />
              <label htmlFor="resume-upload">
                <Button variant="outline" className="cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Resume
                </Button>
              </label>
              <p className="text-xs text-muted-foreground mt-2">
                PDF or Word document, max 5MB
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cover Letter Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Cover Letter Templates</CardTitle>
          <CardDescription>
            Create reusable templates for different job types or industries
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              {data.coverLetterTemplates.map((template) => (
                <Button
                  key={template.id}
                  variant={editingTemplate === template.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setEditingTemplate(template.id)}
                  className="relative"
                >
                  {template.name}
                  {editingTemplate === template.id && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      Editing
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
            
            {!showTemplateForm ? (
              <Button onClick={() => setShowTemplateForm(true)} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Template
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Input
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                  placeholder="Template name..."
                  className="w-40"
                  onKeyPress={(e) => e.key === 'Enter' && addCoverLetterTemplate()}
                />
                <Button onClick={addCoverLetterTemplate} size="sm">
                  Add
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setShowTemplateForm(false);
                    setNewTemplateName('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>

          {editingTemplate && (
            <div className="space-y-4 border rounded-lg p-4 bg-muted/20">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-foreground">
                  Editing: {data.coverLetterTemplates.find(t => t.id === editingTemplate)?.name}
                </h4>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Template</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this template? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => deleteTemplate(editingTemplate)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              
              <Textarea
                value={data.coverLetterTemplates.find(t => t.id === editingTemplate)?.content || ''}
                onChange={(e) => updateTemplate(editingTemplate, { content: e.target.value })}
                placeholder="Write your cover letter template here. Use placeholders like {{company}}, {{position}}, {{your_name}} for dynamic content..."
                className="min-h-[200px]"
              />
              
              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => setEditingTemplate(null)}
                >
                  Done Editing
                </Button>
              </div>
            </div>
          )}

          {data.coverLetterTemplates.length === 0 && !showTemplateForm && (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No templates created yet.</p>
              <p className="text-sm">Create your first template to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Custom Documents */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Documents</CardTitle>
          <CardDescription>
            Upload portfolios, certificates, or other supporting documents
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <input
              type="file"
              onChange={handleCustomDocumentUpload}
              className="hidden"
              id="custom-doc-upload"
              multiple
            />
            <label htmlFor="custom-doc-upload">
              <Button variant="outline" className="cursor-pointer">
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            </label>
          </div>

          {data.customDocuments.length > 0 && (
            <div className="space-y-3">
              {data.customDocuments.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-6 w-6 text-blue-600" />
                    <div>
                      <p className="font-medium text-foreground">{doc.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(doc.file.size)} • {doc.type}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const url = URL.createObjectURL(doc.file);
                        window.open(url, '_blank');
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteCustomDocument(doc.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {data.customDocuments.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Upload className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No additional documents uploaded.</p>
              <p className="text-sm">Add certificates, portfolios, or other supporting files.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};