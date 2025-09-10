import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, X } from 'lucide-react';

interface WorkHistory {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  achievements: string[];
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  graduationDate: string;
  gpa?: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
}

interface ExperienceData {
  workHistory: WorkHistory[];
  education: Education[];
  projects: Project[];
}

interface ExperienceSectionProps {
  data: ExperienceData;
  onChange: (data: Partial<ExperienceData>) => void;
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ data, onChange }) => {
  const [newTech, setNewTech] = useState('');
  const [editingProject, setEditingProject] = useState<string | null>(null);

  const addWorkHistory = () => {
    const newWork: WorkHistory = {
      id: Date.now().toString(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: '',
      achievements: [],
    };
    onChange({ workHistory: [...data.workHistory, newWork] });
  };

  const updateWorkHistory = (id: string, updates: Partial<WorkHistory>) => {
    onChange({
      workHistory: data.workHistory.map(work => 
        work.id === id ? { ...work, ...updates } : work
      )
    });
  };

  const removeWorkHistory = (id: string) => {
    onChange({ workHistory: data.workHistory.filter(work => work.id !== id) });
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      field: '',
      graduationDate: '',
      gpa: '',
    };
    onChange({ education: [...data.education, newEdu] });
  };

  const updateEducation = (id: string, updates: Partial<Education>) => {
    onChange({
      education: data.education.map(edu => 
        edu.id === id ? { ...edu, ...updates } : edu
      )
    });
  };

  const removeEducation = (id: string) => {
    onChange({ education: data.education.filter(edu => edu.id !== id) });
  };

  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: '',
      description: '',
      technologies: [],
      url: '',
    };
    onChange({ projects: [...data.projects, newProject] });
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    onChange({
      projects: data.projects.map(project => 
        project.id === id ? { ...project, ...updates } : project
      )
    });
  };

  const removeProject = (id: string) => {
    onChange({ projects: data.projects.filter(project => project.id !== id) });
  };

  const addTechnology = (projectId: string) => {
    if (!newTech.trim()) return;
    
    const project = data.projects.find(p => p.id === projectId);
    if (project && !project.technologies.includes(newTech.trim())) {
      updateProject(projectId, { 
        technologies: [...project.technologies, newTech.trim()] 
      });
      setNewTech('');
    }
  };

  const removeTechnology = (projectId: string, tech: string) => {
    const project = data.projects.find(p => p.id === projectId);
    if (project) {
      updateProject(projectId, { 
        technologies: project.technologies.filter(t => t !== tech) 
      });
    }
  };

  return (
    <Tabs defaultValue="work" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="work">Work Experience</TabsTrigger>
        <TabsTrigger value="education">Education</TabsTrigger>
        <TabsTrigger value="projects">Projects</TabsTrigger>
      </TabsList>

      <TabsContent value="work" className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Work History</h3>
            <p className="text-muted-foreground text-sm">Your professional experience</p>
          </div>
          <Button onClick={addWorkHistory} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Position
          </Button>
        </div>

        {data.workHistory.map((work) => (
          <Card key={work.id}>
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-end">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => removeWorkHistory(work.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Company</Label>
                  <Input
                    value={work.company}
                    onChange={(e) => updateWorkHistory(work.id, { company: e.target.value })}
                    placeholder="Company name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Position</Label>
                  <Input
                    value={work.position}
                    onChange={(e) => updateWorkHistory(work.id, { position: e.target.value })}
                    placeholder="Job title"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    type="month"
                    value={work.startDate}
                    onChange={(e) => updateWorkHistory(work.id, { startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    type="month"
                    value={work.endDate}
                    onChange={(e) => updateWorkHistory(work.id, { endDate: e.target.value })}
                    placeholder="Leave empty if current"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={work.description}
                  onChange={(e) => updateWorkHistory(work.id, { description: e.target.value })}
                  placeholder="Describe your role and responsibilities..."
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>
        ))}

        {data.workHistory.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">No work experience added yet.</p>
              <Button onClick={addWorkHistory} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Position
              </Button>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="education" className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Education</h3>
            <p className="text-muted-foreground text-sm">Your educational background</p>
          </div>
          <Button onClick={addEducation} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Education
          </Button>
        </div>

        {data.education.map((edu) => (
          <Card key={edu.id}>
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-end">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => removeEducation(edu.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Institution</Label>
                  <Input
                    value={edu.institution}
                    onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                    placeholder="University name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Degree</Label>
                  <Input
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                    placeholder="Bachelor's, Master's, etc."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Field of Study</Label>
                  <Input
                    value={edu.field}
                    onChange={(e) => updateEducation(edu.id, { field: e.target.value })}
                    placeholder="Computer Science, Engineering, etc."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Graduation Date</Label>
                  <Input
                    type="month"
                    value={edu.graduationDate}
                    onChange={(e) => updateEducation(edu.id, { graduationDate: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {data.education.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">No education added yet.</p>
              <Button onClick={addEducation} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Add Education
              </Button>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="projects" className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Projects</h3>
            <p className="text-muted-foreground text-sm">Showcase your work and achievements</p>
          </div>
          <Button onClick={addProject} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        </div>

        {data.projects.map((project) => (
          <Card key={project.id}>
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-end">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => removeProject(project.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Project Name</Label>
                  <Input
                    value={project.name}
                    onChange={(e) => updateProject(project.id, { name: e.target.value })}
                    placeholder="My Amazing Project"
                  />
                </div>
                <div className="space-y-2">
                  <Label>URL (Optional)</Label>
                  <Input
                    value={project.url}
                    onChange={(e) => updateProject(project.id, { url: e.target.value })}
                    placeholder="https://github.com/username/project"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={project.description}
                  onChange={(e) => updateProject(project.id, { description: e.target.value })}
                  placeholder="Describe your project, its purpose, and key features..."
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Technologies</Label>
                <div className="flex space-x-2">
                  <Input
                    value={editingProject === project.id ? newTech : ''}
                    onChange={(e) => {
                      setEditingProject(project.id);
                      setNewTech(e.target.value);
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addTechnology(project.id);
                      }
                    }}
                    placeholder="Add technology..."
                    className="flex-1"
                  />
                  <Button 
                    onClick={() => addTechnology(project.id)} 
                    size="sm"
                    disabled={!newTech.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {project.technologies.map((tech, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {tech}
                      <button
                        onClick={() => removeTechnology(project.id, tech)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {data.projects.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">No projects added yet.</p>
              <Button onClick={addProject} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Project
              </Button>
            </CardContent>
          </Card>
        )}
      </TabsContent>
    </Tabs>
  );
};