import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import { MessageCircle, Send, RotateCcw, Download, Heart, Mic, MicOff } from 'lucide-react';

export default function ChatbotPage() {
  // ==========================================
  // STATE DECLARATIONS
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
  const headerRef = useRef(null);  // ← AJOUTER CET USEREF POUR LE HEADER
  let lastScrollY = 0;

  // ==========================================
  // LOGIQUE HIDE HEADER ON SCROLL
  // ← AJOUTER CE CODE ICI (avant les autres useEffect)
  // ==========================================
  useEffect(() => {
    const handleScroll = () => {
      const messagesArea = document.querySelector('[style*="flex: 1"]');
      
      if (!messagesArea) return;

      const currentScrollY = messagesArea.scrollTop;

      if (headerRef.current) {
        if (currentScrollY > lastScrollY && currentScrollY > 50) {
          // Scroll down & suffisamment loin
          headerRef.current.classList.add('hide');
        } else if (currentScrollY < lastScrollY) {
          // Scroll up
          headerRef.current.classList.remove('hide');
        }
      }

      lastScrollY = currentScrollY;
    };

    const messagesArea = document.querySelector('[style*="flex: 1"]');
    if (messagesArea) {
      messagesArea.addEventListener('scroll', handleScroll);
      return () => messagesArea.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // ==========================================
  // AUTRES USEEFFECT (Web Speech API)
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
        console.error('Erreur de reconnaissance vocale:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // ==========================================
  // FONCTIONS
  // ==========================================

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
    }
  };

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
    setInputValue('');
    inputRef.current?.focus();
  };

  const handleDownloadTranscript = () => {
    const transcript = messages
      .map(m => `${m.role === 'user' ? 'Vous' : 'Sophie'}: ${m.content}`)
      .join('\n\n');

    const blob = new Blob([transcript], { type: 'text/plain; charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `entretien-rlh-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
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

      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'linear-gradient(135deg, #F8F9FA 0%, #E8F4F4 100%)' }}>
        
        {/* HEADER - AJOUTER ref={headerRef} ICI */}
        <header ref={headerRef} style={{
          background: 'white',
          borderBottom: '3px solid #1D2A84',
          padding: '2rem',
          boxShadow: '0 4px 16px rgba(29, 42, 132, 0.12)',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem' }}>
              {/* Logo & Title */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                <div style={{
                  background: 'linear-gradient(135deg, #1D2A84 0%, #A9C8C6 100%)',
                  color: 'white',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Heart size={28} fill="white" />
                </div>
                <div>
                  <h1 style={{ fontSize: '1.8rem', color: '#1D2A84', marginBottom: '0.25rem' }}>
                    Entretien RLH
                  </h1>
                  <p style={{ fontSize: '0.9rem', color: '#666', fontStyle: 'italic' }}>
                    Emma Rousseau — École Notre-Dame des Anges
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={handleDownloadTranscript}
                  style={{
                    background: 'white',
                    color: '#1D2A84',
                    border: '2px solid #1D2A84',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    borderRadius: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#1D2A84';
                    e.target.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'white';
                    e.target.style.color = '#1D2A84';
                  }}
                >
                  <Download size={18} />
                  Télécharger
                </button>
                <button
                  onClick={handleReset}
                  style={{
                    background: '#87B280',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    border: 'none',
                    borderRadius: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    cursor: 'pointer',
                    transition: 'background 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#6fa171';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#87B280';
                  }}
                >
                  <RotateCcw size={18} />
                  Recommencer
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* MESSAGES AREA */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '2rem',
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {messages.map((msg, idx) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: msg.role === 'assistant' ? 'flex-start' : 'flex-end',
                  animation: `slideIn${msg.role === 'assistant' ? 'Left' : 'Right'} 0.3s ease`
                }}
              >
                <div
                  style={{
                    maxWidth: '70%',
                    padding: '1rem 1.5rem',
                    borderRadius: '0.5rem',
                    lineHeight: 1.5,
                    fontSize: '0.95rem',
                    ...(msg.role === 'assistant'
                      ? {
                          background: 'white',
                          color: '#1D2A84',
                          boxShadow: '0 2px 8px rgba(29, 42, 132, 0.08)',
                          borderLeft: '4px solid #87B280'
                        }
                      : {
                          background: 'linear-gradient(135deg, #1D2A84 0%, #2D3A94 100%)',
                          color: 'white',
                          boxShadow: '0 2px 8px rgba(29, 42, 132, 0.2)'
                        }
                    )
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{
                  background: 'white',
                  padding: '1rem 1.5rem',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  gap: '0.5rem',
                  alignItems: 'center',
                  boxShadow: '0 2px 8px rgba(29, 42, 132, 0.08)',
                  borderLeft: '4px solid #F6BA75'
                }}>
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#F6BA75',
                    animation: 'pulse 1.5s infinite'
                  }} />
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#F6BA75',
                    animation: 'pulse 1.5s infinite',
                    animationDelay: '0.2s'
                  }} />
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#F6BA75',
                    animation: 'pulse 1.5s infinite',
                    animationDelay: '0.4s'
                  }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* INPUT AREA */}
        <div style={{
          background: 'white',
          borderTop: '2px solid #E8EAED',
          padding: '2rem',
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%'
        }}>
          <form onSubmit={handleSendMessage} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Écrivez votre réponse ici..."
                disabled={isLoading}
                style={{
                  flex: 1,
                  padding: '0.875rem 1.25rem',
                  border: '2px solid #E8EAED',
                  borderRadius: '0.5rem',
                  fontSize: '0.95rem',
                  fontFamily: "'Barlow Condensed', sans-serif",
                  transition: 'all 0.3s ease',
                  background: isLoading ? '#F8F9FA' : 'white'
                }}
                onFocus={(e) => {
                  if (!isLoading) {
                    e.target.style.borderColor = '#1D2A84';
                    e.target.style.boxShadow = '0 0 0 3px rgba(29, 42, 132, 0.1)';
                  }
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#E8EAED';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                style={{
                  background: isLoading || !inputValue.trim() ? '#CCC' : '#1D2A84',
                  color: 'white',
                  border: 'none',
                  padding: '0.875rem 2rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: isLoading || !inputValue.trim() ? 'not-allowed' : 'pointer',
                  transition: 'background 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isLoading && inputValue.trim()) {
                    e.target.style.background = '#0F1A5C';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading && inputValue.trim()) {
                    e.target.style.background = '#1D2A84';
                  }
                }}
              >
                <Send size={20} />
                <span>Envoyer</span>
              </button>
            </div>
            <p style={{
              fontSize: '0.85rem',
              color: '#666',
              marginLeft: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              💡 <em>Écrivez librement vos réponses. Sophie (directrice) vous répondra naturellement.</em>
            </p>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
      `}</style>
    </>
  );
}
