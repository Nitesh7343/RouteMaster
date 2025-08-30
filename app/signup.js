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
import api from './api'; // <-- same api.js file we created for axios instance

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignup = async () => {
    if (!name.trim() || !phone.trim() || !password.trim()) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    try {
      const res = await api.post('/api/auth/register', {
        name,
        phone,
        password,
      });

      // ✅ Save token & driver info
      await AsyncStorage.setItem('token', res.data.token);
      if (res.data.driver?._id) {
        await AsyncStorage.setItem('driverId', res.data.driver._id);
      }

      Alert.alert("Success", "Account created successfully!");
      router.push('/location-sharing'); // move to location-sharing
    } catch (err) {
      console.log("Signup error:", err.response?.data || err.message);
      Alert.alert("Signup Failed", err.response?.data?.error || "Something went wrong");
    }
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
          <Text style={styles.title}>Create New Account</Text>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>

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
            style={styles.signupButton}
            onPress={handleSignup}
          >
            <Text style={styles.signupButtonText}>Create account</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.replace('/')}
          >
            <Text style={styles.backButtonText}>Back to Login</Text>
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
    fontSize: 28, fontWeight: 'bold', color: '#333',
    textAlign: 'center', marginBottom: 40,
  },
  inputContainer: { marginBottom: 20 },
  input: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd',
    borderRadius: 8, paddingHorizontal: 15, paddingVertical: 12, fontSize: 16,
  },
  signupButton: {
    backgroundColor: '#007AFF', borderRadius: 8, paddingVertical: 15,
    alignItems: 'center', marginTop: 10, marginBottom: 20,
  },
  signupButtonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  backButton: { alignItems: 'center' },
  backButtonText: { color: '#007AFF', fontSize: 16, textDecorationLine: 'underline' },
});
