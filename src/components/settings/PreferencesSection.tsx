import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Plus } from 'lucide-react';

interface PreferencesData {
  tone: 'professional' | 'casual' | 'enthusiastic';
  industries: string[];
  jobTypes: string[];
  customInstructions: string;
  defaultStatus: string;
  notifications: {
    email: boolean;
    inApp: boolean;
  };
}

interface PreferencesSectionProps {
  data: PreferencesData;
  onChange: (data: Partial<PreferencesData>) => void;
}

const COMMON_INDUSTRIES = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Manufacturing',
  'Retail',
  'Consulting',
  'Marketing',
  'Non-profit',
  'Government',
  'Real Estate',
  'Media',
  'Transportation',
  'Energy',
  'Food & Beverage'
];

const COMMON_JOB_TYPES = [
  'Full-time',
  'Part-time',
  'Contract',
  'Freelance',
  'Internship',
  'Remote',
  'Hybrid',
  'On-site',
  'Temporary',
  'Consulting'
];

export const PreferencesSection: React.FC<PreferencesSectionProps> = ({ data, onChange }) => {
  const [newIndustry, setNewIndustry] = React.useState('');
  const [newJobType, setNewJobType] = React.useState('');

  const addIndustry = (industry: string) => {
    if (industry.trim() && !data.industries.includes(industry.trim())) {
      onChange({ industries: [...data.industries, industry.trim()] });
    }
  };

  const removeIndustry = (industryToRemove: string) => {
    onChange({ industries: data.industries.filter(industry => industry !== industryToRemove) });
  };

  const addJobType = (jobType: string) => {
    if (jobType.trim() && !data.jobTypes.includes(jobType.trim())) {
      onChange({ jobTypes: [...data.jobTypes, jobType.trim()] });
    }
  };

  const removeJobType = (jobTypeToRemove: string) => {
    onChange({ jobTypes: data.jobTypes.filter(jobType => jobType !== jobTypeToRemove) });
  };

  const addCustomIndustry = () => {
    if (newIndustry.trim()) {
      addIndustry(newIndustry);
      setNewIndustry('');
    }
  };

  const addCustomJobType = () => {
    if (newJobType.trim()) {
      addJobType(newJobType);
      setNewJobType('');
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Tone Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>AI Writing Style</CardTitle>
          <CardDescription>
            Choose how AI should write your cover letters and applications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Writing Tone</Label>
            <Select value={data.tone} onValueChange={(value: PreferencesData['tone']) => onChange({ tone: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="casual">Casual & Friendly</SelectItem>
                <SelectItem value="enthusiastic">Enthusiastic & Energetic</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              {data.tone === 'professional' && 'Formal, structured, and business-focused language'}
              {data.tone === 'casual' && 'Conversational and approachable while maintaining professionalism'}
              {data.tone === 'enthusiastic' && 'Energetic and passionate, showing excitement for opportunities'}
            </p>
          </div>

          <div className="space-y-2">
            <Label>Custom Instructions</Label>
            <Textarea
              value={data.customInstructions}
              onChange={(e) => onChange({ customInstructions: e.target.value })}
              placeholder="Add specific instructions for AI content generation (e.g., 'Always mention my passion for sustainability', 'Keep paragraphs short', 'Include metrics when possible')..."
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Industry Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Target Industries</CardTitle>
          <CardDescription>
            Select industries you're interested in to tailor AI-generated content
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {COMMON_INDUSTRIES.map((industry) => (
              <Button
                key={industry}
                variant={data.industries.includes(industry) ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  if (data.industries.includes(industry)) {
                    removeIndustry(industry);
                  } else {
                    addIndustry(industry);
                  }
                }}
                className="justify-start"
              >
                {industry}
              </Button>
            ))}
          </div>

          <div className="flex space-x-2">
            <Input
              value={newIndustry}
              onChange={(e) => setNewIndustry(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCustomIndustry()}
              placeholder="Add custom industry..."
              className="flex-1"
            />
            <Button onClick={addCustomIndustry} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {data.industries.length > 0 && (
            <div>
              <Label className="text-sm font-medium">Selected Industries:</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {data.industries.map((industry, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {industry}
                    <button
                      onClick={() => removeIndustry(industry)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Job Type Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Job Type Preferences</CardTitle>
          <CardDescription>
            Specify the types of positions you're seeking
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {COMMON_JOB_TYPES.map((jobType) => (
              <Button
                key={jobType}
                variant={data.jobTypes.includes(jobType) ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  if (data.jobTypes.includes(jobType)) {
                    removeJobType(jobType);
                  } else {
                    addJobType(jobType);
                  }
                }}
                className="justify-start"
              >
                {jobType}
              </Button>
            ))}
          </div>

          <div className="flex space-x-2">
            <Input
              value={newJobType}
              onChange={(e) => setNewJobType(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCustomJobType()}
              placeholder="Add custom job type..."
              className="flex-1"
            />
            <Button onClick={addCustomJobType} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {data.jobTypes.length > 0 && (
            <div>
              <Label className="text-sm font-medium">Selected Job Types:</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {data.jobTypes.map((jobType, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {jobType}
                    <button
                      onClick={() => removeJobType(jobType)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Application Tracking */}
      <Card>
        <CardHeader>
          <CardTitle>Application Tracking</CardTitle>
          <CardDescription>
            Set default preferences for managing your job applications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Default Application Status</Label>
            <Select value={data.defaultStatus} onValueChange={(value) => onChange({ defaultStatus: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="applied">Applied</SelectItem>
                <SelectItem value="interview">Interview</SelectItem>
                <SelectItem value="offer">Offer</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            Choose how you want to be notified about application updates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive email updates about new features and tips
              </p>
            </div>
            <Switch
              id="email-notifications"
              checked={data.notifications.email}
              onCheckedChange={(checked) => 
                onChange({ 
                  notifications: { ...data.notifications, email: checked } 
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="in-app-notifications">In-App Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Show notifications within the application
              </p>
            </div>
            <Switch
              id="in-app-notifications"
              checked={data.notifications.inApp}
              onCheckedChange={(checked) => 
                onChange({ 
                  notifications: { ...data.notifications, inApp: checked } 
                })
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};