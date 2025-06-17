import { useState } from "react";
import { Book, Rocket, Scale, Handshake, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Guides() {
  const [activeGuide, setActiveGuide] = useState<string | null>(null);
  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>({});

  const toggleStepDetails = (stepId: string) => {
    setExpandedSteps(prev => ({
      ...prev,
      [stepId]: !prev[stepId]
    }));
  };

  const methodologySteps = [
    {
      id: 'step1',
      title: 'Étape 1: Définition du projet',
      status: 'complete',
      description: 'Clarifiez votre vision, vos objectifs et votre public cible. Identifiez les filières professionnelles à développer.',
      details: [
        'Analyse du territoire et des besoins économiques',
        'Définition des métiers et compétences à enseigner',
        'Étude de la concurrence et du positionnement'
      ]
    },
    {
      id: 'step2',
      title: 'Étape 2: Étude de marché',
      status: 'progress',
      description: 'Analysez l\'environnement économique local et validez le besoin pour votre école.',
      details: [
        'Enquête auprès des entreprises locales',
        'Analyse des besoins en compétences',
        'Étude de la demande de formation'
      ]
    },
    {
      id: 'step3',
      title: 'Étape 3: Business plan',
      status: 'pending',
      description: 'Élaborez un plan d\'affaires détaillé avec projections financières.',
      details: [
        'Modèle économique et financier',
        'Plan de financement pluriannuel',
        'Stratégie de développement'
      ]
    }
  ];

  return (
    <section id="guides">
      <h1 className="flex items-center gap-2 mb-6 text-2xl font-bold text-gray-800">
        <Book className="w-6 h-6" />
        Guides méthodologiques
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card 
          className="card-hover cursor-pointer"
          onClick={() => setActiveGuide('creation')}
        >
          <CardContent className="p-6">
            <h3 className="flex items-center gap-2 text-lg font-semibold mb-3 text-primary">
              <Rocket className="w-6 h-6" />
              Guide de création
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Processus complet étape par étape pour créer votre école de production.
            </p>
            <div className="text-sm text-gray-500">
              8 étapes • 45 min
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-hover cursor-pointer">
          <CardContent className="p-6">
            <h3 className="flex items-center gap-2 text-lg font-semibold mb-3 text-primary">
              <Scale className="w-6 h-6" />
              Aspects juridiques
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Guide des démarches administratives et du cadre réglementaire.
            </p>
            <div className="text-sm text-gray-500">
              5 étapes • 30 min
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-hover cursor-pointer">
          <CardContent className="p-6">
            <h3 className="flex items-center gap-2 text-lg font-semibold mb-3 text-primary">
              <Handshake className="w-6 h-6" />
              Partenariats
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Stratégies pour développer des partenariats avec les entreprises locales.
            </p>
            <div className="text-sm text-gray-500">
              6 étapes • 25 min
            </div>
          </CardContent>
        </Card>
      </div>
      
      {activeGuide === 'creation' && (
        <Card className="mt-6">
          <CardContent className="p-6">
            <h2 className="flex items-center gap-2 text-xl font-semibold mb-6">
              <Rocket className="w-5 h-5" />
              Guide de création d'école de production
            </h2>
            
            <div className="space-y-4">
              {methodologySteps.map((step) => (
                <div key={step.id} className="methodology-step">
                  <h3 className="flex items-center gap-2 text-lg font-semibold mb-2">
                    <span className={`status-indicator status-${step.status}`}></span>
                    {step.title}
                  </h3>
                  <p className="text-gray-600 mb-3">{step.description}</p>
                  <Button 
                    onClick={() => toggleStepDetails(step.id)}
                    className="btn-secondary"
                  >
                    {expandedSteps[step.id] ? (
                      <>
                        <ChevronUp className="w-4 h-4 mr-2" />
                        Masquer les détails
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4 mr-2" />
                        Voir les détails
                      </>
                    )}
                  </Button>
                  
                  {expandedSteps[step.id] && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <ul className="list-disc pl-5 space-y-2">
                        {step.details.map((detail, index) => (
                          <li key={index} className="text-gray-700">{detail}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </section>
  );
}
