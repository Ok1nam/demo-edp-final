import { Route } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Methodology() {
  return (
    <section id="methodo">
      <h1 className="flex items-center gap-2 mb-6 text-2xl font-bold text-gray-800">
        <Route className="w-6 h-6" />
        Méthodologie
      </h1>
      
      <Card>
        <CardContent className="p-6">
          <p className="mb-6 text-gray-600 leading-relaxed">
            La méthodologie développée dans ce mémoire s'articule autour de trois axes principaux :
          </p>
          
          <div className="space-y-6">
            <div className="border-l-4 border-blue-500 pl-6">
              <h3 className="text-lg font-semibold mb-2">1. Diagnostic initial</h3>
              <p className="text-gray-600 leading-relaxed">
                Évaluation des capacités du porteur de projet et de la maturité du projet.
              </p>
            </div>
            
            <div className="border-l-4 border-green-500 pl-6">
              <h3 className="text-lg font-semibold mb-2">2. Accompagnement structuré</h3>
              <p className="text-gray-600 leading-relaxed">
                Guidance méthodologique avec outils adaptés et suivi personnalisé.
              </p>
            </div>
            
            <div className="border-l-4 border-purple-500 pl-6">
              <h3 className="text-lg font-semibold mb-2">3. Pilotage continu</h3>
              <p className="text-gray-600 leading-relaxed">
                Mise en place d'indicateurs de performance et d'outils de suivi.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
