import { useState } from "react";
import { FileText, Download, Euro, Building, Users, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useToast } from "@/hooks/use-toast";

interface SubsidyApplication {
  id: string;
  fundingBody: string;
  programName: string;
  amount: number;
  projectTitle: string;
  projectDescription: string;
  organizationName: string;
  siretNumber: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  targetAudience: string;
  expectedStudents: number;
  sectors: string[];
  projectDuration: number;
  startDate: string;
  objectives: string;
  methodology: string;
  partnerOrganizations: string;
  budget: {
    personnel: number;
    equipment: number;
    operations: number;
    other: number;
  };
  expectedOutcomes: string;
  evaluationCriteria: string;
  sustainability: string;
  innovation: string;
  socialImpact: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  submissionDate: string;
  responseDate: string;
}

const fundingBodies = [
  { name: "Région", programs: ["Aide à la création", "Fonds formation", "Développement économique"] },
  { name: "État", programs: ["Plan de relance", "France 2030", "Fonds social européen"] },
  { name: "Europe", programs: ["FSE+", "FEDER", "Erasmus+"] },
  { name: "Pôle Emploi", programs: ["Action de formation", "POEI", "AFPR"] },
  { name: "OPCO", programs: ["Plan de développement", "Reconversion", "Alternance"] },
  { name: "Fondations", programs: ["Fondation de France", "Fondation Total", "Autres fondations"] }
];

export default function SubsidyGenerator() {
  const { toast } = useToast();
  const [savedData, setSavedData] = useLocalStorage<SubsidyApplication[]>('subsidy_applications', []);
  const [applications, setApplications] = useState<SubsidyApplication[]>(savedData);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<SubsidyApplication>>({});
  const [selectedFundingBody, setSelectedFundingBody] = useState<string>('');

  const resetForm = () => {
    setFormData({
      budget: { personnel: 0, equipment: 0, operations: 0, other: 0 },
      sectors: [],
      status: 'draft'
    });
    setEditingId(null);
    setShowForm(false);
    setSelectedFundingBody('');
  };

  const saveApplication = () => {
    if (!formData.projectTitle || !formData.fundingBody || !formData.amount) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir les champs obligatoires",
      });
      return;
    }

    const application: SubsidyApplication = {
      id: editingId || Date.now().toString(),
      fundingBody: formData.fundingBody || '',
      programName: formData.programName || '',
      amount: formData.amount || 0,
      projectTitle: formData.projectTitle || '',
      projectDescription: formData.projectDescription || '',
      organizationName: formData.organizationName || '',
      siretNumber: formData.siretNumber || '',
      contactPerson: formData.contactPerson || '',
      email: formData.email || '',
      phone: formData.phone || '',
      address: formData.address || '',
      targetAudience: formData.targetAudience || '',
      expectedStudents: formData.expectedStudents || 0,
      sectors: formData.sectors || [],
      projectDuration: formData.projectDuration || 12,
      startDate: formData.startDate || '',
      objectives: formData.objectives || '',
      methodology: formData.methodology || '',
      partnerOrganizations: formData.partnerOrganizations || '',
      budget: formData.budget || { personnel: 0, equipment: 0, operations: 0, other: 0 },
      expectedOutcomes: formData.expectedOutcomes || '',
      evaluationCriteria: formData.evaluationCriteria || '',
      sustainability: formData.sustainability || '',
      innovation: formData.innovation || '',
      socialImpact: formData.socialImpact || '',
      status: formData.status || 'draft',
      submissionDate: formData.submissionDate || '',
      responseDate: formData.responseDate || ''
    };

    let updatedApplications;
    if (editingId) {
      updatedApplications = applications.map(a => a.id === editingId ? application : a);
    } else {
      updatedApplications = [...applications, application];
    }

    setApplications(updatedApplications);
    setSavedData(updatedApplications);
    resetForm();

    toast({
      title: "Dossier sauvegardé",
      description: `${application.projectTitle} a été ${editingId ? 'modifié' : 'créé'} avec succès.`,
    });
  };

  const editApplication = (app: SubsidyApplication) => {
    setFormData(app);
    setEditingId(app.id);
    setSelectedFundingBody(app.fundingBody);
    setShowForm(true);
  };

  const deleteApplication = (id: string) => {
    const updatedApplications = applications.filter(a => a.id !== id);
    setApplications(updatedApplications);
    setSavedData(updatedApplications);
    
    toast({
      title: "Dossier supprimé",
      description: "Le dossier de subvention a été supprimé.",
    });
  };

  const generateDocument = (appId: string) => {
    toast({
      title: "Génération en cours",
      description: "Génération du dossier PDF en cours...",
    });
  };

  const calculateTotalBudget = () => {
    if (!formData.budget) return 0;
    return Object.values(formData.budget).reduce((sum, value) => sum + (value || 0), 0);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'draft': 'bg-gray-100 text-gray-800',
      'submitted': 'bg-blue-100 text-blue-800',
      'approved': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      'draft': 'Brouillon',
      'submitted': 'Soumis',
      'approved': 'Approuvé',
      'rejected': 'Rejeté'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const calculateStats = () => {
    const total = applications.length;
    const submitted = applications.filter(a => a.status === 'submitted').length;
    const approved = applications.filter(a => a.status === 'approved').length;
    const totalAmount = applications.reduce((sum, a) => sum + a.amount, 0);

    return { total, submitted, approved, totalAmount };
  };

  const stats = calculateStats();

  return (
    <section id="subsidy-generator">
      <h1 className="flex items-center gap-2 mb-6 text-2xl font-bold text-gray-800">
        <FileText className="w-6 h-6" />
        Générateur de Dossiers de Subventions
      </h1>
      
      <p className="mb-6 text-gray-600 leading-relaxed">
        Créez des dossiers de demande de subventions structurés pour financer votre école de production.
      </p>

      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Dossiers créés</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.submitted}</div>
            <div className="text-sm text-gray-600">Dossiers soumis</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            <div className="text-sm text-gray-600">Dossiers approuvés</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.totalAmount.toLocaleString()} €</div>
            <div className="text-sm text-gray-600">Montant total demandé</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Dossiers de subventions</h2>
        <Button 
          onClick={() => setShowForm(true)}
          className="btn-primary"
        >
          Nouveau dossier
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingId ? 'Modifier' : 'Nouveau'} dossier de subvention</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="project-title">Titre du projet *</Label>
                <Input
                  id="project-title"
                  value={formData.projectTitle || ''}
                  onChange={(e) => setFormData({...formData, projectTitle: e.target.value})}
                  placeholder="École de Production XYZ"
                />
              </div>
              <div>
                <Label htmlFor="amount">Montant demandé (€) *</Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount || 0}
                  onChange={(e) => setFormData({...formData, amount: parseInt(e.target.value) || 0})}
                  placeholder="50000"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Organisme financeur *</Label>
                <Select
                  value={selectedFundingBody}
                  onValueChange={(value) => {
                    setSelectedFundingBody(value);
                    setFormData({...formData, fundingBody: value, programName: ''});
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir un organisme" />
                  </SelectTrigger>
                  <SelectContent>
                    {fundingBodies.map(body => (
                      <SelectItem key={body.name} value={body.name}>
                        {body.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Programme de financement</Label>
                <Select
                  value={formData.programName || ''}
                  onValueChange={(value) => setFormData({...formData, programName: value})}
                  disabled={!selectedFundingBody}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir un programme" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedFundingBody && fundingBodies
                      .find(body => body.name === selectedFundingBody)
                      ?.programs.map(program => (
                        <SelectItem key={program} value={program}>
                          {program}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="project-description">Description du projet</Label>
              <Textarea
                id="project-description"
                value={formData.projectDescription || ''}
                onChange={(e) => setFormData({...formData, projectDescription: e.target.value})}
                placeholder="Présentation générale du projet d'école de production..."
                rows={4}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="organization-name">Nom de l'organisation</Label>
                <Input
                  id="organization-name"
                  value={formData.organizationName || ''}
                  onChange={(e) => setFormData({...formData, organizationName: e.target.value})}
                  placeholder="Association XYZ"
                />
              </div>
              <div>
                <Label htmlFor="siret">Numéro SIRET</Label>
                <Input
                  id="siret"
                  value={formData.siretNumber || ''}
                  onChange={(e) => setFormData({...formData, siretNumber: e.target.value})}
                  placeholder="12345678901234"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="contact-person">Personne de contact</Label>
                <Input
                  id="contact-person"
                  value={formData.contactPerson || ''}
                  onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                  placeholder="Nom Prénom"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="contact@ecole.fr"
                />
              </div>
              <div>
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="01 23 45 67 89"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="expected-students">Nombre d'étudiants visés</Label>
                <Input
                  id="expected-students"
                  type="number"
                  value={formData.expectedStudents || 0}
                  onChange={(e) => setFormData({...formData, expectedStudents: parseInt(e.target.value) || 0})}
                  placeholder="20"
                />
              </div>
              <div>
                <Label htmlFor="project-duration">Durée du projet (mois)</Label>
                <Input
                  id="project-duration"
                  type="number"
                  value={formData.projectDuration || 12}
                  onChange={(e) => setFormData({...formData, projectDuration: parseInt(e.target.value) || 12})}
                  placeholder="12"
                />
              </div>
              <div>
                <Label htmlFor="start-date">Date de début</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={formData.startDate || ''}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="objectives">Objectifs du projet</Label>
              <Textarea
                id="objectives"
                value={formData.objectives || ''}
                onChange={(e) => setFormData({...formData, objectives: e.target.value})}
                placeholder="Objectifs spécifiques, mesurables, atteignables..."
                rows={3}
              />
            </div>

            <div>
              <Label>Budget prévisionnel</Label>
              <div className="grid md:grid-cols-4 gap-4 mt-2">
                <div>
                  <Label htmlFor="budget-personnel">Personnel (€)</Label>
                  <Input
                    id="budget-personnel"
                    type="number"
                    value={formData.budget?.personnel || 0}
                    onChange={(e) => setFormData({
                      ...formData, 
                      budget: { ...formData.budget, personnel: parseInt(e.target.value) || 0 } as any
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="budget-equipment">Équipements (€)</Label>
                  <Input
                    id="budget-equipment"
                    type="number"
                    value={formData.budget?.equipment || 0}
                    onChange={(e) => setFormData({
                      ...formData, 
                      budget: { ...formData.budget, equipment: parseInt(e.target.value) || 0 } as any
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="budget-operations">Fonctionnement (€)</Label>
                  <Input
                    id="budget-operations"
                    type="number"
                    value={formData.budget?.operations || 0}
                    onChange={(e) => setFormData({
                      ...formData, 
                      budget: { ...formData.budget, operations: parseInt(e.target.value) || 0 } as any
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="budget-other">Autres (€)</Label>
                  <Input
                    id="budget-other"
                    type="number"
                    value={formData.budget?.other || 0}
                    onChange={(e) => setFormData({
                      ...formData, 
                      budget: { ...formData.budget, other: parseInt(e.target.value) || 0 } as any
                    })}
                  />
                </div>
              </div>
              <div className="mt-2 text-right">
                <span className="font-semibold">Total: {calculateTotalBudget().toLocaleString()} €</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expected-outcomes">Résultats attendus</Label>
                <Textarea
                  id="expected-outcomes"
                  value={formData.expectedOutcomes || ''}
                  onChange={(e) => setFormData({...formData, expectedOutcomes: e.target.value})}
                  placeholder="Impact attendu, bénéficiaires..."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="social-impact">Impact social</Label>
                <Textarea
                  id="social-impact"
                  value={formData.socialImpact || ''}
                  onChange={(e) => setFormData({...formData, socialImpact: e.target.value})}
                  placeholder="Contribution au développement local..."
                  rows={3}
                />
              </div>
            </div>

            <div>
              <Label>Statut</Label>
              <Select
                value={formData.status || 'draft'}
                onValueChange={(value) => setFormData({...formData, status: value as any})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Brouillon</SelectItem>
                  <SelectItem value="submitted">Soumis</SelectItem>
                  <SelectItem value="approved">Approuvé</SelectItem>
                  <SelectItem value="rejected">Rejeté</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3">
              <Button onClick={saveApplication} className="btn-primary">
                {editingId ? 'Modifier' : 'Créer'}
              </Button>
              <Button onClick={resetForm} className="btn-secondary">
                Annuler
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {applications.map(app => (
          <Card key={app.id} className="card-hover">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{app.projectTitle}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                      {getStatusLabel(app.status)}
                    </span>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      {app.fundingBody} - {app.programName}
                    </div>
                    <div className="flex items-center gap-2">
                      <Euro className="w-4 h-4" />
                      {app.amount.toLocaleString()} €
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {app.expectedStudents} étudiants
                    </div>
                  </div>
                  {app.projectDescription && (
                    <p className="text-sm text-gray-700 mb-3">{app.projectDescription}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-500">
                  {app.submissionDate && `Soumis le ${new Date(app.submissionDate).toLocaleDateString('fr-FR')}`}
                  {app.responseDate && ` • Réponse le ${new Date(app.responseDate).toLocaleDateString('fr-FR')}`}
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => generateDocument(app.id)}
                    className="btn-primary text-xs px-3 py-1"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Générer PDF
                  </Button>
                  <Button 
                    onClick={() => editApplication(app)}
                    className="btn-secondary text-xs px-3 py-1"
                  >
                    Modifier
                  </Button>
                  <Button 
                    onClick={() => deleteApplication(app.id)}
                    className="btn-danger text-xs px-3 py-1"
                  >
                    Supprimer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {applications.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Aucun dossier de subvention créé.</p>
              <p className="text-sm">Cliquez sur "Nouveau dossier" pour commencer.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}