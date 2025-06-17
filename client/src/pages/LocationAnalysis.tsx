import { useState } from "react";
import { MapPin, TrendingUp, Building, Users, Factory, Car, Wifi, Euro } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useToast } from "@/hooks/use-toast";

interface LocationCriteria {
  population: number;
  unemploymentRate: number;
  averageIncome: number;
  industrialPresence: number;
  transportAccess: number;
  educationLevel: number;
  competitionLevel: number;
  localSupport: number;
}

interface LocationAnalysis {
  id: string;
  cityName: string;
  region: string;
  postalCode: string;
  targetSectors: string[];
  criteria: LocationCriteria;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  overallScore: number;
  recommendation: string;
  notes: string;
  analyzedDate: string;
}

export default function LocationAnalysis() {
  const { toast } = useToast();
  const [savedData, setSavedData] = useLocalStorage<LocationAnalysis[]>('location_analyses', []);
  const [analyses, setAnalyses] = useState<LocationAnalysis[]>(savedData);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<LocationAnalysis>>({});

  const sectors = [
    'Bâtiment', 'Industrie manufacturière', 'Automobile', 'Aéronautique', 
    'Électronique', 'Agroalimentaire', 'Logistique', 'Services', 'Numérique', 'Artisanat'
  ];

  const criteriaLabels = {
    population: 'Bassin de population',
    unemploymentRate: 'Taux de chômage des jeunes',
    averageIncome: 'Niveau de revenus',
    industrialPresence: 'Tissu industriel',
    transportAccess: 'Accessibilité transports',
    educationLevel: 'Offre éducative',
    competitionLevel: 'Concurrence formations',
    localSupport: 'Soutien des collectivités'
  };

  const resetForm = () => {
    setFormData({
      criteria: {
        population: 50,
        unemploymentRate: 50,
        averageIncome: 50,
        industrialPresence: 50,
        transportAccess: 50,
        educationLevel: 50,
        competitionLevel: 50,
        localSupport: 50
      },
      targetSectors: [],
      strengths: [],
      weaknesses: [],
      opportunities: [],
      threats: []
    });
    setEditingId(null);
    setShowForm(false);
  };

  const calculateScore = (criteria: LocationCriteria) => {
    const weights = {
      population: 0.15,
      unemploymentRate: 0.20, // Higher unemployment = more need = higher score
      averageIncome: 0.10,
      industrialPresence: 0.20,
      transportAccess: 0.15,
      educationLevel: 0.05,
      competitionLevel: 0.10, // Lower competition = higher score
      localSupport: 0.05
    };

    // Adjust scoring for unemployment and competition (inverse relationship)
    const adjustedCriteria = {
      ...criteria,
      unemploymentRate: criteria.unemploymentRate, // High unemployment = good for EDP
      competitionLevel: 100 - criteria.competitionLevel // Low competition = good
    };

    const score = Object.entries(weights).reduce((total, [key, weight]) => {
      return total + (adjustedCriteria[key as keyof LocationCriteria] * weight);
    }, 0);

    return Math.round(score);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-blue-600 bg-blue-50';
    if (score >= 40) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Bon';
    if (score >= 40) return 'Moyen';
    return 'Faible';
  };

  const saveAnalysis = () => {
    if (!formData.cityName || !formData.region) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir les champs obligatoires",
      });
      return;
    }

    const score = calculateScore(formData.criteria!);
    
    const analysis: LocationAnalysis = {
      id: editingId || Date.now().toString(),
      cityName: formData.cityName || '',
      region: formData.region || '',
      postalCode: formData.postalCode || '',
      targetSectors: formData.targetSectors || [],
      criteria: formData.criteria!,
      strengths: formData.strengths || [],
      weaknesses: formData.weaknesses || [],
      opportunities: formData.opportunities || [],
      threats: formData.threats || [],
      overallScore: score,
      recommendation: generateRecommendation(score),
      notes: formData.notes || '',
      analyzedDate: new Date().toISOString().split('T')[0]
    };

    let updatedAnalyses;
    if (editingId) {
      updatedAnalyses = analyses.map(a => a.id === editingId ? analysis : a);
    } else {
      updatedAnalyses = [...analyses, analysis];
    }

    setAnalyses(updatedAnalyses);
    setSavedData(updatedAnalyses);
    resetForm();

    toast({
      title: "Analyse sauvegardée",
      description: `${analysis.cityName} a été ${editingId ? 'modifiée' : 'ajoutée'} avec succès.`,
    });
  };

  const generateRecommendation = (score: number) => {
    if (score >= 80) {
      return "Localisation très favorable. Conditions optimales pour l'implantation d'une école de production.";
    } else if (score >= 60) {
      return "Localisation favorable. Quelques points d'attention à surveiller mais contexte propice.";
    } else if (score >= 40) {
      return "Localisation moyenne. Nécessite des actions spécifiques pour compenser les faiblesses identifiées.";
    } else {
      return "Localisation peu favorable. Recommandation d'étudier d'autres territoires ou de revoir le projet.";
    }
  };

  const editAnalysis = (analysis: LocationAnalysis) => {
    setFormData(analysis);
    setEditingId(analysis.id);
    setShowForm(true);
  };

  const deleteAnalysis = (id: string) => {
    const updatedAnalyses = analyses.filter(a => a.id !== id);
    setAnalyses(updatedAnalyses);
    setSavedData(updatedAnalyses);
    
    toast({
      title: "Analyse supprimée",
      description: "L'analyse territoriale a été supprimée.",
    });
  };

  const updateCriteria = (key: keyof LocationCriteria, value: number) => {
    setFormData({
      ...formData,
      criteria: {
        ...formData.criteria!,
        [key]: value
      }
    });
  };

  const addListItem = (field: 'strengths' | 'weaknesses' | 'opportunities' | 'threats', value: string) => {
    if (!value.trim()) return;
    
    setFormData({
      ...formData,
      [field]: [...(formData[field] || []), value.trim()]
    });
  };

  const removeListItem = (field: 'strengths' | 'weaknesses' | 'opportunities' | 'threats', index: number) => {
    setFormData({
      ...formData,
      [field]: (formData[field] || []).filter((_, i) => i !== index)
    });
  };

  return (
    <section id="location-analysis">
      <h1 className="flex items-center gap-2 mb-6 text-2xl font-bold text-gray-800">
        <MapPin className="w-6 h-6" />
        Simulateur d'Implantation Géographique
      </h1>
      
      <p className="mb-6 text-gray-600 leading-relaxed">
        Analysez le potentiel d'implantation de votre école de production selon différents critères territoriaux.
      </p>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Analyses territoriales</h2>
        <Button 
          onClick={() => setShowForm(true)}
          className="btn-primary"
        >
          Nouvelle analyse
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingId ? 'Modifier' : 'Nouvelle'} analyse territoriale</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city-name">Ville/Commune *</Label>
                <Input
                  id="city-name"
                  value={formData.cityName || ''}
                  onChange={(e) => setFormData({...formData, cityName: e.target.value})}
                  placeholder="Ex: Lyon"
                />
              </div>
              <div>
                <Label htmlFor="region">Région *</Label>
                <Input
                  id="region"
                  value={formData.region || ''}
                  onChange={(e) => setFormData({...formData, region: e.target.value})}
                  placeholder="Ex: Auvergne-Rhône-Alpes"
                />
              </div>
              <div>
                <Label htmlFor="postal-code">Code postal</Label>
                <Input
                  id="postal-code"
                  value={formData.postalCode || ''}
                  onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                  placeholder="69000"
                />
              </div>
            </div>

            <div>
              <Label>Secteurs d'activité visés</Label>
              <div className="grid md:grid-cols-5 gap-2 mt-2">
                {sectors.map(sector => (
                  <label key={sector} className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={formData.targetSectors?.includes(sector) || false}
                      onChange={(e) => {
                        const current = formData.targetSectors || [];
                        if (e.target.checked) {
                          setFormData({...formData, targetSectors: [...current, sector]});
                        } else {
                          setFormData({...formData, targetSectors: current.filter(s => s !== sector)});
                        }
                      }}
                      className="rounded"
                    />
                    <span>{sector}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Critères d'évaluation (0-100)</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(criteriaLabels).map(([key, label]) => (
                  <div key={key}>
                    <Label>{label}</Label>
                    <div className="flex items-center gap-3 mt-1">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={formData.criteria?.[key as keyof LocationCriteria] || 50}
                        onChange={(e) => updateCriteria(key as keyof LocationCriteria, parseInt(e.target.value))}
                        className="flex-1"
                      />
                      <span className="w-12 text-sm font-medium">
                        {formData.criteria?.[key as keyof LocationCriteria] || 50}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-green-700 mb-2">Forces</h4>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ajouter une force..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addListItem('strengths', e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                  </div>
                  {formData.strengths?.map((item, index) => (
                    <div key={index} className="flex items-center justify-between bg-green-50 p-2 rounded">
                      <span className="text-sm">{item}</span>
                      <Button
                        onClick={() => removeListItem('strengths', index)}
                        className="text-xs px-2 py-1 btn-danger"
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-red-700 mb-2">Faiblesses</h4>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ajouter une faiblesse..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addListItem('weaknesses', e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                  </div>
                  {formData.weaknesses?.map((item, index) => (
                    <div key={index} className="flex items-center justify-between bg-red-50 p-2 rounded">
                      <span className="text-sm">{item}</span>
                      <Button
                        onClick={() => removeListItem('weaknesses', index)}
                        className="text-xs px-2 py-1 btn-danger"
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-blue-700 mb-2">Opportunités</h4>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ajouter une opportunité..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addListItem('opportunities', e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                  </div>
                  {formData.opportunities?.map((item, index) => (
                    <div key={index} className="flex items-center justify-between bg-blue-50 p-2 rounded">
                      <span className="text-sm">{item}</span>
                      <Button
                        onClick={() => removeListItem('opportunities', index)}
                        className="text-xs px-2 py-1 btn-danger"
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-orange-700 mb-2">Menaces</h4>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ajouter une menace..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addListItem('threats', e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                  </div>
                  {formData.threats?.map((item, index) => (
                    <div key={index} className="flex items-center justify-between bg-orange-50 p-2 rounded">
                      <span className="text-sm">{item}</span>
                      <Button
                        onClick={() => removeListItem('threats', index)}
                        className="text-xs px-2 py-1 btn-danger"
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notes complémentaires</Label>
              <Textarea
                id="notes"
                value={formData.notes || ''}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Observations particulières, données locales..."
                rows={3}
              />
            </div>

            {formData.criteria && (
              <Card className="bg-gray-50">
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-1">
                      {calculateScore(formData.criteria)}/100
                    </div>
                    <div className="text-sm text-gray-600">Score d'attractivité</div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex gap-3">
              <Button onClick={saveAnalysis} className="btn-primary">
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
        {analyses.map(analysis => (
          <Card key={analysis.id} className="card-hover">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{analysis.cityName}</h3>
                    <span className="text-sm text-gray-600">{analysis.region}</span>
                    {analysis.postalCode && (
                      <span className="text-sm text-gray-500">({analysis.postalCode})</span>
                    )}
                  </div>
                  
                  {analysis.targetSectors.length > 0 && (
                    <div className="mb-3">
                      <div className="text-sm text-gray-600 mb-1">Secteurs ciblés:</div>
                      <div className="flex flex-wrap gap-1">
                        {analysis.targetSectors.map(sector => (
                          <span key={sector} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            {sector}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className={`text-center p-4 rounded-lg ${getScoreColor(analysis.overallScore)}`}>
                  <div className="text-2xl font-bold">{analysis.overallScore}/100</div>
                  <div className="text-xs">{getScoreLabel(analysis.overallScore)}</div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-green-700">Forces ({analysis.strengths.length})</h4>
                  {analysis.strengths.slice(0, 3).map((strength, index) => (
                    <div key={index} className="text-sm text-gray-600">• {strength}</div>
                  ))}
                  {analysis.strengths.length > 3 && (
                    <div className="text-xs text-gray-500">+ {analysis.strengths.length - 3} autres...</div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-red-700">Faiblesses ({analysis.weaknesses.length})</h4>
                  {analysis.weaknesses.slice(0, 3).map((weakness, index) => (
                    <div key={index} className="text-sm text-gray-600">• {weakness}</div>
                  ))}
                  {analysis.weaknesses.length > 3 && (
                    <div className="text-xs text-gray-500">+ {analysis.weaknesses.length - 3} autres...</div>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg mb-4">
                <h4 className="font-medium text-blue-900 mb-1">Recommandation:</h4>
                <p className="text-sm text-blue-800">{analysis.recommendation}</p>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-500">
                  Analysé le {new Date(analysis.analyzedDate).toLocaleDateString('fr-FR')}
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => editAnalysis(analysis)}
                    className="btn-secondary text-xs px-3 py-1"
                  >
                    Modifier
                  </Button>
                  <Button 
                    onClick={() => deleteAnalysis(analysis.id)}
                    className="btn-danger text-xs px-3 py-1"
                  >
                    Supprimer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {analyses.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center text-gray-500">
              <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Aucune analyse territoriale créée.</p>
              <p className="text-sm">Cliquez sur "Nouvelle analyse" pour commencer.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}