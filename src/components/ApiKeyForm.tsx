
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { env, setGroqApiKey } from '@/lib/env';

const ApiKeyForm = () => {
  const [apiKey, setApiKey] = useState(env.GROQ_API_KEY || '');
  const [isVisible, setIsVisible] = useState(false);
  
  const handleSave = () => {
    setGroqApiKey(apiKey);
    // Reload to apply the new key
    window.location.reload();
  };

  return (
    <div className="bg-white border rounded-md p-4 mb-4">
      <h3 className="text-md font-medium mb-2">Configuração de API</h3>
      <div className="flex items-center space-x-2">
        <div className="flex-1">
          <Input
            type={isVisible ? "text" : "password"}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Insira a chave da API GROQ"
            className="w-full"
          />
        </div>
        <Button 
          type="button"
          variant="outline"
          onClick={() => setIsVisible(!isVisible)}
          className="whitespace-nowrap"
        >
          {isVisible ? "Ocultar" : "Mostrar"}
        </Button>
        <Button 
          type="button"
          onClick={handleSave}
          className="whitespace-nowrap"
        >
          Salvar
        </Button>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Nota: A chave da API é armazenada localmente no seu navegador.
      </p>
    </div>
  );
};

export default ApiKeyForm;
