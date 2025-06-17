
import { useState } from "react";
import { FileText, Download, Building, User, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface StatutsData {
  associationName: string;
  presidentName: string;
  secretaireName: string;
  siegeSocial: string;
  objet: string;
  duree: string;
  montantCotisation: string;
}

export default function StatutsGenerator() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<StatutsData>({
    associationName: '',
    presidentName: '',
    secretaireName: '',
    siegeSocial: '',
    objet: '',
    duree: '99',
    montantCotisation: ''
  });

  const [showPreview, setShowPreview] = useState(false);

  const handleInputChange = (field: keyof StatutsData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateStatuts = () => {
    const statutsTemplate = `
STATUTS DE L'ASSOCIATION
${formData.associationName || "[NOM DE L'ASSOCIATION]"}


ARTICLE 1 - DÉNOMINATION
Il est fondé entre les adhérents aux présents statuts une association régie par la loi du 1er juillet 1901 et le décret du 16 août 1901, ayant pour titre :
${formData.associationName || "[NOM DE L'ASSOCIATION]"}


ARTICLE 2 - OBJET
Cette association a pour objet :
${formData.objet || '[OBJET DE L\'ASSOCIATION]'}

ARTICLE 3 - SIÈGE SOCIAL
Le siège social est fixé à :
${formData.siegeSocial || '[ADRESSE DU SIÈGE SOCIAL]'}

Il pourra être transféré par simple décision du conseil d'administration.

ARTICLE 4 - DURÉE
La durée de l'association est de ${formData.duree || '99'} années à compter de sa déclaration en préfecture.

ARTICLE 5 - COMPOSITION
L'association se compose de :
- Membres d'honneur
- Membres actifs ou adhérents
- Membres bienfaiteurs

ARTICLE 6 - ADMISSION
Pour faire partie de l'association, il faut être agréé par le bureau qui statue lors de chacune de ses réunions sur les demandes d'admission présentées.

ARTICLE 7 - MEMBRES - COTISATIONS
${formData.montantCotisation ? 
  `La cotisation annuelle est fixée à ${formData.montantCotisation} euros.` : 
  'Le montant des cotisations est fixé annuellement par l\'assemblée générale.'
}

ARTICLE 8 - RADIATIONS
La qualité de membre se perd par :
- La démission
- Le décès
- La radiation prononcée par le conseil d'administration pour non-paiement des cotisations ou pour motif grave

ARTICLE 9 - RESSOURCES
Les ressources de l'association comprennent :
- Le montant des cotisations
- Les subventions qui pourraient lui être accordées
- Les dons et legs
- Toutes autres ressources autorisées par la loi

ARTICLE 10 - CONSEIL D'ADMINISTRATION
L'association est dirigée par un conseil d'administration de 3 membres minimum élus pour 3 années par l'assemblée générale.

ARTICLE 11 - BUREAU
Le conseil d'administration élit parmi ses membres un bureau composé de :
- Un(e) président(e) : ${formData.presidentName || '[NOM DU PRÉSIDENT]'}
- Un(e) secrétaire : ${formData.secretaireName || '[NOM DU SECRÉTAIRE]'}
- Un(e) trésorier(ère)

ARTICLE 12 - RÉUNIONS DU CONSEIL D'ADMINISTRATION
Le conseil d'administration se réunit au moins une fois tous les six mois, sur convocation du président, ou sur la demande du quart de ses membres.

ARTICLE 13 - ASSEMBLÉE GÉNÉRALE ORDINAIRE
L'assemblée générale ordinaire comprend tous les membres de l'association à jour de leurs cotisations.
Elle se réunit chaque année au mois de [MOIS].

ARTICLE 14 - ASSEMBLÉE GÉNÉRALE EXTRAORDINAIRE
Si besoin est, ou sur la demande de la moitié plus un des membres inscrits, le président peut convoquer une assemblée générale extraordinaire.

ARTICLE 15 - RÈGLEMENT INTÉRIEUR
Un règlement intérieur peut être établi par le conseil d'administration, qui le fait alors approuver par l'assemblée générale.

ARTICLE 16 - DISSOLUTION
En cas de dissolution prononcée selon les modalités prévues à l'article 14, un ou plusieurs liquidateurs sont nommés, et l'actif net, s'il y a lieu, est dévolu à un organisme ayant un but non lucratif conformément aux décisions de l'assemblée générale extraordinaire.

Fait à ${formData.siegeSocial ? formData.siegeSocial.split(',')[0] || '[VILLE]' : '[VILLE]'}, le [DATE]

Le Président,                          Le Secrétaire,
${formData.presidentName || '[NOM DU PRÉSIDENT]'}                    ${formData.secretaireName || '[NOM DU SECRÉTAIRE]'}

Signature :                           Signature :
`;

    return statutsTemplate;
  };

  const downloadStatuts = () => {
    if (!formData.associationName || !formData.presidentName || !formData.secretaireName || !formData.siegeSocial) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir au minimum le nom de l'association, le président, le secrétaire et le siège social.",
        variant: "destructive"
      });
      return;
    }

    const statutsContent = generateStatuts();
    const blob = new Blob([statutsContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Statuts_${formData.associationName.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Statuts générés",
      description: "Les statuts ont été téléchargés avec succès.",
    });
  };

  const resetForm = () => {
    setFormData({
      associationName: '',
      presidentName: '',
      secretaireName: '',
      siegeSocial: '',
      objet: '',
      duree: '99',
      montantCotisation: ''
    });
    setShowPreview(false);
  };

  const isFormValid = formData.associationName && formData.presidentName && formData.secretaireName && formData.siegeSocial;

  return (
    <section id="statuts-generator">
      <h1 className="flex items-center gap-2 mb-6 text-2xl font-bold text-gray-800">
        <FileText className="w-6 h-6" />
        Générateur de Statuts d'Association
      </h1>
      
      <p className="mb-6 text-gray-600 leading-relaxed">
        Créez facilement les statuts de votre association en remplissant le formulaire ci-dessous. 
        Les statuts générés respectent le cadre légal français (Loi 1901).
      </p>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Formulaire */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              Informations de l'association
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="association-name">Nom de l'association *</Label>
              <Input
                id="association-name"
                value={formData.associationName}
                onChange={(e) => handleInputChange('associationName', e.target.value)}
                placeholder="École de Production XYZ"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="objet">Objet de l'association</Label>
              <Textarea
                id="objet"
                value={formData.objet}
                onChange={(e) => handleInputChange('objet', e.target.value)}
                placeholder="Formation professionnelle par la pédagogie du faire..."
                rows={3}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="siege-social">Siège social *</Label>
              <Input
                id="siege-social"
                value={formData.siegeSocial}
                onChange={(e) => handleInputChange('siegeSocial', e.target.value)}
                placeholder="123 rue de l'École, 75000 Paris"
                className="mt-1"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duree">Durée (années)</Label>
                <Input
                  id="duree"
                  value={formData.duree}
                  onChange={(e) => handleInputChange('duree', e.target.value)}
                  placeholder="99"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="cotisation">Cotisation annuelle (€)</Label>
                <Input
                  id="cotisation"
                  value={formData.montantCotisation}
                  onChange={(e) => handleInputChange('montantCotisation', e.target.value)}
                  placeholder="50"
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dirigeants */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Dirigeants
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="president">Nom du président *</Label>
              <Input
                id="president"
                value={formData.presidentName}
                onChange={(e) => handleInputChange('presidentName', e.target.value)}
                placeholder="Nom Prénom du président"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="secretaire">Nom du secrétaire *</Label>
              <Input
                id="secretaire"
                value={formData.secretaireName}
                onChange={(e) => handleInputChange('secretaireName', e.target.value)}
                placeholder="Nom Prénom du secrétaire"
                className="mt-1"
              />
            </div>

            <div className="pt-4 space-y-3">
              <Button 
                onClick={() => setShowPreview(!showPreview)}
                className="w-full btn-secondary"
                disabled={!isFormValid}
              >
                {showPreview ? 'Masquer' : 'Aperçu des statuts'}
              </Button>
              
              <Button 
                onClick={downloadStatuts}
                className="w-full btn-primary"
                disabled={!isFormValid}
              >
                <Download className="w-4 h-4 mr-2" />
                Télécharger les statuts
              </Button>
              
              <Button 
                onClick={resetForm}
                className="w-full btn-secondary"
              >
                Réinitialiser
              </Button>
            </div>

            {!isFormValid && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  <strong>Champs obligatoires :</strong> Nom de l'association, président, secrétaire et siège social
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Aperçu */}
      {showPreview && isFormValid && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Aperçu des statuts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm font-mono">
                {generateStatuts()}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="mt-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-3">ℹ️ Informations importantes</h3>
          <div className="text-sm text-gray-600 space-y-2">
            <p>• Les statuts générés respectent le cadre légal des associations loi 1901</p>
            <p>• Vous devrez compléter les champs entre crochets avant la déclaration</p>
            <p>• N'oubliez pas de faire signer les statuts par le président et le secrétaire</p>
            <p>• Ces statuts doivent être déposés en préfecture pour officialiser votre association</p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
