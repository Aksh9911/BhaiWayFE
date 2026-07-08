import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert, Image, ScrollView, Dimensions } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

const { width, height } = Dimensions.get('window');

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleLogin = () => {
    if (!phoneNumber.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }
    navigation.navigate('Home', { phoneNumber });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('../../assets/icon.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          
          <Text style={styles.title}>Welcome to <Text style={styles.bhaiWayText}>BhaiWay</Text></Text>
          <Text style={styles.description}>
            Experience the next generation of professional connectivity. Streamline your workflow,
            collaborate with precision, and drive momentum with our intuitive platform designed for modern
            enterprises.
          </Text>
          
          <TouchableOpacity style={styles.signUpButton} onPress={() => {}}>
            <Text style={styles.signUpButtonText}>Sign Up Free →</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login to Account</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.trustedByText}>TRUSTED BY MODERN TEAMS</Text>
            <View style={styles.companyLogos}>
              <Text style={styles.companyLogoText}>Acme Corp</Text>
              <Text style={styles.companyLogoText}>GlobalTech</Text>
            </View>
            <Text style={styles.companyLogoText}>Nexus</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: width * 0.06,
    paddingVertical: height * 0.05,
    alignItems: 'center',
  },
  logoContainer: {
    width: width * 0.24,
    height: width * 0.24,
    borderRadius: width * 0.06,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: height * 0.03,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  logo: {
    width: width * 0.16,
    height: width * 0.16,
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: '600',
    marginBottom: height * 0.01,
    color: '#000',
    textAlign: 'center',
  },
  bhaiWayText: {
    color: '#1F5EFF',
    fontWeight: '800',
  },
  description: {
    fontSize: width * 0.037,
    color: '#666',
    textAlign: 'center',
    marginBottom: height * 0.05,
    lineHeight: width * 0.06,
    maxWidth: width * 0.8,
  },
  signUpButton: {
    width: '100%',
    backgroundColor: '#1F5EFF',
    borderRadius: width * 0.04,
    paddingVertical: height * 0.02,
    alignItems: 'center',
    marginBottom: height * 0.015,
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: width * 0.04,
    fontWeight: '700',
  },
  loginButton: {
    width: '100%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#1F5EFF',
    borderRadius: width * 0.04,
    paddingVertical: height * 0.02,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#1F5EFF',
    fontSize: width * 0.04,
    fontWeight: '600',
  },
  footer: {
    marginTop: height * 0.05,
    alignItems: 'center',
  },
  trustedByText: {
    fontSize: width * 0.03,
    letterSpacing: 1.6,
    color: '#999',
    marginBottom: height * 0.015,
  },
  companyLogos: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: height * 0.01,
    flexWrap: 'wrap',
  },
  companyLogoText: {
    fontSize: width * 0.04,
    fontWeight: '700',
    color: '#000',
    marginHorizontal: width * 0.04,
  },
});
