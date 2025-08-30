import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api'; // <-- make sure you created app/api.js as explained earlier

export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    if (!phone.trim() || !password.trim()) {
      Alert.alert("Error", "Please enter phone and password");
      return;
    }

    try {
      const res = await api.post('/api/auth/login', { phone, password });

      // ✅ save token + driver info
      await AsyncStorage.setItem('token', res.data.token);
      if (res.data.driver?._id) {
        await AsyncStorage.setItem('driverId', res.data.driver._id);
      }

      Alert.alert("Success", "Login successful!");
      router.push('/route-management'); // go to duty screen
    } catch (err) {
      console.log("Login error:", err.response?.data || err.message);
      Alert.alert("Login Failed", err.response?.data?.error || "Invalid credentials");
    }
  };

  const handleSignup = () => {
    router.push('/signup');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <Text style={styles.appTitle}>Route Master</Text>
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>RM</Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity 
            style={styles.loginButton}
            onPress={handleLogin}
          >
            <Text style={styles.loginButtonText}>Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.signupButton}
            onPress={handleSignup}
          >
            <Text style={styles.signupButtonText}>Create New Account</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  keyboardView: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  appTitle: { fontSize: 28, fontWeight: 'bold', color: '#333' },
  logoPlaceholder: {
    width: 60, height: 60, backgroundColor: '#007AFF',
    borderRadius: 30, justifyContent: 'center', alignItems: 'center',
  },
  logoText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 30 },
  title: {
    fontSize: 32, fontWeight: 'bold', color: '#333',
    textAlign: 'center', marginBottom: 10,
  },
  subtitle: {
    fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 40,
  },
  inputContainer: { marginBottom: 20 },
  input: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd',
    borderRadius: 8, paddingHorizontal: 15, paddingVertical: 12, fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#007AFF', borderRadius: 8, paddingVertical: 15,
    alignItems: 'center', marginTop: 10, marginBottom: 20,
  },
  loginButtonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  signupButton: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#007AFF',
    borderRadius: 8, paddingVertical: 15, alignItems: 'center',
  },
  signupButtonText: { color: '#007AFF', fontSize: 16, fontWeight: '600' },
});
