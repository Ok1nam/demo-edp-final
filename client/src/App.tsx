import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import LoginForm from "./components/LoginForm";
import Home from "./pages/Home";
import Tools from "./pages/Tools";
import ResultatFiscal from "./pages/ResultatFiscal";
import TvaCoefficient from "./pages/TvaCoefficient";
import PlanComptable from "./pages/PlanComptable";
import React from "react";
import Questionnaire from "./pages/Questionnaire";
import Calculators from "./pages/Calculators";
import BusinessPlan from "./pages/BusinessPlan";
import PartnershipTracker from "./pages/PartnershipTracker";
import PedagogicalCosts from "./pages/PedagogicalCosts";
import TrainingPlanner from "./pages/TrainingPlanner";
import SubsidyGenerator from "@/pages/SubsidyGenerator";
import StatutsGenerator from "@/pages/StatutsGenerator";
import UnderDevelopment from "@/pages/UnderDevelopment";
import Dashboard from "./pages/Dashboard";
import LocationAnalysis from "./pages/LocationAnalysis";
import Guides from "./pages/Guides";
import Methodology from "./pages/Methodology";
import Annexes from "./pages/Annexes";
import Contact from "./pages/Contact";
import { useState } from "react";
import { useAuth } from "./hooks/useAuth";

function Router() {
  const [currentPage, setCurrentPage] = useState("accueil");
  const { isAuthenticated, login } = useAuth();

  const navigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Si l'utilisateur n'est pas connecté, afficher le formulaire de connexion
  if (!isAuthenticated) {
    return <LoginForm onLogin={login} />;
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "accueil": return <Home navigate={navigate} />;
      case "outils": return <Tools navigate={navigate} />;
      case "arbre": return <Questionnaire navigate={navigate} />;
      case "calculateurs": return <Calculators />;
      case "business-plan": return <BusinessPlan />;
      case "partenariats": return <PartnershipTracker />;
      case "couts-pedagogiques": return <PedagogicalCosts />;
      case "planification": return <TrainingPlanner />;
      case 'subventions': return <SubsidyGenerator />;
      case 'statuts': return <StatutsGenerator />;
      case "tableau-bord": return <Dashboard />;
      case "cartographie": return <LocationAnalysis />;
      case "guides": return <Guides />;
      case "methodo": return <Methodology />;
      case "annexes": return <Annexes />;
      case "expert-comptable": 
      case "resultat-fiscal": return <ResultatFiscal />;
      case "plan-comptable": return <PlanComptable />;
      case "tva-coefficient": return <TvaCoefficient />;
      case "edp": return <Contact />;
      case "budget-creation": return <Calculators />;
      
      
      // Pages en cours de développement
      case "criteres-label": return <UnderDevelopment title="Critères pour obtenir le label" />;
      case "pret-subordonne": return <UnderDevelopment title="Contrat de prêt subordonné" />;
      case "habilitation-taxe": return <UnderDevelopment title="Habilitation taxe apprentissage" />;
      case "prix-vente": return <UnderDevelopment title="Prix de vente des produits" />;
      case "rapport-adapte": return <UnderDevelopment title="Modèle de rapport adapté" />;
      case "suivi-subventions": return <UnderDevelopment title="Suivi des subventions" />;
      case "suivi-prets": return <UnderDevelopment title="Suivi des prêts" />;
      case "organigramme": return <UnderDevelopment title="Exemple d'organigramme" />;
      case "entretiens": return <UnderDevelopment title="Entretiens porteurs de projet" />;
      case "guide-tva": return <UnderDevelopment title="Guide d'application de la TVA" />;
      case "etude-marche": return <UnderDevelopment title="Étude de marché" />;
      
      default: return <Home navigate={navigate} />;
    }
  };
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;