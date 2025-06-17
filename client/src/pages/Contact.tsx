import { Mail, MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const { toast } = useToast();

  const openSupportChat = () => {
    toast({
      title: "Chat d'assistance",
      description: "Chat d'assistance ouvert...",
    });
  };

  return (
    <section id="apropos">
      <h1 className="flex items-center gap-2 mb-6 text-2xl font-bold text-gray-800">
        <Mail className="w-6 h-6" />
        Contact
      </h1>
      
      <Card>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Auteur du mémoire</h3>
              <p className="font-medium text-lg">Laura Gombaud</p>
              <p className="text-gray-600 mb-4">Candidate au Diplôme d'Expertise Comptable</p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a 
                  href="mailto:laura.gombaud@example.com" 
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  laura.gombaud@example.com
                </a>
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Support technique</h3>
              <p className="text-gray-600 mb-4">
                Pour toute question sur l'utilisation des outils :
              </p>
              <Button onClick={openSupportChat} className="btn-primary">
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat d'assistance
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
