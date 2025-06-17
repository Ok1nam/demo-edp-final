import { Download, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";


export default function ResultatFiscal() {
  return (
    <section id="resultat-fiscal">
      <h1 className="flex items-center gap-2 mb-6 text-2xl font-bold text-gray-800">
        <FileText className="w-6 h-6" />
        Trame de calcul du résultat fiscal
      </h1>

      <p className="mb-6 text-gray-600 leading-relaxed">
        Cette page vous permet de consulter la méthodologie de calcul du résultat fiscal à partir du résultat comptable. Le fichier Excel associé est commun aux autres outils.
      </p>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Méthodologie</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700">
            Le calcul du résultat fiscal repose sur des retraitements extra-comptables appliqués au résultat comptable. Ces retraitements peuvent inclure les réintégrations et les déductions fiscales spécifiques au secteur ou au statut de l'école. Le fichier Excel vous accompagne dans cette démarche étape par étape.
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
