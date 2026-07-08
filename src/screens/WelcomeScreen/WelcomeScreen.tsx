import React, { useEffect } from 'react';
import { ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import LogoCard from '../../components/LogoCard';
import PrimaryButton from '../../components/PrimaryButton';
import SecondaryButton from '../../components/SecondaryButton';
import TrustedBySection from '../../components/TrustedBySection';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import { colors } from '../../theme';
import { styles } from './styles';

const DESCRIPTION_TEXT =
  'Experience the next generation of professional connectivity. Streamline your workflow, collaborate with precision, and drive momentum with our intuitive platform designed for modern enterprises.';

type WelcomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

export default function WelcomeScreen({ navigation }: WelcomeScreenProps) {
  const { width } = useWindowDimensions();

  const screenOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.6);
  const buttonsTranslateY = useSharedValue(40);
  const buttonsOpacity = useSharedValue(0);

  useEffect(() => {
    screenOpacity.value = withTiming(1, { duration: 500 });
    logoScale.value = withDelay(100, withSpring(1, { damping: 14, stiffness: 120 }));
    buttonsTranslateY.value = withDelay(300, withSpring(0, { damping: 16, stiffness: 110 }));
    buttonsOpacity.value = withDelay(300, withTiming(1, { duration: 400 }));
  }, [buttonsOpacity, buttonsTranslateY, logoScale, screenOpacity]);

  const screenAnimatedStyle = useAnimatedStyle(() => ({
    opacity: screenOpacity.value,
  }));

  const buttonsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: buttonsOpacity.value,
    transform: [{ translateY: buttonsTranslateY.value }],
  }));

  const handleSignUp = () => {
    navigation.navigate('Signup');
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <Animated.View style={[styles.container, screenAnimatedStyle]}>
        <LinearGradient
          colors={[colors.gradientGlowStart, colors.gradientGlowEnd]}
          style={styles.gradientGlow}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={[styles.content, { maxWidth: Math.min(width, 520) }]}>
            <View style={styles.logoWrapper}>
              <LogoCard scale={logoScale} />
            </View>

            <View style={styles.headingContainer}>
              <Text style={styles.headingLine}>Welcome to</Text>
              <Text style={styles.headingBrand}>BhaiWay</Text>
            </View>

            <Text style={styles.description}>{DESCRIPTION_TEXT}</Text>

            <Animated.View style={[styles.buttonsContainer, buttonsAnimatedStyle]}>
              <PrimaryButton
                label="Sign Up Free"
                onPress={handleSignUp}
                accessibilityLabel="Sign up for a free account"
              />
              <SecondaryButton
                label="Login to Account"
                onPress={handleLogin}
                accessibilityLabel="Login to your account"
              />
            </Animated.View>

            <TrustedBySection />
          </View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}
