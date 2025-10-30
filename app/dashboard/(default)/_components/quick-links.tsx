import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface QuickLink {
  title: string;
  description: string;
  href: string;
  backgroundImage: string;
}

interface QuickLinksProps {
  links: QuickLink[];
}

export function QuickLinks({ links }: QuickLinksProps) {
  return (
    <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {links.map(link => (
        <Link key={link.href} href={link.href} className="group">
          <Card className="relative h-full overflow-hidden transition-all hover:shadow-md">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-10 transition-opacity group-hover:opacity-20"
              style={{ backgroundImage: `url(${link.backgroundImage})` }}
            />
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center justify-between text-xl">
                {link.title}
                <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
              </CardTitle>
              <CardDescription className="mt-2">{link.description}</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  );
}
