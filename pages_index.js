import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import { MessageCircle, Send, RotateCcw, Download } from 'lucide-react';

export default function ChatbotPage() {
  const [messages, setMessages] = useState([
    {
      id: 0,
      role: 'assistant',
      content: 'Allô, École Notre-Dame des Anges, c\'est Sophie à l\'appareil.'
    },
    {
      id: 1,
      role: 'assistant',
      content: 'Oui bonjour... vous appelez de la part de Fratries c\'est ça ? Au sujet d\'Emma ?'
    },
    {
      id: 2,
      role: 'assistant',
      content: 'Bon je vous écoute. On vient tout juste de commencer avec elle, donc... vous pensez qu\'il faut déjà se lancer dans des démarches administratives ?'
    }
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [collectedData, setCollectedData] = useState({});
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    // Ajouter le message utilisateur
    const userMessage = {
      id: messages.length,
      role: 'user',
      content: inputValue
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Appeler l'API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.map(m => ({
            role: m.role,
            content: m.content
          })).concat([userMessage])
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      // Ajouter la réponse de Claude
      const assistantMessage = {
        id: messages.length + 1,
        role: 'assistant',
        content: data.message
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Analyser la réponse pour extraire données RLH (simple parsing)
      extractRLHData(inputValue, data.message);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        id: messages.length + 1,
        role: 'assistant',
        content: '❌ Erreur de connexion. Vérifiez votre clé API ou réessayez.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const extractRLHData = (userInput, aiResponse) => {
    // Extraction simple des données clés mentionnées dans le dialogue
    const lowerInput = userInput.toLowerCase();

    if (lowerInput.includes('20') || lowerInput.includes('salariés')) {
      setCollectedData(prev => ({ ...prev, effectif: '~20 salariés' }));
    }
    if (lowerInput.includes('handicap') || lowerInput.includes('emma')) {
      setCollectedData(prev => ({ ...prev, hasHandicap: true }));
    }
    if (lowerInput.includes('14') || lowerInput.includes('heures')) {
      setCollectedData(prev => ({ ...prev, hours: '14h/semaine' }));
    }
    if (lowerInput.includes('tuteur') || lowerInput.includes('tutrice')) {
      setCollectedData(prev => ({ ...prev, hasTutor: true }));
    }
  };

  const handleReset = () => {
    setMessages([
      {
        id: 0,
        role: 'assistant',
        content: 'Allô, École Notre-Dame des Anges, c\'est Sophie à l\'appareil.'
      },
      {
        id: 1,
        role: 'assistant',
        content: 'Oui bonjour... vous appelez de la part de Fratries c\'est ça ? Au sujet d\'Emma ?'
      },
      {
        id: 2,
        role: 'assistant',
        content: 'Bon je vous écoute. On vient tout juste de commencer avec elle, donc... vous pensez qu\'il faut déjà se lancer dans des démarches administratives ?'
      }
    ]);
    setCollectedData({});
    setInputValue('');
    inputRef.current?.focus();
  };

  const handleDownloadTranscript = () => {
    const transcript = messages
      .map(m => `${m.role === 'user' ? 'Consultant' : 'Sophie'}: ${m.content}`)
      .join('\n\n');

    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `entretien-rlh-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
  };

  return (
    <>
      <Head>
        <title>Entretien RLH Interactif - Fratries</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 p-4">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <MessageCircle size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Entretien RLH Interactif</h1>
                <p className="text-sm text-gray-500">Emma Rousseau — École Notre-Dame des Anges</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleDownloadTranscript}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
              >
                <Download size={16} />
                Télécharger
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
              >
                <RotateCcw size={16} />
                Recommencer
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 max-w-5xl mx-auto w-full">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-2xl rounded-lg px-4 py-3 ${
                    msg.role === 'assistant'
                      ? 'bg-white text-gray-800 shadow-sm border border-gray-200'
                      : 'bg-blue-600 text-white shadow-sm'
                  }`}
                >
                  <p className="text-sm md:text-base leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 shadow-sm border border-gray-200 rounded-lg px-4 py-3">
                  <div className="flex gap-2 items-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 bg-white p-4 max-w-5xl mx-auto w-full">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Écrivez votre réponse ici..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 disabled:bg-gray-100"
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition font-medium"
            >
              <Send size={18} />
              <span className="hidden sm:inline">Envoyer</span>
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-2">💡 Écrivez librement vos réponses. Sophie (directrice) vous répondra naturellement.</p>
        </div>
      </div>
    </>
  );
}
