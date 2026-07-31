import React, { useCallback, useEffect } from 'react';
import { FlatList, Image, Pressable, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { AppFooter, IconButton } from '@/shared/components';
import { triggerLightHaptic } from '@/shared/utils';
import {
  SUPPORT_AGENT_AVATAR,
  SUPPORT_CHAT_SCREEN,
} from '@/features/profile/constants';
import { useSupportChat } from '@/features/profile/hooks';
import type { SupportChatMessage } from '@/features/profile/types';
import { styles, supportChatTokens } from './SupportChatScreen.styles';

const TypingDots = () => {
  const d1 = useSharedValue(0);
  const d2 = useSharedValue(0);
  const d3 = useSharedValue(0);

  useEffect(() => {
    const start = (value: typeof d1, delayMs: number) => {
      value.value = withRepeat(
        withSequence(
          withTiming(0, { duration: delayMs }),
          withTiming(-4, { duration: 200 }),
          withTiming(0, { duration: 200 }),
          withTiming(0, { duration: Math.max(0, 600 - delayMs) }),
        ),
        -1,
        false,
      );
    };
    start(d1, 0);
    start(d2, 150);
    start(d3, 300);
  }, [d1, d2, d3]);

  const s1 = useAnimatedStyle(() => ({ transform: [{ translateY: d1.value }] }));
  const s2 = useAnimatedStyle(() => ({ transform: [{ translateY: d2.value }] }));
  const s3 = useAnimatedStyle(() => ({ transform: [{ translateY: d3.value }] }));

  return (
    <View style={styles.typingDots}>
      <Animated.View style={[styles.typingDot, s1]} />
      <Animated.View style={[styles.typingDot, s2]} />
      <Animated.View style={[styles.typingDot, s3]} />
    </View>
  );
};

const MessageBubble = ({ item }: { item: SupportChatMessage }) => {
  if (item.sender === 'user') {
    return (
      <View style={styles.userRow}>
        <View style={styles.userBubble}>
          <Text style={styles.userText}>{item.text}</Text>
          <View style={styles.userMeta}>
            <Text style={styles.userTime}>{item.timeLabel}</Text>
            <Ionicons
              name={item.status === 'read' ? 'checkmark-done' : 'checkmark'}
              size={12}
              color={supportChatTokens.ON_PRIMARY_CONTAINER}
            />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.supportRow}>
      <Image
        source={{ uri: SUPPORT_AGENT_AVATAR }}
        style={styles.agentAvatar}
        accessibilityIgnoresInvertColors
        accessibilityLabel="Support agent"
      />
      <View style={styles.supportBubble}>
        <Text style={styles.supportText}>{item.text}</Text>
        <Text style={styles.supportTime}>{item.timeLabel}</Text>
      </View>
    </View>
  );
};

export const SupportChatScreen = () => {
  const {
    messages,
    draft,
    isTyping,
    listRef,
    setDraft,
    sendMessage,
    goBack,
    attachFile,
  } = useSupportChat();

  const canSend = draft.trim().length > 0;

  const handleBack = useCallback(() => {
    triggerLightHaptic();
    goBack();
  }, [goBack]);

  const handleSend = useCallback(() => {
    if (!canSend) {
      return;
    }
    triggerLightHaptic();
    sendMessage();
  }, [canSend, sendMessage]);

  const renderItem = useCallback(
    ({ item }: { item: SupportChatMessage }) => <MessageBubble item={item} />,
    [],
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-back"
          onPress={handleBack}
          color={supportChatTokens.PRIMARY}
          accessibilityLabel="Go back"
        />
        <Text style={styles.headerTitle} accessibilityRole="header">
          {SUPPORT_CHAT_SCREEN.title}
        </Text>
      </View>

      <FlatList
        ref={listRef}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View style={styles.dateWrap}>
            <View style={styles.dateBadge}>
              <Text style={styles.dateLabel}>{SUPPORT_CHAT_SCREEN.dateLabel}</Text>
            </View>
          </View>
        }
        ListFooterComponent={
          isTyping ? (
            <View style={styles.typingWrap} accessibilityLabel={SUPPORT_CHAT_SCREEN.typingLabel}>
              <Text style={styles.typingLabel}>{SUPPORT_CHAT_SCREEN.typingLabel}</Text>
              <TypingDots />
            </View>
          ) : null
        }
      />

      <View style={styles.composerBar}>
        <View style={styles.composer}>
          <Pressable
            style={styles.attachButton}
            onPress={attachFile}
            accessibilityRole="button"
            accessibilityLabel="Attach file"
          >
            <Ionicons name="attach" size={22} color={supportChatTokens.ON_SURFACE_VARIANT} />
          </Pressable>
          <TextInput
            style={styles.input}
            value={draft}
            onChangeText={setDraft}
            placeholder={SUPPORT_CHAT_SCREEN.inputPlaceholder}
            placeholderTextColor={supportChatTokens.OUTLINE}
            multiline
            accessibilityLabel={SUPPORT_CHAT_SCREEN.inputPlaceholder}
          />
          <Pressable
            style={({ pressed }) => [
              styles.sendButton,
              !canSend && styles.sendButtonDisabled,
              pressed && canSend && { transform: [{ scale: 0.95 }] },
            ]}
            onPress={handleSend}
            disabled={!canSend}
            accessibilityRole="button"
            accessibilityLabel="Send message"
          >
            <Ionicons name="send" size={18} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>

      <AppFooter activeTab="profile" />
    </SafeAreaView>
  );
};
