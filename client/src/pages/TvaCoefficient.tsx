import { Download, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";


export default function CoefficientTVA() {
  return (
    <section id="coefficient-tva">
      <h1 className="flex items-center gap-2 mb-6 text-2xl font-bold text-gray-800">
        <FileText className="w-6 h-6" />
        Trame de calcul du coefficient de déduction de TVA
      </h1>

      <p className="mb-6 text-gray-600 leading-relaxed">
        Cette page vous aide à calculer le coefficient de déduction de TVA applicable aux dépenses mixtes. Ce coefficient est essentiel pour respecter les obligations fiscales et optimiser la récupération de TVA selon les règles propres aux écoles de production.
      </p>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Calcul du coefficient de déduction</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700">
            Le fichier Excel ci-dessous vous permet de réaliser vos calculs en tenant compte de la proportion d'activités ouvrant droit à déduction. Veillez à l'actualiser annuellement ou à chaque changement significatif dans votre activité.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>📥 Télécharger le fichier Excel</CardTitle>
        </CardHeader>
        <CardContent className="flex items-start justify-between">
          <div className="text-sm text-gray-700">
            Ce fichier est commun aux outils de plan comptable, coefficient de déduction TVA, et résultat fiscal. Veuillez le remplir avant de procéder à vos calculs.
          </div>
          <a
            href="/demo-edp/fichiers/ECOLE_DE_PRODUCTION_MODELE.xlsx"
            download
            className="ml-4"
          >
            <Button variant="default">
              <Download className="w-4 h-4 mr-2" /> Télécharger
            </Button>
          </a>
        </CardContent>
      </Card>
    </section>
  );
}
