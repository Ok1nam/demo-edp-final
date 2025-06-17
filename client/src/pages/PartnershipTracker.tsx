import { useState } from "react";
import { Handshake, Plus, Building, Phone, Mail, Calendar, Star, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useToast } from "@/hooks/use-toast";

interface Partnership {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  sector: string;
  location: string;
  partnershipType: 'stage' | 'apprentissage' | 'equipement' | 'financement' | 'autre';
  status: 'prospect' | 'contact' | 'negociation' | 'actif' | 'suspendu';
  students: number;
  notes: string;
  lastContact: string;
  nextAction: string;
}

export default function PartnershipTracker() {
  const { toast } = useToast();
  const [savedPartnerships, setSavedPartnerships] = useLocalStorage<Partnership[]>('partnerships_data', []);
  const [partnerships, setPartnerships] = useState<Partnership[]>(savedPartnerships);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Partnership>>({});

  const partnershipTypes = [
    { value: 'stage', label: 'Stages' },
    { value: 'apprentissage', label: 'Apprentissage' },
    { value: 'equipement', label: 'Équipements' },
    { value: 'financement', label: 'Financement' },
    { value: 'autre', label: 'Autre' }
  ];

  const statusOptions = [
    { value: 'prospect', label: 'Prospect', color: 'bg-gray-100 text-gray-800' },
    { value: 'contact', label: 'Premier contact', color: 'bg-blue-100 text-blue-800' },
    { value: 'negociation', label: 'En négociation', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'actif', label: 'Partenariat actif', color: 'bg-green-100 text-green-800' },
    { value: 'suspendu', label: 'Suspendu', color: 'bg-red-100 text-red-800' }
  ];

  const resetForm = () => {
    setFormData({});
    setEditingId(null);
    setShowForm(false);
  };

  const savePartnership = () => {
    if (!formData.companyName || !formData.contactPerson) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir les champs obligatoires",
      });
      return;
    }

    const partnership: Partnership = {
      id: editingId || Date.now().toString(),
      companyName: formData.companyName || '',
      contactPerson: formData.contactPerson || '',
      email: formData.email || '',
      phone: formData.phone || '',
      sector: formData.sector || '',
      location: formData.location || '',
      partnershipType: formData.partnershipType || 'stage',
      status: formData.status || 'prospect',
      students: formData.students || 0,
      notes: formData.notes || '',
      lastContact: formData.lastContact || '',
      nextAction: formData.nextAction || ''
    };

    let updatedPartnerships;
    if (editingId) {
      updatedPartnerships = partnerships.map(p => p.id === editingId ? partnership : p);
    } else {
      updatedPartnerships = [...partnerships, partnership];
    }

    setPartnerships(updatedPartnerships);
    setSavedPartnerships(updatedPartnerships);
    resetForm();

    toast({
      title: "Partenariat sauvegardé",
      description: `${partnership.companyName} a été ${editingId ? 'modifié' : 'ajouté'} avec succès.`,
    });
  };

  const editPartnership = (partnership: Partnership) => {
    setFormData(partnership);
    setEditingId(partnership.id);
    setShowForm(true);
  };

  const deletePartnership = (id: string) => {
    const updatedPartnerships = partnerships.filter(p => p.id !== id);
    setPartnerships(updatedPartnerships);
    setSavedPartnerships(updatedPartnerships);
    
    toast({
      title: "Partenariat supprimé",
      description: "Le partenariat a été supprimé avec succès.",
    });
  };

  const getStatusColor = (status: string) => {
    return statusOptions.find(s => s.value === status)?.color || 'bg-gray-100 text-gray-800';
  };

  const getStatsData = () => {
    const total = partnerships.length;
    const active = partnerships.filter(p => p.status === 'actif').length;
    const prospects = partnerships.filter(p => p.status === 'prospect').length;
    const totalStudents = partnerships.reduce((sum, p) => sum + p.students, 0);

    return { total, active, prospects, totalStudents };
  };

  const stats = getStatsData();

  return (
    <section id="partnership-tracker">
      <h1 className="flex items-center gap-2 mb-6 text-2xl font-bold text-gray-800">
        <Handshake className="w-6 h-6" />
        Suivi des Partenariats
      </h1>
      
      <p className="mb-6 text-gray-600 leading-relaxed">
        Gérez et suivez vos relations avec les entreprises partenaires pour optimiser les opportunités de stages et d'apprentissage.
      </p>

      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Partenaires total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <div className="text-sm text-gray-600">Partenariats actifs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.prospects}</div>
            <div className="text-sm text-gray-600">Prospects</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.totalStudents}</div>
            <div className="text-sm text-gray-600">Places étudiants</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Liste des partenaires</h2>
        <Button 
          onClick={() => setShowForm(true)}
          className="btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un partenaire
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingId ? 'Modifier' : 'Nouveau'} partenaire</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="company-name">Nom de l'entreprise *</Label>
                <Input
                  id="company-name"
                  value={formData.companyName || ''}
                  onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                  placeholder="Nom de l'entreprise"
                />
              </div>
              <div>
                <Label htmlFor="contact-person">Personne de contact *</Label>
                <Input
                  id="contact-person"
                  value={formData.contactPerson || ''}
                  onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                  placeholder="Nom du contact"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="contact@entreprise.com"
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
              <div>
                <Label htmlFor="location">Localisation</Label>
                <Input
                  id="location"
                  value={formData.location || ''}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  placeholder="Ville"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="sector">Secteur d'activité</Label>
                <Input
                  id="sector"
                  value={formData.sector || ''}
                  onChange={(e) => setFormData({...formData, sector: e.target.value})}
                  placeholder="Industrie, BTP..."
                />
              </div>
              <div>
                <Label>Type de partenariat</Label>
                <Select
                  value={formData.partnershipType || 'stage'}
                  onValueChange={(value) => setFormData({...formData, partnershipType: value as any})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {partnershipTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Statut</Label>
                <Select
                  value={formData.status || 'prospect'}
                  onValueChange={(value) => setFormData({...formData, status: value as any})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(status => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="students">Nombre d'étudiants</Label>
                <Input
                  id="students"
                  type="number"
                  value={formData.students || 0}
                  onChange={(e) => setFormData({...formData, students: parseInt(e.target.value) || 0})}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="last-contact">Dernier contact</Label>
                <Input
                  id="last-contact"
                  type="date"
                  value={formData.lastContact || ''}
                  onChange={(e) => setFormData({...formData, lastContact: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="next-action">Prochaine action</Label>
                <Input
                  id="next-action"
                  value={formData.nextAction || ''}
                  onChange={(e) => setFormData({...formData, nextAction: e.target.value})}
                  placeholder="Relance téléphonique..."
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes || ''}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Notes sur le partenaire..."
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <Button onClick={savePartnership} className="btn-primary">
                {editingId ? 'Modifier' : 'Ajouter'}
              </Button>
              <Button onClick={resetForm} className="btn-secondary">
                Annuler
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {partnerships.map(partnership => (
          <Card key={partnership.id} className="card-hover">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{partnership.companyName}</h3>
                    <Badge className={getStatusColor(partnership.status)}>
                      {statusOptions.find(s => s.value === partnership.status)?.label}
                    </Badge>
                    <Badge variant="outline">
                      {partnershipTypes.find(t => t.value === partnership.partnershipType)?.label}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      {partnership.contactPerson} - {partnership.sector}
                    </div>
                    {partnership.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {partnership.location}
                      </div>
                    )}
                    {partnership.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {partnership.email}
                      </div>
                    )}
                    {partnership.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {partnership.phone}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">{partnership.students}</div>
                  <div className="text-xs text-gray-600">étudiants</div>
                </div>
              </div>

              {partnership.notes && (
                <div className="bg-gray-50 p-3 rounded-lg mb-3">
                  <p className="text-sm">{partnership.notes}</p>
                </div>
              )}

              {partnership.nextAction && (
                <div className="flex items-center gap-2 text-sm text-orange-600 mb-3">
                  <Calendar className="w-4 h-4" />
                  Prochaine action: {partnership.nextAction}
                </div>
              )}

              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-500">
                  {partnership.lastContact && `Dernier contact: ${new Date(partnership.lastContact).toLocaleDateString('fr-FR')}`}
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => editPartnership(partnership)}
                    className="btn-secondary text-xs px-3 py-1"
                  >
                    Modifier
                  </Button>
                  <Button 
                    onClick={() => deletePartnership(partnership.id)}
                    className="btn-danger text-xs px-3 py-1"
                  >
                    Supprimer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {partnerships.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center text-gray-500">
              <Handshake className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Aucun partenaire enregistré pour le moment.</p>
              <p className="text-sm">Cliquez sur "Ajouter un partenaire" pour commencer.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}