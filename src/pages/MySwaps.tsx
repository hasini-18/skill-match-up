import { useState, useMemo } from 'react';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { 
  Check, 
  X, 
  Trash2, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Star,
  User
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const MySwaps = () => {
  const { swapRequests, profiles, skills, updateSwapRequest, deleteSwapRequest, getProfileByUserId } = useData();
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('sent');

  const userProfile = getProfileByUserId(user?.id || '');

  const sentRequests = useMemo(() => {
    if (!userProfile) return [];
    return swapRequests.filter(request => request.requesterId === userProfile.id);
  }, [swapRequests, userProfile]);

  const receivedRequests = useMemo(() => {
    if (!userProfile) return [];
    return swapRequests.filter(request => request.recipientId === userProfile.id);
  }, [swapRequests, userProfile]);

  const getProfile = (profileId: string) => {
    return profiles.find(p => p.id === profileId);
  };

  const getSkillIcon = (skillName: string) => {
    const skill = skills.find(s => s.name === skillName);
    return skill?.icon || '🔧';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'status-pending';
      case 'Accepted': return 'status-accepted';
      case 'Rejected': return 'status-rejected';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return <Clock className="h-3 w-3" />;
      case 'Accepted': return <CheckCircle className="h-3 w-3" />;
      case 'Rejected': return <XCircle className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  const handleAccept = (requestId: string) => {
    updateSwapRequest(requestId, { status: 'Accepted' });
    toast({
      title: "Request Accepted",
      description: "The swap request has been accepted. You can now start collaborating!"
    });
  };

  const handleReject = (requestId: string) => {
    updateSwapRequest(requestId, { status: 'Rejected' });
    toast({
      title: "Request Rejected",
      description: "The swap request has been declined."
    });
  };

  const handleDelete = (requestId: string) => {
    deleteSwapRequest(requestId);
    toast({
      title: "Request Deleted",
      description: "The swap request has been removed."
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (!userProfile) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="text-6xl mb-4">👋</div>
          <h1 className="text-3xl font-bold">Profile Required</h1>
          <p className="text-xl text-muted-foreground">
            You need to create your profile to view and manage swap requests.
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

  const renderRequestCard = (request: any, type: 'sent' | 'received') => {
    const otherProfile = type === 'sent' 
      ? getProfile(request.recipientId) 
      : getProfile(request.requesterId);

    if (!otherProfile) return null;

    return (
      <Card key={request.id} className="profile-card">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-4">
            <Avatar className="h-12 w-12 ring-2 ring-primary/20">
              <AvatarImage src={otherProfile.profilePhoto} alt={otherProfile.name} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {otherProfile.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{otherProfile.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {type === 'sent' ? 'Request sent to' : 'Request from'} • {formatDate(request.createdAt)}
                  </p>
                </div>
                <Badge className={`${getStatusColor(request.status)} flex items-center space-x-1`}>
                  {getStatusIcon(request.status)}
                  <span>{request.status}</span>
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    {type === 'sent' ? 'I can offer:' : 'They can offer:'}
                  </p>
                  <Badge className="skill-tag">
                    {getSkillIcon(request.skillOffered)} {request.skillOffered}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    {type === 'sent' ? 'I want to learn:' : 'They want to learn:'}
                  </p>
                  <Badge variant="outline">
                    {getSkillIcon(request.skillWanted)} {request.skillWanted}
                  </Badge>
                </div>
              </div>

              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm">{request.message}</p>
              </div>

              <div className="flex justify-between items-center pt-2">
                <Button asChild variant="outline" size="sm">
                  <Link to={`/profile/${otherProfile.id}`}>
                    View Profile
                  </Link>
                </Button>

                <div className="flex space-x-2">
                  {type === 'received' && request.status === 'Pending' && (
                    <>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleReject(request.id)}
                      >
                        <X className="h-3 w-3 mr-1" />
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleAccept(request.id)}
                      >
                        <Check className="h-3 w-3 mr-1" />
                        Accept
                      </Button>
                    </>
                  )}

                  {type === 'sent' && request.status === 'Pending' && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Request</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this swap request? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(request.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">My Skill Swaps</h1>
          <p className="text-muted-foreground">
            Manage your swap requests and build your professional network
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="profile-card text-center">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-primary">{sentRequests.length}</div>
              <div className="text-xs text-muted-foreground">Sent</div>
            </CardContent>
          </Card>
          <Card className="profile-card text-center">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-secondary">{receivedRequests.length}</div>
              <div className="text-xs text-muted-foreground">Received</div>
            </CardContent>
          </Card>
          <Card className="profile-card text-center">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-green-600">
                {[...sentRequests, ...receivedRequests].filter(r => r.status === 'Accepted').length}
              </div>
              <div className="text-xs text-muted-foreground">Accepted</div>
            </CardContent>
          </Card>
          <Card className="profile-card text-center">
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-yellow-600">
                {[...sentRequests, ...receivedRequests].filter(r => r.status === 'Pending').length}
              </div>
              <div className="text-xs text-muted-foreground">Pending</div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sent" className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span>Requests Sent ({sentRequests.length})</span>
            </TabsTrigger>
            <TabsTrigger value="received" className="flex items-center space-x-2">
              <Star className="h-4 w-4" />
              <span>Requests Received ({receivedRequests.length})</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sent" className="space-y-4 mt-6">
            {sentRequests.length > 0 ? (
              sentRequests.map(request => renderRequestCard(request, 'sent'))
            ) : (
              <Card className="profile-card">
                <CardContent className="pt-6 text-center space-y-4">
                  <div className="text-4xl">📤</div>
                  <h3 className="text-lg font-semibold">No Requests Sent</h3>
                  <p className="text-muted-foreground">
                    Start connecting with skilled professionals to expand your network.
                  </p>
                  <Button asChild>
                    <Link to="/">
                      Explore Profiles
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="received" className="space-y-4 mt-6">
            {receivedRequests.length > 0 ? (
              receivedRequests.map(request => renderRequestCard(request, 'received'))
            ) : (
              <Card className="profile-card">
                <CardContent className="pt-6 text-center space-y-4">
                  <div className="text-4xl">📥</div>
                  <h3 className="text-lg font-semibold">No Requests Received</h3>
                  <p className="text-muted-foreground">
                    Make sure your profile is public to receive swap requests from others.
                  </p>
                  <Button asChild>
                    <Link to="/profile">
                      Update Profile
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default MySwaps;