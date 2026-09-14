import { useState, useMemo } from 'react';
import { useGetAllProjects } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, CheckCircle2, Clock, Target } from 'lucide-react';
import { ProjectStatus } from '../backend';

export default function ProjectProgressPage() {
  const { data: projects = [], isLoading } = useGetAllProjects();
  const [districtFilter, setDistrictFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [yearFilter, setYearFilter] = useState<string>('all');

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesDistrict = districtFilter === 'all' || project.district === districtFilter;
      const matchesCategory = categoryFilter === 'all' || project.category === categoryFilter;
      
      if (yearFilter !== 'all') {
        const projectYear = new Date(Number(project.startDate) / 1000000).getFullYear();
        const matchesYear = projectYear.toString() === yearFilter;
        return matchesDistrict && matchesCategory && matchesYear;
      }
      
      return matchesDistrict && matchesCategory;
    });
  }, [projects, districtFilter, categoryFilter, yearFilter]);

  const districts = useMemo(() => {
    const uniqueDistricts = [...new Set(projects.map((p) => p.district))];
    return uniqueDistricts.sort();
  }, [projects]);

  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(projects.map((p) => p.category))];
    return uniqueCategories.sort();
  }, [projects]);

  const years = useMemo(() => {
    const uniqueYears = [...new Set(projects.map((p) => {
      return new Date(Number(p.startDate) / 1000000).getFullYear().toString();
    }))];
    return uniqueYears.sort().reverse();
  }, [projects]);

  const totalProjects = filteredProjects.length;
  const activeProjects = filteredProjects.filter((p) => p.status === ProjectStatus.active).length;
  const completedProjects = filteredProjects.filter((p) => p.status === ProjectStatus.completed).length;
  const averageProgress = totalProjects > 0 
    ? filteredProjects.reduce((sum, p) => sum + p.progress, 0) / totalProjects 
    : 0;

  const progressByDistrict = useMemo(() => {
    const districtMap = new Map<string, { total: number; completed: number; avgProgress: number }>();
    filteredProjects.forEach((project) => {
      const current = districtMap.get(project.district) || { total: 0, completed: 0, avgProgress: 0 };
      districtMap.set(project.district, {
        total: current.total + 1,
        completed: current.completed + (project.status === ProjectStatus.completed ? 1 : 0),
        avgProgress: current.avgProgress + project.progress,
      });
    });
    return Array.from(districtMap.entries())
      .map(([name, data]) => ({ 
        name, 
        total: data.total,
        completed: data.completed,
        avgProgress: data.avgProgress / data.total,
        completionRate: (data.completed / data.total) * 100
      }))
      .sort((a, b) => b.total - a.total);
  }, [filteredProjects]);

  const projectsByCategory = useMemo(() => {
    const categoryMap = new Map<string, number>();
    filteredProjects.forEach((project) => {
      const current = categoryMap.get(project.category) || 0;
      categoryMap.set(project.category, current + 1);
    });
    return Array.from(categoryMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filteredProjects]);

  const projectsByStatus = useMemo(() => {
    const statusMap = new Map<string, number>();
    filteredProjects.forEach((project) => {
      const current = statusMap.get(project.status) || 0;
      statusMap.set(project.status, current + 1);
    });
    return Array.from(statusMap.entries()).map(([name, value]) => ({ name, value }));
  }, [filteredProjects]);

  const COLORS = ['oklch(0.55 0.18 240)', 'oklch(0.65 0.16 150)', 'oklch(0.6 0.2 30)', 'oklch(0.5 0.18 280)', 'oklch(0.58 0.19 340)'];

  if (isLoading) {
    return (
      <div className="container py-8 space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-40" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Project Progress Tracker</h1>
        <p className="text-muted-foreground">
          Visualize and analyze project completion and progress across districts
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Select value={districtFilter} onValueChange={setDistrictFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Districts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Districts</SelectItem>
                {districts.map((district) => (
                  <SelectItem key={district} value={district}>
                    {district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Years" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProjects}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Matching filters
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProjects}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Currently in progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedProjects}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalProjects > 0 ? `${((completedProjects / totalProjects) * 100).toFixed(1)}% completion rate` : 'N/A'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageProgress.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all projects
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Progress by District */}
        <Card>
          <CardHeader>
            <CardTitle>Progress by District</CardTitle>
            <CardDescription>Completion rates and average progress</CardDescription>
          </CardHeader>
          <CardContent>
            {progressByDistrict.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No data available
              </p>
            ) : (
              <ChartContainer
                config={{
                  total: { label: 'Total Projects', color: 'oklch(0.55 0.18 240)' },
                  completed: { label: 'Completed', color: 'oklch(0.65 0.16 150)' },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={progressByDistrict}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" className="text-xs" />
                    <YAxis className="text-xs" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="total" fill="oklch(0.55 0.18 240)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="completed" fill="oklch(0.65 0.16 150)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* Projects by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Projects by Category</CardTitle>
            <CardDescription>Distribution across project types</CardDescription>
          </CardHeader>
          <CardContent>
            {projectsByCategory.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No data available
              </p>
            ) : (
              <ChartContainer
                config={{
                  value: { label: 'Projects' },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={projectsByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {projectsByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* Projects by Status */}
        <Card>
          <CardHeader>
            <CardTitle>Projects by Status</CardTitle>
            <CardDescription>Current project phases</CardDescription>
          </CardHeader>
          <CardContent>
            {projectsByStatus.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No data available
              </p>
            ) : (
              <ChartContainer
                config={{
                  value: { label: 'Projects' },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={projectsByStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {projectsByStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* Average Progress by District */}
        <Card>
          <CardHeader>
            <CardTitle>Average Progress by District</CardTitle>
            <CardDescription>Completion percentage across districts</CardDescription>
          </CardHeader>
          <CardContent>
            {progressByDistrict.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No data available
              </p>
            ) : (
              <ChartContainer
                config={{
                  avgProgress: { label: 'Avg Progress %', color: 'oklch(0.6 0.2 30)' },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={progressByDistrict}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" className="text-xs" />
                    <YAxis className="text-xs" domain={[0, 100]} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="avgProgress" fill="oklch(0.6 0.2 30)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
