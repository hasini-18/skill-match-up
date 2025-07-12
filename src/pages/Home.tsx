import { useState, useMemo } from 'react';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, MessageSquare, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const { profiles, skills } = useData();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  // Filter public profiles and exclude current user
  const publicProfiles = useMemo(() => {
    return profiles.filter(profile => 
      profile.isPublic && 
      profile.userId !== user?.id &&
      (searchTerm === '' || 
       profile.skillsOffered.some(skill => 
         skill.toLowerCase().includes(searchTerm.toLowerCase())
       ) ||
       profile.skillsWanted.some(skill => 
         skill.toLowerCase().includes(searchTerm.toLowerCase())
       ) ||
       profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       profile.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [profiles, user?.id, searchTerm]);

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
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold gradient-hero bg-clip-text text-transparent">
            Discover Amazing Skills
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect with skilled professionals, share your expertise, and learn something new
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by skills, name, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="profile-card text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-primary">{publicProfiles.length}</div>
              <div className="text-sm text-muted-foreground">Active Profiles</div>
            </CardContent>
          </Card>
          <Card className="profile-card text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-secondary">{skills.length}</div>
              <div className="text-sm text-muted-foreground">Available Skills</div>
            </CardContent>
          </Card>
          <Card className="profile-card text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-accent">100+</div>
              <div className="text-sm text-muted-foreground">Successful Swaps</div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publicProfiles.map((profile) => (
            <Card key={profile.id} className="profile-card group">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16 ring-2 ring-primary/20">
                    <AvatarImage src={profile.profilePhoto} alt={profile.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                      {profile.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{profile.name}</h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3 mr-1" />
                      {profile.location}
                    </div>
                    <div className="flex items-center mt-1">
                      <Star className="h-3 w-3 text-yellow-500 mr-1" />
                      <span className="text-sm font-medium">{profile.rating}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Skills Offered</p>
                  <div className="flex flex-wrap gap-1">
                    {profile.skillsOffered.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="secondary" className="skill-tag text-xs">
                        {getSkillIcon(skill)} {skill}
                      </Badge>
                    ))}
                    {profile.skillsOffered.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{profile.skillsOffered.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Looking For</p>
                  <div className="flex flex-wrap gap-1">
                    {profile.skillsWanted.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {getSkillIcon(skill)} {skill}
                      </Badge>
                    ))}
                    {profile.skillsWanted.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{profile.skillsWanted.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Badge className={`availability-badge ${getAvailabilityColor(profile.availability)}`}>
                    {profile.availability}
                  </Badge>
                  <div className="flex space-x-2">
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/profile/${profile.id}`}>
                        View Profile
                      </Link>
                    </Button>
                    <Button asChild size="sm">
                      <Link to={`/swap-request?recipient=${profile.id}`}>
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Connect
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {publicProfiles.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold mb-2">No profiles found</h3>
            <p className="text-muted-foreground">
              {searchTerm 
                ? "Try adjusting your search terms or browse all profiles"
                : "No public profiles available at the moment"
              }
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Home;