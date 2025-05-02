
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const ApiKeyForm = () => {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  const hasApiKey = Boolean(apiKey);

  if (hasApiKey) {
    return null; // Don't show anything if we have an API key
  }

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>API Key Missing</AlertTitle>
      <AlertDescription>
        Please add your GROQ API key to the .env file as VITE_GROQ_API_KEY.
      </AlertDescription>
    </Alert>
  );
};

export default ApiKeyForm;
