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
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const chatMessagesRef = useRef(null);
  const globalActionsRef = useRef(null);

  // ============================================================
  // SCROLL FIX - Prevent body scroll when chat is open
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

  // ============================================================
  // IMPROVED SCROLL HANDLING
  // ============================================================
  useEffect(() => {
    const messagesElement = chatMessagesRef.current;

    const handleWheel = (e) => {
      const target = e.currentTarget;
      if (!target) return;
      
      const { scrollTop, scrollHeight, clientHeight } = target;
      const isAtTop = scrollTop <= 1;
      const isAtBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight - 1;
      
      const deltaY = e.deltaY || 0;
      const isScrollingUp = deltaY < 0;
      const isScrollingDown = deltaY > 0;
      
      if ((isAtTop && isScrollingUp) || (isAtBottom && isScrollingDown)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const handleTouchStart = (e) => {
      const target = e.currentTarget;
      if (!target) return;
      
      target._touchStartY = e.touches[0].clientY;
      target._touchStartScrollTop = target.scrollTop;
    };

    const handleTouchMove = (e) => {
      const target = e.currentTarget;
      if (!target || target._touchStartY === undefined) return;
      
      const touchY = e.touches[0].clientY;
      const deltaY = target._touchStartY - touchY;
      const { scrollTop, scrollHeight, clientHeight } = target;
      const isAtTop = scrollTop <= 1;
      const isAtBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight - 1;
      
      if ((isAtTop && deltaY < 0) || (isAtBottom && deltaY > 0)) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      
      target._touchStartY = touchY;
    };

    const handleTouchEnd = (e) => {
      const target = e.currentTarget;
      if (target) {
        target._touchStartY = undefined;
        target._touchStartScrollTop = undefined;
      }
    };

    if (messagesElement) {
      messagesElement.addEventListener('wheel', handleWheel, { passive: false });
      messagesElement.addEventListener('touchstart', handleTouchStart, { passive: true });
      messagesElement.addEventListener('touchmove', handleTouchMove, { passive: false });
      messagesElement.addEventListener('touchend', handleTouchEnd, { passive: true });
    }

    return () => {
      if (messagesElement) {
        messagesElement.removeEventListener('wheel', handleWheel);
        messagesElement.removeEventListener('touchstart', handleTouchStart);
        messagesElement.removeEventListener('touchmove', handleTouchMove);
        messagesElement.removeEventListener('touchend', handleTouchEnd);
      }
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

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      loadRootOptions();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

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

  const loadRootOptions = async () => {
    try {
      setLoading(true);
      setFlowHistory([]);
      setShowGlobalActions(false);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_API_URL}/api/chatbot/start`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch options');
      }
      
      const data = await response.json();
      
      if (data && data.message) {
        setMessages([{
          id: Date.now(),
          type: 'bot',
          text: data.message,
          options: data.options || [],
          showOptions: true
        }]);
        
        if (data.options && data.options.length > 0) {
          setFlowHistory([{ 
            options: data.options, 
            label: 'Main Menu' 
          }]);
        }
        
        setCurrentMessageId(data.id);
        setConversationEnded(data.is_end || false);
      } else {
        setMessages([{
          id: Date.now(),
          type: 'bot',
          text: '👋 Hi! How can I help you today?',
          options: [],
          showOptions: false
        }]);
      }
      
      setUnreadCount(prev => prev + 1);
    } catch (error) {
      console.error('Error loading options:', error);
      setMessages([{
        id: Date.now(),
        type: 'bot',
        text: 'Sorry, I\'m having trouble connecting. Please try again.',
        options: [],
        showOptions: false
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionClick = async (optionId, optionText, messageIndex) => {
    // Add user message
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'user',
      text: optionText,
      options: [],
      showOptions: false
    }]);

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
          id: Date.now(),
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
              id: Date.now(),
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
          id: Date.now(),
          type: 'bot',
          text: 'I received your response. How can I help you further?',
          options: [],
          showOptions: false
        }]);
        await loadRootOptions();
      }
    } catch (error) {
      console.error('Error loading node:', error);
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'bot',
        text: 'Sorry, I encountered an error. Please try again.',
        options: [],
        showOptions: false
      }]);
      
      setTimeout(() => {
        loadRootOptions();
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // MESSAGE ACTION HANDLERS
  // ============================================================
  
  const handleStartAPI = () => {
    setShowGlobalActions(false);
    loadRootOptions();
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
    
    setTimeout(() => {
      loadRootOptions();
    }, 300);
  };

  const handleRestart = () => {
    setMessages([]);
    setOptions([]);
    setConversationEnded(false);
    setCurrentMessageId(null);
    setFlowHistory([]);
    setExpandedMessages({});
    setShowGlobalActions(false);
    loadRootOptions();
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
  // MESSAGE RENDERER WITH INLINE OPTIONS
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
        style={{
          animationDelay: `${index * 0.05}s`
        }}
      >
        {isBot && (
          <span className="message-avatar">🤖</span>
        )}
        <div className="message-wrapper">
          <div className="message-content">
            <div className="message-text">
              {displayText}
            </div>
            
            {/* Inline Options - WhatsApp Style */}
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
                    style={{
                      animationDelay: `${optIndex * 0.08}s`
                    }}
                  >
                    <span className="option-text">
                      {option.option_text || option.title || option.text}
                    </span>
                    <span className="option-arrow">→</span>
                  </button>
                ))}
              </div>
            )}
            
            {/* Message Action Buttons */}
            {isBot && (
              <div className="message-actions-bar">
                {needsExpansion && (
                  <button 
                    className="action-chip"
                    onClick={() => toggleMessageExpand(message.id)}
                    title={isExpanded ? 'Show less' : 'Show more'}
                  >
                    <span className="action-icon">{isExpanded ? '🔼' : '🔽'}</span>
                    {isExpanded ? 'Show Less' : 'Show More'}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
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
              <span className="bot-avatar">🤖</span>
              <div className="header-info">
                <h3>Chat Assistant</h3>
                <p className="status">Online</p>
              </div>
            </div>
            <div className="header-actions">
              {/* Global Actions Button */}
              <button 
                className="global-actions-btn"
                onClick={toggleGlobalActions}
                aria-label="More options"
                title="More options"
              >
                ⋮
              </button>
              
              {/* Global Actions Dropdown */}
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
          >
            {messages.length === 0 && !loading ? (
              <div className="empty-state">
                <span className="empty-icon">🤖</span>
                <p>Start a conversation</p>
              </div>
            ) : (
              messages.map(renderMessage)
            )}
            {loading && (
              <div className="message bot-message">
                <span className="message-avatar">🤖</span>
                <div className="message-content">
                  <span className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {conversationEnded && (
            <div className="chat-footer">
              <button onClick={handleRestart} className="new-chat-btn">
                <span className="btn-icon">🗨️</span>
                New Chat
              </button>
            </div>
          )}
          
          <div className="chat-footer-bar">
            <span className="footer-text">
              <span className="footer-icon">⚡</span>
              Powered by AI
            </span>
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