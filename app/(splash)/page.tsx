import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, FileText, Zap, Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const companyLogos = [
  { name: 'CAT', url: 'https://logo.clearbit.com/caterpillar.com' },
  { name: 'Volvo', url: 'https://logo.clearbit.com/volvo.com' },
  { name: 'JCB', url: 'https://logo.clearbit.com/jcb.com' },
  { name: 'Komatsu', url: 'https://logo.clearbit.com/komatsu.com' },
  { name: 'Hitachi', url: 'https://logo.clearbit.com/hitachi.com' },
  { name: 'John Deere', url: 'https://logo.clearbit.com/deere.com' },
  { name: 'Case', url: 'https://logo.clearbit.com/casece.com' },
  { name: 'Bobcat', url: 'https://logo.clearbit.com/bobcat.com' },
];

export default function HomePage() {
  return (
    <main className="min-h-screen relative bg-background">
      {/* Subtle background image */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029&auto=format&fit=crop)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/50 to-white/90 dark:from-gray-950/90 dark:via-gray-950/50 dark:to-gray-950/90" />
      </div>
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden z-10">
        {/* Hero Image */}
        <div className="absolute inset-0 -z-10 opacity-10">
          <Image
            src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=2070&auto=format&fit=crop"
            alt="Construction equipment"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              Maximize Your Fleet Revenue
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              The Largest Construction Equipment Private Marketplace.
            </p>
            <div className="flex flex-wrap gap-3 justify-center mb-12">
              <Badge variant="secondary" className="text-sm py-2 px-4">
                Fast Payments
              </Badge>
              <Badge variant="secondary" className="text-sm py-2 px-4">
                Reliability
              </Badge>
              <Badge variant="secondary" className="text-sm py-2 px-4">
                Seamless
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-8">Trusted by industry leaders</p>
            {/* Logo Ticker */}
            <div className="relative overflow-hidden py-8 mb-12 ticker-fade">
              <div className="flex animate-scroll-reverse">
                {[...companyLogos, ...companyLogos].map((logo, i) => (
                  <div
                    key={i}
                    className="flex-shrink-0 mx-8 flex items-center justify-center w-32 h-16 bg-white/80 dark:bg-gray-800/80 rounded-lg backdrop-blur-sm p-3"
                  >
                    <Image
                      src={logo.url}
                      alt={logo.name}
                      width={120}
                      height={60}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* More Revenue Section */}
      <section className="py-16 bg-muted/50 spotlight-blur relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">More Revenue, Less Paperwork</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              FleetLink is a private marketplace of +500 companies, connecting owner-operated
              construction equipment to contractors. Every equipment supplier is pre-vetted to
              ensure reliability and our proprietary tracking system ensures every contractor
              receives the equipment they requested.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <FileText className="h-6 w-6" />
                </div>
                <CardTitle>Automated Ticketing</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  FleetLink handles the ticketing for equipment owners. Our turnaround times are 3x
                  faster than going direct to renters.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Zap className="h-6 w-6" />
                </div>
                <CardTitle>Fast Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Suppliers get paid 4x faster when they rent their equipment out through our
                  FleetLink network.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Clock className="h-6 w-6" />
                </div>
                <CardTitle>Easy & Simple</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  No more calling around. Equipment requests take 10 seconds and 90% of requests are
                  filled within 2 hours.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Meeting You Section */}
      <section className="py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Meeting you where you are</h2>
              <p className="text-lg text-muted-foreground">
                Founded by construction company owners, we understand how you work. We meet you
                where you are. No complicated marketplace. So you can focus on the job at hand.
              </p>
            </div>
            <div className="relative rounded-lg overflow-hidden aspect-video">
              <Image
                src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=2070&auto=format&fit=crop"
                alt="Construction site meeting"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 500+ Companies Section */}
      <section className="py-16 bg-muted/50 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="relative rounded-lg overflow-hidden aspect-square">
                  <Image
                    src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
                    alt="Construction equipment fleet"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative rounded-lg overflow-hidden aspect-square">
                  <Image
                    src="https://images.unsplash.com/photo-1590674899484-d5640e854abe?q=80&w=2074&auto=format&fit=crop"
                    alt="Heavy machinery"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">500+ In-Network Companies</h2>
              <p className="text-lg text-muted-foreground">
                Exclusive Access to Our List of Contractors and Suppliers guarantee that you a 500%
                increase in your revenue.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 relative spotlight-blur z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Trusted by industry leaders and loved by clients
            </h2>
            <p className="text-lg text-muted-foreground mb-12">
              FleetLink's success is measured by our clients' results. Hear from equipment owners
              and contractors who've transformed their operations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-500">
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-muted-foreground mb-6">
                  "FleetLink completely transformed our operations. We got a last-minute rental
                  request on a Friday afternoon, and within 90 minutes, they had us matched with the
                  perfect excavator. Got paid within 48 hours instead of the usual 30+ days!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop"
                      alt="Mike Thompson"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold">Mike Thompson</p>
                    <p className="text-sm text-muted-foreground">Thompson Equipment Rentals</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-500">
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-muted-foreground mb-6">
                  "Before FleetLink, we'd wait weeks for payment and constantly chase down
                  paperwork. Now? Equipment rented out in under 2 hours, payment in 4 days. Our cash
                  flow has never been better. This platform is a game-changer."
                </p>
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2070&auto=format&fit=crop"
                      alt="Sarah Martinez"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold">Sarah Martinez</p>
                    <p className="text-sm text-muted-foreground">Martinez Construction Supply</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/50 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Join and Start Earning</h2>
          <Link href="/sign-up">
            <Button size="lg" className="text-lg">
              Request To Join FleetLink
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
