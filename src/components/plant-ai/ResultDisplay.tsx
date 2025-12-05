import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResultDisplayProps {
  result: string | null;
  isLoading: boolean;
  placeholder?: string;
  className?: string;
}

export const ResultDisplay = ({ result, isLoading, placeholder, className }: ResultDisplayProps) => {
  if (isLoading) {
    return (
      <div className={cn("flex flex-col items-center justify-center p-8 bg-muted/30 rounded-xl", className)}>
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Analyzing your plant...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className={cn("flex items-center justify-center p-8 bg-muted/30 rounded-xl text-center", className)}>
        <p className="text-muted-foreground">{placeholder || "Upload an image to get started"}</p>
      </div>
    );
  }

  return (
    <div className={cn("p-6 bg-card border rounded-xl overflow-auto", className)}>
      <div className="prose prose-sm dark:prose-invert max-w-none">
        {result.split('\n').map((line, i) => {
          if (line.startsWith('# ')) {
            return <h1 key={i} className="text-xl font-bold text-foreground mb-2">{line.slice(2)}</h1>;
          }
          if (line.startsWith('## ')) {
            return <h2 key={i} className="text-lg font-semibold text-foreground mb-2">{line.slice(3)}</h2>;
          }
          if (line.startsWith('### ')) {
            return <h3 key={i} className="text-md font-semibold text-foreground mb-1">{line.slice(4)}</h3>;
          }
          if (line.startsWith('- ') || line.startsWith('* ')) {
            return <li key={i} className="text-foreground ml-4">{line.slice(2)}</li>;
          }
          if (line.match(/^\d+\. /)) {
            return <li key={i} className="text-foreground ml-4 list-decimal">{line.replace(/^\d+\. /, '')}</li>;
          }
          if (line.startsWith('**') && line.endsWith('**')) {
            return <p key={i} className="font-bold text-foreground">{line.slice(2, -2)}</p>;
          }
          if (line.trim() === '') {
            return <br key={i} />;
          }
          return <p key={i} className="text-foreground mb-2">{line}</p>;
        })}
      </div>
    </div>
  );
};
