import { useState, useEffect } from 'react';
import { useAddProject, useAddDistrict, useAddAnnouncement, useGetAllProjects, useGetAllDistricts, useUpdateProject } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Loader2, Plus, Edit, LogOut, Shield } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';
import { ProjectStatus, type Project, type District, type Announcement } from '../backend';
import AdminLoginModal from '../components/AdminLoginModal';
import { Badge } from '@/components/ui/badge';

export default function AdminDashboardPage() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  const { data: projects = [], isLoading: projectsLoading } = useGetAllProjects();
  const { data: districts = [], isLoading: districtsLoading } = useGetAllDistricts();

  const addProject = useAddProject();
  const updateProject = useUpdateProject();
  const addDistrict = useAddDistrict();
  const addAnnouncement = useAddAnnouncement();

  const [projectForm, setProjectForm] = useState({
    name: '',
    description: '',
    municipality: 'Quezon City',
    district: '',
    category: '',
    startDate: '',
    endDate: '',
    officialInCharge: '',
    status: ProjectStatus.planned,
    budget: '',
  });

  const [districtForm, setDistrictForm] = useState({
    name: '',
    overview: '',
    barangays: '',
  });

  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    content: '',
  });

  const [editingProject, setEditingProject] = useState<Project | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const adminStatus = localStorage.getItem('adminLoggedIn');
      const loginTime = localStorage.getItem('adminLoginTime');
      
      // Check if logged in and session is valid (within 24 hours)
      if (adminStatus === 'true' && loginTime) {
        const timeSinceLogin = Date.now() - parseInt(loginTime);
        const twentyFourHours = 24 * 60 * 60 * 1000;
        
        if (timeSinceLogin < twentyFourHours) {
          setIsAdminLoggedIn(true);
          setShowLoginModal(false);
        } else {
          // Session expired
          localStorage.removeItem('adminLoggedIn');
          localStorage.removeItem('adminLoginTime');
          setIsAdminLoggedIn(false);
          setShowLoginModal(true);
        }
      } else {
        setIsAdminLoggedIn(false);
        setShowLoginModal(true);
      }
      setIsCheckingAuth(false);
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminLoginTime');
    setIsAdminLoggedIn(false);
    setShowLoginModal(true);
    toast.success('Logged out successfully');
  };

  const handleLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    setShowLoginModal(false);
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!projectForm.name || !projectForm.district || !projectForm.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const now = BigInt(Date.now() * 1000000);
      const budgetTotal = projectForm.budget ? parseFloat(projectForm.budget) : 0;

      const project: Project = {
        id: `project-${Date.now()}`,
        name: projectForm.name,
        description: projectForm.description,
        municipality: projectForm.municipality,
        district: projectForm.district,
        category: projectForm.category,
        startDate: BigInt(new Date(projectForm.startDate || Date.now()).getTime() * 1000000),
        endDate: BigInt(new Date(projectForm.endDate || Date.now()).getTime() * 1000000),
        progress: 0,
        status: projectForm.status,
        officialInCharge: projectForm.officialInCharge,
        milestones: [],
        attachments: [],
        createdAt: now,
        updatedAt: now,
        budget: {
          total: budgetTotal,
          breakdown: [],
        },
        thumbnail: undefined,
      };

      await addProject.mutateAsync(project);
      toast.success('Project added successfully!');
      setProjectForm({
        name: '',
        description: '',
        municipality: 'Quezon City',
        district: '',
        category: '',
        startDate: '',
        endDate: '',
        officialInCharge: '',
        status: ProjectStatus.planned,
        budget: '',
      });
    } catch (error) {
      console.error('Add project error:', error);
      toast.error('Failed to add project');
    }
  };

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingProject) return;

    try {
      const updatedProject: Project = {
        ...editingProject,
        name: projectForm.name,
        description: projectForm.description,
        district: projectForm.district,
        category: projectForm.category,
        startDate: BigInt(new Date(projectForm.startDate).getTime() * 1000000),
        endDate: BigInt(new Date(projectForm.endDate).getTime() * 1000000),
        status: projectForm.status,
        officialInCharge: projectForm.officialInCharge,
        budget: {
          ...editingProject.budget,
          total: projectForm.budget ? parseFloat(projectForm.budget) : editingProject.budget.total,
        },
        updatedAt: BigInt(Date.now() * 1000000),
      };

      await updateProject.mutateAsync(updatedProject);
      toast.success('Project updated successfully!');
      setEditingProject(null);
      setProjectForm({
        name: '',
        description: '',
        municipality: 'Quezon City',
        district: '',
        category: '',
        startDate: '',
        endDate: '',
        officialInCharge: '',
        status: ProjectStatus.planned,
        budget: '',
      });
    } catch (error) {
      console.error('Update project error:', error);
      toast.error('Failed to update project');
    }
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setProjectForm({
      name: project.name,
      description: project.description,
      municipality: project.municipality,
      district: project.district,
      category: project.category,
      startDate: new Date(Number(project.startDate) / 1000000).toISOString().split('T')[0],
      endDate: new Date(Number(project.endDate) / 1000000).toISOString().split('T')[0],
      officialInCharge: project.officialInCharge,
      status: project.status,
      budget: project.budget.total.toString(),
    });
  };

  const handleAddDistrict = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!districtForm.name) {
      toast.error('Please enter a district name');
      return;
    }

    try {
      const barangayList = districtForm.barangays
        .split('\n')
        .filter(line => line.trim())
        .map(line => {
          const parts = line.split('|').map(p => p.trim());
          return {
            name: parts[0] || '',
            landmarkNotes: parts[1] || '',
          };
        });

      const district: District = {
        id: `district-${Date.now()}`,
        name: districtForm.name,
        projects: [],
        activeProjects: BigInt(0),
        completedProjects: BigInt(0),
        coverImage: undefined,
        logo: undefined,
        budgetSummary: {
          totalBudget: 0,
          spent: 0,
          remaining: 0,
        },
        overview: districtForm.overview || '',
        barangays: barangayList,
      };

      await addDistrict.mutateAsync(district);
      toast.success('District added successfully!');
      setDistrictForm({ name: '', overview: '', barangays: '' });
    } catch (error) {
      console.error('Add district error:', error);
      toast.error('Failed to add district');
    }
  };

  const handleAddAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!announcementForm.title || !announcementForm.content) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const announcement: Announcement = {
        id: `announcement-${Date.now()}`,
        title: announcementForm.title,
        content: announcementForm.content,
        date: BigInt(Date.now() * 1000000),
      };

      await addAnnouncement.mutateAsync(announcement);
      toast.success('Announcement published successfully!');
      setAnnouncementForm({ title: '', content: '' });
    } catch (error) {
      console.error('Add announcement error:', error);
      toast.error('Failed to publish announcement');
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Checking authentication...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdminLoggedIn) {
    return (
      <>
        <AdminLoginModal
          open={showLoginModal}
          onOpenChange={setShowLoginModal}
          onLoginSuccess={handleLoginSuccess}
        />
        <div className="container py-8">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Authentication Required</AlertTitle>
            <AlertDescription>
              Please log in with admin credentials to access the Bantay Bayan dashboard.
            </AlertDescription>
          </Alert>
        </div>
      </>
    );
  }

  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Bantay Bayan Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage projects, districts, and announcements
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>

      <Tabs defaultValue="projects" className="space-y-6">
        <TabsList>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="districts">Districts</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{editingProject ? 'Edit Project' : 'Add New Project'}</CardTitle>
              <CardDescription>
                {editingProject ? 'Update project information' : 'Create a new municipal project'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={editingProject ? handleUpdateProject : handleAddProject} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="project-name">Project Name *</Label>
                    <Input
                      id="project-name"
                      value={projectForm.name}
                      onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="project-category">Category *</Label>
                    <Input
                      id="project-category"
                      value={projectForm.category}
                      onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                      placeholder="e.g., Infrastructure, Education"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="project-district">District *</Label>
                    <Select
                      value={projectForm.district}
                      onValueChange={(value) => setProjectForm({ ...projectForm, district: value })}
                    >
                      <SelectTrigger id="project-district">
                        <SelectValue placeholder="Select district" />
                      </SelectTrigger>
                      <SelectContent>
                        {districtsLoading ? (
                          <SelectItem value="loading" disabled>Loading districts...</SelectItem>
                        ) : districts.length === 0 ? (
                          <SelectItem value="none" disabled>No districts available</SelectItem>
                        ) : (
                          districts.map((district) => (
                            <SelectItem key={district.id} value={district.name}>
                              {district.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="project-status">Status</Label>
                    <Select
                      value={projectForm.status}
                      onValueChange={(value) => setProjectForm({ ...projectForm, status: value as ProjectStatus })}
                    >
                      <SelectTrigger id="project-status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={ProjectStatus.planned}>Planned</SelectItem>
                        <SelectItem value={ProjectStatus.active}>Active</SelectItem>
                        <SelectItem value={ProjectStatus.completed}>Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="project-start">Start Date</Label>
                    <Input
                      id="project-start"
                      type="date"
                      value={projectForm.startDate}
                      onChange={(e) => setProjectForm({ ...projectForm, startDate: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="project-end">End Date</Label>
                    <Input
                      id="project-end"
                      type="date"
                      value={projectForm.endDate}
                      onChange={(e) => setProjectForm({ ...projectForm, endDate: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="project-budget">Budget (PHP)</Label>
                    <Input
                      id="project-budget"
                      type="number"
                      value={projectForm.budget}
                      onChange={(e) => setProjectForm({ ...projectForm, budget: e.target.value })}
                      placeholder="0"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="project-official">Official in Charge</Label>
                    <Input
                      id="project-official"
                      value={projectForm.officialInCharge}
                      onChange={(e) => setProjectForm({ ...projectForm, officialInCharge: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="project-description">Description</Label>
                  <Textarea
                    id="project-description"
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                    rows={4}
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={addProject.isPending || updateProject.isPending}>
                    {(addProject.isPending || updateProject.isPending) ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {editingProject ? 'Updating...' : 'Adding...'}
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        {editingProject ? 'Update Project' : 'Add Project'}
                      </>
                    )}
                  </Button>
                  {editingProject && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setEditingProject(null);
                        setProjectForm({
                          name: '',
                          description: '',
                          municipality: 'Quezon City',
                          district: '',
                          category: '',
                          startDate: '',
                          endDate: '',
                          officialInCharge: '',
                          status: ProjectStatus.planned,
                          budget: '',
                        });
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Existing Projects</CardTitle>
              <CardDescription>
                {projectsLoading ? 'Loading...' : `${projects.length} projects registered`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {projectsLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : projects.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No projects added yet
                </p>
              ) : (
                <div className="space-y-2">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{project.name}</span>
                          <Badge variant="outline">{project.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {project.district} • {project.category}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditProject(project)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="districts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add New District</CardTitle>
              <CardDescription>Create a new district/municipality with barangay information</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddDistrict} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="district-name">District Name *</Label>
                  <Input
                    id="district-name"
                    value={districtForm.name}
                    onChange={(e) => setDistrictForm({ ...districtForm, name: e.target.value })}
                    placeholder="e.g., 1st District, 2nd District"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="district-overview">Overview</Label>
                  <Textarea
                    id="district-overview"
                    value={districtForm.overview}
                    onChange={(e) => setDistrictForm({ ...districtForm, overview: e.target.value })}
                    placeholder="Brief description of the district"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="district-barangays">Barangays (one per line)</Label>
                  <Textarea
                    id="district-barangays"
                    value={districtForm.barangays}
                    onChange={(e) => setDistrictForm({ ...districtForm, barangays: e.target.value })}
                    placeholder="Format: Barangay Name | Landmark Notes&#10;Example:&#10;Alicia | Near Araneta Center&#10;Amihan | Residential area near Cubao"
                    rows={8}
                  />
                  <p className="text-xs text-muted-foreground">
                    Use format: Barangay Name | Landmark Notes (one per line)
                  </p>
                </div>

                <Button type="submit" disabled={addDistrict.isPending}>
                  {addDistrict.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Add District
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Existing Districts</CardTitle>
              <CardDescription>
                {districtsLoading ? 'Loading...' : `${districts.length} districts registered`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {districtsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-32 w-full" />
                  ))}
                </div>
              ) : districts.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No districts added yet
                </p>
              ) : (
                <div className="space-y-4">
                  {districts.map((district) => (
                    <div
                      key={district.id}
                      className="p-4 border rounded-lg space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-lg">{district.name}</span>
                        <Badge variant="secondary">{district.barangays.length} barangays</Badge>
                      </div>
                      {district.overview && (
                        <p className="text-sm text-muted-foreground">{district.overview}</p>
                      )}
                      {district.barangays.length > 0 && (
                        <div className="pt-2 border-t">
                          <p className="text-xs font-medium text-muted-foreground mb-2">Barangays:</p>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {district.barangays.slice(0, 6).map((barangay, idx) => (
                              <div key={idx} className="text-xs">
                                <span className="font-medium">{barangay.name}</span>
                                {barangay.landmarkNotes && (
                                  <span className="text-muted-foreground"> • {barangay.landmarkNotes}</span>
                                )}
                              </div>
                            ))}
                            {district.barangays.length > 6 && (
                              <div className="text-xs text-muted-foreground">
                                +{district.barangays.length - 6} more
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="announcements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Publish Announcement</CardTitle>
              <CardDescription>Share project updates with citizens</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddAnnouncement} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="announcement-title">Title *</Label>
                  <Input
                    id="announcement-title"
                    value={announcementForm.title}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="announcement-content">Content *</Label>
                  <Textarea
                    id="announcement-content"
                    value={announcementForm.content}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e.target.value })}
                    rows={6}
                    required
                  />
                </div>

                <Button type="submit" disabled={addAnnouncement.isPending}>
                  {addAnnouncement.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Publish Announcement
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
