import { useState } from "react";
import { GraduationCap, Users, Clock, Euro, Calculator, PieChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useToast } from "@/hooks/use-toast";

interface PedagogicalSector {
  id: string;
  name: string;
  students: number;
  hours: number;
  trainers: number;
  trainerSalary: number;
  equipment: number;
  materials: number;
  certifications: number;
}

interface CostData {
  sectors: PedagogicalSector[];
  overheadRate: number;
  adminCosts: number;
}

export default function PedagogicalCosts() {
  const { toast } = useToast();
  const [savedData, setSavedData] = useLocalStorage<CostData>('pedagogical_costs_data', {
    sectors: [],
    overheadRate: 25,
    adminCosts: 15000
  });

  const [data, setData] = useState<CostData>(savedData);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<PedagogicalSector>>({});

  const sectorTemplates = [
    { name: "Bâtiment - Maçonnerie", hours: 1400, equipment: 8000, materials: 2000 },
    { name: "Industrie - Mécanique", hours: 1200, equipment: 15000, materials: 3000 },
    { name: "Services - Commerce", hours: 1000, equipment: 3000, materials: 1000 },
    { name: "Restauration", hours: 1100, equipment: 12000, materials: 4000 },
    { name: "Électricité", hours: 1300, equipment: 10000, materials: 2500 }
  ];

  const resetForm = () => {
    setFormData({});
    setEditingId(null);
    setShowForm(false);
  };

  const saveSector = () => {
    if (!formData.name || !formData.students) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir les champs obligatoires",
      });
      return;
    }

    const sector: PedagogicalSector = {
      id: editingId || Date.now().toString(),
      name: formData.name || '',
      students: formData.students || 0,
      hours: formData.hours || 0,
      trainers: formData.trainers || 1,
      trainerSalary: formData.trainerSalary || 35000,
      equipment: formData.equipment || 0,
      materials: formData.materials || 0,
      certifications: formData.certifications || 0
    };

    let updatedSectors;
    if (editingId) {
      updatedSectors = data.sectors.map(s => s.id === editingId ? sector : s);
    } else {
      updatedSectors = [...data.sectors, sector];
    }

    const newData = { ...data, sectors: updatedSectors };
    setData(newData);
    setSavedData(newData);
    resetForm();

    toast({
      title: "Filière sauvegardée",
      description: `${sector.name} a été ${editingId ? 'modifiée' : 'ajoutée'} avec succès.`,
    });
  };

  const editSector = (sector: PedagogicalSector) => {
    setFormData(sector);
    setEditingId(sector.id);
    setShowForm(true);
  };

  const deleteSector = (id: string) => {
    const updatedSectors = data.sectors.filter(s => s.id !== id);
    const newData = { ...data, sectors: updatedSectors };
    setData(newData);
    setSavedData(newData);
    
    toast({
      title: "Filière supprimée",
      description: "La filière a été supprimée avec succès.",
    });
  };

  const loadTemplate = (template: any) => {
    setFormData({
      ...formData,
      name: template.name,
      hours: template.hours,
      equipment: template.equipment,
      materials: template.materials
    });
  };

  const calculateSectorCost = (sector: PedagogicalSector) => {
    const trainerCosts = sector.trainers * sector.trainerSalary;
    const directCosts = trainerCosts + sector.equipment + sector.materials + sector.certifications;
    const overheadCosts = directCosts * (data.overheadRate / 100);
    const totalCost = directCosts + overheadCosts;
    const costPerStudent = sector.students > 0 ? totalCost / sector.students : 0;
    const costPerHour = sector.hours > 0 ? totalCost / sector.hours : 0;

    return { trainerCosts, directCosts, overheadCosts, totalCost, costPerStudent, costPerHour };
  };

  const calculateGlobalMetrics = () => {
    const totalStudents = data.sectors.reduce((sum, s) => sum + s.students, 0);
    const totalCosts = data.sectors.reduce((sum, s) => sum + calculateSectorCost(s).totalCost, 0);
    const totalHours = data.sectors.reduce((sum, s) => sum + s.hours, 0);
    const avgCostPerStudent = totalStudents > 0 ? (totalCosts + data.adminCosts) / totalStudents : 0;
    const avgCostPerHour = totalHours > 0 ? (totalCosts + data.adminCosts) / totalHours : 0;

    return { totalStudents, totalCosts, totalHours, avgCostPerStudent, avgCostPerHour };
  };

  const globalMetrics = calculateGlobalMetrics();

  return (
    <section id="pedagogical-costs">
      <h1 className="flex items-center gap-2 mb-6 text-2xl font-bold text-gray-800">
        <GraduationCap className="w-6 h-6" />
        Calculateur de Coûts Pédagogiques
      </h1>
      
      <p className="mb-6 text-gray-600 leading-relaxed">
        Calculez précisément les coûts de formation par filière, par étudiant et par heure pour optimiser votre modèle économique.
      </p>

      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{globalMetrics.totalStudents}</div>
            <div className="text-sm text-gray-600">Étudiants total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{globalMetrics.totalCosts.toLocaleString()} €</div>
            <div className="text-sm text-gray-600">Coûts pédagogiques</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{globalMetrics.avgCostPerStudent.toLocaleString()} €</div>
            <div className="text-sm text-gray-600">Coût moyen/étudiant</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{globalMetrics.avgCostPerHour.toFixed(0)} €</div>
            <div className="text-sm text-gray-600">Coût moyen/heure</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres généraux</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="overhead-rate">Taux de charges indirectes (%)</Label>
                <Input
                  id="overhead-rate"
                  type="number"
                  value={data.overheadRate}
                  onChange={(e) => {
                    const newData = { ...data, overheadRate: parseInt(e.target.value) || 0 };
                    setData(newData);
                    setSavedData(newData);
                  }}
                  placeholder="25"
                />
              </div>
              <div>
                <Label htmlFor="admin-costs">Coûts administratifs annuels (€)</Label>
                <Input
                  id="admin-costs"
                  type="number"
                  value={data.adminCosts}
                  onChange={(e) => {
                    const newData = { ...data, adminCosts: parseInt(e.target.value) || 0 };
                    setData(newData);
                    setSavedData(newData);
                  }}
                  placeholder="15000"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={() => setShowForm(true)}
              className="w-full btn-primary"
            >
              Ajouter une filière
            </Button>
            <Button 
              onClick={() => toast({ title: "Export", description: "Export Excel en développement..." })}
              className="w-full btn-secondary"
            >
              Exporter Excel
            </Button>
          </CardContent>
        </Card>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingId ? 'Modifier' : 'Nouvelle'} filière</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sector-name">Nom de la filière *</Label>
                <Input
                  id="sector-name"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Ex: Bâtiment - Maçonnerie"
                />
              </div>
              <div>
                <Label>Modèle pré-défini</Label>
                <Select onValueChange={(value) => {
                  const template = sectorTemplates.find(t => t.name === value);
                  if (template) loadTemplate(template);
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir un modèle" />
                  </SelectTrigger>
                  <SelectContent>
                    {sectorTemplates.map(template => (
                      <SelectItem key={template.name} value={template.name}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="students">Nombre d'étudiants *</Label>
                <Input
                  id="students"
                  type="number"
                  value={formData.students || 0}
                  onChange={(e) => setFormData({...formData, students: parseInt(e.target.value) || 0})}
                  placeholder="12"
                />
              </div>
              <div>
                <Label htmlFor="hours">Heures de formation/an</Label>
                <Input
                  id="hours"
                  type="number"
                  value={formData.hours || 0}
                  onChange={(e) => setFormData({...formData, hours: parseInt(e.target.value) || 0})}
                  placeholder="1200"
                />
              </div>
              <div>
                <Label htmlFor="trainers">Nombre de formateurs</Label>
                <Input
                  id="trainers"
                  type="number"
                  value={formData.trainers || 1}
                  onChange={(e) => setFormData({...formData, trainers: parseInt(e.target.value) || 1})}
                  placeholder="1"
                />
              </div>
              <div>
                <Label htmlFor="trainer-salary">Salaire annuel formateur (€)</Label>
                <Input
                  id="trainer-salary"
                  type="number"
                  value={formData.trainerSalary || 35000}
                  onChange={(e) => setFormData({...formData, trainerSalary: parseInt(e.target.value) || 0})}
                  placeholder="35000"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="equipment">Équipements/an (€)</Label>
                <Input
                  id="equipment"
                  type="number"
                  value={formData.equipment || 0}
                  onChange={(e) => setFormData({...formData, equipment: parseInt(e.target.value) || 0})}
                  placeholder="8000"
                />
              </div>
              <div>
                <Label htmlFor="materials">Matières premières/an (€)</Label>
                <Input
                  id="materials"
                  type="number"
                  value={formData.materials || 0}
                  onChange={(e) => setFormData({...formData, materials: parseInt(e.target.value) || 0})}
                  placeholder="2000"
                />
              </div>
              <div>
                <Label htmlFor="certifications">Certifications/examens (€)</Label>
                <Input
                  id="certifications"
                  type="number"
                  value={formData.certifications || 0}
                  onChange={(e) => setFormData({...formData, certifications: parseInt(e.target.value) || 0})}
                  placeholder="500"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={saveSector} className="btn-primary">
                {editingId ? 'Modifier' : 'Ajouter'}
              </Button>
              <Button onClick={resetForm} className="btn-secondary">
                Annuler
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {data.sectors.map(sector => {
          const costs = calculateSectorCost(sector);
          return (
            <Card key={sector.id} className="card-hover">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{sector.name}</h3>
                    <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {sector.students} étudiants
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {sector.hours}h/an
                      </div>
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" />
                        {sector.trainers} formateur(s)
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{costs.totalCost.toLocaleString()} €</div>
                    <div className="text-xs text-gray-600">Coût total annuel</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-green-600">{costs.costPerStudent.toLocaleString()} €</div>
                    <div className="text-xs text-gray-600">Coût/étudiant</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-purple-600">{costs.costPerHour.toFixed(0)} €</div>
                    <div className="text-xs text-gray-600">Coût/heure</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-orange-600">{costs.directCosts.toLocaleString()} €</div>
                    <div className="text-xs text-gray-600">Coûts directs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-red-600">{costs.overheadCosts.toLocaleString()} €</div>
                    <div className="text-xs text-gray-600">Charges indirectes</div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-500">
                    Détail: Formateurs {costs.trainerCosts.toLocaleString()}€ + Équip./Mat. {(sector.equipment + sector.materials).toLocaleString()}€ + Certif. {sector.certifications.toLocaleString()}€
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => editSector(sector)}
                      className="btn-secondary text-xs px-3 py-1"
                    >
                      Modifier
                    </Button>
                    <Button 
                      onClick={() => deleteSector(sector.id)}
                      className="btn-danger text-xs px-3 py-1"
                    >
                      Supprimer
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {data.sectors.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center text-gray-500">
              <Calculator className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Aucune filière configurée pour le moment.</p>
              <p className="text-sm">Cliquez sur "Ajouter une filière" pour commencer.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}