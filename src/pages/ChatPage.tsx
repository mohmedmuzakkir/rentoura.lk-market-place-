import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Bell, 
  MoreVertical, 
  Phone, 
  ShieldCheck, 
  MapPin, 
  ChevronRight, 
  Plus, 
  Smile, 
  Mic, 
  Send, 
  CheckCheck, 
  ExternalLink,
  ShieldAlert,
  Info,
  Calendar,
  Sparkles,
  Paperclip,
  Image as ImageIcon,
  Loader2
} from 'lucide-react';
import { RentouraLogo } from '../components/RentouraLogo';
import { AppRoute } from '../types';
import { Conversation, ChatMessage } from '../types/messagesTypes';
import { MessagingService } from '../services/messagingService';

interface ChatPageProps {
  conversation: Conversation;
  onBack: () => void;
  onNavigate: (route: AppRoute) => void;
  onOpenListingDetail: (id: string, module?: 'rentals' | 'jobs' | 'services') => void;
  onSendMessage: (conversationId: string, text: string, type?: 'text' | 'location' | 'contact' | 'image') => void;
  notificationCount?: number;
  userProfile?: any;
  onRefreshMessages?: () => void;
  onToggleMute?: (conversationId: string, isMuted: boolean) => void;
  onToggleArchive?: (conversationId: string, isArchived: boolean) => void;
  onMarkUnread?: (conversationId: string) => void;
}

export const ChatPage: React.FC<ChatPageProps> = ({
  conversation,
  onBack,
  onNavigate,
  onOpenListingDetail,
  onSendMessage,
  notificationCount = 3,
  userProfile,
  onRefreshMessages,
  onToggleMute,
  onToggleArchive,
  onMarkUnread
}) => {
  const [inputText, setInputText] = useState('');
  const [activeTab, setActiveTab] = useState<'chat' | 'details' | 'user'>('chat');
  const [showSearch, setShowSearch] = useState(false);
  const [messageSearch, setMessageSearch] = useState('');
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [showUserInfoModal, setShowUserInfoModal] = useState(false);
  const [showShareContactModal, setShowShareContactModal] = useState(false);
  const [contactPhoneInput, setContactPhoneInput] = useState(userProfile?.phone_normalized || userProfile?.phone || '');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Real-time subscription to message updates
  useEffect(() => {
    if (conversation?.id) {
      const unsub = MessagingService.subscribeToMessages(conversation.id, () => {
        onRefreshMessages?.();
      });
      return () => {
        unsub();
      };
    }
  }, [conversation?.id, onRefreshMessages]);

  // Auto scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation.messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSendMessage(conversation.id, inputText.trim(), 'text');
    setInputText('');
  };

  const handleQuickReply = (reply: string) => {
    onSendMessage(conversation.id, reply, 'text');
  };

  const handleSendLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude.toFixed(4);
          const lng = pos.coords.longitude.toFixed(4);
          onSendMessage(
            conversation.id, 
            `📍 Shared Location: https://maps.google.com/?q=${lat},${lng}`, 
            'location'
          );
        },
        () => {
          if (conversation.listing.location && conversation.listing.location !== 'Sri Lanka') {
            onSendMessage(
              conversation.id, 
              `📍 Location regarding listing: ${conversation.listing.location}`, 
              'location'
            );
          } else {
            const userLoc = prompt('Enter location or landmark to share:');
            if (userLoc && userLoc.trim()) {
              onSendMessage(conversation.id, `📍 Shared Location: ${userLoc.trim()}`, 'location');
            }
          }
        }
      );
    } else if (conversation.listing.location) {
      onSendMessage(
        conversation.id, 
        `📍 Location regarding listing: ${conversation.listing.location}`, 
        'location'
      );
    }
  };

  const handleConfirmShareContact = () => {
    const phoneToShare = contactPhoneInput.trim() || userProfile?.phone_normalized || userProfile?.phone;
    if (!phoneToShare) {
      alert('Please enter a valid contact number to share.');
      return;
    }
    onSendMessage(
      conversation.id, 
      `📞 Contact Number: ${phoneToShare}`, 
      'contact'
    );
    setShowShareContactModal(false);
  };

  const handleImageUploadChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPEG, PNG, WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image file size must be smaller than 5 MB.');
      return;
    }

    setIsUploadingImage(true);
    try {
      const signedUrl = await MessagingService.uploadAttachment(conversation.id, file);
      if (signedUrl) {
        onSendMessage(conversation.id, signedUrl, 'image');
      } else {
        alert('Could not upload image attachment. Storage bucket security policy requirement.');
      }
    } catch (err: any) {
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const filteredMessages = messageSearch.trim()
    ? conversation.messages.filter(m => m.text.toLowerCase().includes(messageSearch.toLowerCase()))
    : conversation.messages;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col justify-between">
      {/* Top Header Bar matching Image 3 */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-2.5 shadow-xs">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          {/* Back button */}
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors tap-bounce shrink-0"
            aria-label="Back to Inbox"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Centered Logo */}
          <div className="cursor-pointer" onClick={() => onNavigate('/')}>
            <RentouraLogo variant="header" theme="light" />
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors tap-bounce"
              aria-label="Search Messages"
            >
              <Search className="w-4.5 h-4.5" />
            </button>

            <button
              onClick={() => onNavigate('/messages')}
              className="relative w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors tap-bounce"
              aria-label="Notifications"
            >
              <Bell className="w-4.5 h-4.5" />
              {notificationCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] px-1 bg-[#1464F4] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                  {notificationCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setShowUserInfoModal(true)}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors tap-bounce"
              aria-label="Chat Options"
            >
              <MoreVertical className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* Message Search Bar */}
        {showSearch && (
          <div className="max-w-4xl mx-auto mt-2 pt-2 border-t border-slate-100">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search in this conversation..."
                value={messageSearch}
                onChange={(e) => setMessageSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-100 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#1464F4]/20 border border-slate-200"
                autoFocus
              />
            </div>
          </div>
        )}
      </header>

      {/* Main Container */}
      <main className="max-w-4xl w-full mx-auto flex-1 flex flex-col px-3 sm:px-4 py-3 space-y-3">
        {/* User & Listing Context Card matching Image 3 Hero Banner */}
        <div className="bg-gradient-to-br from-[#041C43] to-[#0A2E6E] text-white rounded-2xl p-3.5 sm:p-4 shadow-md space-y-3.5">
          {/* Top Row: User details & Call button */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                {conversation.participant.avatarUrl ? (
                  <img
                    src={conversation.participant.avatarUrl}
                    alt={conversation.participant.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white/30 shadow-xs"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-blue-600 border-2 border-white/30 text-white flex items-center justify-center font-bold text-sm">
                    {conversation.participant.avatarInitials || conversation.participant.name.charAt(0)}
                  </div>
                )}
                {conversation.participant.isOnline && (
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#041C43]" />
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h2 className="font-bold text-white text-base font-heading truncate">
                    {conversation.participant.name}
                  </h2>
                  {conversation.participant.verified && (
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-300 font-medium mt-0.5">
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online
                  </span>
                  <span>•</span>
                  <span className="truncate">{conversation.participant.memberSince || 'Member'}</span>
                </div>
                {conversation.participant.location && (
                  <div className="text-[10.5px] text-slate-300/80 truncate mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    {conversation.participant.location}
                  </div>
                )}
              </div>
            </div>

            {/* Call button */}
            {conversation.participant.phone && (
              <a
                href={`tel:${conversation.participant.phone}`}
                className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold flex items-center gap-1.5 transition-all border border-white/10 shrink-0 tap-bounce"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Call</span>
              </a>
            )}
          </div>

          {/* Prominent Listing Context Card matching Image 3 */}
          <div
            onClick={() => onOpenListingDetail(conversation.listing.id, conversation.listing.module)}
            className="bg-white/10 hover:bg-white/15 backdrop-blur-xs border border-white/15 rounded-xl p-2.5 flex items-center justify-between gap-3 cursor-pointer transition-all tap-bounce group"
          >
            <div className="flex items-center gap-3 min-w-0">
              {conversation.listing.imageUrl ? (
                <img
                  src={conversation.listing.imageUrl}
                  alt={conversation.listing.title}
                  className="w-13 h-13 rounded-lg object-cover shrink-0 border border-white/20"
                />
              ) : (
                <div className="w-13 h-13 rounded-lg bg-white/10 flex items-center justify-center shrink-0 text-white font-bold text-xs">
                  {conversation.listing.badge}
                </div>
              )}

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span 
                    className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase text-white tracking-wide"
                    style={{ backgroundColor: conversation.listing.badgeColor || '#1464F4' }}
                  >
                    {conversation.listing.badge}
                  </span>
                  <span className="text-[11px] text-white/80 truncate font-semibold">
                    {conversation.listing.location}
                  </span>
                </div>
                <h3 className="font-bold text-white text-xs font-heading truncate mt-0.5 group-hover:text-blue-200 transition-colors">
                  {conversation.listing.title}
                </h3>
                <div className="text-xs font-black text-amber-300 font-heading mt-0.5">
                  {conversation.listing.price}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 text-white/70 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0">
              <span className="text-[11px] font-semibold hidden sm:inline">View Listing</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-2 pt-1 border-t border-white/10 text-xs font-bold">
            <button
              onClick={() => setActiveTab('chat')}
              className={`pb-1 px-1 transition-all ${
                activeTab === 'chat'
                  ? 'text-white border-b-2 border-[#00D2FF]'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Chat
            </button>
            <button
              onClick={() => onOpenListingDetail(conversation.listing.id, conversation.listing.module)}
              className="pb-1 px-1 text-white/60 hover:text-white transition-all flex items-center gap-1"
            >
              Listing Details <ExternalLink className="w-3 h-3 opacity-70" />
            </button>
            <button
              onClick={() => setShowUserInfoModal(true)}
              className="pb-1 px-1 text-white/60 hover:text-white transition-all"
            >
              User Info
            </button>
          </div>
        </div>

        {/* Safety Warning Notice Banner matching Image 3 */}
        <div className="bg-amber-50/90 border border-amber-200/80 rounded-xl p-2.5 flex items-start justify-between gap-2.5 text-xs text-amber-900 shadow-2xs">
          <div className="flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[11.5px] leading-tight font-medium">
              <strong>Keep conversations safe:</strong> Never share sensitive passwords or bank OTPs, and avoid advance payments before inspecting.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/safety')}
            className="shrink-0 text-[11px] font-bold text-[#1464F4] hover:underline whitespace-nowrap self-center"
          >
            Learn More
          </button>
        </div>

        {/* Chat Messages Container */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-200/90 shadow-xs p-3 sm:p-4 flex flex-col justify-between space-y-3 min-h-[380px]">
          {/* Scrollable Messages Area */}
          <div className="space-y-3 overflow-y-auto max-h-[50vh] pr-1">
            {/* Date Pill */}
            <div className="flex items-center justify-center my-1">
              <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-bold uppercase tracking-wider">
                Today
              </span>
            </div>

            {filteredMessages.map((msg) => {
              const isMe = msg.sender === 'me';
              const isImageMsg = msg.type === 'image' || (typeof msg.text === 'string' && (msg.text.startsWith('http://') || msg.text.startsWith('https://')) && (msg.text.includes('.png') || msg.text.includes('.jpg') || msg.text.includes('.jpeg') || msg.text.includes('.webp') || msg.text.includes('token=') || msg.text.includes('supabase')));
              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  {!isMe && (
                    <div className="shrink-0 mb-1">
                      {conversation.participant.avatarUrl ? (
                        <img
                          src={conversation.participant.avatarUrl}
                          alt={conversation.participant.name}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px]">
                          {conversation.participant.avatarInitials || conversation.participant.name.charAt(0)}
                        </div>
                      )}
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] sm:max-w-[70%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-2xs ${
                      isMe
                        ? 'bg-[#EBF2FE] border border-[#1464F4]/20 text-slate-900 rounded-br-xs'
                        : 'bg-slate-100/90 border border-slate-200/70 text-slate-900 rounded-bl-xs'
                    }`}
                  >
                    {isImageMsg ? (
                      <div className="mt-0.5 space-y-1">
                        <img
                          src={msg.text}
                          alt="Attachment image"
                          className="max-w-xs max-h-60 rounded-xl object-cover border border-slate-200/80 cursor-pointer hover:opacity-95 transition-opacity"
                          onClick={() => window.open(msg.text, '_blank')}
                        />
                        <span className="text-[10px] text-slate-500 block italic">Click image to view full resolution</span>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap font-medium">{msg.text}</p>
                    )}
                    <div
                      className={`flex items-center gap-1 text-[9.5px] mt-1 ${
                        isMe ? 'justify-end text-[#1464F4]/80' : 'text-slate-400'
                      }`}
                    >
                      <span>{msg.time}</span>
                      {isMe && <CheckCheck className="w-3.5 h-3.5 text-[#1464F4]" />}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Buttons & Suggested Replies */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            {/* Quick action triggers */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              <button
                onClick={handleSendLocation}
                className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#1464F4] text-[11px] font-bold border border-blue-200/60 whitespace-nowrap tap-bounce flex items-center gap-1"
              >
                <MapPin className="w-3 h-3" /> Send location
              </button>
              <button
                onClick={() => setShowShareContactModal(true)}
                className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#08A34F] text-[11px] font-bold border border-emerald-200/60 whitespace-nowrap tap-bounce flex items-center gap-1"
              >
                <Phone className="w-3 h-3" /> Share contact
              </button>
            </div>

            {/* Quick replies pill chips */}
            {conversation.quickReplies && conversation.quickReplies.length > 0 && (
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {conversation.quickReplies.map((reply, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickReply(reply)}
                    className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium whitespace-nowrap transition-colors tap-bounce"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Hidden File Input for Image Uploads */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleImageUploadChange}
      />

      {/* Sticky Message Composer matching Image 3 */}
      <footer className="sticky bottom-0 z-30 bg-white border-t border-slate-200/90 px-3 sm:px-4 py-3 pb-6 sm:pb-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center gap-2">
          {/* Attachment button */}
          <div className="relative">
            <button
              onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
              disabled={isUploadingImage}
              className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors tap-bounce shrink-0 disabled:opacity-50"
              aria-label="Add attachment"
            >
              {isUploadingImage ? <Loader2 className="w-5 h-5 animate-spin text-[#1464F4]" /> : <Plus className="w-5 h-5" />}
            </button>

            {/* Attachment popover */}
            {showAttachmentMenu && (
              <div className="absolute bottom-12 left-0 bg-white rounded-2xl p-2 shadow-xl border border-slate-200 w-48 space-y-1 z-50 animate-in fade-in slide-in-from-bottom-2">
                <button
                  onClick={() => {
                    handleSendLocation();
                    setShowAttachmentMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4 text-[#1464F4]" /> Share Location
                </button>
                <button
                  onClick={() => {
                    setShowShareContactModal(true);
                    setShowAttachmentMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-2"
                >
                  <Phone className="w-4 h-4 text-[#08A34F]" /> Send Contact
                </button>
                <button
                  onClick={() => {
                    fileInputRef.current?.click();
                    setShowAttachmentMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-2"
                >
                  <ImageIcon className="w-4 h-4 text-purple-500" /> Upload Image
                </button>
              </div>
            )}
          </div>

          {/* Text Input */}
          <div className="flex-1 relative flex items-center">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isUploadingImage ? "Uploading image..." : "Type a message..."}
              disabled={isUploadingImage}
              className="w-full pl-3.5 pr-10 py-2.5 bg-slate-100 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1464F4]/30 border border-slate-200 disabled:opacity-60"
            />
            <button
              onClick={() => setInputText(prev => prev + ' 😊')}
              className="absolute right-2.5 text-slate-400 hover:text-slate-600 p-1"
              aria-label="Add emoji"
            >
              <Smile className="w-4 h-4" />
            </button>
          </div>

          {/* Send or Mic Button */}
          {inputText.trim() ? (
            <button
              onClick={handleSend}
              disabled={isUploadingImage}
              className="w-10 h-10 rounded-xl bg-[#1464F4] text-white flex items-center justify-center hover:bg-blue-600 transition-colors shadow-xs tap-bounce shrink-0 disabled:opacity-50"
              aria-label="Send message"
            >
              <Send className="w-4.5 h-4.5" />
            </button>
          ) : (
            <button
              onClick={() => alert('Voice recording is coming soon.')}
              className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors tap-bounce shrink-0"
              aria-label="Record voice note"
              title="Voice recording coming soon"
            >
              <Mic className="w-4.5 h-4.5" />
            </button>
          )}
        </div>
      </footer>

      {/* Share Contact Confirmation Modal */}
      {showShareContactModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base font-heading">Share Contact Info</h3>
              <button
                onClick={() => setShowShareContactModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Confirm your phone number to share with <strong>{conversation.participant.name}</strong>.
            </p>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-700">Phone Number</label>
              <input
                type="text"
                value={contactPhoneInput}
                onChange={(e) => setContactPhoneInput(e.target.value)}
                placeholder="+94 77 000 0000"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#1464F4]/30 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowShareContactModal(false)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmShareContact}
                className="flex-1 py-2.5 px-3 rounded-xl bg-[#08A34F] text-white text-xs font-bold hover:bg-emerald-600 shadow-xs"
              >
                Share Contact
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Info & Options Modal */}
      {showUserInfoModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base font-heading">User Profile & Options</h3>
              <button
                onClick={() => setShowUserInfoModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
              {conversation.participant.avatarUrl ? (
                <img
                  src={conversation.participant.avatarUrl}
                  alt={conversation.participant.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-blue-100 text-[#1464F4] flex items-center justify-center font-bold text-base">
                  {conversation.participant.name.charAt(0)}
                </div>
              )}
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{conversation.participant.name}</h4>
                <div className="text-xs text-slate-500">{conversation.participant.memberSince}</div>
                {conversation.participant.verified && (
                  <div className="text-xs text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified User
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  setShowUserInfoModal(false);
                  onOpenListingDetail(conversation.listing.id, conversation.listing.module);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-[#1464F4] text-white text-xs font-bold flex items-center justify-center gap-2 tap-bounce"
              >
                <ExternalLink className="w-4 h-4" /> View Associated Listing
              </button>

              {conversation.participant.phone && (
                <a
                  href={`tel:${conversation.participant.phone}`}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 text-[#08A34F] text-xs font-bold flex items-center justify-center gap-2 tap-bounce border border-emerald-200"
                >
                  <Phone className="w-4 h-4" /> Call: {conversation.participant.phone}
                </a>
              )}

              <div className="pt-2 border-t border-slate-100 flex flex-col gap-1.5">
                <button
                  onClick={() => {
                    onToggleMute?.(conversation.id, !conversation.isMuted);
                    setShowUserInfoModal(false);
                  }}
                  className="w-full py-2 px-3 rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 text-xs font-medium flex items-center justify-center gap-1.5"
                >
                  <Bell className="w-3.5 h-3.5" /> {conversation.isMuted ? 'Unmute Conversation' : 'Mute Notifications'}
                </button>

                <button
                  onClick={() => {
                    onToggleArchive?.(conversation.id, !(conversation as any).isArchived);
                    setShowUserInfoModal(false);
                    onBack();
                  }}
                  className="w-full py-2 px-3 rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 text-xs font-medium flex items-center justify-center gap-1.5"
                >
                  <Info className="w-3.5 h-3.5 text-amber-500" /> Archive Conversation
                </button>

                <button
                  onClick={() => {
                    onMarkUnread?.(conversation.id);
                    setShowUserInfoModal(false);
                    onBack();
                  }}
                  className="w-full py-2 px-3 rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 text-xs font-medium flex items-center justify-center gap-1.5"
                >
                  <CheckCheck className="w-3.5 h-3.5 text-[#1464F4]" /> Mark as Unread
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
