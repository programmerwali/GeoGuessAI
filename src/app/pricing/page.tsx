
import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, Award, Zap, Star } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing Plans - GeoGuessAI",
  description: "Choose the best GeoGuessAI plan for your needs. Free, credit-based, and subscription options available.",
};

export default function PricingPage() {
  const tiers = [
    {
      name: "Hobbyist",
      tierId: "free",
      price: "$0",
      frequency: "/month",
      description: "Perfect for trying out GeoGuessAI and occasional use.",
      features: [
        "5 AI analyses per month",
        "Standard location identification",
        "Community support",
      ],
      cta: "Get Started",
      href: "/", // Link to homepage or a potential future signup/dashboard
      icon: <Award className="w-6 h-6 mr-2" />,
      highlight: false,
    },
    {
      name: "Explorer",
      tierId: "explorer",
      price: "$10",
      frequency: "/100 credits",
      description: "Pay as you go. Ideal for project-based or fluctuating needs.",
      features: [
        "1 credit per AI analysis",
        "Purchase credits in flexible bundles",
        "Standard support",
        "Access to new features",
      ],
      cta: "Purchase Credits",
      href: "/get-credits?tier=explorer", // Placeholder for purchase flow
      icon: <Zap className="w-6 h-6 mr-2" />,
      highlight: true,
    },
    {
      name: "Pro",
      tierId: "pro",
      price: "$20",
      frequency: "/month",
      description: "For frequent users and professionals needing more power.",
      features: [
        "500 AI analyses per month",
        "Priority support",
        "Early access to all new features",
        "Discounted rate for additional credits",
      ],
      cta: "Subscribe Now",
      href: "/subscribe?tier=pro", // Placeholder for subscription flow
      icon: <Star className="w-6 h-6 mr-2" />,
      highlight: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <header className="mb-12 sm:mb-16 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-primary">
          Find the Perfect Plan
        </h1>
        <p className="mt-3 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
          Choose a plan that scales with your GeoGuessAI usage. Upgrade or cancel anytime.
        </p>
      </header>

      <main className="w-full max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {tiers.map((tier) => (
            <Card 
              key={tier.tierId} 
              className={`flex flex-col rounded-xl ${tier.highlight ? 'border-2 border-primary ring-4 ring-primary/20 shadow-2xl' : 'shadow-lg'}`}
            >
              <CardHeader className="text-center pt-8 pb-4">
                <div className="inline-flex items-center justify-center bg-primary/10 text-primary p-3 rounded-full mb-4 mx-auto">
                  {tier.icon}
                </div>
                <CardTitle className="text-3xl font-semibold">{tier.name}</CardTitle>
                <div className="mt-2 flex items-baseline justify-center">
                  <span className="text-5xl font-extrabold text-foreground tracking-tight">{tier.price}</span>
                  <span className="ml-1 text-xl font-medium text-muted-foreground">{tier.frequency}</span>
                </div>
                <CardDescription className="mt-4 text-md min-h-[3em]">{tier.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow px-6 pb-8">
                <ul className="space-y-3">
                  {tier.features.map((feature, index) => (
                    <li key={`${tier.tierId}-feature-${index}`} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 shrink-0 mt-1" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="p-6 bg-muted/30 rounded-b-xl">
                <Button 
                  asChild 
                  className="w-full py-3 text-lg" 
                  variant={tier.highlight ? "default" : "outline"}
                  size="lg"
                >
                  <Link href={tier.href}>{tier.cta}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>

      <footer className="mt-16 sm:mt-20 text-center">
        <div className="text-md text-muted-foreground space-y-3">
            <p>
            Need a custom enterprise plan or have more questions?{' '}
            <Link href="/contact-sales" className="font-semibold text-primary hover:underline"> {/* Assuming a contact page might exist or be added later */}
                Contact Sales
            </Link>
            </p>
            <p>All prices are in USD. You can change your plan or cancel your subscription at any time.</p>
        </div>
        <p className="mt-10">
          <Link href="/" className="text-md text-primary hover:underline">
            &larr; Back to GeoGuessAI
          </Link>
        </p>
      </footer>
    </div>
  );
}
