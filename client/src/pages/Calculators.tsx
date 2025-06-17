import { useState } from "react";
import { Calculator, Euro, TrendingUp, DollarSign, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function () {
  const { toast } = useToast();
  const [activeCalculator, setActiveCalculator] = useState<string | null>(null);
  
  // Budget calculator state
  const [budgetInputs, setBudgetInputs] = useState({
    localCost: 50000,
    equipmentCost: 30000,
    itCost: 15000,
    startupCost: 10000
  });

  const calculateTotalBudget = () => {
    return Object.values(budgetInputs).reduce((sum, value) => sum + value, 0);
  };

  const handleBudgetInputChange = (field: string, value: string) => {
    setBudgetInputs(prev => ({
      ...prev,
      [field]: parseInt(value) || 0
    }));
  };

  const generateBudgetReport = () => {
    toast({
      title: "Rapport généré",
      description: "Le rapport de budget a été généré avec succès.",
    });
  };

  return (
    <section id="calculateurs">
      <h1 className="flex items-center gap-2 mb-6 text-2xl font-bold text-gray-800">
        <Calculator className="w-6 h-6" />
        Calculateurs financiers
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card 
          className="card-hover cursor-pointer"
          onClick={() => setActiveCalculator('budget')}
        >
          <CardContent className="p-6">
            <h3 className="flex items-center gap-2 text-lg font-semibold mb-3 text-primary">
              <Euro className="w-6 h-6" />
              Calculateur de budget
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Estimez le budget initial nécessaire pour créer votre école de production.
            </p>
          </CardContent>
        </Card>
        
        <Card className="card-hover cursor-pointer">
          <CardContent className="p-6">
            <h3 className="flex items-center gap-2 text-lg font-semibold mb-3 text-primary">
              <TrendingUp className="w-6 h-6" />
              Calcul de rentabilité
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Analysez la viabilité économique et le retour sur investissement.
            </p>
          </CardContent>
        </Card>
        
        <Card className="card-hover cursor-pointer">
          <CardContent className="p-6">
            <h3 className="flex items-center gap-2 text-lg font-semibold mb-3 text-primary">
              <FileText className="w-6 h-6" />
              Business Plan
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Générateur de business plan structuré avec projections financières.
            </p>
          </CardContent>
        </Card>
      </div>
      
      {activeCalculator === 'budget' && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Euro className="w-5 h-5" />
              Calculateur de budget initial
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Coûts d'installation</h3>
                
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="local-cost">Locaux et aménagement (€)</Label>
                    <Input
                      id="local-cost"
                      type="number"
                      value={budgetInputs.localCost}
                      onChange={(e) => handleBudgetInputChange('localCost', e.target.value)}
                      placeholder="50000"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="equipment-cost">Équipements pédagogiques (€)</Label>
                    <Input
                      id="equipment-cost"
                      type="number"
                      value={budgetInputs.equipmentCost}
                      onChange={(e) => handleBudgetInputChange('equipmentCost', e.target.value)}
                      placeholder="30000"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="it-cost">Matériel informatique (€)</Label>
                    <Input
                      id="it-cost"
                      type="number"
                      value={budgetInputs.itCost}
                      onChange={(e) => handleBudgetInputChange('itCost', e.target.value)}
                      placeholder="15000"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="startup-cost">Frais de démarrage (€)</Label>
                    <Input
                      id="startup-cost"
                      type="number"
                      value={budgetInputs.startupCost}
                      onChange={(e) => handleBudgetInputChange('startupCost', e.target.value)}
                      placeholder="10000"
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border-2 border-primary text-center">
                <h3 className="text-lg font-semibold mb-4">Estimation du budget</h3>
                <div className="text-4xl font-bold text-primary mb-2">
                  {calculateTotalBudget().toLocaleString()} €
                </div>
                <p className="text-sm text-gray-600 mb-4">Budget initial estimé</p>
                <Button onClick={generateBudgetReport} className="btn-primary">
                  <FileText className="w-4 h-4 mr-2" />
                  Générer le rapport
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </section>
  );
}
