import { supabase } from '../lib/supabase';
import { Conversation, ChatMessage, ConversationModule, ConversationParticipant, ConversationListing } from '../types/messagesTypes';
import { formatListingDate } from '../utils/dateUtils';

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
      let convRows: any[] | null = null;
      let convErr: any = null;

      // Try fetching with type column
      const resWithType = await supabase
        .from('conversations')
        .select('id, listing_id, created_by, last_message_at, status, created_at, type')
        .in('id', conversationIds)
        .order('last_message_at', { ascending: false });

      if (!resWithType.error) {
        convRows = resWithType.data;
      } else {
        // Fallback if type column does not exist yet
        const resFallback = await supabase
          .from('conversations')
          .select('id, listing_id, created_by, last_message_at, status, created_at')
          .in('id', conversationIds)
          .order('last_message_at', { ascending: false });
        convRows = resFallback.data;
        convErr = resFallback.error;
      }

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
          .select('user_id, role, last_read_at')
          .eq('conversation_id', conv.id)
          .neq('user_id', currentUserId);

        const otherLastReadAt = otherPartRows && otherPartRows[0]?.last_read_at
          ? new Date(otherPartRows[0].last_read_at).getTime()
          : 0;

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
            .select('id, full_name, avatar_url, phone_normalized, created_at, role')
            .eq('id', otherUserId)
            .maybeSingle();

          if (prof) {
            const isStaff = Boolean(prof.role && ['admin', 'super_admin', 'moderator'].includes(prof.role));
            participant = {
              id: prof.id,
              name: prof.full_name || 'RENTOURA User',
              avatarUrl: prof.avatar_url || undefined,
              memberSince: prof.created_at ? `Member since ${new Date(prof.created_at).getFullYear()}` : 'Member',
              phone: prof.phone_normalized || undefined,
              isOnline: false,
              role: prof.role || 'user',
              isStaff,
              isVerifiedAdmin: isStaff,
              verified: isStaff
            };
          }
        }

        // Fetch listing information if present
        let listing: ConversationListing = {
          id: conv.listing_id || 'system',
          title: participant.isStaff ? 'Official Admin Communication' : 'Direct Marketplace Message',
          badge: participant.isStaff ? 'VERIFIED ADMIN' : 'CHAT',
          badgeColor: participant.isStaff ? '#1464F4' : '#64748B',
          module: 'system'
        };

        if (conv.listing_id) {
          const { data: listingRow } = await supabase
            .from('listings')
            .select('id, title, module, price, status')
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
              price: listingRow.price ? `LKR ${Number(listingRow.price).toLocaleString()}` : 'Contact for Price',
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
        let msgRows: any[] | null = null;
        const resWithRead = await supabase
          .from('messages')
          .select('id, sender_id, body, type, created_at, is_read, read_at')
          .eq('conversation_id', conv.id)
          .order('created_at', { ascending: true });

        if (!resWithRead.error) {
          msgRows = resWithRead.data;
        } else {
          const resFallback = await supabase
            .from('messages')
            .select('id, sender_id, body, type, created_at')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: true });
          msgRows = resFallback.data;
        }

        const senderIds = [...new Set((msgRows || []).map(m => m.sender_id).filter(Boolean))];
        const { data: senderProfiles } = senderIds.length > 0
          ? await supabase.from('profiles').select('id, role').in('id', senderIds)
          : { data: [] };
        const senderRoleMap = new Map((senderProfiles || []).map(p => [p.id, p.role as string]));

        const formattedMessages: ChatMessage[] = (msgRows || []).map(m => {
          const isMe = m.sender_id === currentUserId;
          const msgDate = new Date(m.created_at);
          const msgTime = msgDate.getTime();
          const sRole = senderRoleMap.get(m.sender_id) || 'user';
          const isStaffSender = Boolean(sRole && ['admin', 'super_admin', 'moderator'].includes(sRole));

          const isReadByRecipient = Boolean(
            m.is_read || (otherLastReadAt > 0 && msgTime <= otherLastReadAt)
          );
          const isReadByMe = Boolean(
            m.is_read || (lastReadAt > 0 && msgTime <= lastReadAt)
          );

          return {
            id: m.id,
            sender: isMe ? 'me' : 'them',
            text: m.body,
            time: msgDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            timestamp: msgTime,
            type: (m.type as any) || 'text',
            isRead: isMe ? isReadByRecipient : isReadByMe,
            senderId: m.sender_id,
            senderRole: sRole as any,
            isStaffSender
          };
        });

        const hasAppMessage = (msgRows || []).some(m => 
          m.type === 'job_application' || 
          (m.body && (m.body.startsWith('📋 JOB APPLICATION') || m.body.startsWith('📄 JOB APPLICATION')))
        );
        const isJobApplication = conv.type === 'job_application' || hasAppMessage;

        if (isJobApplication && listing) {
          listing.badge = 'APPLICATION';
          listing.badgeColor = '#065F46';
        }

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
          type: isJobApplication ? 'job_application' : 'chat',
          isJobApplication,
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
   * Find an existing conversation ID for a listing + recipient pair without creating a new one.
   */
  static async findExistingConversation(
    listingId: string | null,
    recipientUserId: string
  ): Promise<string | null> {
    try {
      const { data: authData } = await supabase.auth.getUser();
      const currentUserId = authData?.user?.id;

      if (!currentUserId || currentUserId === recipientUserId) {
        return null;
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
          const matchConvIds = existingParts.map(p => p.conversation_id);
          let query = supabase
            .from('conversations')
            .select('id')
            .in('id', matchConvIds);

          if (listingId) {
            query = query.eq('listing_id', listingId);
          } else {
            query = query.is('listing_id', null);
          }

          const { data: matchingConvs } = await query.limit(1);

          if (matchingConvs && matchingConvs.length > 0) {
            return matchingConvs[0].id;
          }
        }
      }
      return null;
    } catch (err) {
      console.warn('[MessagingService] Error finding existing conversation:', err);
      return null;
    }
  }

  /**
   * Get or Create a conversation for a listing (or direct system chat if null) + recipient
   */
  static async getOrCreateConversation(
    listingId: string | null,
    recipientUserId: string,
    type: 'chat' | 'job_application' = 'chat'
  ): Promise<string | null> {
    try {
      const { data: authData } = await supabase.auth.getUser();
      const currentUserId = authData?.user?.id;

      if (!currentUserId) {
        throw new Error('User must be logged in to send messages.');
      }

      if (currentUserId === recipientUserId) {
        throw new Error('You cannot message yourself.');
      }

      // Check existing conversation
      const existingId = await MessagingService.findExistingConversation(listingId, recipientUserId);
      if (existingId) {
        if (type === 'job_application') {
          try {
            await supabase.from('conversations').update({ type: 'job_application' }).eq('id', existingId);
          } catch {}
        }
        return existingId;
      }

      // Create new conversation
      let newConvId: string | null = null;
      let createErr: any = null;

      const payload: any = {
        listing_id: listingId || null,
        created_by: currentUserId,
        last_message_at: new Date().toISOString(),
        type
      };

      try {
        const { data, error } = await supabase
          .from('conversations')
          .insert(payload)
          .select('id')
          .single();

        if (!error && data) {
          newConvId = data.id;
        } else {
          createErr = error;
        }
      } catch {
        createErr = true;
      }

      if (!newConvId) {
        // Fallback without type column if schema migration not yet applied
        const { data, error } = await supabase
          .from('conversations')
          .insert({
            listing_id: listingId || null,
            created_by: currentUserId,
            last_message_at: new Date().toISOString()
          })
          .select('id')
          .single();

        if (error || !data) {
          throw new Error(error?.message || createErr?.message || 'Failed to create conversation');
        }
        newConvId = data.id;
      }

      // Fetch user profile roles for participant insertion
      const { data: myProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', currentUserId)
        .maybeSingle();

      const myRole = myProfile?.role && ['admin', 'super_admin', 'moderator'].includes(myProfile.role)
        ? myProfile.role
        : 'inquirer';

      // Insert participants
      await supabase.from('conversation_participants').insert([
        { conversation_id: newConvId, user_id: currentUserId, role: myRole },
        { conversation_id: newConvId, user_id: recipientUserId, role: 'owner' }
      ]);

      return newConvId;
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
    type: 'text' | 'location' | 'contact' | 'image' | 'file' | 'job_application' = 'text'
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

      const { data: myProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', currentUserId)
        .maybeSingle();

      const sRole = myProfile?.role || 'user';
      const isStaffSender = Boolean(sRole && ['admin', 'super_admin', 'moderator'].includes(sRole));

      const msgDate = new Date(newMsg.created_at);
      return {
        id: newMsg.id,
        sender: 'me',
        text: newMsg.body,
        time: msgDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: msgDate.getTime(),
        type: (newMsg.type as any) || 'text',
        isRead: false,
        senderId: currentUserId,
        senderRole: sRole as any,
        isStaffSender
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
    if (!conversationId || conversationId.startsWith('draft:')) {
      return () => {};
    }

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
   * Realtime subscription listener for typing indicator in a conversation
   */
  static subscribeToTyping(
    conversationId: string,
    currentUserId: string,
    onTypingStatusChange: (isTyping: boolean) => void
  ) {
    if (!conversationId || conversationId.startsWith('draft:')) {
      return () => {};
    }

    const channel = supabase.channel(`typing_${conversationId}`);
    
    channel
      .on('broadcast', { event: 'typing' }, (payload) => {
        if (payload.payload?.userId !== currentUserId) {
          onTypingStatusChange(!!payload.payload?.isTyping);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }

  /**
   * Broadcast typing status for a conversation
   */
  static async broadcastTyping(conversationId: string, isTyping: boolean) {
    if (!conversationId || conversationId.startsWith('draft:')) return;

    try {
      const { data: authData } = await supabase.auth.getUser();
      const currentUserId = authData?.user?.id;
      if (!currentUserId) return;

      const channel = supabase.channel(`typing_${conversationId}`);
      await channel.send({
        type: 'broadcast',
        event: 'typing',
        payload: { userId: currentUserId, isTyping }
      });
    } catch (err) {
      // Ignore broadcast errors
    }
  }

  /**
   * Mark conversation as read for current user
   */
  static async markAsRead(conversationId: string): Promise<boolean> {
    if (!conversationId || conversationId.startsWith('draft:')) return true;

    try {
      const { data: authData } = await supabase.auth.getUser();
      const currentUserId = authData?.user?.id;
      if (!currentUserId) return false;

      const nowIso = new Date().toISOString();

      await supabase
        .from('conversation_participants')
        .update({ last_read_at: nowIso })
        .eq('conversation_id', conversationId)
        .eq('user_id', currentUserId);

      try {
        await supabase
          .from('messages')
          .update({ is_read: true, read_at: nowIso })
          .eq('conversation_id', conversationId)
          .neq('sender_id', currentUserId)
          .eq('is_read', false);
      } catch {
        // Fallback if is_read column not yet available
      }

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
    return formatListingDate(dateStr);
  }
}
