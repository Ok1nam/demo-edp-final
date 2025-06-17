import { useState, useEffect } from "react";
import { BarChart3, TrendingUp, Users, Euro, Target, Clock, Award, Building } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface DashboardMetrics {
  totalStudents: number;
  activeModules: number;
  completedModules: number;
  totalBudget: number;
  totalRevenue: number;
  activePartnerships: number;
  pendingApplications: number;
  averageCostPerStudent: number;
  profitMargin: number;
  certificationRate: number;
}

interface RecentActivity {
  id: string;
  type: 'module' | 'partnership' | 'subsidy' | 'budget';
  title: string;
  description: string;
  date: string;
  status: 'success' | 'warning' | 'info';
}

export default function Dashboard() {
  const [questionnaireData] = useLocalStorage('questionnaire_state', null);
  const [businessPlanData] = useLocalStorage('business_plan_data', null);
  const [rentabilityData] = useLocalStorage('rentability_data', null);
  const [partnershipsData] = useLocalStorage('partnerships_data', []);
  const [subsidyData] = useLocalStorage('subsidy_applications', []);
  const [trainingData] = useLocalStorage('training_plan_data', { modules: [] });
  const [pedagogicalData] = useLocalStorage('pedagogical_costs_data', { sectors: [] });

  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalStudents: 0,
    activeModules: 0,
    completedModules: 0,
    totalBudget: 0,
    totalRevenue: 0,
    activePartnerships: 0,
    pendingApplications: 0,
    averageCostPerStudent: 0,
    profitMargin: 0,
    certificationRate: 0
  });

  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);

  useEffect(() => {
    calculateMetrics();
    generateRecentActivities();
  }, [questionnaireData, businessPlanData, rentabilityData, partnershipsData, subsidyData, trainingData, pedagogicalData]);

  const calculateMetrics = () => {
    // Calculate students
    const studentsFromTraining = trainingData?.modules?.reduce((sum: number, module: any) => sum + (module.students || 0), 0) || 0;
    const studentsFromPedagogical = pedagogicalData?.sectors?.reduce((sum: number, sector: any) => sum + (sector.students || 0), 0) || 0;
    const rentabilityStudents = (rentabilityData as any)?.students || 0;
    const totalStudents = Math.max(studentsFromTraining, studentsFromPedagogical, rentabilityStudents);

    // Calculate modules
    const modules = trainingData?.modules || [];
    const activeModules = modules.filter((m: any) => m.status === 'in-progress').length;
    const completedModules = modules.filter((m: any) => m.status === 'completed').length;

    // Calculate budget and revenue
    const totalBudget = (businessPlanData as any)?.initialInvestment || 0;
    const businessRevenue = (businessPlanData as any)?.financialProjections?.year1?.revenue || 0;
    const rentabilityRevenue = ((rentabilityData as any)?.students || 0) * ((rentabilityData as any)?.tuitionFee || 0) + ((rentabilityData as any)?.subsidies || 0) + ((rentabilityData as any)?.otherRevenue || 0);
    const projectedRevenue = businessRevenue || rentabilityRevenue;

    // Calculate partnerships
    const partnerships = partnershipsData || [];
    const activePartnerships = partnerships.filter((p: any) => p.status === 'actif').length;

    // Calculate subsidy applications
    const applications = subsidyData || [];
    const pendingApplications = applications.filter((a: any) => a.status === 'submitted').length;

    // Calculate costs
    const totalCosts = pedagogicalData?.sectors?.reduce((sum: number, sector: any) => {
      const trainerCosts = sector.trainers * sector.trainerSalary;
      const directCosts = trainerCosts + sector.equipment + sector.materials + sector.certifications;
      const overheadCosts = directCosts * (pedagogicalData.overheadRate / 100);
      return sum + directCosts + overheadCosts;
    }, 0) || 0;

    const averageCostPerStudent = totalStudents > 0 ? totalCosts / totalStudents : 0;
    const profitMargin = projectedRevenue > 0 ? ((projectedRevenue - totalCosts) / projectedRevenue) * 100 : 0;

    // Estimate certification rate (mock calculation based on completed modules)
    const certificationRate = modules.length > 0 ? (completedModules / modules.length) * 100 : 0;

    setMetrics({
      totalStudents,
      activeModules,
      completedModules,
      totalBudget,
      totalRevenue: projectedRevenue,
      activePartnerships,
      pendingApplications,
      averageCostPerStudent,
      profitMargin,
      certificationRate
    });
  };

  const generateRecentActivities = () => {
    const activities: RecentActivity[] = [];

    // Add recent training modules
    if (trainingData?.modules) {
      trainingData.modules.slice(-3).forEach((module: any) => {
        activities.push({
          id: `module-${module.id}`,
          type: 'module',
          title: `Module ${module.title}`,
          description: `${module.sector} - ${module.students} étudiants`,
          date: module.startDate || new Date().toISOString().split('T')[0],
          status: module.status === 'completed' ? 'success' : 'info'
        });
      });
    }

    // Add recent partnerships
    if (partnershipsData) {
      partnershipsData.slice(-2).forEach((partnership: any) => {
        activities.push({
          id: `partnership-${partnership.id}`,
          type: 'partnership',
          title: `Partenariat ${partnership.companyName}`,
          description: `${partnership.partnershipType} - ${partnership.students} places`,
          date: partnership.lastContact || new Date().toISOString().split('T')[0],
          status: partnership.status === 'actif' ? 'success' : 'warning'
        });
      });
    }

    // Add recent subsidy applications
    if (subsidyData) {
      subsidyData.slice(-2).forEach((app: any) => {
        activities.push({
          id: `subsidy-${app.id}`,
          type: 'subsidy',
          title: `Subvention ${app.fundingBody}`,
          description: `${app.amount.toLocaleString()} € - ${app.status}`,
          date: app.submissionDate || new Date().toISOString().split('T')[0],
          status: app.status === 'approved' ? 'success' : app.status === 'rejected' ? 'warning' : 'info'
        });
      });
    }

    // Sort by date and take latest 5
    activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setRecentActivities(activities.slice(0, 5));
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'module': return Clock;
      case 'partnership': return Building;
      case 'subsidy': return Euro;
      case 'budget': return BarChart3;
      default: return Target;
    }
  };

  const getActivityColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'info': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <section id="dashboard">
      <h1 className="flex items-center gap-2 mb-6 text-2xl font-bold text-gray-800">
        <BarChart3 className="w-6 h-6" />
        Tableau de Bord de Pilotage
      </h1>
      
      <p className="mb-6 text-gray-600 leading-relaxed">
        Vue d'ensemble des indicateurs clés de performance de votre école de production.
      </p>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Étudiants</p>
                <p className="text-2xl font-bold text-blue-600">{metrics.totalStudents}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Modules actifs</p>
                <p className="text-2xl font-bold text-green-600">{metrics.activeModules}</p>
              </div>
              <Clock className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Partenaires actifs</p>
                <p className="text-2xl font-bold text-purple-600">{metrics.activePartnerships}</p>
              </div>
              <Building className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenus projetés</p>
                <p className="text-2xl font-bold text-orange-600">{metrics.totalRevenue.toLocaleString()} €</p>
              </div>
              <Euro className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Indicateurs financiers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Marge bénéficiaire</span>
                <span className={`font-medium ${metrics.profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {metrics.profitMargin.toFixed(1)}%
                </span>
              </div>
              <Progress value={Math.max(0, Math.min(100, metrics.profitMargin + 20))} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Coût par étudiant</span>
                <span className="font-medium">{metrics.averageCostPerStudent.toLocaleString()} €</span>
              </div>
              <div className="text-xs text-gray-600">
                Budget total: {metrics.totalBudget.toLocaleString()} €
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Demandes de subventions</span>
                <span className="font-medium text-blue-600">{metrics.pendingApplications} en cours</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Indicateurs pédagogiques
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Taux de certification</span>
                <span className="font-medium text-green-600">{metrics.certificationRate.toFixed(1)}%</span>
              </div>
              <Progress value={metrics.certificationRate} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Modules terminés</span>
                <span className="font-medium">{metrics.completedModules} / {metrics.completedModules + metrics.activeModules}</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Ratio étudiant/formateur</span>
                <span className="font-medium">
                  {pedagogicalData?.sectors?.length > 0 
                    ? (metrics.totalStudents / pedagogicalData.sectors.reduce((sum: number, s: any) => sum + s.trainers, 0)).toFixed(1)
                    : '0'
                  }:1
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Activités récentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentActivities.length > 0 ? (
            <div className="space-y-3">
              {recentActivities.map(activity => {
                const IconComponent = getActivityIcon(activity.type);
                return (
                  <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <IconComponent className={`w-5 h-5 mt-0.5 ${getActivityColor(activity.status)}`} />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{activity.title}</div>
                      <div className="text-xs text-gray-600">{activity.description}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(activity.date).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Target className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Aucune activité récente</p>
              <p className="text-sm">Commencez à utiliser les outils pour voir vos données ici</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card-hover cursor-pointer" onClick={() => window.location.hash = 'arbre'}>
          <CardContent className="p-4 text-center">
            <div className="text-blue-600 font-medium">Évaluer le projet</div>
            <div className="text-xs text-gray-600">Questionnaire 20 questions</div>
          </CardContent>
        </Card>
        
        <Card className="card-hover cursor-pointer" onClick={() => window.location.hash = 'business-plan'}>
          <CardContent className="p-4 text-center">
            <div className="text-green-600 font-medium">Business Plan</div>
            <div className="text-xs text-gray-600">Créer un plan structuré</div>
          </CardContent>
        </Card>
        
        <Card className="card-hover cursor-pointer" onClick={() => window.location.hash = 'partenariats'}>
          <CardContent className="p-4 text-center">
            <div className="text-purple-600 font-medium">Ajouter un partenaire</div>
            <div className="text-xs text-gray-600">Gérer les entreprises</div>
          </CardContent>
        </Card>
        
        <Card className="card-hover cursor-pointer" onClick={() => window.location.hash = 'subventions'}>
          <CardContent className="p-4 text-center">
            <div className="text-orange-600 font-medium">Demande de subvention</div>
            <div className="text-xs text-gray-600">Financer le projet</div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}