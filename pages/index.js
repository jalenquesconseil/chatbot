import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import { Send, Mic, MicOff } from 'lucide-react';

export default function ChatbotPage() {
  // ==========================================
  // STATE
  // ==========================================
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
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);

  // ==========================================
  // REFS
  // ==========================================
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  // ==========================================
  // WEB SPEECH API (Microphone)
  // ==========================================
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      setVoiceSupported(true);
      const recognition = new SpeechRecognition();
      recognition.lang = 'fr-FR';
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;

          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          setInputValue(prev => prev + finalTranscript);
        } else if (interimTranscript) {
          setInputValue(interimTranscript);
        }
      };

      recognition.onerror = (event) => {
        console.error('Erreur vocale:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // ==========================================
  // SCROLL TO BOTTOM
  // ==========================================
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ==========================================
  // TOGGLE VOICE
  // ==========================================
  const toggleVoiceInput = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
    }
  };

  // ==========================================
  // SEND MESSAGE
  // ==========================================
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    const userMessage = {
      id: messages.length,
      role: 'user',
      content: inputValue
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
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

      const assistantMessage = {
        id: messages.length + 1,
        role: 'assistant',
        content: data.message
      };

      setMessages(prev => [...prev, assistantMessage]);
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

  // ==========================================
  // RENDER
  // ==========================================
  return (
    <>
      <Head>
        <title>Entretien RLH Interactif - Fratries</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Head>

      <div className="chat-container">
        {/* MESSAGES */}
        <div className="messages-area">
          {messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.role === 'user' ? 'sent' : 'received'}`}>
              <div className="message-content">{msg.content}</div>
            </div>
          ))}

          {/* LOADING */}
          {isLoading && (
            <div className="message received">
              <div className="message-content">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* INPUT */}
        <div className="input-area">
          <form className="input-form" onSubmit={handleSendMessage}>
            <div className="input-wrapper">
              <input
                ref={inputRef}
                type="text"
                placeholder="Écrivez votre réponse ici..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isLoading}
              />
              {voiceSupported && (
                <button
                  type="button"
                  className={`btn-voice ${isListening ? 'listening' : ''}`}
                  onClick={toggleVoiceInput}
                  title={isListening ? 'Arrêter' : 'Microphone'}
                >
                  {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                </button>
              )}
            </div>

            <button
              type="submit"
              className="btn-send"
              disabled={isLoading || !inputValue.trim()}
            >
              <Send size={20} />
              <span>Envoyer</span>
            </button>
          </form>

          <p className="input-helper">
            💡 <em>Écrivez ou parlez librement. Sophie vous répondra naturellement.</em>
          </p>
        </div>
      </div>
    </>
  );
}
