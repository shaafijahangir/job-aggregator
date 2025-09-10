import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { ProfileSection } from '@/components/settings/ProfileSection';
import { ExperienceSection } from '@/components/settings/ExperienceSection';
import { DocumentsSection } from '@/components/settings/DocumentsSection';
import { PreferencesSection } from '@/components/settings/PreferencesSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Save, Download, Upload } from 'lucide-react';

export interface UserProfile {
  personal: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
    objectives: string;
    skills: string[];
  };
  experience: {
    workHistory: Array<{
      id: string;
      company: string;
      position: string;
      startDate: string;
      endDate: string;
      description: string;
      achievements: string[];
    }>;
    education: Array<{
      id: string;
      institution: string;
      degree: string;
      field: string;
      graduationDate: string;
      gpa?: string;
    }>;
    projects: Array<{
      id: string;
      name: string;
      description: string;
      technologies: string[];
      url?: string;
    }>;
  };
  documents: {
    resume?: File;
    coverLetterTemplates: Array<{
      id: string;
      name: string;
      content: string;
    }>;
    customDocuments: Array<{
      id: string;
      name: string;
      file: File;
      type: string;
    }>;
  };
  preferences: {
    tone: 'professional' | 'casual' | 'enthusiastic';
    industries: string[];
    jobTypes: string[];
    customInstructions: string;
    defaultStatus: string;
    notifications: {
      email: boolean;
      inApp: boolean;
    };
  };
}

const Settings = () => {
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile>({
    personal: {
      name: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      summary: '',
      objectives: '',
      skills: [],
    },
    experience: {
      workHistory: [],
      education: [],
      projects: [],
    },
    documents: {
      coverLetterTemplates: [],
      customDocuments: [],
    },
    preferences: {
      tone: 'professional',
      industries: [],
      jobTypes: [],
      customInstructions: '',
      defaultStatus: 'applied',
      notifications: {
        email: true,
        inApp: true,
      },
    },
  });

  const [hasChanges, setHasChanges] = useState(false);

  // Load profile from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile));
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    }
  }, []);

  // Track changes
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    const currentProfile = JSON.stringify(profile);
    setHasChanges(savedProfile !== currentProfile);
  }, [profile]);

  const updateProfile = (section: keyof UserProfile, data: any) => {
    setProfile(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }));
  };

  const saveProfile = () => {
    try {
      localStorage.setItem('userProfile', JSON.stringify(profile));
      setHasChanges(false);
      toast({
        title: "Profile Saved",
        description: "Your professional context has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Could not save your profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const exportProfile = () => {
    const dataStr = JSON.stringify(profile, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'professional-profile.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "Profile Exported",
      description: "Your profile has been downloaded as a JSON file.",
    });
  };

  const importProfile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedProfile = JSON.parse(e.target?.result as string);
        setProfile(importedProfile);
        toast({
          title: "Profile Imported",
          description: "Your profile has been imported successfully.",
        });
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "Invalid profile file format.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Professional Settings</h1>
              <p className="text-muted-foreground mt-1">
                Manage your professional context for AI-powered job applications
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <input
                type="file"
                accept=".json"
                onChange={importProfile}
                className="hidden"
                id="import-profile"
              />
              <label htmlFor="import-profile">
                <Button variant="outline" size="sm" className="cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </Button>
              </label>
              
              <Button variant="outline" size="sm" onClick={exportProfile}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              
              <Button 
                onClick={saveProfile} 
                disabled={!hasChanges}
                className="relative"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
                {hasChanges && (
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full"></span>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <ProfileSection 
              data={profile.personal} 
              onChange={(data) => updateProfile('personal', data)} 
            />
          </TabsContent>

          <TabsContent value="experience" className="space-y-6">
            <ExperienceSection 
              data={profile.experience} 
              onChange={(data) => updateProfile('experience', data)} 
            />
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <DocumentsSection 
              data={profile.documents} 
              onChange={(data) => updateProfile('documents', data)} 
            />
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <PreferencesSection 
              data={profile.preferences} 
              onChange={(data) => updateProfile('preferences', data)} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;