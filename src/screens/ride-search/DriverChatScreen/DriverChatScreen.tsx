import React, { useCallback } from 'react';
import { FlatList, Pressable, ScrollView, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppFooter, Avatar, IconButton, AppText as Text, AppTextInput as TextInput } from '@/shared/components';
import { colors } from '@/shared/theme';
import { getSearchParam, triggerLightHaptic } from '@/shared/utils';
import { DRIVER_CHAT_SCREEN } from '@/features/ride-search/constants';
import { useDriverChat } from '@/features/ride-search/hooks';
import type { ChatMessage } from '@/features/ride-search/types';
import { styles } from './DriverChatScreen.styles';

const MessageBubble = ({ item }: { item: ChatMessage }) => {
  const isUser = item.sender === 'user';

  return (
    <View style={isUser ? styles.messageBlockRight : styles.messageBlockLeft}>
      <View style={isUser ? styles.bubbleRight : styles.bubbleLeft}>
        <Text style={isUser ? styles.messageTextRight : styles.messageTextLeft}>{item.text}</Text>
      </View>
      {isUser ? (
        <View style={styles.metaRight}>
          <Text style={styles.metaRightText}>{item.timeLabel}</Text>
          <Ionicons
            name={item.status === 'read' ? 'checkmark-done' : 'checkmark'}
            size={14}
            color="#0342D1"
          />
        </View>
      ) : (
        <Text style={styles.metaLeft}>{item.timeLabel}</Text>
      )}
    </View>
  );
};

export const DriverChatScreen = () => {
  const params = useLocalSearchParams<{
    driverName?: string;
    carModel?: string;
    threadId?: string;
  }>();

  const {
    profile,
    messages,
    draft,
    quickReplies,
    listRef,
    setDraft,
    sendMessage,
    goBack,
    callDriver,
    openMore,
    attachFile,
  } = useDriverChat({
    driverName: getSearchParam(params.driverName),
    carModel: getSearchParam(params.carModel),
    threadId: getSearchParam(params.threadId),
  });

  const handleBack = useCallback(() => {
    triggerLightHaptic();
    goBack();
  }, [goBack]);

  const handleSend = useCallback(() => {
    triggerLightHaptic();
    sendMessage();
  }, [sendMessage]);

  const handleQuickReply = useCallback(
    (text: string) => {
      triggerLightHaptic();
      sendMessage(text);
    },
    [sendMessage],
  );

  const renderItem = useCallback(
    ({ item }: { item: ChatMessage }) => <MessageBubble item={item} />,
    [],
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <IconButton
            icon="arrow-back"
            onPress={handleBack}
            color={colors.primary}
            accessibilityLabel="Go back"
          />
          <View style={styles.profileRow}>
            <View style={styles.avatarWrap}>
              <Avatar
                size={40}
                uri={profile.avatarUri}
                accessibilityLabel={`${profile.name} photo`}
              />
              {profile.isOnline ? <View style={styles.onlineDot} /> : null}
            </View>
            <View>
              <Text style={styles.driverName}>{profile.name}</Text>
              <View style={styles.statusRow}>
                <Text style={styles.onlineLabel}>{DRIVER_CHAT_SCREEN.onlineLabel}</Text>
                <Text style={styles.vehicleLabel}>• {profile.vehicleLabel}</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.headerActions}>
          <IconButton
            icon="call-outline"
            onPress={callDriver}
            color={colors.primary}
            accessibilityLabel="Call driver"
          />
          <IconButton
            icon="ellipsis-vertical"
            onPress={openMore}
            color="#434655"
            accessibilityLabel="More options"
          />
        </View>
      </View>

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={
          <View style={styles.dayChipWrap}>
            <View style={styles.dayChip}>
              <Text style={styles.dayChipText}>{DRIVER_CHAT_SCREEN.todayLabel}</Text>
            </View>
          </View>
        }
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
        keyboardShouldPersistTaps="handled"
      />

      <View style={styles.composer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickRow}
        >
          {quickReplies.map((reply) => (
            <Pressable
              key={reply}
              style={({ pressed }) => [
                styles.quickChip,
                pressed && { backgroundColor: '#E7E8E9', transform: [{ scale: 0.97 }] },
              ]}
              onPress={() => handleQuickReply(reply)}
              accessibilityRole="button"
              accessibilityLabel={reply}
            >
              <Text style={styles.quickLabel}>{reply}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.inputRow}>
          <Pressable
            onPress={attachFile}
            accessibilityRole="button"
            accessibilityLabel="Attach file"
          >
            <Ionicons name="attach" size={22} color="#434655" />
          </Pressable>
          <TextInput
            style={styles.input}
            value={draft}
            onChangeText={setDraft}
            placeholder={DRIVER_CHAT_SCREEN.inputPlaceholder}
            placeholderTextColor="rgba(67,70,85,0.5)"
            returnKeyType="send"
            onSubmitEditing={handleSend}
            accessibilityLabel="Message input"
          />
          <Pressable
            style={({ pressed }) => [
              styles.sendButton,
              pressed && { transform: [{ scale: 0.92 }] },
            ]}
            onPress={handleSend}
            accessibilityRole="button"
            accessibilityLabel="Send message"
          >
            <Ionicons name="send" size={18} color={colors.white} />
          </Pressable>
        </View>
      </View>

      <AppFooter activeTab="inbox" />
    </SafeAreaView>
  );
};
