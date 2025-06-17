import { Folder, FileText, Table, BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function Annexes() {
  const { toast } = useToast();

  const downloadDocument = (docType: string) => {
    toast({
      title: "Téléchargement",
      description: `Téléchargement du document : ${docType}`,
    });
  };

  return (
    <section id="annexes">
      <h1 className="flex items-center gap-2 mb-6 text-2xl font-bold text-gray-800">
        <Folder className="w-6 h-6" />
        Annexes
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card 
          className="card-hover cursor-pointer"
          onClick={() => downloadDocument('legal-framework')}
        >
          <CardContent className="p-6">
            <h3 className="flex items-center gap-2 text-lg font-semibold mb-3 text-primary">
              <FileText className="w-6 h-6" />
              Cadre réglementaire
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Textes officiels et réglementation des écoles de production.
            </p>
          </CardContent>
        </Card>
        
        <Card 
          className="card-hover cursor-pointer"
          onClick={() => downloadDocument('financial-templates')}
        >
          <CardContent className="p-6">
            <h3 className="flex items-center gap-2 text-lg font-semibold mb-3 text-primary">
              <Table className="w-6 h-6" />
              Modèles financiers
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Templates Excel pour business plan et projections financières.
            </p>
          </CardContent>
        </Card>
        
        <Card 
          className="card-hover cursor-pointer"
          onClick={() => downloadDocument('case-studies')}
        >
          <CardContent className="p-6">
            <h3 className="flex items-center gap-2 text-lg font-semibold mb-3 text-primary">
              <BarChart3 className="w-6 h-6" />
              Études de cas
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Exemples concrets de créations d'écoles de production.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
