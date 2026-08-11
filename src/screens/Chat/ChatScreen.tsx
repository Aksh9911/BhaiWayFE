import React, { useCallback, useRef } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  ChatHeader,
  ChatInput,
  MessageBubble,
  chatScreenStyles as styles,
  chatTokens,
} from '@/components/Chat';
import { AppFooter, AppText as Text } from '@/shared/components';
import { getSearchParam, triggerLightHaptic } from '@/shared/utils';
import { useChatConversation } from '@/features/chat/hooks';
import { authSession } from '@/store';
import type { Message } from '@/types/chat';

export const ChatScreen = () => {
  const params = useLocalSearchParams<{ chatId?: string }>();
  const chatId = getSearchParam(params.chatId);
  const listRef = useRef<FlatList<Message> | null>(null);
  const user = authSession.getUser() ?? authSession.ensureDemoSession('RIDER');

  const {
    room,
    messages,
    draft,
    setDraft,
    loading,
    sending,
    uploading,
    sendText,
    sendImage,
    goBack,
    callPeer,
  } = useChatConversation(chatId);

  const handleSend = useCallback(() => {
    void sendText();
  }, [sendText]);

  const handleAttach = useCallback(() => {
    triggerLightHaptic();
    void sendImage();
  }, [sendImage]);

  const renderItem = useCallback(
    ({ item }: { item: Message }) => (
      <MessageBubble message={item} currentUserId={user.id} currentRole={user.role} />
    ),
    [user.id, user.role],
  );

  if (!chatId) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>Chat not found</Text>
        </View>
        <AppFooter activeTab="inbox" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {room ? (
        <ChatHeader room={room} onBack={goBack} onCall={callPeer} />
      ) : (
        <View style={{ padding: 16 }}>
          <ActivityIndicator color={chatTokens.primary} />
        </View>
      )}

      {loading && messages.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={chatTokens.primary} />
        </View>
      ) : (
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListHeaderComponent={
            <View style={styles.dayChipWrap}>
              <View style={styles.dayChip}>
                <Text style={styles.dayChipText}>Today</Text>
              </View>
            </View>
          }
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        />
      )}

      <ChatInput
        value={draft}
        onChangeText={setDraft}
        onSend={handleSend}
        onAttachImage={handleAttach}
        sending={sending}
        uploading={uploading}
      />

      <AppFooter activeTab="inbox" />
    </SafeAreaView>
  );
};
