import { useState } from "react";
import { Calendar, Clock, Award, BookOpen, Users, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useToast } from "@/hooks/use-toast";

interface TrainingModule {
  id: string;
  title: string;
  sector: string;
  duration: number; // en heures
  startDate: string;
  endDate: string;
  instructor: string;
  students: number;
  objectives: string;
  skills: string[];
  certification: string;
  status: 'planned' | 'in-progress' | 'completed' | 'cancelled';
  prerequisites: string;
  resources: string;
}

interface TrainingPlan {
  modules: TrainingModule[];
  academicYear: string;
}

export default function TrainingPlanner() {
  const { toast } = useToast();
  const [savedData, setSavedData] = useLocalStorage<TrainingPlan>('training_plan_data', {
    modules: [],
    academicYear: '2024-2025'
  });

  const [data, setData] = useState<TrainingPlan>(savedData);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<TrainingModule>>({});
  const [currentView, setCurrentView] = useState<'calendar' | 'list'>('list');

  const sectors = [
    'Bâtiment', 'Industrie', 'Services', 'Restauration', 'Automobile', 
    'Électricité', 'Plomberie', 'Informatique', 'Commerce', 'Logistique'
  ];

  const certificationTypes = [
    'CAP', 'BAC Pro', 'BTS', 'Titre professionnel', 'Certification interne', 'Autre'
  ];

  const resetForm = () => {
    setFormData({});
    setEditingId(null);
    setShowForm(false);
  };

  const saveModule = () => {
    if (!formData.title || !formData.sector || !formData.startDate) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir les champs obligatoires",
      });
      return;
    }

    const module: TrainingModule = {
      id: editingId || Date.now().toString(),
      title: formData.title || '',
      sector: formData.sector || '',
      duration: formData.duration || 0,
      startDate: formData.startDate || '',
      endDate: formData.endDate || '',
      instructor: formData.instructor || '',
      students: formData.students || 0,
      objectives: formData.objectives || '',
      skills: formData.skills || [],
      certification: formData.certification || '',
      status: formData.status || 'planned',
      prerequisites: formData.prerequisites || '',
      resources: formData.resources || ''
    };

    let updatedModules;
    if (editingId) {
      updatedModules = data.modules.map(m => m.id === editingId ? module : m);
    } else {
      updatedModules = [...data.modules, module];
    }

    const newData = { ...data, modules: updatedModules };
    setData(newData);
    setSavedData(newData);
    resetForm();

    toast({
      title: "Module sauvegardé",
      description: `${module.title} a été ${editingId ? 'modifié' : 'ajouté'} avec succès.`,
    });
  };

  const editModule = (module: TrainingModule) => {
    setFormData(module);
    setEditingId(module.id);
    setShowForm(true);
  };

  const deleteModule = (id: string) => {
    const updatedModules = data.modules.filter(m => m.id !== id);
    const newData = { ...data, modules: updatedModules };
    setData(newData);
    setSavedData(newData);
    
    toast({
      title: "Module supprimé",
      description: "Le module a été supprimé avec succès.",
    });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'planned': 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-yellow-100 text-yellow-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      'planned': 'Planifié',
      'in-progress': 'En cours',
      'completed': 'Terminé',
      'cancelled': 'Annulé'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const calculateStats = () => {
    const total = data.modules.length;
    const completed = data.modules.filter(m => m.status === 'completed').length;
    const inProgress = data.modules.filter(m => m.status === 'in-progress').length;
    const totalHours = data.modules.reduce((sum, m) => sum + m.duration, 0);
    const totalStudents = data.modules.reduce((sum, m) => sum + m.students, 0);

    return { total, completed, inProgress, totalHours, totalStudents };
  };

  const stats = calculateStats();

  const groupModulesByMonth = () => {
    const grouped: { [key: string]: TrainingModule[] } = {};
    
    data.modules.forEach(module => {
      if (module.startDate) {
        const date = new Date(module.startDate);
        const monthKey = date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' });
        if (!grouped[monthKey]) {
          grouped[monthKey] = [];
        }
        grouped[monthKey].push(module);
      }
    });

    return grouped;
  };

  const modulesByMonth = groupModulesByMonth();

  return (
    <section id="training-planner">
      <h1 className="flex items-center gap-2 mb-6 text-2xl font-bold text-gray-800">
        <Calendar className="w-6 h-6" />
        Planificateur de Formations
      </h1>
      
      <p className="mb-6 text-gray-600 leading-relaxed">
        Organisez et planifiez vos modules de formation, certifications et calendrier pédagogique annuel.
      </p>

      <div className="grid md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Modules total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-sm text-gray-600">Terminés</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.inProgress}</div>
            <div className="text-sm text-gray-600">En cours</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.totalHours}</div>
            <div className="text-sm text-gray-600">Heures total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.totalStudents}</div>
            <div className="text-sm text-gray-600">Étudiants</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          <Button
            onClick={() => setCurrentView('list')}
            className={currentView === 'list' ? 'btn-primary' : 'btn-secondary'}
          >
            Vue liste
          </Button>
          <Button
            onClick={() => setCurrentView('calendar')}
            className={currentView === 'calendar' ? 'btn-primary' : 'btn-secondary'}
          >
            Vue calendrier
          </Button>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="btn-primary"
        >
          Ajouter un module
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingId ? 'Modifier' : 'Nouveau'} module de formation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Titre du module *</Label>
                <Input
                  id="title"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Ex: Initiation à la maçonnerie"
                />
              </div>
              <div>
                <Label>Secteur *</Label>
                <Select
                  value={formData.sector || ''}
                  onValueChange={(value) => setFormData({...formData, sector: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir un secteur" />
                  </SelectTrigger>
                  <SelectContent>
                    {sectors.map(sector => (
                      <SelectItem key={sector} value={sector}>
                        {sector}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="duration">Durée (heures)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration || 0}
                  onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value) || 0})}
                  placeholder="40"
                />
              </div>
              <div>
                <Label htmlFor="start-date">Date de début *</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={formData.startDate || ''}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="end-date">Date de fin</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={formData.endDate || ''}
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="students">Nb étudiants</Label>
                <Input
                  id="students"
                  type="number"
                  value={formData.students || 0}
                  onChange={(e) => setFormData({...formData, students: parseInt(e.target.value) || 0})}
                  placeholder="12"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="instructor">Formateur</Label>
                <Input
                  id="instructor"
                  value={formData.instructor || ''}
                  onChange={(e) => setFormData({...formData, instructor: e.target.value})}
                  placeholder="Nom du formateur"
                />
              </div>
              <div>
                <Label>Certification visée</Label>
                <Select
                  value={formData.certification || ''}
                  onValueChange={(value) => setFormData({...formData, certification: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Type de certification" />
                  </SelectTrigger>
                  <SelectContent>
                    {certificationTypes.map(cert => (
                      <SelectItem key={cert} value={cert}>
                        {cert}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="objectives">Objectifs pédagogiques</Label>
              <Textarea
                id="objectives"
                value={formData.objectives || ''}
                onChange={(e) => setFormData({...formData, objectives: e.target.value})}
                placeholder="Définir les objectifs d'apprentissage..."
                rows={3}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="prerequisites">Prérequis</Label>
                <Textarea
                  id="prerequisites"
                  value={formData.prerequisites || ''}
                  onChange={(e) => setFormData({...formData, prerequisites: e.target.value})}
                  placeholder="Connaissances requises..."
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="resources">Ressources nécessaires</Label>
                <Textarea
                  id="resources"
                  value={formData.resources || ''}
                  onChange={(e) => setFormData({...formData, resources: e.target.value})}
                  placeholder="Matériel, outils, supports..."
                  rows={2}
                />
              </div>
            </div>

            <div>
              <Label>Statut</Label>
              <Select
                value={formData.status || 'planned'}
                onValueChange={(value) => setFormData({...formData, status: value as any})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planned">Planifié</SelectItem>
                  <SelectItem value="in-progress">En cours</SelectItem>
                  <SelectItem value="completed">Terminé</SelectItem>
                  <SelectItem value="cancelled">Annulé</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3">
              <Button onClick={saveModule} className="btn-primary">
                {editingId ? 'Modifier' : 'Ajouter'}
              </Button>
              <Button onClick={resetForm} className="btn-secondary">
                Annuler
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {currentView === 'list' && (
        <div className="space-y-4">
          {data.modules.map(module => (
            <Card key={module.id} className="card-hover">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{module.title}</h3>
                      <Badge className={getStatusColor(module.status)}>
                        {getStatusLabel(module.status)}
                      </Badge>
                      <Badge variant="outline">{module.sector}</Badge>
                      {module.certification && (
                        <Badge variant="outline" className="bg-purple-50 text-purple-700">
                          <Award className="w-3 h-3 mr-1" />
                          {module.certification}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(module.startDate).toLocaleDateString('fr-FR')}
                        {module.endDate && ` - ${new Date(module.endDate).toLocaleDateString('fr-FR')}`}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {module.duration}h
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {module.students} étudiants
                      </div>
                      {module.instructor && (
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          {module.instructor}
                        </div>
                      )}
                    </div>

                    {module.objectives && (
                      <div className="bg-blue-50 p-3 rounded-lg mb-3">
                        <h4 className="font-medium text-blue-900 mb-1">Objectifs:</h4>
                        <p className="text-sm text-blue-800">{module.objectives}</p>
                      </div>
                    )}

                    <div className="flex gap-4 text-xs text-gray-500">
                      {module.prerequisites && (
                        <div>
                          <span className="font-medium">Prérequis:</span> {module.prerequisites}
                        </div>
                      )}
                      {module.resources && (
                        <div>
                          <span className="font-medium">Ressources:</span> {module.resources}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button 
                    onClick={() => editModule(module)}
                    className="btn-secondary text-xs px-3 py-1"
                  >
                    Modifier
                  </Button>
                  <Button 
                    onClick={() => deleteModule(module.id)}
                    className="btn-danger text-xs px-3 py-1"
                  >
                    Supprimer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {data.modules.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Aucun module de formation planifié.</p>
                <p className="text-sm">Cliquez sur "Ajouter un module" pour commencer.</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {currentView === 'calendar' && (
        <div className="space-y-6">
          {Object.entries(modulesByMonth).map(([month, modules]) => (
            <Card key={month}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {month}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {modules.map(module => (
                    <div key={module.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          module.status === 'completed' ? 'bg-green-500' :
                          module.status === 'in-progress' ? 'bg-yellow-500' :
                          module.status === 'cancelled' ? 'bg-red-500' : 'bg-blue-500'
                        }`}></div>
                        <div>
                          <div className="font-medium">{module.title}</div>
                          <div className="text-sm text-gray-600">
                            {module.sector} • {module.duration}h • {module.students} étudiants
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(module.startDate).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          {Object.keys(modulesByMonth).length === 0 && (
            <Card>
              <CardContent className="p-8 text-center text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Aucun module planifié dans le calendrier.</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </section>
  );
}