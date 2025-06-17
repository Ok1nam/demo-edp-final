import { useState, useEffect } from "react";
import { TreePine, Play, ArrowLeft, RotateCcw, Download, Save, Check, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { questions } from "@/data/questions";

interface QuestionnaireProps {
  navigate: (page: string) => void;
}

interface QuestionnaireState {
  currentIndex: number;
  responses: string[];
  isStarted: boolean;
  isCompleted: boolean;
}

export default function Questionnaire({ navigate }: QuestionnaireProps) {
  const { toast } = useToast();
  const [savedState, setSavedState] = useLocalStorage<QuestionnaireState>('questionnaire_state', {
    currentIndex: 0,
    responses: [],
    isStarted: false,
    isCompleted: false
  });

  const [state, setState] = useState<QuestionnaireState>(savedState);
  const [showAdvice, setShowAdvice] = useState(false);

  useEffect(() => {
    setSavedState(state);
  }, [state, setSavedState]);

  const startQuestionnaire = () => {
    setState({
      currentIndex: 0,
      responses: [],
      isStarted: true,
      isCompleted: false
    });
    setShowAdvice(false);
  };

  const answerQuestion = (answer: string) => {
    const newResponses = [...state.responses];
    newResponses[state.currentIndex] = answer;
    
    if (answer === 'NON') {
      setShowAdvice(true);
      setTimeout(() => {
        setShowAdvice(false);
        moveToNext(newResponses);
      }, 2000);
    } else {
      moveToNext(newResponses);
    }
  };

  const moveToNext = (responses: string[]) => {
    const nextIndex = state.currentIndex + 1;
    if (nextIndex >= questions.length) {
      setState(prev => ({
        ...prev,
        responses,
        isCompleted: true
      }));
    } else {
      setState(prev => ({
        ...prev,
        currentIndex: nextIndex,
        responses
      }));
    }
  };

  const goToPrevious = () => {
    if (state.currentIndex > 0) {
      setState(prev => ({
        ...prev,
        currentIndex: prev.currentIndex - 1
      }));
      setShowAdvice(false);
    }
  };

  const resetQuestionnaire = () => {
    startQuestionnaire();
  };

  const exportResults = () => {
    toast({
      title: "Export en cours",
      description: "Fonctionnalité d'export PDF en développement...",
    });
  };

  const saveProgress = () => {
    toast({
      title: "Progression sauvegardée",
      description: "Vos réponses ont été sauvegardées localement.",
    });
  };

  const generateReport = () => {
    const noCount = state.responses.filter(r => r === 'NON').length;
    const score = ((questions.length - noCount) / questions.length) * 100;
    
    let assessment = '';
    if (score >= 90) assessment = 'Excellent - Projet très mature';
    else if (score >= 75) assessment = 'Bon - Quelques ajustements nécessaires';
    else if (score >= 60) assessment = 'Moyen - Préparation à renforcer';
    else assessment = 'Insuffisant - Projet à retravailler';

    return { score, assessment, noCount };
  };

  const progress = state.isStarted ? (state.currentIndex / questions.length) * 100 : 0;
  const currentQuestion = state.isStarted && state.currentIndex < questions.length ? questions[state.currentIndex] : null;

  return (
    <section id="arbre">
      <h1 className="flex items-center gap-2 mb-6 text-2xl font-bold text-gray-800">
        <TreePine className="w-6 h-6" />
        Arbre de décision
      </h1>
      
      <p className="mb-6 text-gray-600 leading-relaxed">
        20 questions pour évaluer votre projet d'école de production et identifier les axes d'amélioration.
      </p>
      
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="font-semibold text-primary mb-2">
            {state.isCompleted 
              ? 'Questionnaire terminé ✅' 
              : state.isStarted 
                ? `Question ${state.currentIndex + 1} sur ${questions.length}`
                : 'Prêt à commencer'
            }
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>
      
      {!state.isStarted && (
        <Button onClick={startQuestionnaire} className="btn-primary">
          <Play className="w-4 h-4 mr-2" />
          Lancer le questionnaire
        </Button>
      )}
      
      {state.isStarted && currentQuestion && !state.isCompleted && (
        <Card className="mb-6">
          <CardContent className="p-6">
            {state.currentIndex === 0 && (
              <h2 className="text-xl font-semibold mb-4 text-primary flex items-center gap-2">
                🧠 Volet 1 – Capacités personnelles du porteur de projet
              </h2>
            )}
            {state.currentIndex === 10 && (
              <h2 className="text-xl font-semibold mb-4 text-primary flex items-center gap-2">
                🔧 Volet 2 – Maturité du projet d'École de Production
              </h2>
            )}
            
            <p className="font-medium mb-4 text-lg">
              {state.currentIndex + 1}. {currentQuestion.question}
            </p>
            
            <div className="flex gap-3 mb-4">
              <Button 
                onClick={() => answerQuestion('OUI')}
                className="btn-success"
              >
                <Check className="w-4 h-4 mr-2" />
                OUI
              </Button>
              <Button 
                onClick={() => answerQuestion('NON')}
                className="btn-danger"
              >
                <X className="w-4 h-4 mr-2" />
                NON
              </Button>
              <Button 
                onClick={goToPrevious}
                disabled={state.currentIndex === 0}
                className="btn-secondary"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Précédent
              </Button>
            </div>
            
            {showAdvice && (
              <div className="advice bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                💡 Conseil : {currentQuestion.advice}
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
      {state.isCompleted && (
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">📊 Résultats de l'évaluation</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary">{generateReport().score.toFixed(0)}%</div>
                  <div className="text-gray-600">Score global</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold">{generateReport().assessment}</div>
                  <div className="text-sm text-gray-600">
                    {generateReport().noCount} points d'amélioration identifiés
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => navigate('outils')} className="btn-secondary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux outils
            </Button>
            <Button onClick={resetQuestionnaire} className="btn-secondary">
              <RotateCcw className="w-4 h-4 mr-2" />
              Recommencer
            </Button>
            <Button onClick={exportResults} className="btn-primary">
              <Download className="w-4 h-4 mr-2" />
              Exporter PDF
            </Button>
            <Button onClick={saveProgress} className="btn-warning">
              <Save className="w-4 h-4 mr-2" />
              Sauvegarder
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
