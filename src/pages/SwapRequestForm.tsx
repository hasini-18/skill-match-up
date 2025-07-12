import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Send, ArrowLeft, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SwapRequestForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { profiles, skills, createSwapRequest, getProfileByUserId } = useData();
  const { user } = useAuth();
  const { toast } = useToast();

  const recipientId = searchParams.get('recipient');
  const recipientProfile = profiles.find(p => p.id === recipientId);
  const userProfile = getProfileByUserId(user?.id || '');

  const [formData, setFormData] = useState({
    skillOffered: '',
    skillWanted: '',
    message: ''
  });

  useEffect(() => {
    if (!userProfile) {
      toast({
        title: "Profile Required",
        description: "Please create your profile before sending swap requests.",
        variant: "destructive"
      });
      navigate('/profile');
    }
  }, [userProfile, navigate, toast]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!userProfile || !recipientProfile) {
      toast({
        title: "Error",
        description: "Invalid request setup.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.skillOffered || !formData.skillWanted || !formData.message.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields.",
        variant: "destructive"
      });
      return;
    }

    createSwapRequest({
      requesterId: userProfile.id,
      recipientId: recipientProfile.id,
      skillOffered: formData.skillOffered,
      skillWanted: formData.skillWanted,
      message: formData.message,
      status: 'Pending'
    });

    toast({
      title: "Request Sent!",
      description: `Your swap request has been sent to ${recipientProfile.name}.`
    });

    navigate('/my-swaps');
  };

  const getSkillIcon = (skillName: string) => {
    const skill = skills.find(s => s.name === skillName);
    return skill?.icon || '🔧';
  };

  if (!userProfile) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="text-6xl mb-4">👋</div>
          <h1 className="text-3xl font-bold">Profile Required</h1>
          <p className="text-xl text-muted-foreground">
            You need to create your profile before sending swap requests.
          </p>
          <Button asChild size="lg">
            <Link to="/profile">
              <User className="h-4 w-4 mr-2" />
              Create Profile
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  if (!recipientProfile) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-3xl font-bold">Invalid Request</h1>
          <p className="text-xl text-muted-foreground">
            The profile you're trying to connect with was not found.
          </p>
          <Button asChild size="lg">
            <Link to="/">
              Back to Home
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-4">
          <Link to={`/profile/${recipientProfile.id}`} className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Profile</span>
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="profile-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Send className="h-5 w-5" />
                  <span>Send Swap Request</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="skillOffered">Skill I Can Offer</Label>
                    <Select
                      value={formData.skillOffered}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, skillOffered: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a skill you can teach" />
                      </SelectTrigger>
                      <SelectContent>
                        {userProfile.skillsOffered.map((skill) => (
                          <SelectItem key={skill} value={skill}>
                            <div className="flex items-center space-x-2">
                              <span>{getSkillIcon(skill)}</span>
                              <span>{skill}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {userProfile.skillsOffered.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        You need to add skills you can offer to your profile first.
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="skillWanted">Skill I Want to Learn</Label>
                    <Select
                      value={formData.skillWanted}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, skillWanted: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a skill they can teach you" />
                      </SelectTrigger>
                      <SelectContent>
                        {recipientProfile.skillsOffered.map((skill) => (
                          <SelectItem key={skill} value={skill}>
                            <div className="flex items-center space-x-2">
                              <span>{getSkillIcon(skill)}</span>
                              <span>{skill}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Personal Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Introduce yourself and explain why you'd like to connect. What specific aspects of their skill interest you? What can you offer in return?"
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      rows={6}
                      className="resize-none"
                    />
                    <p className="text-sm text-muted-foreground">
                      A thoughtful message increases your chances of acceptance.
                    </p>
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate(-1)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={!formData.skillOffered || !formData.skillWanted || !formData.message.trim()}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send Request
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recipient Profile */}
            <Card className="profile-card">
              <CardHeader>
                <CardTitle>Connecting With</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <Avatar className="h-20 w-20 mx-auto mb-3 ring-2 ring-primary/20">
                    <AvatarImage src={recipientProfile.profilePhoto} alt={recipientProfile.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                      {recipientProfile.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold text-lg">{recipientProfile.name}</h3>
                  <p className="text-sm text-muted-foreground">{recipientProfile.location}</p>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2">Available Skills</h4>
                  <div className="flex flex-wrap gap-1">
                    {recipientProfile.skillsOffered.slice(0, 4).map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {getSkillIcon(skill)} {skill}
                      </Badge>
                    ))}
                    {recipientProfile.skillsOffered.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{recipientProfile.skillsOffered.length - 4}
                      </Badge>
                    )}
                  </div>
                </div>

                <Button asChild variant="outline" className="w-full">
                  <Link to={`/profile/${recipientProfile.id}`}>
                    View Full Profile
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Your Skills */}
            <Card className="profile-card">
              <CardHeader>
                <CardTitle>Your Skills</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm mb-2">Skills You Offer</h4>
                  <div className="flex flex-wrap gap-1">
                    {userProfile.skillsOffered.map((skill) => (
                      <Badge key={skill} className="skill-tag text-xs">
                        {getSkillIcon(skill)} {skill}
                      </Badge>
                    ))}
                  </div>
                  {userProfile.skillsOffered.length === 0 && (
                    <p className="text-xs text-muted-foreground">
                      No skills added yet.
                    </p>
                  )}
                </div>

                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link to="/profile">
                    Update Skills
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="profile-card bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-primary">💡 Tips for Success</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>• Be specific about what you want to learn</p>
                <p>• Explain how your skills can help them</p>
                <p>• Suggest a timeline or format</p>
                <p>• Be genuine and enthusiastic</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SwapRequestForm;