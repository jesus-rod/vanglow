'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MessageCircle, Star, Users, Shield, Coins, Upload } from 'lucide-react';

const HomePage = () => {
  const stats = [
    { number: '500+', label: 'Medici verificati', icon: <Shield className="w-5 h-5" /> },
    { number: '20.000+', label: 'Utenti attivi', icon: <Users className="w-5 h-5" /> },
    { number: '10.000+', label: 'Recensioni', icon: <Star className="w-5 h-5" /> },
  ];

  const features = [
    {
      title: 'Prima/Dopo Verificati',
      description: 'Risultati reali e verificati da nostri esperti',
      icon: <Shield className="w-6 h-6 text-primary" />,
    },
    {
      title: 'Recensioni Verificate',
      description: 'Solo feedback de pazienti reali',
      icon: <Star className="w-6 h-6 text-primary" />,
    },
    {
      title: 'Match Anonimi',
      description: 'Utenti Connettiti in privato con altri pazienti',
      icon: <MessageCircle className="w-6 h-6 text-primary" />,
    },
    {
      title: 'Sistema Crediti+',
      description: 'Guadagna crediti condividendo la tua esperienza',
      icon: <Coins className="w-6 h-6 text-primary" />,
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="container mx-auto px-4 py-4 flex justify-between items-center border-b">
        <div className="text-2xl font-bold text-primary">Vanglow</div>
        <nav className="hidden md:flex space-x-6">
          <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            Esperienze
          </Link>
          <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            Dottori
          </Link>
          <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            Forum
          </Link>
          <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            Articoli
          </Link>
          <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            Marche
          </Link>
        </nav>
        <div className="flex space-x-4">
          <Button variant="ghost">Accedi</Button>
          <Button>Registrati</Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Prima e dopo Reali</Badge>
              <Badge variant="outline">Utenti Verificati</Badge>
              <Badge variant="outline">Dottori competenti</Badge>
            </div>

            <h1 className="text-5xl font-serif text-primary">
              Il primo social network della bellezza
            </h1>

            <p className="text-xl text-muted-foreground">
              Cerca la tua esperienza e guadagna crediti
            </p>

            <div className="flex flex-wrap gap-4">
              <Button variant="outline" size="lg">
                Scopri esperienze
              </Button>
              <Button size="lg">
                <Upload className="mr-2 h-4 w-4" />
                Carica esperienza
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-8">
              {stats.map((stat, index) => (
                <Card key={index} className="border-none shadow-none">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      {stat.icon}
                      <span className="text-2xl font-bold">{stat.number}</span>
                    </div>
                    <div className="text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 relative">
            {/* Add your images here using Next.js Image component */}
            {/* This is a placeholder for the image grid layout */}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-serif text-primary mb-12">
          Metti in risalto il meglio della tua bellezza.
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-none shadow-none">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {feature.icon}
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Bot Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8">
            <div className="flex items-start gap-8">
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-4">
                  Condividi la tua esperienza, aiuta gli altri e guadagna crediti! 🎉
                </h3>
                <p className="text-muted-foreground mb-6">
                  Parla con VanBot, raccontagli la tua esperienza, ti aiuterà a strutturarla mentre
                  ti esprimi liberamente.
                </p>

                <div className="space-y-6">
                  {[
                    {
                      title: 'Testo o voce',
                      description:
                        'Puoi scrivere le tue risposte o inviare note vocali, come preferisci.',
                    },
                    {
                      title: 'Rivedi e personalizza',
                      description:
                        "Prima di pubblicare, avrai un'anteprima per confermare e modificare i dettagli.",
                    },
                    {
                      title: 'Guadagna crediti',
                      description: 'Riscattabili per prodotti o trattamenti estetici.',
                    },
                  ].map((step, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <Badge
                        variant="outline"
                        className="w-6 h-6 rounded-full flex items-center justify-center p-0"
                      >
                        {index + 1}
                      </Badge>
                      <div>
                        <h4 className="font-semibold">{step.title}</h4>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-1/3">{/* Add bot image here */}</div>
            </div>

            <div className="flex flex-wrap gap-4 mt-8">
              <Button variant="outline" size="lg">
                Scopri esperienze
              </Button>
              <Button size="lg">
                <Upload className="mr-2 h-4 w-4" />
                Carica esperienza
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold mb-4">Tipi di interventi</h4>
              <div className="grid grid-cols-2 gap-4">
                {[
                  'Rinoplastica',
                  'Mastoplastica additiva',
                  'Mastopessi',
                  'Mastoplastica riduttiva',
                  'Blefaroplastica',
                  'Lifting del viso',
                  'Liposuzione',
                  'Botox',
                ].map((item) => (
                  <Link
                    key={item}
                    href="#"
                    className="hover:underline text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                  >
                    {item}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Città</h4>
              <div className="grid grid-cols-3 gap-4">
                {[
                  'Milano',
                  'Roma',
                  'Napoli',
                  'Torino',
                  'Firenze',
                  'Bologna',
                  'Genova',
                  'Palermo',
                ].map((city) => (
                  <Link
                    key={city}
                    href="#"
                    className="hover:underline text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                  >
                    {city}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default HomePage;
