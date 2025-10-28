import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Eye, Users, MessageSquare, TrendingUp, FileText, AlertCircle } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-accent/5 border-b">
        <div className="absolute inset-0 bg-[url('/assets/generated/bantay-bayan-hero-banner.dim_1200x400.png')] bg-cover bg-center opacity-10" />
        <div className="container relative py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="flex justify-center mb-6">
              <img 
                src="/assets/generated/bantay-bayan-logo.dim_200x200.png" 
                alt="Bantay Bayan" 
                className="h-24 w-24 md:h-32 md:w-32 object-contain"
              />
            </div>
            <Badge variant="outline" className="text-sm px-4 py-1">
              About Bantay Bayan
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Transparency Through Technology
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Empowering Filipino citizens to monitor government projects and hold officials accountable
            </p>
          </div>
        </div>
      </section>

      <div className="container py-12 space-y-12">
        {/* Mission Statement */}
        <section>
          <Card className="border-2 border-primary/20">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-3xl">Our Mission</CardTitle>
              <CardDescription className="text-base mt-4 max-w-3xl mx-auto">
                Bantay Bayan is a Philippine public transparency platform dedicated to exposing ghost projects 
                and promoting government accountability. We believe that every Filipino citizen has the right 
                to know how their tax money is being spent and to ensure that promised infrastructure projects 
                are actually being built.
              </CardDescription>
            </CardHeader>
          </Card>
        </section>

        {/* History Section */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Our Story</h2>
            <p className="text-muted-foreground">How Bantay Bayan came to be</p>
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  Bantay Bayan was born from a simple observation: too many government projects in the Philippines 
                  are announced with great fanfare but never materialize. These "ghost projects" represent not just 
                  wasted resources, but broken promises to communities that desperately need infrastructure improvements.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Starting with Quezon City, we've built a platform that aggregates project data, tracks progress 
                  in real-time, and makes this information accessible to every citizen. Our goal is to create a 
                  culture of transparency where officials know they are being watched, and citizens have the tools 
                  to demand accountability.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  What began as a grassroots initiative has grown into a comprehensive transparency platform, 
                  serving thousands of concerned citizens who want to ensure their communities receive the 
                  infrastructure and services they deserve.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Goals Section */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Our Goals</h2>
            <p className="text-muted-foreground">What we aim to achieve</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-2 hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Eye className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Expose Ghost Projects</CardTitle>
                <CardDescription className="mt-2">
                  Identify and publicize projects that exist only on paper, ensuring that promised 
                  infrastructure is actually delivered to communities.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-success" />
                </div>
                <CardTitle>Track Progress</CardTitle>
                <CardDescription className="mt-2">
                  Monitor the real-time progress of government projects with detailed timelines, 
                  milestones, and budget tracking to ensure accountability.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Empower Citizens</CardTitle>
                <CardDescription className="mt-2">
                  Give every Filipino the tools and information they need to hold their elected 
                  officials accountable and demand better governance.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-warning/10 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-warning" />
                </div>
                <CardTitle>Promote Transparency</CardTitle>
                <CardDescription className="mt-2">
                  Make government project data accessible, understandable, and actionable for all 
                  citizens, fostering a culture of openness.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-destructive/10 flex items-center justify-center mb-4">
                  <AlertCircle className="h-6 w-6 text-destructive" />
                </div>
                <CardTitle>Combat Corruption</CardTitle>
                <CardDescription className="mt-2">
                  Create a deterrent against corruption by making it harder for officials to 
                  misappropriate funds or falsify project completion.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Foster Dialogue</CardTitle>
                <CardDescription className="mt-2">
                  Enable constructive conversations between citizens and officials about project 
                  priorities, progress, and community needs.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* How to Participate */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">How You Can Participate</h2>
            <p className="text-muted-foreground">Join us in promoting government accountability</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">1</span>
                  Track Projects
                </CardTitle>
                <CardDescription className="mt-2">
                  Browse our database of government projects in Quezon City. Bookmark projects in your 
                  area to receive updates on their progress. Check if promised projects are actually 
                  being built and completed on time.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => navigate({ to: '/districts' })} className="w-full">
                  Explore Projects
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">2</span>
                  Report Issues
                </CardTitle>
                <CardDescription className="mt-2">
                  See a project that's stalled or appears to be a ghost project? Use our comment 
                  system to report concerns, share observations, and engage with other citizens 
                  monitoring the same projects.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" onClick={() => navigate({ to: '/' })} className="w-full">
                  View Recent Projects
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">3</span>
                  Analyze Data
                </CardTitle>
                <CardDescription className="mt-2">
                  Use our analytics tools to understand spending patterns, completion rates, and 
                  project distribution across districts. Export data for your own research or 
                  advocacy work.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" onClick={() => navigate({ to: '/progress' })} className="w-full">
                  View Analytics
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">4</span>
                  Spread Awareness
                </CardTitle>
                <CardDescription className="mt-2">
                  Share project information with your community. The more citizens who are aware 
                  and engaged, the harder it becomes for ghost projects to exist. Help us build 
                  a culture of transparency.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" onClick={() => navigate({ to: '/reports' })} className="w-full">
                  Generate Reports
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Call to Action */}
        <section>
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
            <CardContent className="pt-12 pb-12 text-center">
              <div className="max-w-2xl mx-auto space-y-6">
                <h2 className="text-3xl font-bold">Join the Movement</h2>
                <p className="text-lg text-muted-foreground">
                  Every citizen who tracks a project, reports an issue, or shares information 
                  contributes to a more transparent and accountable government. Together, we can 
                  ensure that public funds are used for their intended purpose and that promised 
                  projects become reality.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Button size="lg" onClick={() => navigate({ to: '/' })}>
                    Start Tracking Projects
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => navigate({ to: '/districts' })}>
                    Explore Municipalities
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Contact/Report Section */}
        <section>
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Have Questions or Concerns?</CardTitle>
              <CardDescription className="mt-2">
                We're committed to transparency and accountability, not just in government, but in our 
                own operations. If you have questions about how Bantay Bayan works, suggestions for 
                improvement, or concerns about specific projects, we want to hear from you.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-6">
                Use the comment sections on individual project pages to report issues or share observations. 
                For general inquiries about the platform, you can engage with our community through the 
                project discussions.
              </p>
              <Button onClick={() => navigate({ to: '/' })}>
                Go to Home Page
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
