import * as React from "react"

import { useState, useEffect } from "react";
import { 
  Home, 
  Wrench, 
  BarChart3, 
  BookOpen, 
  Phone,
  FileText,
  Calculator,
  TrendingUp,
  Building,
  CheckSquare,
  DollarSign,
  Folder,
  Euro,
  PieChart,
  MapPin,
  Users,
  MessageCircle,
  Scale,
  Target
} from "lucide-react";

interface NavigationProps {
  navigate: (page: string) => void;
}

export default function Navigation({ navigate }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  useEffect(() => {
    const handleToggle = (event: CustomEvent) => {
      setIsOpen(event.detail);
    };

    window.addEventListener('toggleNavigation', handleToggle as EventListener);
    
    return () => {
      window.removeEventListener('toggleNavigation', handleToggle as EventListener);
    };
  }, []);

  const handleNavClick = (page: string) => {
    navigate(page);
    setIsOpen(false);
    setOpenSubmenu(null);
    // Reset burger menu state
    const event = new CustomEvent('toggleNavigation', { detail: false });
    window.dispatchEvent(event);
  };

  const toggleSubmenu = (submenu: string) => {
    setOpenSubmenu(openSubmenu === submenu ? null : submenu);
  };

  const menuStructure = [
    {
      id: "accueil",
      label: "Accueil",
      icon: Home,
      items: [
        { id: "accueil", label: "Accueil", icon: Home }
      ]
    },
    {
      id: "outils",
      label: "Outils",
      icon: Wrench,
      items: [
        { id: "plan-comptable", label: "Plan comptable", icon: FileText },
        { id: "tva-coefficient", label: "Trame de calcul du coeff. de déduction de TVA", icon: Calculator },
        { id: "resultat-fiscal", label: "Trame de calcul du résultat fiscal", icon: TrendingUp },
        { id: "budget-creation", label: "Trame de budget à la création", icon: DollarSign },
        { id: "arbre", label: "Arbre à la décision", icon: Target },
        { id: "statuts", label: "Générateur de statuts", icon: Building },
        { id: "criteres-label", label: "Critères label", icon: CheckSquare },
        { id: "subventions", label: "Dossier type demande subvention", icon: Folder },
        { id: "pret-subordonne", label: "Exemple de contrat de prêt subordonné", icon: FileText },
        { id: "habilitation-taxe", label: "Exemple de formulaire de demande d'habilitation taxe apprentissage", icon: Euro },
        { id: "calculateurs", label: "Tableau calcul de coût", icon: Calculator },
        { id: "prix-vente", label: "Tableau de détermination du prix de vente des produits", icon: PieChart },
        { id: "rapport-adapte", label: "Modèle de rapport adapté", icon: FileText },
        { id: "tableau-bord", label: "Tableau de bord financier & extra-financier", icon: BarChart3 }

      ]
    },
    {
      id: "suivis",
      label: "Suivis",
      icon: BarChart3,
      items: [
        { id: "suivi-subventions", label: "Suivi des subventions", icon: Euro },
        { id: "suivi-prets", label: "Suivi des prêts", icon: DollarSign },
        { id: "partenariats", label: "Suivi des partenariats", icon: Users },
      ]
    },
    {
      id: "documentation",
      label: "Documentation & Guides",
      icon: BookOpen,
      items: [
        { id: "methodo", label: "Méthodologie", icon: BookOpen },
        { id: "cartographie", label: "Cartographie des écoles de production en France", icon: MapPin },
        { id: "organigramme", label: "Exemple d'organigramme", icon: Building },
        { id: "entretiens", label: "Entretiens effectués auprès des porteurs de projet", icon: MessageCircle },
        { id: "guide-tva", label: "Guide d'application de la TVA", icon: Scale },
        { id: "etude-marche", label: "Étude du marché du secteur sélectionné", icon: Target }
      ]
    },
    {
      id: "contact",
      label: "Contact & Aide",
      icon: Phone,
      items: [
        { id: "expert-comptable", label: "A propos", icon: Calculator },
        { id: "edp", label: "Ecoles de production", icon: Building }
      ]
    }
  ];

  return (
    <nav 
      className={`fixed top-0 right-0 w-80 h-full bg-gray-800 transition-transform duration-300 pt-16 z-40 shadow-lg overflow-y-auto ${
        isOpen ? 'transform translate-x-0' : 'transform translate-x-full'
      }`}
    >
      <ul className="list-none">
        {menuStructure.map((section) => (
          <li key={section.id} className="border-b border-gray-600">
            <button
              onClick={() => section.items.length > 1 ? toggleSubmenu(section.id) : handleNavClick(section.items[0].id)}
              className="w-full flex items-center justify-between gap-3 p-4 text-white text-lg hover:bg-gray-700 transition-colors duration-200 text-left font-semibold"
            >
              <span className="flex items-center gap-3">
                <section.icon className="w-5 h-5" />
                {section.label}
              </span>
              {section.items.length > 1 && (
                <span
                  className={`transform transition-transform duration-200 inline-block px-1 rounded bg-white text-black ${
                    openSubmenu === section.id ? 'rotate-90' : ''
                  }`}
                >
                  ▶
                </span>
              )}
            </button>
            
            {section.items.length > 1 && openSubmenu === section.id && (
              <ul className="bg-gray-700">
                {section.items.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => handleNavClick(item.id)}
                      className="w-full flex items-center gap-3 pl-12 pr-4 py-3 text-white text-sm hover:bg-gray-600 transition-colors duration-200 text-left"
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
