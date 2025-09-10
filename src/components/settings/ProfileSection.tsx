import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Plus } from 'lucide-react';

interface ProfileData {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  objectives: string;
  skills: string[];
}

interface ProfileSectionProps {
  data: ProfileData;
  onChange: (data: Partial<ProfileData>) => void;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({ data, onChange }) => {
  const [newSkill, setNewSkill] = React.useState('');

  const addSkill = () => {
    if (newSkill.trim() && !data.skills.includes(newSkill.trim())) {
      onChange({ skills: [...data.skills, newSkill.trim()] });
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    onChange({ skills: data.skills.filter(skill => skill !== skillToRemove) });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Your core professional details used across all applications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={data.name}
                onChange={(e) => onChange({ name: e.target.value })}
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Professional Title</Label>
              <Input
                id="title"
                value={data.title}
                onChange={(e) => onChange({ title: e.target.value })}
                placeholder="Software Developer"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={data.email}
                onChange={(e) => onChange({ email: e.target.value })}
                placeholder="john@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={data.phone}
                onChange={(e) => onChange({ phone: e.target.value })}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={data.location}
              onChange={(e) => onChange({ location: e.target.value })}
              placeholder="Vancouver, BC, Canada"
            />
          </div>
        </CardContent>
      </Card>

      {/* Professional Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Professional Summary</CardTitle>
          <CardDescription>
            A brief overview of your professional background and expertise
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={data.summary}
            onChange={(e) => onChange({ summary: e.target.value })}
            placeholder="Experienced software developer with 5+ years in full-stack development..."
            className="min-h-[120px]"
          />
        </CardContent>
      </Card>

      {/* Career Objectives */}
      <Card>
        <CardHeader>
          <CardTitle>Career Objectives</CardTitle>
          <CardDescription>
            Your current career goals and target opportunities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={data.objectives}
            onChange={(e) => onChange({ objectives: e.target.value })}
            placeholder="Seeking a senior developer role at an innovative tech company..."
            className="min-h-[100px]"
          />
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader>
          <CardTitle>Core Skills</CardTitle>
          <CardDescription>
            Key technical and professional skills to highlight in applications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add a skill..."
              className="flex-1"
            />
            <Button onClick={addSkill} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {skill}
                <button
                  onClick={() => removeSkill(skill)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          
          {data.skills.length === 0 && (
            <p className="text-muted-foreground text-sm">
              No skills added yet. Add your key skills to improve AI-generated content.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};