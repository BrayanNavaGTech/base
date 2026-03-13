import { Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";

export function WorkBubble() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button 
        size="icon" 
        className="h-14 w-14 rounded-full shadow-lg hover:scale-110 transition-transform"
      >
        <Briefcase size={24} />
      </Button>
    </div>
  );
}