'use client';

import React, { useState, useEffect, useRef } from 'react';
import './FloatingChatbot.scss';

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [conversationEnded, setConversationEnded] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentMessageId, setCurrentMessageId] = useState(null);
  const [flowHistory, setFlowHistory] = useState([]);
  const [expandedMessages, setExpandedMessages] = useState({});
  const [showGlobalActions, setShowGlobalActions] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [hasStarted, setHasStarted] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const chatMessagesRef = useRef(null);
  const globalActionsRef = useRef(null);
  const inputRef = useRef(null);
  
  // ============================================================
  // UNIQUE ID GENERATOR
  // ============================================================
  const idCounter = useRef(0);
  
  const generateUniqueId = () => {
    idCounter.current += 1;
    return `${Date.now()}-${idCounter.current}-${Math.random().toString(36).substr(2, 9)}`;
  };

  // ============================================================
  // SCROLL TO BOTTOM
  // ============================================================
  const scrollToBottom = () => {
    if (chatMessagesRef.current) {
      setTimeout(() => {
        chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
      }, 50);
    }
  };

  // ============================================================
  // SCROLL FIX
  // ============================================================
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${window.scrollY}px`;
    } else {
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
      }
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    };
  }, [isOpen]);

  // Close global actions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (globalActionsRef.current && !globalActionsRef.current.contains(event.target)) {
        setShowGlobalActions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 300);
    }
  }, [isOpen]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (isOpen && messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, isOpen, loading]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatContainerRef.current && !chatContainerRef.current.contains(event.target)) {
        const toggleBtn = document.querySelector('.chatbot-toggle');
        if (toggleBtn && toggleBtn.contains(event.target)) {
          return;
        }
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // ============================================================
  // SHOW WELCOME MESSAGE
  // ============================================================
  useEffect(() => {
    if (isOpen && messages.length === 0 && !hasStarted) {
      showWelcomeMessage();
    }
  }, [isOpen]);

  const showWelcomeMessage = () => {
    const welcomeMessage = {
      id: generateUniqueId(),
      type: 'bot',
      text: `👋 Welcome to Liaison Bank!\nHow may we help you today? 😊`,
      options: [],
      showOptions: false
    };
    setMessages([welcomeMessage]);
    setHasStarted(true);
    setTimeout(() => {
      scrollToBottom();
    }, 100);
  };

  // ============================================================
  // SEND USER MESSAGE TO BACKEND
  // ============================================================
  const sendUserMessage = async (userMessage) => {
    try {
      setLoading(true);
      setShowGlobalActions(false);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_API_URL}/api/chatbot/user-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      const data = await response.json();
      
      console.log('Response from backend:', data);
      
      if (data) {
        const isEnd = data.is_end || false;
        const hasOptions = data.options && data.options.length > 0;
        
        const botMessage = {
          id: generateUniqueId(),
          type: 'bot',
          text: data.message || 'How can I help you?',
          options: data.options || [],
          showOptions: hasOptions
        };
        
        setMessages(prev => [...prev, botMessage]);
        
        if (data.id) {
          setCurrentMessageId(data.id);
        }
        
        if (hasOptions) {
          setFlowHistory(prev => [...prev, { 
            options: data.options, 
            label: userMessage || 'Options' 
          }]);
        }
        
        setConversationEnded(data.is_end || false);
        
        if (data.matched === false) {
          console.log('No semantic match found, showing default options');
        }
      } else {
        setMessages(prev => [...prev, {
          id: generateUniqueId(),
          type: 'bot',
          text: 'I received your message. How can I help you further?',
          options: [],
          showOptions: false
        }]);
      }
      
      setUnreadCount(prev => prev + 1);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        id: generateUniqueId(),
        type: 'bot',
        text: 'Sorry, I\'m having trouble connecting. Please try again.',
        options: [],
        showOptions: false
      }]);
    } finally {
      setLoading(false);
      setTimeout(() => {
        scrollToBottom();
      }, 150);
    }
  };

  // ============================================================
  // HANDLE SEND MESSAGE
  // ============================================================
  const handleSendMessage = async () => {
    const trimmedMessage = inputValue.trim();
    if (!trimmedMessage || loading) return;

    const userMessageObj = {
      id: generateUniqueId(),
      type: 'user',
      text: trimmedMessage,
      options: [],
      showOptions: false
    };
    
    setMessages(prev => [...prev, userMessageObj]);
    setInputValue('');
    
    setTimeout(() => {
      scrollToBottom();
    }, 50);

    await sendUserMessage(trimmedMessage);
  };

  // ============================================================
  // HANDLE OPTION CLICK
  // ============================================================
  const handleOptionClick = async (optionId, optionText, messageIndex) => {
    const userMessageObj = {
      id: generateUniqueId(),
      type: 'user',
      text: optionText,
      options: [],
      showOptions: false
    };
    
    setMessages(prev => [...prev, userMessageObj]);
    
    setTimeout(() => {
      scrollToBottom();
    }, 50);

    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_API_URL}/api/chatbot/message/${optionId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch node');
      }
      
      const data = await response.json();
      
      if (data && data.message) {
        const isEnd = data.is_end || false;
        const newMessage = {
          id: generateUniqueId(),
          type: 'bot',
          text: data.message,
          options: isEnd ? [] : (data.options || []),
          showOptions: !isEnd && data.options && data.options.length > 0
        };

        setMessages(prev => [...prev, newMessage]);

        setCurrentMessageId(data.id);
        
        if (isEnd) {
          setConversationEnded(true);
          
          setTimeout(() => {
            setMessages(prev => [...prev, {
              id: generateUniqueId(),
              type: 'bot',
              text: '✨ Conversation ended. Click "New Chat" to start again.',
              options: [],
              showOptions: false
            }]);
          }, 500);
        } else {
          if (data.options && data.options.length > 0) {
            setFlowHistory(prev => [...prev, { 
              options: data.options, 
              label: optionText || 'Options' 
            }]);
          }
        }
      } else {
        setMessages(prev => [...prev, {
          id: generateUniqueId(),
          type: 'bot',
          text: 'I received your response. How can I help you further?',
          options: [],
          showOptions: false
        }]);
      }
    } catch (error) {
      console.error('Error loading node:', error);
      setMessages(prev => [...prev, {
        id: generateUniqueId(),
        type: 'bot',
        text: 'Sorry, I encountered an error. Please try again.',
        options: [],
        showOptions: false
      }]);
    } finally {
      setLoading(false);
      setTimeout(() => {
        scrollToBottom();
      }, 150);
    }
  };

  // ============================================================
  // MESSAGE ACTION HANDLERS
  // ============================================================
  
  const handleStartAPI = () => {
    setShowGlobalActions(false);
    setMessages([]);
    setConversationEnded(false);
    setCurrentMessageId(null);
    setFlowHistory([]);
    setExpandedMessages({});
    setHasStarted(false);
    setInputValue('');
    setTimeout(() => {
      showWelcomeMessage();
    }, 100);
  };

  const handleExitBot = () => {
    setShowGlobalActions(false);
    setIsOpen(false);
    setUnreadCount(0);
  };

  const handleClearHistory = () => {
    setMessages([]);
    setOptions([]);
    setConversationEnded(false);
    setCurrentMessageId(null);
    setFlowHistory([]);
    setExpandedMessages({});
    setShowGlobalActions(false);
    setHasStarted(false);
    setInputValue('');
    setTimeout(() => {
      showWelcomeMessage();
    }, 100);
  };

  const handleRestart = () => {
    setMessages([]);
    setOptions([]);
    setConversationEnded(false);
    setCurrentMessageId(null);
    setFlowHistory([]);
    setExpandedMessages({});
    setShowGlobalActions(false);
    setHasStarted(false);
    setInputValue('');
    setTimeout(() => {
      showWelcomeMessage();
    }, 100);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0);
    }
  };

  const toggleGlobalActions = () => {
    setShowGlobalActions(!showGlobalActions);
  };

  // ============================================================
  // MESSAGE RENDERER
  // ============================================================
  const toggleMessageExpand = (messageId) => {
    setExpandedMessages(prev => ({
      ...prev,
      [messageId]: !prev[messageId]
    }));
  };

  const renderMessage = (message, index) => {
    const isExpanded = expandedMessages[message.id] || false;
    const charLimit = 200;
    const needsExpansion = message.text.length > charLimit;
    const displayText = isExpanded ? message.text : message.text.slice(0, charLimit) + (needsExpansion && !isExpanded ? '...' : '');
    const isBot = message.type === 'bot';
    const hasOptions = message.options && message.options.length > 0 && message.showOptions;
    
    return (
      <div
        key={message.id}
        className={`message ${isBot ? 'bot-message' : 'user-message'}`}
      >
        {isBot && (
          <div className="message-avatar bot-avatar">
            <span></span>
          </div>
        )}
        <div className="message-wrapper">
          <div className="message-content">
            <div className="message-text">
              {displayText}
            </div>
            
            {hasOptions && (
              <div className="inline-options">
                {message.options.map((option, optIndex) => (
                  <button
                    key={option.id || optIndex}
                    className="inline-option-btn"
                    onClick={() => handleOptionClick(
                      option.next_message_id || option.id,
                      option.option_text || option.title || option.text,
                      index
                    )}
                  >
                    <span className="option-text">
                      {option.option_text || option.title || option.text}
                    </span>
                    <span className="option-arrow">→</span>
                  </button>
                ))}
              </div>
            )}
            
            {isBot && needsExpansion && (
              <div className="message-actions-bar">
                <button 
                  className="action-chip"
                  onClick={() => toggleMessageExpand(message.id)}
                  title={isExpanded ? 'Show less' : 'Show more'}
                >
                  <span className="action-icon">{isExpanded ? '−' : '+'}</span>
                  {isExpanded ? 'Show Less' : 'Show More'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ============================================================
  // HANDLE ENTER KEY
  // ============================================================
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="floating-chatbot" ref={chatContainerRef}>
      <button 
        className="chatbot-toggle" 
        onClick={toggleChat}
        aria-label="Toggle chat"
      >
        {isOpen ? (
          <span className="close-icon">✕</span>
        ) : (
          <>
            <span className="chat-icon">💬</span>
            {unreadCount > 0 && (
              <span className="unread-badge">{unreadCount}</span>
            )}
          </>
        )}
      </button>

      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="header-content">
              <div className="brand-icon">LB</div>
              <div className="header-info">
                <h3>Liaison Bank</h3>
                <p className="status">Online</p>
              </div>
            </div>
            <div className="header-actions">
              <button 
                className="global-actions-btn"
                onClick={toggleGlobalActions}
                aria-label="More options"
                title="More options"
              >
                ⋮
              </button>
              
              {showGlobalActions && (
                <div className="global-actions-dropdown" ref={globalActionsRef}>
                  <button 
                    className="dropdown-item"
                    onClick={handleStartAPI}
                  >
                    Start New Conversation
                  </button>
                  <button 
                    className="dropdown-item"
                    onClick={handleClearHistory}
                  >
                    Clear Chat History
                  </button>
                  <button 
                    className="dropdown-item exit-item"
                    onClick={handleExitBot}
                  >
                    Exit Chat
                  </button>
                </div>
              )}
              
              <button 
                className="minimize-btn" 
                onClick={() => setIsOpen(false)}
                aria-label="Minimize chat"
              >
                −
              </button>
            </div>
          </div>
          
          <div
            className="chat-messages"
            ref={chatMessagesRef}
            onWheel={(e) => {
              e.stopPropagation();
              const element = e.currentTarget;
              if (e.deltaY !== 0) {
                element.scrollTop += e.deltaY;
              }
            }}
          >
            {messages.length === 0 && !loading ? (
              <div className="empty-state">
                <div className="empty-icon">🏦</div>
                <p>Welcome to Liaison Bank</p>
                <span className="empty-subtext">Type a message to start the conversation</span>
              </div>
            ) : (
              messages.map(renderMessage)
            )}
            {loading && (
              <div className="message bot-message">
                <div className="message-avatar bot-avatar">
                  <span>🤖</span>
                </div>
                <div className="message-wrapper">
                  <div className="message-content">
                    <span className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {conversationEnded ? (
            <div className="chat-footer">
              <button onClick={handleRestart} className="new-chat-btn">
                <span className="btn-icon">🔄</span>
                New Chat
              </button>
              

            </div>
          ) : (
            <div className="chat-input-area">
              <div className="input-wrapper">
                <input
                  ref={inputRef}
                  type="text"
                  className="chat-input"
                  placeholder="Type your message..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={loading}
                />
                <button 
                  className="send-btn"
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || loading}
                  aria-label="Send message"
                >
                  <span className="send-icon">➤</span>
                </button>
              </div>
            </div>
          )}
          
          <div className="chat-footer-bar">
            <span className="flow-indicator">
              {messages.length} messages
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingChatbot;