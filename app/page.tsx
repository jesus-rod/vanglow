'use client';

import { Card } from 'antd';
import Link from 'next/link';
import Image from 'next/image';

const HomePage = () => {
  const stats = [
    { number: '500+', label: 'Medici verificati' },
    { number: '20.000+', label: 'Utenti attivi' },
    { number: '10.000+', label: 'Recensioni' },
  ];

  const features = [
    {
      title: 'Prima/Dopo Verificati',
      description: 'Risultati reali e verificati da nostri esperti',
      icon: '⭕',
    },
    {
      title: 'Recensioni Verificate',
      description: 'Solo feedback de pazienti reali',
      icon: '⭕',
    },
    {
      title: 'Match Anonimi',
      description: 'Utenti Connettiti in privato con altri pazienti',
      icon: '⭕',
    },
    {
      title: 'Sistema Crediti+',
      description: 'Guadagna crediti condividendo la tua esperienza',
      icon: '⭕',
    },
  ];

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-green-900">Vanglow</div>
        <nav className="hidden md:flex space-x-6">
          <Link href="#" className="text-gray-600">
            Esperienze
          </Link>
          <Link href="#" className="text-gray-600">
            Dottori
          </Link>
          <Link href="#" className="text-gray-600">
            Forum
          </Link>
          <Link href="#" className="text-gray-600">
            Articoli
          </Link>
          <Link href="#" className="text-gray-600">
            Marche
          </Link>
        </nav>
        <div className="flex space-x-4">
          <button className="px-4 py-2 rounded-full">Accedi</button>
          <button className="px-4 py-2 bg-green-900 text-white rounded-full">Registrati</button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 grid md:grid-cols-2 gap-8">
        <div className="space-y-8">
          <div className="flex space-x-4 text-sm">
            <span>Prima e dopo Reali</span>
            <span>Utenti Verificati</span>
            <span>Dottori competenti</span>
          </div>

          <h1 className="text-5xl font-serif text-green-900">
            Il primo social network della bellezza
          </h1>

          <p className="text-xl">Cerca la tua esperienza e guadagna crediti</p>

          <div className="flex space-x-4">
            <button className="px-6 py-3 border border-green-900 text-green-900 rounded-full">
              Scopri esperienze
            </button>
            <button className="px-6 py-3 bg-green-900 text-white rounded-full">
              Carica esperienza
            </button>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-2xl font-bold">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 relative">
          {/* Add your images here using Next.js Image component */}
          {/* This is a placeholder for the image grid layout */}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-serif text-green-900 mb-12">
          Metti in risalto il meglio della tua bellezza.
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className="text-2xl">{feature.icon}</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bot Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
          <div className="flex items-start space-x-4">
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-4">
                Condividi la tua esperienza, aiuta gli altri e guadagna crediti! 🎉
              </h3>
              <p className="text-gray-600 mb-6">
                Parla con VanBot, raccontagli la tua esperienza, ti aiuterà a strutturarla mentre ti
                esprimi liberamente.
              </p>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <span className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                    1
                  </span>
                  <div>
                    <h4 className="font-semibold">Testo o voce</h4>
                    <p className="text-sm text-gray-600">
                      Puoi scrivere le tue risposte o inviare note vocali, come preferisci.
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                    2
                  </span>
                  <div>
                    <h4 className="font-semibold">Rivedi e personalizza</h4>
                    <p className="text-sm text-gray-600">
                      Prima di pubblicare, avrai un'anteprima per confermare e modificare i
                      dettagli.
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                    3
                  </span>
                  <div>
                    <h4 className="font-semibold">Guadagna crediti</h4>
                    <p className="text-sm text-gray-600">
                      Riscattabili per prodotti o trattamenti estetici.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-1/3">{/* Add bot image here */}</div>
          </div>

          <div className="flex space-x-4 mt-8">
            <button className="px-6 py-3 border border-green-900 text-green-900 rounded-full">
              Scopri esperienze
            </button>
            <button className="px-6 py-3 bg-green-900 text-white rounded-full">
              Carica esperienza
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold mb-4">Tipi di interventi</h4>
              <div className="grid grid-cols-2 gap-4">
                <Link href="#" className="hover:underline">
                  Rinoplastica
                </Link>
                <Link href="#" className="hover:underline">
                  Mastoplastica additiva
                </Link>
                <Link href="#" className="hover:underline">
                  Mastopessi
                </Link>
                <Link href="#" className="hover:underline">
                  Mastoplastica riduttiva
                </Link>
                <Link href="#" className="hover:underline">
                  Blefaroplastica
                </Link>
                <Link href="#" className="hover:underline">
                  Lifting del viso
                </Link>
                <Link href="#" className="hover:underline">
                  Liposuzione
                </Link>
                <Link href="#" className="hover:underline">
                  Botox
                </Link>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Città</h4>
              <div className="grid grid-cols-3 gap-4">
                <Link href="#" className="hover:underline">
                  Milano
                </Link>
                <Link href="#" className="hover:underline">
                  Roma
                </Link>
                <Link href="#" className="hover:underline">
                  Napoli
                </Link>
                <Link href="#" className="hover:underline">
                  Torino
                </Link>
                <Link href="#" className="hover:underline">
                  Firenze
                </Link>
                <Link href="#" className="hover:underline">
                  Bologna
                </Link>
                <Link href="#" className="hover:underline">
                  Genova
                </Link>
                <Link href="#" className="hover:underline">
                  Palermo
                </Link>
                <Link href="#" className="hover:underline">
                  Verona
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-green-800 flex justify-between items-center">
            <div className="text-sm">© Vanglow 2023. All Rights Reserved</div>
            <div className="flex space-x-4 text-sm">
              <Link href="#" className="hover:underline">
                Privacy
              </Link>
              <Link href="#" className="hover:underline">
                Termini e condizioni
              </Link>
              <Link href="#" className="hover:underline">
                Contatti
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default HomePage;
