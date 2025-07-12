import { useParams, Link } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, MapPin, Star, Award, Calendar, ArrowLeft } from 'lucide-react';

const ProfileDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { profiles, skills } = useData();
  const { user } = useAuth();

  const profile = profiles.find(p => p.id === id);

  if (!profile) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold mb-2">Profile Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The profile you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  if (!profile.isPublic && profile.userId !== user?.id) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold mb-2">Private Profile</h1>
          <p className="text-muted-foreground mb-6">
            This profile is set to private and cannot be viewed.
          </p>
          <Button asChild>
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const getSkillIcon = (skillName: string) => {
    const skill = skills.find(s => s.name === skillName);
    return skill?.icon || '🔧';
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'Weekdays': return 'bg-availability-weekdays text-white';
      case 'Weekends': return 'bg-availability-weekends text-white';
      case 'Evenings': return 'bg-availability-evenings text-white';
      case 'Anytime': return 'bg-availability-anytime text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Profiles</span>
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <Card className="profile-card">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
                  <Avatar className="h-32 w-32 ring-4 ring-primary/20 mx-auto md:mx-0">
                    <AvatarImage src={profile.profilePhoto} alt={profile.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                      {profile.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-center md:text-left">
                    <h1 className="text-3xl font-bold">{profile.name}</h1>
                    <div className="flex items-center justify-center md:justify-start text-muted-foreground mt-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{profile.location}</span>
                    </div>
                    <div className="flex items-center justify-center md:justify-start mt-2">
                      <Star className="h-5 w-5 text-yellow-500 mr-1" />
                      <span className="font-medium text-lg">{profile.rating}</span>
                      <span className="text-muted-foreground ml-1">rating</span>
                    </div>
                    <Badge 
                      className={`mt-3 availability-badge ${getAvailabilityColor(profile.availability)}`}
                    >
                      Available {profile.availability}
                    </Badge>
                  </div>
                </div>
                
                {profile.bio && (
                  <div className="mt-6 p-4 bg-muted rounded-lg">
                    <p className="text-muted-foreground leading-relaxed">{profile.bio}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Skills Section */}
            <Card className="profile-card">
              <CardHeader>
                <CardTitle>Skills & Expertise</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-primary">Skills I Can Offer</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skillsOffered.map((skill) => (
                      <Badge key={skill} className="skill-tag text-sm py-2">
                        {getSkillIcon(skill)} {skill}
                      </Badge>
                    ))}
                  </div>
                  {profile.skillsOffered.length === 0 && (
                    <p className="text-muted-foreground">No skills offered yet.</p>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3 text-secondary">Skills I Want to Learn</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skillsWanted.map((skill) => (
                      <Badge key={skill} variant="outline" className="text-sm py-2">
                        {getSkillIcon(skill)} {skill}
                      </Badge>
                    ))}
                  </div>
                  {profile.skillsWanted.length === 0 && (
                    <p className="text-muted-foreground">Not looking to learn any specific skills at the moment.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Connect Section */}
            {profile.userId !== user?.id && (
              <Card className="profile-card gradient-primary text-white">
                <CardContent className="pt-6 text-center">
                  <h3 className="text-xl font-semibold mb-2">Ready to Connect?</h3>
                  <p className="mb-4 opacity-90">
                    Send a swap request to start learning from {profile.name.split(' ')[0]}
                  </p>
                  <Button 
                    asChild 
                    variant="secondary" 
                    size="lg"
                    className="bg-white text-primary hover:bg-white/90"
                  >
                    <Link to={`/swap-request?recipient=${profile.id}`}>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Send Swap Request
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Projects */}
            {profile.projects && profile.projects.length > 0 && (
              <Card className="profile-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-primary" />
                    <span>Featured Projects</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {profile.projects.map((project, index) => (
                      <div key={index} className="p-3 bg-muted rounded-lg border-l-4 border-primary">
                        <h4 className="font-medium text-sm">{project}</h4>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Events */}
            {profile.events && profile.events.length > 0 && (
              <Card className="profile-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-secondary" />
                    <span>Events & Conferences</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {profile.events.map((event, index) => (
                      <div key={index} className="p-3 bg-muted rounded-lg border-l-4 border-secondary">
                        <h4 className="font-medium text-sm">{event}</h4>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Stats */}
            <Card className="profile-card">
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Skills Offered</span>
                  <span className="font-semibold">{profile.skillsOffered.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Skills Wanted</span>
                  <span className="font-semibold">{profile.skillsWanted.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Rating</span>
                  <div className="flex items-center">
                    <Star className="h-3 w-3 text-yellow-500 mr-1" />
                    <span className="font-semibold">{profile.rating}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Projects</span>
                  <span className="font-semibold">{profile.projects?.length || 0}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfileDetail;