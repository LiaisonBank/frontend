'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import chatWindowBg from '@/assets/images/chat-windowbg.webp';
import './FloatingChatbot.scss';

// ============================================================
// CONSTANTS
// ============================================================
const CHAR_LIMIT = 200;
const SCROLL_DELAY = 50;
const FOCUS_DELAY = 300;
const WELCOME_DELAY = 100;

const WELCOME_MESSAGE = `👋 Welcome to Liaison Bank!\nHow may we help you today? 😊`;
const ERROR_MESSAGE = "Sorry, I'm having trouble connecting. Please try again.";
const FALLBACK_MESSAGE = 'I received your message. How can I help you further?';
const END_MESSAGE = '✨ Conversation ended. Click "New Chat" to start again.';

// ============================================================
// UNIQUE ID GENERATOR (module-scoped counter)
// ============================================================
let idCounter = 0;
const generateUniqueId = () => {
  idCounter += 1;
  return `${Date.now()}-${idCounter}-${Math.random().toString(36).slice(2, 11)}`;
};

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
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
  const toggleButtonRef = useRef(null);

  // ============================================================
  // SCROLL TO BOTTOM
  // ============================================================
  const scrollToBottom = useCallback(() => {
    if (chatMessagesRef.current) {
      setTimeout(() => {
        if (chatMessagesRef.current) {
          chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
        }
      }, SCROLL_DELAY);
    }
  }, []);

  // ============================================================
  // SHOW WELCOME MESSAGE
  // ============================================================
  const showWelcomeMessage = useCallback(() => {
    const welcomeMessage = {
      id: generateUniqueId(),
      type: 'bot',
      text: WELCOME_MESSAGE,
      options: [],
      showOptions: false,
    };
    setMessages([welcomeMessage]);
    setHasStarted(true);
    setTimeout(scrollToBottom, WELCOME_DELAY);
  }, [scrollToBottom]);

  // ============================================================
  // BODY SCROLL LOCK (when chat is open)
  // ============================================================
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${scrollY}px`;
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
  // CLICK OUTSIDE — CLOSE GLOBAL ACTIONS DROPDOWN
  // ============================================================
  useEffect(() => {
    if (!showGlobalActions) return;

    const handleClickOutside = (event) => {
      if (globalActionsRef.current && !globalActionsRef.current.contains(event.target)) {
        setShowGlobalActions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showGlobalActions]);

  // ============================================================
  // CLICK OUTSIDE — CLOSE CHAT
  // ============================================================
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (chatContainerRef.current && !chatContainerRef.current.contains(event.target)) {
        setIsOpen(false);
        setUnreadCount(0);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // ============================================================
  // ESCAPE KEY — CLOSE CHAT (or dropdown first)
  // ============================================================
  useEffect(() => {
    if (!isOpen) return;

    const handleEscapeKey = (event) => {
      if (event.key !== 'Escape') return;

      // If the global actions dropdown is open, close it first
      if (showGlobalActions) {
        setShowGlobalActions(false);
        return;
      }

      // Otherwise close the entire chat
      setIsOpen(false);
      setUnreadCount(0);
      // Return focus to the toggle button for accessibility
      toggleButtonRef.current?.focus();
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [isOpen, showGlobalActions]);

  // ============================================================
  // FOCUS INPUT WHEN CHAT OPENS
  // ============================================================
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => inputRef.current?.focus(), FOCUS_DELAY);
    return () => clearTimeout(timer);
  }, [isOpen]);

  // ============================================================
  // AUTO-SCROLL ON NEW MESSAGES
  // ============================================================
  useEffect(() => {
    if (isOpen && messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, isOpen, loading, scrollToBottom]);

  // ============================================================
  // SHOW WELCOME ON FIRST OPEN
  // ============================================================
  useEffect(() => {
    if (isOpen && messages.length === 0 && !hasStarted) {
      showWelcomeMessage();
    }
  }, [isOpen, messages.length, hasStarted, showWelcomeMessage]);

  // ============================================================
  // SEND USER MESSAGE TO BACKEND
  // ============================================================
  const sendUserMessage = useCallback(async (userMessage) => {
    try {
      setLoading(true);
      setShowGlobalActions(false);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LOCAL_API_URL}/api/chatbot/user-message`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: userMessage }),
        }
      );

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();

      if (data) {
        const isEnd = data.is_end || false;
        const hasOptions = Array.isArray(data.options) && data.options.length > 0;

        const botMessage = {
          id: generateUniqueId(),
          type: 'bot',
          text: data.message || FALLBACK_MESSAGE,
          options: data.options || [],
          showOptions: hasOptions,
        };

        setMessages((prev) => [...prev, botMessage]);

        if (data.id) setCurrentMessageId(data.id);

        if (hasOptions) {
          setFlowHistory((prev) => [
            ...prev,
            { options: data.options, label: userMessage || 'Options' },
          ]);
        }

        setConversationEnded(isEnd);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: generateUniqueId(),
            type: 'bot',
            text: FALLBACK_MESSAGE,
            options: [],
            showOptions: false,
          },
        ]);
      }

      setUnreadCount((prev) => prev + 1);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: generateUniqueId(),
          type: 'bot',
          text: ERROR_MESSAGE,
          options: [],
          showOptions: false,
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(scrollToBottom, 150);
    }
  }, [scrollToBottom]);

  // ============================================================
  // HANDLE SEND MESSAGE
  // ============================================================
  const handleSendMessage = useCallback(async () => {
    const trimmedMessage = inputValue.trim();
    if (!trimmedMessage || loading) return;

    const userMessageObj = {
      id: generateUniqueId(),
      type: 'user',
      text: trimmedMessage,
      options: [],
      showOptions: false,
    };

    setMessages((prev) => [...prev, userMessageObj]);
    setInputValue('');
    setTimeout(scrollToBottom, SCROLL_DELAY);

    await sendUserMessage(trimmedMessage);
  }, [inputValue, loading, sendUserMessage, scrollToBottom]);

  // ============================================================
  // HANDLE OPTION CLICK
  // ============================================================
  const handleOptionClick = useCallback(async (optionId, optionText) => {
    const userMessageObj = {
      id: generateUniqueId(),
      type: 'user',
      text: optionText,
      options: [],
      showOptions: false,
    };

    setMessages((prev) => [...prev, userMessageObj]);
    setTimeout(scrollToBottom, SCROLL_DELAY);
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LOCAL_API_URL}/api/chatbot/message/${optionId}`
      );

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();

      if (data?.message) {
        const isEnd = data.is_end || false;
        const newMessage = {
          id: generateUniqueId(),
          type: 'bot',
          text: data.message,
          options: isEnd ? [] : data.options || [],
          showOptions: !isEnd && Array.isArray(data.options) && data.options.length > 0,
        };

        setMessages((prev) => [...prev, newMessage]);
        setCurrentMessageId(data.id);

        if (isEnd) {
          setConversationEnded(true);
          setTimeout(() => {
            setMessages((prev) => [
              ...prev,
              {
                id: generateUniqueId(),
                type: 'bot',
                text: END_MESSAGE,
                options: [],
                showOptions: false,
              },
            ]);
          }, 500);
        } else if (Array.isArray(data.options) && data.options.length > 0) {
          setFlowHistory((prev) => [
            ...prev,
            { options: data.options, label: optionText || 'Options' },
          ]);
        }
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: generateUniqueId(),
            type: 'bot',
            text: FALLBACK_MESSAGE,
            options: [],
            showOptions: false,
          },
        ]);
      }
    } catch (error) {
      console.error('Error loading node:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: generateUniqueId(),
          type: 'bot',
          text: 'Sorry, I encountered an error. Please try again.',
          options: [],
          showOptions: false,
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(scrollToBottom, 150);
    }
  }, [scrollToBottom]);

  // ============================================================
  // RESET HELPER
  // ============================================================
  const resetChatState = useCallback(() => {
    setMessages([]);
    setConversationEnded(false);
    setCurrentMessageId(null);
    setFlowHistory([]);
    setExpandedMessages({});
    setShowGlobalActions(false);
    setHasStarted(false);
    setInputValue('');
    setTimeout(showWelcomeMessage, WELCOME_DELAY);
  }, [showWelcomeMessage]);

  // ============================================================
  // ACTION HANDLERS
  // ============================================================
  const handleStartAPI = useCallback(() => resetChatState(), [resetChatState]);
  const handleClearHistory = useCallback(() => resetChatState(), [resetChatState]);
  const handleRestart = useCallback(() => resetChatState(), [resetChatState]);

  const handleExitBot = useCallback(() => {
    setShowGlobalActions(false);
    setIsOpen(false);
    setUnreadCount(0);
    toggleButtonRef.current?.focus();
  }, []);

  const toggleChat = useCallback(() => {
    setIsOpen((prev) => {
      if (!prev) setUnreadCount(0);
      return !prev;
    });
  }, []);

  const toggleGlobalActions = useCallback(() => {
    setShowGlobalActions((prev) => !prev);
  }, []);

  // ============================================================
  // MESSAGE RENDERER
  // ============================================================
  const toggleMessageExpand = useCallback((messageId) => {
    setExpandedMessages((prev) => ({
      ...prev,
      [messageId]: !prev[messageId],
    }));
  }, []);

  const renderMessage = useCallback(
    (message, index) => {
      const isExpanded = expandedMessages[message.id] || false;
      const needsExpansion = message.text.length > CHAR_LIMIT;
      const displayText = isExpanded
        ? message.text
        : message.text.slice(0, CHAR_LIMIT) + (needsExpansion ? '...' : '');
      const isBot = message.type === 'bot';
      const hasOptions =
        Array.isArray(message.options) && message.options.length > 0 && message.showOptions;

      return (
        <div key={message.id} className={`message ${isBot ? 'bot-message' : 'user-message'}`}>
          {isBot && (
            <div className="message-avatar bot-avatar">
               <Image
                  src="/chat-girl.png"
                  alt="Liaison Bank logo"
                  width={192}
                  height={192}
                  priority
                />  
            </div>
          )}
          <div className="message-wrapper">
            <div className="message-content">
              <div className="message-text">{displayText}</div>

              {hasOptions && (
                <div className="inline-options">
                  {message.options.map((option, optIndex) => {
                    const optLabel =
                      option.option_text || option.title || option.text;
                    return (
                      <button
                        key={option.id || optIndex}
                        className="inline-option-btn"
                        onClick={() =>
                          handleOptionClick(
                            option.next_message_id || option.id,
                            optLabel,
                            index
                          )
                        }
                      >
                        <span className="option-text">{optLabel}</span>
                        <span className="option-arrow">→</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {isBot && needsExpansion && (
                <div className="message-actions-bar">
                  <button
                    className="action-chip"
                    onClick={() => toggleMessageExpand(message.id)}
                    title={isExpanded ? 'Show less' : 'Show more'}
                    aria-expanded={isExpanded}
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
    },
    [expandedMessages, handleOptionClick, toggleMessageExpand]
  );

  // ============================================================
  // HANDLE ENTER KEY IN INPUT
  // ============================================================
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  // ============================================================
  // WHEEL HANDLER (stop propagation so page doesn't scroll)
  // ============================================================
  const handleWheel = useCallback((e) => {
    e.stopPropagation();
    const element = e.currentTarget;
    if (e.deltaY !== 0) {
      element.scrollTop += e.deltaY;
    }
  }, []);

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="floating-chatbot" ref={chatContainerRef}>
      <button
        ref={toggleButtonRef}
        className="chatbot-toggle"
        onClick={toggleChat}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <span className="close-icon">✕</span>
        ) : (
          <>
            <span className="chat-icon">💬</span>
            {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
          </>
        )}
      </button>

      {isOpen && (
        <div className="chat-window" role="dialog" aria-label="Liaison Bank chat">
          <div className="chat-header">
            <div className="header-content">
              <div className="brand-icon">
                <Image
                  src="/chat-header.png"
                  alt="Liaison Bank logo"
                  width={192}
                  height={192}
                  priority
                />
              </div>
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
                aria-haspopup="true"
                aria-expanded={showGlobalActions}
                title="More options"
              >
                ⋮
              </button>

              {showGlobalActions && (
                <div className="global-actions-dropdown" ref={globalActionsRef} role="menu">
                  <button className="dropdown-item" onClick={handleStartAPI} role="menuitem">
                    Start New Conversation
                  </button>
                  <button className="dropdown-item" onClick={handleClearHistory} role="menuitem">
                    Clear Chat History
                  </button>
                  <button
                    className="dropdown-item exit-item"
                    onClick={handleExitBot}
                    role="menuitem"
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

          <div className="chat-messages" ref={chatMessagesRef} onWheel={handleWheel}   style={{
            '--chat-wallpaper': `url(${chatWindowBg.src || chatWindowBg})`
          }}>
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
                   <Image
                    src="/chat-girl.png"
                    alt="Liaison Bank logo"
                    width={192}
                    height={192}
                    priority
                  />                  
                  {/* <span>🤖</span> */}
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
                  aria-label="Chat message input"
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
            <span className="flow-indicator">{messages.length} messages</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingChatbot;