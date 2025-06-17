import { GraduationCap, Wrench, Calculator, Book, FileText, TrendingUp, Handshake } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface HomeProps {
  navigate: (page: string) => void;
}

export default function Home({ navigate }: HomeProps) {
  return (
    <section id="accueil">
      <div className="hero-gradient text-white rounded-xl mb-6 min-h-[120px] flex items-center justify-center p-6">
        <div className="text-center">
          <GraduationCap className="w-8 h-8 mx-auto mb-3" />
          <h1 className="text-xl md:text-2xl font-bold leading-relaxed">
            Proposition d'une démarche méthodologique d'accompagnement par l'expert-comptable dans la création et le pilotage d'une école de production
          </h1>
        </div>
      </div>
      
      <div className="mb-8">
        <h1 className="flex items-center gap-2 mb-4 text-2xl font-bold text-gray-800">
          <GraduationCap className="w-6 h-6" />
          Accueil
        </h1>
        
        <Card className="mb-6">
          <CardContent className="p-6">
            <p className="mb-4 leading-relaxed">
              Bienvenue sur le site de présentation du mémoire relatif à l'accompagnement à la création d'une École de Production par un expert-comptable.
            </p>
            <p className="mb-4 leading-relaxed">
              Ce site constitue un support à la rédaction du mémoire dans le cadre de l'obtention du Diplôme d'Expertise Comptable (DEC).
            </p>
            <p className="mb-4 leading-relaxed">
              Vous y trouverez différents outils, ressources et illustrations conçus pour faciliter l'accompagnement des porteurs de projet dans la création et le pilotage d'une école de production.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
              <p className="text-blue-900">
                <strong>Problématique :</strong> « Comment l'expert-comptable peut-il accompagner au mieux un porteur de projet dans la création d'une école de production ainsi que dans son suivi financier et extra-financier ? »
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card 
          className="card-hover cursor-pointer"
          onClick={() => navigate('outils')}
        >
          <CardContent className="p-6">
            <h3 className="flex items-center gap-2 text-lg font-semibold mb-3 text-primary">
              <Wrench className="w-6 h-6" />
              Outils d'évaluation
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Questionnaires et arbres de décision pour évaluer la faisabilité de votre projet.
            </p>
          </CardContent>
        </Card>
        
        <Card 
          className="card-hover cursor-pointer"
          onClick={() => navigate('calculateurs')}
        >
          <CardContent className="p-6">
            <h3 className="flex items-center gap-2 text-lg font-semibold mb-3 text-primary">
              <Calculator className="w-6 h-6" />
              Calculateurs financiers
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Outils de calcul pour le business plan et la gestion financière.
            </p>
          </CardContent>
        </Card>
        
        <Card 
          className="card-hover cursor-pointer"
          onClick={() => navigate('business-plan')}
        >
          <CardContent className="p-6">
            <h3 className="flex items-center gap-2 text-lg font-semibold mb-3 text-primary">
              <FileText className="w-6 h-6" />
              Business Plan
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Générateur de business plan structuré avec projections financières automatisées.
            </p>
          </CardContent>
        </Card>
        
        <Card 
          className="card-hover cursor-pointer"
          onClick={() => navigate('rentabilite')}
        >
          <CardContent className="p-6">
            <h3 className="flex items-center gap-2 text-lg font-semibold mb-3 text-primary">
              <TrendingUp className="w-6 h-6" />
              Simulateur de rentabilité
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Analysez la viabilité économique avec différents scénarios de projection.
            </p>
          </CardContent>
        </Card>
        
        <Card 
          className="card-hover cursor-pointer"
          onClick={() => navigate('partenariats')}
        >
          <CardContent className="p-6">
            <h3 className="flex items-center gap-2 text-lg font-semibold mb-3 text-primary">
              <Handshake className="w-6 h-6" />
              Suivi des partenariats
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Gérez vos relations avec les entreprises partenaires et opportunités de stages.
            </p>
          </CardContent>
        </Card>
        
        <Card 
          className="card-hover cursor-pointer"
          onClick={() => navigate('guides')}
        >
          <CardContent className="p-6">
            <h3 className="flex items-center gap-2 text-lg font-semibold mb-3 text-primary">
              <Book className="w-6 h-6" />
              Guides interactifs
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Guides méthodologiques étape par étape pour la création d'école.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
