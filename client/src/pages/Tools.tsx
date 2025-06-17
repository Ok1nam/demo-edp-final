import { Wrench, TreePine, Map, ClipboardCheck, Stethoscope, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ToolsProps {
  navigate: (page: string) => void;
}

export default function Tools({ navigate }: ToolsProps) {
  return (
    <section id="outils">
      <h1 className="flex items-center gap-2 mb-6 text-2xl font-bold text-gray-800">
        <Wrench className="w-6 h-6" />
        Outils d'évaluation
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card 
          className="card-hover cursor-pointer"
          onClick={() => navigate('arbre')}
        >
          <CardContent className="p-6">
            <h3 className="flex items-center gap-2 text-lg font-semibold mb-3 text-primary">
              <TreePine className="w-6 h-6" />
              Arbre de décision
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Évaluez votre préparation en 20 questions ciblées pour identifier les points d'amélioration.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <span className="status-indicator status-pending"></span>
              <span className="text-gray-500">Non commencé</span>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="card-hover cursor-pointer"
          onClick={() => navigate('statuts')}
        >
          <CardContent className="p-6">
            <h3 className="flex items-center gap-2 text-lg font-semibold mb-3 text-primary">
              <FileText className="w-6 h-6" />
              Création de statuts
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Générez automatiquement les statuts de votre association avec un formulaire simple.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <span className="status-indicator status-pending"></span>
              <span className="text-gray-500">Outil disponible</span>
            </div>
          </CardContent>
        </Card>
        
        <Card 
          className="card-hover cursor-pointer"
          onClick={() => window.open('https://www.ecoles-de-production.com/le-reseau-des-ecoles/','_blank')}
        >
          <CardContent className="p-6">
            <h3 className="flex items-center gap-2 text-lg font-semibold mb-3 text-primary">
              <Map className="w-6 h-6" />
              Cartographie du réseau
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Visualisez la répartition géographique des écoles de production existantes.
            </p>
          </CardContent>
        </Card>
        
        <Card className="card-hover cursor-pointer">
          <CardContent className="p-6">
            <h3 className="flex items-center gap-2 text-lg font-semibold mb-3 text-primary">
              <ClipboardCheck className="w-6 h-6" />
              Check-list projet
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Liste complète des étapes et documents nécessaires pour votre projet.
            </p>
          </CardContent>
        </Card>
        
        <Card className="card-hover cursor-pointer">
          <CardContent className="p-6">
            <h3 className="flex items-center gap-2 text-lg font-semibold mb-3 text-primary">
              <Stethoscope className="w-6 h-6" />
              Diagnostic rapide
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Évaluation express de la viabilité de votre projet en 5 minutes.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
