import { supabase } from '../lib/supabase';
import { Conversation, ChatMessage, ConversationModule, ConversationParticipant, ConversationListing } from '../types/messagesTypes';

export class MessagingService {
  /**
   * Get all conversations for the currently logged in user
   */
  static async getConversations(): Promise<Conversation[]> {
    try {
      const { data: authData } = await supabase.auth.getUser();
      const currentUserId = authData?.user?.id;

      if (!currentUserId) {
        return [];
      }

      // 1. Fetch participant records for current user
      const { data: myPartRows, error: partErr } = await supabase
        .from('conversation_participants')
        .select('conversation_id, last_read_at, is_muted, is_archived')
        .eq('user_id', currentUserId);

      if (partErr || !myPartRows || myPartRows.length === 0) {
        return [];
      }

      const conversationIds = myPartRows.map(p => p.conversation_id);

      // 2. Fetch conversations details
      const { data: convRows, error: convErr } = await supabase
        .from('conversations')
        .select('id, listing_id, created_by, last_message_at, status, created_at')
        .in('id', conversationIds)
        .order('last_message_at', { ascending: false });

      if (convErr || !convRows) {
        return [];
      }

      // 3. For each conversation, fetch participants, listing, and messages
      const results: Conversation[] = [];

      for (const conv of convRows) {
        const myPart = myPartRows.find(p => p.conversation_id === conv.id);
        const lastReadAt = myPart?.last_read_at ? new Date(myPart.last_read_at).getTime() : 0;

        // Fetch other participant(s)
        const { data: otherPartRows } = await supabase
          .from('conversation_participants')
          .select('user_id, role')
          .eq('conversation_id', conv.id)
          .neq('user_id', currentUserId);

        let participant: ConversationParticipant = {
          id: 'system',
          name: 'RENTOURA User',
          isOnline: false,
          memberSince: 'Member'
        };

        if (otherPartRows && otherPartRows.length > 0) {
          const otherUserId = otherPartRows[0].user_id;
          const { data: prof } = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url, phone_normalized, created_at')
            .eq('id', otherUserId)
            .maybeSingle();

          if (prof) {
            participant = {
              id: prof.id,
              name: prof.full_name || 'RENTOURA User',
              avatarUrl: prof.avatar_url || undefined,
              memberSince: prof.created_at ? `Member since ${new Date(prof.created_at).getFullYear()}` : 'Member',
              phone: prof.phone_normalized || undefined,
              isOnline: false
            };
          }
        }

        // Fetch listing information if present
        let listing: ConversationListing = {
          id: conv.listing_id || 'system',
          title: 'Direct Marketplace Message',
          badge: 'CHAT',
          badgeColor: '#64748B',
          module: 'system'
        };

        if (conv.listing_id) {
          const { data: listingRow } = await supabase
            .from('listings')
            .select('id, title, module, price_amount, status')
            .eq('id', conv.listing_id)
            .maybeSingle();

          if (listingRow) {
            let coverUrl: string | undefined = undefined;
            const { data: mediaRows } = await supabase
              .from('listing_media')
              .select('storage_path')
              .eq('listing_id', conv.listing_id)
              .order('is_cover', { ascending: false })
              .limit(1);

            if (mediaRows && mediaRows.length > 0 && mediaRows[0].storage_path) {
              const path = mediaRows[0].storage_path;
              if (path.startsWith('http')) {
                coverUrl = path;
              } else {
                const { data: signedData } = await supabase.storage
                  .from('listing-images')
                  .createSignedUrl(path, 3600);
                if (signedData?.signedUrl) {
                  coverUrl = signedData.signedUrl;
                }
              }
            }

            const rawMod = (listingRow.module || 'rentals').toLowerCase();
            const moduleType: ConversationModule = rawMod.startsWith('job') ? 'jobs' : (rawMod.startsWith('serv') ? 'services' : 'rentals');
            const badgeColor = moduleType === 'jobs' ? '#08A34F' : (moduleType === 'services' ? '#FF650A' : '#1464F4');

            listing = {
              id: listingRow.id,
              title: listingRow.status === 'active' ? listingRow.title : `${listingRow.title} (Unavailable)`,
              price: listingRow.price_amount ? `LKR ${Number(listingRow.price_amount).toLocaleString()}` : 'Contact for Price',
              imageUrl: coverUrl,
              badge: moduleType === 'jobs' ? 'JOB' : (moduleType === 'services' ? 'SERVICE' : 'RENTAL'),
              badgeColor,
              module: moduleType
            };
          } else {
            listing = {
              id: conv.listing_id,
              title: 'Listing Unavailable',
              badge: 'UNAVAILABLE',
              badgeColor: '#64748B',
              module: 'system'
            };
          }
        }

        // Fetch messages for this conversation
        const { data: msgRows } = await supabase
          .from('messages')
          .select('id, sender_id, body, type, created_at')
          .eq('conversation_id', conv.id)
          .order('created_at', { ascending: true });

        const formattedMessages: ChatMessage[] = (msgRows || []).map(m => {
          const isMe = m.sender_id === currentUserId;
          const msgDate = new Date(m.created_at);
          return {
            id: m.id,
            sender: isMe ? 'me' : 'them',
            text: m.body,
            time: msgDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            timestamp: msgDate.getTime(),
            type: (m.type as any) || 'text',
            isRead: new Date(m.created_at).getTime() <= lastReadAt
          };
        });

        // Compute unread count
        let unreadCount = 0;
        (msgRows || []).forEach(m => {
          if (m.sender_id !== currentUserId && new Date(m.created_at).getTime() > lastReadAt) {
            unreadCount++;
          }
        });

        const lastMsgObj = formattedMessages[formattedMessages.length - 1];
        const lastMsgText = lastMsgObj ? lastMsgObj.text : 'Conversation started';
        const lastMsgTime = conv.last_message_at
          ? MessagingService.formatTimeAgo(conv.last_message_at)
          : 'Just now';

        results.push({
          id: conv.id,
          module: listing.module || 'system',
          participant,
          listing,
          lastMessage: lastMsgText,
          lastMessageTime: lastMsgTime,
          lastMessageTimestamp: conv.last_message_at ? new Date(conv.last_message_at).getTime() : Date.now(),
          unreadCount,
          isPinned: false,
          isMuted: myPart?.is_muted || false,
          messages: formattedMessages
        });
      }

      return results;
    } catch (err) {
      console.warn('[MessagingService] Error fetching conversations:', err);
      return [];
    }
  }

  /**
   * Get or Create a conversation for a listing + recipient
   */
  static async getOrCreateConversation(
    listingId: string,
    recipientUserId: string
  ): Promise<string | null> {
    try {
      const { data: authData } = await supabase.auth.getUser();
      const currentUserId = authData?.user?.id;

      if (!currentUserId) {
        throw new Error('User must be logged in to send messages.');
      }

      if (currentUserId === recipientUserId) {
        throw new Error('You cannot message your own listing.');
      }

      // Check existing conversation
      const { data: myConvs } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', currentUserId);

      if (myConvs && myConvs.length > 0) {
        const myConvIds = myConvs.map(c => c.conversation_id);

        const { data: existingParts } = await supabase
          .from('conversation_participants')
          .select('conversation_id')
          .eq('user_id', recipientUserId)
          .in('conversation_id', myConvIds);

        if (existingParts && existingParts.length > 0) {
          // Check if one matches listingId
          const matchConvIds = existingParts.map(p => p.conversation_id);
          const { data: matchingConvs } = await supabase
            .from('conversations')
            .select('id')
            .in('id', matchConvIds)
            .eq('listing_id', listingId)
            .limit(1);

          if (matchingConvs && matchingConvs.length > 0) {
            return matchingConvs[0].id;
          }
        }
      }

      // Create new conversation
      const { data: newConv, error: createErr } = await supabase
        .from('conversations')
        .insert({
          listing_id: listingId,
          created_by: currentUserId,
          last_message_at: new Date().toISOString()
        })
        .select('id')
        .single();

      if (createErr || !newConv) {
        throw new Error(createErr?.message || 'Failed to create conversation');
      }

      // Insert participants
      await supabase.from('conversation_participants').insert([
        { conversation_id: newConv.id, user_id: currentUserId, role: 'inquirer' },
        { conversation_id: newConv.id, user_id: recipientUserId, role: 'owner' }
      ]);

      return newConv.id;
    } catch (err: any) {
      console.warn('[MessagingService] Error in getOrCreateConversation:', err.message || err);
      throw err;
    }
  }

  /**
   * Send a message to a conversation
   */
  static async sendMessage(
    conversationId: string,
    body: string,
    type: 'text' | 'location' | 'contact' | 'image' | 'file' = 'text'
  ): Promise<ChatMessage | null> {
    try {
      const { data: authData } = await supabase.auth.getUser();
      const currentUserId = authData?.user?.id;

      if (!currentUserId) {
        throw new Error('User must be logged in to send a message.');
      }

      const { data: newMsg, error: insertErr } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: currentUserId,
          body,
          type
        })
        .select('*')
        .single();

      if (insertErr || !newMsg) {
        throw new Error(insertErr?.message || 'Failed to send message');
      }

      const nowIso = new Date().toISOString();

      // Update conversation last_message_at
      await supabase
        .from('conversations')
        .update({ last_message_at: nowIso })
        .eq('id', conversationId);

      // Update current user's last_read_at
      await supabase
        .from('conversation_participants')
        .update({ last_read_at: nowIso })
        .eq('conversation_id', conversationId)
        .eq('user_id', currentUserId);

      const msgDate = new Date(newMsg.created_at);
      return {
        id: newMsg.id,
        sender: 'me',
        text: newMsg.body,
        time: msgDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: msgDate.getTime(),
        type: (newMsg.type as any) || 'text',
        isRead: true
      };
    } catch (err: any) {
      console.warn('[MessagingService] Error sending message:', err.message || err);
      return null;
    }
  }

  /**
   * Upload an image attachment to Supabase Storage and return signed URL
   */
  static async uploadAttachment(
    conversationId: string,
    file: File
  ): Promise<string | null> {
    try {
      const fileExt = file.name.split('.').pop() || 'jpg';
      const filePath = `chat_${conversationId}/${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

      let bucket = 'chat-attachments';
      let { error: uploadErr } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (uploadErr) {
        bucket = 'listing-images';
        const fallbackRes = await supabase.storage
          .from(bucket)
          .upload(filePath, file, { cacheControl: '3600', upsert: false });
        if (fallbackRes.error) {
          console.warn('[MessagingService] Attachment upload error:', fallbackRes.error.message);
          return null;
        }
      }

      const { data: signedData } = await supabase.storage
        .from(bucket)
        .createSignedUrl(filePath, 86400 * 7);

      return signedData?.signedUrl || null;
    } catch (err) {
      console.warn('[MessagingService] Attachment upload failed:', err);
      return null;
    }
  }

  /**
   * Realtime subscription listener for new messages in a conversation
   */
  static subscribeToMessages(
    conversationId: string,
    onNewMessage: () => void
  ) {
    const channel = supabase
      .channel(`chat_${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        () => {
          onNewMessage();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }

  /**
   * Mark conversation as read for current user
   */
  static async markAsRead(conversationId: string): Promise<boolean> {
    try {
      const { data: authData } = await supabase.auth.getUser();
      const currentUserId = authData?.user?.id;
      if (!currentUserId) return false;

      await supabase
        .from('conversation_participants')
        .update({ last_read_at: new Date().toISOString() })
        .eq('conversation_id', conversationId)
        .eq('user_id', currentUserId);

      return true;
    } catch (err) {
      return false;
    }
  }

  /**
   * Mark conversation as unread for current user
   */
  static async markAsUnread(conversationId: string): Promise<boolean> {
    try {
      const { data: authData } = await supabase.auth.getUser();
      const currentUserId = authData?.user?.id;
      if (!currentUserId) return false;

      await supabase
        .from('conversation_participants')
        .update({ last_read_at: '1970-01-01T00:00:00Z' })
        .eq('conversation_id', conversationId)
        .eq('user_id', currentUserId);

      return true;
    } catch (err) {
      return false;
    }
  }

  /**
   * Toggle archive status for current user
   */
  static async toggleArchive(conversationId: string, isArchived: boolean): Promise<boolean> {
    try {
      const { data: authData } = await supabase.auth.getUser();
      const currentUserId = authData?.user?.id;
      if (!currentUserId) return false;

      await supabase
        .from('conversation_participants')
        .update({ is_archived: isArchived })
        .eq('conversation_id', conversationId)
        .eq('user_id', currentUserId);

      return true;
    } catch (err) {
      return false;
    }
  }

  /**
   * Toggle mute status for current user
   */
  static async toggleMute(conversationId: string, isMuted: boolean): Promise<boolean> {
    try {
      const { data: authData } = await supabase.auth.getUser();
      const currentUserId = authData?.user?.id;
      if (!currentUserId) return false;

      await supabase
        .from('conversation_participants')
        .update({ is_muted: isMuted })
        .eq('conversation_id', conversationId)
        .eq('user_id', currentUserId);

      return true;
    } catch (err) {
      return false;
    }
  }

  /**
   * Helper function for human time formatting
   */
  private static formatTimeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString();
  }
}
