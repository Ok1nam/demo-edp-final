import { useState } from "react";
import { FileText, Download, Save, Calculator, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface BusinessPlanData {
  projectName: string;
  promoterName: string;
  location: string;
  targetSectors: string;
  studentCapacity: number;
  initialInvestment: number;
  operatingCosts: number;
  expectedRevenue: number;
  partnerships: string;
  competitionAnalysis: string;
  marketingStrategy: string;
  financialProjections: {
    year1: { revenue: number; expenses: number; };
    year2: { revenue: number; expenses: number; };
    year3: { revenue: number; expenses: number; };
  };
}

export default function BusinessPlan() {
  const { toast } = useToast();
  const [savedData, setSavedData] = useLocalStorage<BusinessPlanData>('business_plan_data', {
    projectName: '',
    promoterName: '',
    location: '',
    targetSectors: '',
    studentCapacity: 20,
    initialInvestment: 100000,
    operatingCosts: 80000,
    expectedRevenue: 90000,
    partnerships: '',
    competitionAnalysis: '',
    marketingStrategy: '',
    financialProjections: {
      year1: { revenue: 90000, expenses: 80000 },
      year2: { revenue: 110000, expenses: 85000 },
      year3: { revenue: 130000, expenses: 90000 }
    }
  });

  const [formData, setFormData] = useState<BusinessPlanData>(savedData);
  const [activeSection, setActiveSection] = useState<string>('general');

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateFinancialProjection = (year: 'year1' | 'year2' | 'year3', type: 'revenue' | 'expenses', value: number) => {
    setFormData(prev => ({
      ...prev,
      financialProjections: {
        ...prev.financialProjections,
        [year]: {
          ...prev.financialProjections[year],
          [type]: value
        }
      }
    }));
  };

  const savePlan = () => {
    setSavedData(formData);
    toast({
      title: "Business plan sauvegardé",
      description: "Vos données ont été sauvegardées localement.",
    });
  };

  const generateReport = () => {
    toast({
      title: "Génération du rapport",
      description: "Génération du business plan PDF en cours...",
    });
  };

  const calculateROI = () => {
    const year3Profit = formData.financialProjections.year3.revenue - formData.financialProjections.year3.expenses;
    return ((year3Profit / formData.initialInvestment) * 100).toFixed(1);
  };

  const calculateBreakeven = () => {
    const avgAnnualProfit = (
      (formData.financialProjections.year1.revenue - formData.financialProjections.year1.expenses) +
      (formData.financialProjections.year2.revenue - formData.financialProjections.year2.expenses) +
      (formData.financialProjections.year3.revenue - formData.financialProjections.year3.expenses)
    ) / 3;
    
    if (avgAnnualProfit <= 0) return "Non rentable";
    return (formData.initialInvestment / avgAnnualProfit).toFixed(1) + " ans";
  };

  const sections = [
    { id: 'general', title: 'Informations générales', icon: FileText },
    { id: 'market', title: 'Analyse de marché', icon: TrendingUp },
    { id: 'financial', title: 'Projections financières', icon: Calculator },
  ];

  return (
    <section id="business-plan">
      <h1 className="flex items-center gap-2 mb-6 text-2xl font-bold text-gray-800">
        <FileText className="w-6 h-6" />
        Générateur de Business Plan
      </h1>
      
      <p className="mb-6 text-gray-600 leading-relaxed">
        Créez un business plan structuré pour votre projet d'école de production avec des projections financières automatisées.
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {sections.map(({ id, title, icon: Icon }) => (
          <Button
            key={id}
            onClick={() => setActiveSection(id)}
            className={activeSection === id ? "btn-primary" : "btn-secondary"}
          >
            <Icon className="w-4 h-4 mr-2" />
            {title}
          </Button>
        ))}
      </div>

      {activeSection === 'general' && (
        <Card>
          <CardHeader>
            <CardTitle>Informations générales du projet</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="project-name">Nom du projet</Label>
                <Input
                  id="project-name"
                  value={formData.projectName}
                  onChange={(e) => updateField('projectName', e.target.value)}
                  placeholder="École de Production XYZ"
                />
              </div>
              <div>
                <Label htmlFor="promoter-name">Nom du porteur de projet</Label>
                <Input
                  id="promoter-name"
                  value={formData.promoterName}
                  onChange={(e) => updateField('promoterName', e.target.value)}
                  placeholder="Votre nom"
                />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location">Localisation</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => updateField('location', e.target.value)}
                  placeholder="Ville, Région"
                />
              </div>
              <div>
                <Label htmlFor="capacity">Capacité d'accueil (étudiants)</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.studentCapacity}
                  onChange={(e) => updateField('studentCapacity', parseInt(e.target.value) || 0)}
                  placeholder="20"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="sectors">Secteurs d'activité ciblés</Label>
              <Textarea
                id="sectors"
                value={formData.targetSectors}
                onChange={(e) => updateField('targetSectors', e.target.value)}
                placeholder="Bâtiment, Industrie, Services..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {activeSection === 'market' && (
        <Card>
          <CardHeader>
            <CardTitle>Analyse de marché et stratégie</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="partnerships">Partenariats entreprises</Label>
              <Textarea
                id="partnerships"
                value={formData.partnerships}
                onChange={(e) => updateField('partnerships', e.target.value)}
                placeholder="Liste des entreprises partenaires et types de collaboration..."
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="competition">Analyse concurrentielle</Label>
              <Textarea
                id="competition"
                value={formData.competitionAnalysis}
                onChange={(e) => updateField('competitionAnalysis', e.target.value)}
                placeholder="Autres écoles, centres de formation dans la région..."
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="marketing">Stratégie de communication</Label>
              <Textarea
                id="marketing"
                value={formData.marketingStrategy}
                onChange={(e) => updateField('marketingStrategy', e.target.value)}
                placeholder="Plan de communication, recrutement des étudiants..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {activeSection === 'financial' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Investissement initial</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="initial-investment">Investissement initial (€)</Label>
                <Input
                  id="initial-investment"
                  type="number"
                  value={formData.initialInvestment}
                  onChange={(e) => updateField('initialInvestment', parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="operating-costs">Charges annuelles (€)</Label>
                <Input
                  id="operating-costs"
                  type="number"
                  value={formData.operatingCosts}
                  onChange={(e) => updateField('operatingCosts', parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="expected-revenue">Revenus attendus (€)</Label>
                <Input
                  id="expected-revenue"
                  type="number"
                  value={formData.expectedRevenue}
                  onChange={(e) => updateField('expectedRevenue', parseInt(e.target.value) || 0)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Projections sur 3 ans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                {(['year1', 'year2', 'year3'] as const).map((year, index) => (
                  <div key={year} className="space-y-3">
                    <h4 className="font-semibold text-center">Année {index + 1}</h4>
                    <div>
                      <Label>Revenus (€)</Label>
                      <Input
                        type="number"
                        value={formData.financialProjections[year].revenue}
                        onChange={(e) => updateFinancialProjection(year, 'revenue', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <Label>Charges (€)</Label>
                      <Input
                        type="number"
                        value={formData.financialProjections[year].expenses}
                        onChange={(e) => updateFinancialProjection(year, 'expenses', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="text-center">
                      <div className="font-medium">
                        Résultat: {(formData.financialProjections[year].revenue - formData.financialProjections[year].expenses).toLocaleString()} €
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Indicateurs clés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6 text-center">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{calculateROI()}%</div>
                  <div className="text-sm text-gray-600">ROI Année 3</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{calculateBreakeven()}</div>
                  <div className="text-sm text-gray-600">Seuil de rentabilité</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex flex-wrap gap-3 mt-8">
        <Button onClick={savePlan} className="btn-warning">
          <Save className="w-4 h-4 mr-2" />
          Sauvegarder
        </Button>
        <Button onClick={generateReport} className="btn-primary">
          <Download className="w-4 h-4 mr-2" />
          Générer le business plan PDF
        </Button>
      </div>
    </section>
  );
}