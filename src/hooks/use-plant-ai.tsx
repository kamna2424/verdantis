import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type AIRequestType = "identify" | "disease" | "chat" | "care";

interface UseImageAnalysisReturn {
  analyze: (image: string) => Promise<string | null>;
  isLoading: boolean;
  error: string | null;
}

interface UseChatReturn {
  sendMessage: (message: string) => Promise<string | null>;
  isLoading: boolean;
  error: string | null;
}

interface UseCareRecommendationsReturn {
  getRecommendations: (plantName: string) => Promise<string | null>;
  isLoading: boolean;
  error: string | null;
}

const callPlantAI = async (
  type: AIRequestType,
  payload: { image?: string; message?: string; plantName?: string }
): Promise<string | null> => {
  const { data, error } = await supabase.functions.invoke("plant-ai", {
    body: { type, ...payload },
  });

  if (error) {
    console.error("Plant AI error:", error);
    throw new Error(error.message || "Failed to process request");
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  return data?.result || null;
};

export const usePlantIdentification = (): UseImageAnalysisReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = async (image: string): Promise<string | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await callPlantAI("identify", { image });
      toast.success("Plant identified successfully!");
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to identify plant";
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { analyze, isLoading, error };
};

export const useDiseaseDetection = (): UseImageAnalysisReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = async (image: string): Promise<string | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await callPlantAI("disease", { image });
      toast.success("Disease analysis complete!");
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to analyze plant health";
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { analyze, isLoading, error };
};

export const usePlantChat = (): UseChatReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (message: string): Promise<string | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await callPlantAI("chat", { message });
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to get response";
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { sendMessage, isLoading, error };
};

export const useCareRecommendations = (): UseCareRecommendationsReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRecommendations = async (plantName: string): Promise<string | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await callPlantAI("care", { plantName });
      toast.success("Care recommendations ready!");
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to get recommendations";
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { getRecommendations, isLoading, error };
};
