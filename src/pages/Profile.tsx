import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Minus, Camera, Save, Star, Award, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const { user } = useAuth();
  const { profiles, skills, createProfile, updateProfile, getProfileByUserId } = useData();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  
  const userProfile = getProfileByUserId(user?.id || '');
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    location: '',
    profilePhoto: '',
    skillsOffered: [] as string[],
    skillsWanted: [] as string[],
    availability: 'Weekdays' as 'Weekdays' | 'Weekends' | 'Evenings' | 'Anytime',
    isPublic: true,
    bio: '',
    projects: [] as string[],
    events: [] as string[],
    rating: 5.0
  });

  const [newProject, setNewProject] = useState('');
  const [newEvent, setNewEvent] = useState('');

  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name,
        location: userProfile.location,
        profilePhoto: userProfile.profilePhoto,
        skillsOffered: userProfile.skillsOffered,
        skillsWanted: userProfile.skillsWanted,
        availability: userProfile.availability,
        isPublic: userProfile.isPublic,
        bio: userProfile.bio || '',
        projects: userProfile.projects || [],
        events: userProfile.events || [],
        rating: userProfile.rating
      });
    }
  }, [userProfile]);

  const handleSkillToggle = (skillName: string, type: 'offered' | 'wanted') => {
    if (type === 'offered') {
      setFormData(prev => ({
        ...prev,
        skillsOffered: prev.skillsOffered.includes(skillName)
          ? prev.skillsOffered.filter(s => s !== skillName)
          : [...prev.skillsOffered, skillName]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        skillsWanted: prev.skillsWanted.includes(skillName)
          ? prev.skillsWanted.filter(s => s !== skillName)
          : [...prev.skillsWanted, skillName]
      }));
    }
  };

  const addProject = () => {
    if (newProject.trim()) {
      setFormData(prev => ({
        ...prev,
        projects: [...prev.projects, newProject.trim()]
      }));
      setNewProject('');
    }
  };

  const removeProject = (index: number) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  const addEvent = () => {
    if (newEvent.trim()) {
      setFormData(prev => ({
        ...prev,
        events: [...prev.events, newEvent.trim()]
      }));
      setNewEvent('');
    }
  };

  const removeEvent = (index: number) => {
    setFormData(prev => ({
      ...prev,
      events: prev.events.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    if (!user) return;

    const profileData = {
      ...formData,
      userId: user.id
    };

    if (userProfile) {
      updateProfile(userProfile.id, profileData);
    } else {
      createProfile(profileData);
    }

    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been saved successfully."
    });
  };

  const getSkillIcon = (skillName: string) => {
    const skill = skills.find(s => s.name === skillName);
    return skill?.icon || '🔧';
  };

  if (!userProfile && !isEditing) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="text-6xl mb-4">👋</div>
          <h1 className="text-3xl font-bold">Welcome to Skill Swap Hub!</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create your profile to start connecting with other skilled professionals and share your expertise.
          </p>
          <Button 
            size="lg" 
            variant="gradient" 
            onClick={() => setIsEditing(true)}
            className="h-14 px-8 text-lg"
          >
            Create My Profile
          </Button>
        </div>
      </Layout>
    );
  }

  if (isEditing) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">
              {userProfile ? 'Edit Profile' : 'Create Profile'}
            </h1>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} className="flex items-center space-x-2">
                <Save className="h-4 w-4" />
                <span>Save Profile</span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Basic Information */}
            <div className="lg:col-span-2">
              <Card className="profile-card">
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        placeholder="City, State/Country"
                        value={formData.location}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="photo">Profile Photo URL</Label>
                    <Input
                      id="photo"
                      placeholder="https://example.com/photo.jpg"
                      value={formData.profilePhoto}
                      onChange={(e) => setFormData(prev => ({ ...prev, profilePhoto: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us about yourself, your experience, and what you're passionate about..."
                      value={formData.bio}
                      onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="availability">Availability</Label>
                    <Select
                      value={formData.availability}
                      onValueChange={(value: any) => setFormData(prev => ({ ...prev, availability: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Weekdays">Weekdays</SelectItem>
                        <SelectItem value="Weekends">Weekends</SelectItem>
                        <SelectItem value="Evenings">Evenings</SelectItem>
                        <SelectItem value="Anytime">Anytime</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="public"
                      checked={formData.isPublic}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPublic: checked }))}
                    />
                    <Label htmlFor="public">Make profile public</Label>
                  </div>
                </CardContent>
              </Card>

              {/* Skills */}
              <Card className="profile-card">
                <CardHeader>
                  <CardTitle>Skills</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-base font-medium">Skills I Can Offer</Label>
                    <p className="text-sm text-muted-foreground mb-3">
                      Select the skills you can teach or help others with
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {skills.map((skill) => (
                        <div key={skill.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`offered-${skill.id}`}
                            checked={formData.skillsOffered.includes(skill.name)}
                            onCheckedChange={() => handleSkillToggle(skill.name, 'offered')}
                          />
                          <Label 
                            htmlFor={`offered-${skill.id}`}
                            className="text-sm cursor-pointer flex items-center space-x-1"
                          >
                            <span>{skill.icon}</span>
                            <span>{skill.name}</span>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-medium">Skills I Want to Learn</Label>
                    <p className="text-sm text-muted-foreground mb-3">
                      Select the skills you'd like to learn or improve
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {skills.map((skill) => (
                        <div key={skill.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`wanted-${skill.id}`}
                            checked={formData.skillsWanted.includes(skill.name)}
                            onCheckedChange={() => handleSkillToggle(skill.name, 'wanted')}
                          />
                          <Label 
                            htmlFor={`wanted-${skill.id}`}
                            className="text-sm cursor-pointer flex items-center space-x-1"
                          >
                            <span>{skill.icon}</span>
                            <span>{skill.name}</span>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Preview & Additional Info */}
            <div className="space-y-6">
              {/* Profile Preview */}
              <Card className="profile-card">
                <CardHeader>
                  <CardTitle>Profile Preview</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <Avatar className="h-24 w-24 mx-auto ring-4 ring-primary/20">
                    <AvatarImage src={formData.profilePhoto} alt={formData.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                      {formData.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{formData.name || 'Your Name'}</h3>
                    <p className="text-sm text-muted-foreground">{formData.location || 'Your Location'}</p>
                  </div>
                  <Badge className={formData.isPublic ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {formData.isPublic ? 'Public Profile' : 'Private Profile'}
                  </Badge>
                </CardContent>
              </Card>

              {/* Projects */}
              <Card className="profile-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="h-5 w-5" />
                    <span>Projects</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {formData.projects.map((project, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                      <span className="text-sm">{project}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeProject(index)}
                        className="h-6 w-6 p-0"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add project"
                      value={newProject}
                      onChange={(e) => setNewProject(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addProject()}
                      className="flex-1"
                    />
                    <Button onClick={addProject} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Events */}
              <Card className="profile-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>Events</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {formData.events.map((event, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                      <span className="text-sm">{event}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEvent(index)}
                        className="h-6 w-6 p-0"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add event"
                      value={newEvent}
                      onChange={(e) => setNewEvent(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addEvent()}
                      className="flex-1"
                    />
                    <Button onClick={addEvent} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // View Mode
  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <Button onClick={() => setIsEditing(true)}>
            Edit Profile
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <Card className="profile-card">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-6">
                  <Avatar className="h-24 w-24 ring-4 ring-primary/20">
                    <AvatarImage src={userProfile.profilePhoto} alt={userProfile.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                      {userProfile.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold">{userProfile.name}</h2>
                    <p className="text-muted-foreground flex items-center">
                      <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {userProfile.location}
                    </p>
                    <div className="flex items-center mt-2">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="font-medium">{userProfile.rating}</span>
                      <Badge className="ml-4" variant={userProfile.isPublic ? 'default' : 'secondary'}>
                        {userProfile.isPublic ? 'Public' : 'Private'}
                      </Badge>
                    </div>
                  </div>
                </div>
                {userProfile.bio && (
                  <div className="mt-6">
                    <p className="text-muted-foreground">{userProfile.bio}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Skills */}
            <Card className="profile-card">
              <CardHeader>
                <CardTitle>Skills</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Skills I Offer</h4>
                  <div className="flex flex-wrap gap-2">
                    {userProfile.skillsOffered.map((skill) => (
                      <Badge key={skill} className="skill-tag">
                        {getSkillIcon(skill)} {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Skills I Want to Learn</h4>
                  <div className="flex flex-wrap gap-2">
                    {userProfile.skillsWanted.map((skill) => (
                      <Badge key={skill} variant="outline">
                        {getSkillIcon(skill)} {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Projects */}
            {userProfile.projects && userProfile.projects.length > 0 && (
              <Card className="profile-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="h-5 w-5" />
                    <span>Projects</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {userProfile.projects.map((project, index) => (
                      <div key={index} className="p-3 bg-muted rounded-lg">
                        <span className="text-sm font-medium">{project}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Events */}
            {userProfile.events && userProfile.events.length > 0 && (
              <Card className="profile-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>Events</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {userProfile.events.map((event, index) => (
                      <div key={index} className="p-3 bg-muted rounded-lg">
                        <span className="text-sm font-medium">{event}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Availability */}
            <Card className="profile-card">
              <CardHeader>
                <CardTitle>Availability</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge className="availability-badge bg-primary text-primary-foreground">
                  {userProfile.availability}
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;