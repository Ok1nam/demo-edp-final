import { useState } from "react";
import { TrendingUp, Calculator, BarChart3, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface RentabilityData {
  students: number;
  tuitionFee: number;
  subsidies: number;
  otherRevenue: number;
  salaries: number;
  facilityRent: number;
  equipment: number;
  utilities: number;
  insurance: number;
  otherExpenses: number;
}

export default function Rentability() {
  const [savedData, setSavedData] = useLocalStorage<RentabilityData>('rentability_data', {
    students: 20,
    tuitionFee: 3000,
    subsidies: 25000,
    otherRevenue: 10000,
    salaries: 120000,
    facilityRent: 18000,
    equipment: 8000,
    utilities: 6000,
    insurance: 3000,
    otherExpenses: 5000
  });

  const [data, setData] = useState<RentabilityData>(savedData);
  const [scenario, setScenario] = useState<'optimistic' | 'realistic' | 'pessimistic'>('realistic');

  const updateField = (field: keyof RentabilityData, value: number) => {
    const newData = { ...data, [field]: value };
    setData(newData);
    setSavedData(newData);
  };

  const getScenarioMultiplier = () => {
    switch (scenario) {
      case 'optimistic': return { revenue: 1.2, expenses: 0.9 };
      case 'pessimistic': return { revenue: 0.8, expenses: 1.1 };
      default: return { revenue: 1, expenses: 1 };
    }
  };

  const calculateMetrics = () => {
    const multiplier = getScenarioMultiplier();
    
    const revenue = (
      data.students * data.tuitionFee +
      data.subsidies +
      data.otherRevenue
    ) * multiplier.revenue;

    const expenses = (
      data.salaries +
      data.facilityRent +
      data.equipment +
      data.utilities +
      data.insurance +
      data.otherExpenses
    ) * multiplier.expenses;

    const profit = revenue - expenses;
    const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
    const costPerStudent = data.students > 0 ? expenses / data.students : 0;
    const revenuePerStudent = data.students > 0 ? revenue / data.students : 0;

    return {
      revenue,
      expenses,
      profit,
      margin,
      costPerStudent,
      revenuePerStudent
    };
  };

  const metrics = calculateMetrics();

  const getMarginColor = () => {
    if (metrics.margin >= 10) return "text-green-600 bg-green-50";
    if (metrics.margin >= 0) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getMarginStatus = () => {
    if (metrics.margin >= 10) return "Excellente rentabilité";
    if (metrics.margin >= 5) return "Bonne rentabilité";
    if (metrics.margin >= 0) return "Rentabilité fragile";
    return "Déficit";
  };

  const scenarios = [
    { id: 'optimistic', label: 'Optimiste', description: '+20% revenus, -10% charges' },
    { id: 'realistic', label: 'Réaliste', description: 'Données actuelles' },
    { id: 'pessimistic', label: 'Pessimiste', description: '-20% revenus, +10% charges' }
  ];

  return (
    <section id="rentability">
      <h1 className="flex items-center gap-2 mb-6 text-2xl font-bold text-gray-800">
        <TrendingUp className="w-6 h-6" />
        Simulateur de Rentabilité
      </h1>
      
      <p className="mb-6 text-gray-600 leading-relaxed">
        Analysez la viabilité économique de votre école de production avec des projections sur différents scénarios.
      </p>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Revenus annuels
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="students">Nombre d'étudiants</Label>
                <Input
                  id="students"
                  type="number"
                  value={data.students}
                  onChange={(e) => updateField('students', parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="tuition">Frais de scolarité par étudiant (€)</Label>
                <Input
                  id="tuition"
                  type="number"
                  value={data.tuitionFee}
                  onChange={(e) => updateField('tuitionFee', parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="subsidies">Subventions publiques (€)</Label>
                <Input
                  id="subsidies"
                  type="number"
                  value={data.subsidies}
                  onChange={(e) => updateField('subsidies', parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="other-revenue">Autres revenus (€)</Label>
                <Input
                  id="other-revenue"
                  type="number"
                  value={data.otherRevenue}
                  onChange={(e) => updateField('otherRevenue', parseInt(e.target.value) || 0)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Charges annuelles
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="salaries">Salaires et charges sociales (€)</Label>
                <Input
                  id="salaries"
                  type="number"
                  value={data.salaries}
                  onChange={(e) => updateField('salaries', parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="rent">Loyer/charges locaux (€)</Label>
                <Input
                  id="rent"
                  type="number"
                  value={data.facilityRent}
                  onChange={(e) => updateField('facilityRent', parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="equipment">Équipements/maintenance (€)</Label>
                <Input
                  id="equipment"
                  type="number"
                  value={data.equipment}
                  onChange={(e) => updateField('equipment', parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="utilities">Énergie/communications (€)</Label>
                <Input
                  id="utilities"
                  type="number"
                  value={data.utilities}
                  onChange={(e) => updateField('utilities', parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="insurance">Assurances (€)</Label>
                <Input
                  id="insurance"
                  type="number"
                  value={data.insurance}
                  onChange={(e) => updateField('insurance', parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="other-expenses">Autres charges (€)</Label>
                <Input
                  id="other-expenses"
                  type="number"
                  value={data.otherExpenses}
                  onChange={(e) => updateField('otherExpenses', parseInt(e.target.value) || 0)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Scénarios</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {scenarios.map(({ id, label, description }) => (
                <Button
                  key={id}
                  onClick={() => setScenario(id as any)}
                  className={`w-full text-left justify-start ${
                    scenario === id ? 'btn-primary' : 'btn-secondary'
                  }`}
                >
                  <div>
                    <div className="font-medium">{label}</div>
                    <div className="text-xs opacity-75">{description}</div>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card className={getMarginColor()}>
            <CardHeader>
              <CardTitle className="text-center">Marge bénéficiaire</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold mb-2">
                {metrics.margin.toFixed(1)}%
              </div>
              <div className="text-sm font-medium mb-3">
                {getMarginStatus()}
              </div>
              <Progress 
                value={Math.max(0, Math.min(100, metrics.margin + 20))} 
                className="h-2"
              />
            </CardContent>
          </Card>

          {metrics.margin < 0 && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="font-medium">Attention</span>
                </div>
                <p className="text-sm text-red-600 mt-1">
                  Le projet n'est pas rentable dans ce scénario. Révisez les paramètres.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {metrics.revenue.toLocaleString()} €
            </div>
            <div className="text-sm text-gray-600">Revenus totaux</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {metrics.expenses.toLocaleString()} €
            </div>
            <div className="text-sm text-gray-600">Charges totales</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className={`text-2xl font-bold ${metrics.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {metrics.profit.toLocaleString()} €
            </div>
            <div className="text-sm text-gray-600">Résultat net</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {metrics.costPerStudent.toLocaleString()} €
            </div>
            <div className="text-sm text-gray-600">Coût par étudiant</div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}