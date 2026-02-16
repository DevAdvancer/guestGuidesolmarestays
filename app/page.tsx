import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative w-40 h-40 rounded-full overflow-hidden mb-4 border-4 border-white shadow-lg">
            <Image
              src="/logo.png"
              alt="Solmaré Logo"
              fill
              className="object-cover"
              priority
            />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Welcome to Solmaré
          </h1>
          <p className="text-muted-foreground text-lg">
            Luxury Stays & Experiences
          </p>
        </div>

        <Card className="border-border/50 shadow-lg">
          <CardHeader>
            <CardTitle>Guest Access</CardTitle>
            <CardDescription>
              To access your guest guide, please use the specific link provided in your check-in instructions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground text-center">
              Example Link: <br />
              <span className="font-mono text-xs">solmarestays.com/guide/your-property-id</span>
            </div>

            <Button asChild variant="outline" className="w-full">
              <Link href="https://solmarestays.com" target="_blank">
                Visit Solmaré Stays Website <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground pt-8">
          Need help? <a href="tel:+18052426411" className="underline hover:text-primary">Contact Management</a>
        </p>
      </div>
    </main>
  );
}
