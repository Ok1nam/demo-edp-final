
import { Card, CardContent } from "@/components/ui/card";
import { Wrench, Clock } from "lucide-react";

interface UnderDevelopmentProps {
  title?: string;
}

export default function UnderDevelopment({ title = "Page en cours de développement" }: UnderDevelopmentProps) {
  return (
    <section className="min-h-[60vh] flex items-center justify-center">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Wrench className="h-16 w-16 text-blue-500" />
                <Clock className="h-6 w-6 text-orange-500 absolute -bottom-1 -right-1" />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {title}
            </h1>

            <p className="text-gray-600 mb-6 leading-relaxed">
              Cette fonctionnalité est actuellement en cours de développement. 
              Elle sera bientôt disponible dans une prochaine version.
            </p>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                💡 <strong>Suggestion :</strong> Explorez les autres outils disponibles 
                en attendant la mise en ligne de cette page.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
