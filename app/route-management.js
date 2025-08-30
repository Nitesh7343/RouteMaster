import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api'; // axios instance

export default function RouteManagementScreen() {
  const [busNumber, setBusNumber] = useState('');
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [shiftStartTime, setShiftStartTime] = useState('');
  const [shiftEndTime, setShiftEndTime] = useState('');
  const router = useRouter();

  const handleShiftStart = () => {
    const now = new Date();
    setShiftStartTime(
      now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    );
  };

  const handleShiftEnd = () => {
    const now = new Date();
    setShiftEndTime(
      now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    );
  };

  const handleDone = async () => {
    if (!busNumber || !fromCity || !toCity || !shiftStartTime || !shiftEndTime) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");

      const res = await api.post(
        "/api/bus/add",
        {
          busNumber,
          fromCity,
          toCity,
          shiftStartTime,
          shiftEndTime,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.bus?._id) {
        await AsyncStorage.setItem("busId", res.data.bus._id);
      }

      Alert.alert("Success", "Bus & route saved successfully!");
      router.push("/location-sharing");
    } catch (err) {
      console.log("Bus save error:", err.response?.data || err.message);
      Alert.alert("Error", err.response?.data?.message || "Failed to save bus");
      router.push("/location-sharing");
    }
  };
  router.push("/location-sharing");

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appTitle}>Route Master</Text>
        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoText}>RM</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Bus No</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Bus Number"
            value={busNumber}
            onChangeText={setBusNumber}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.routeContainer}>
          <Text style={styles.label}>Route</Text>
          <View style={styles.routeInputs}>
            <View style={styles.routeField}>
              <Text style={styles.routeLabel}>From</Text>
              <TextInput
                style={styles.routeInput}
                placeholder="Origin City"
                value={fromCity}
                onChangeText={setFromCity}
                autoCapitalize="words"
              />
            </View>
            <View style={styles.routeField}>
              <Text style={styles.routeLabel}>To</Text>
              <TextInput
                style={styles.routeInput}
                placeholder="Destination City"
                value={toCity}
                onChangeText={setToCity}
                autoCapitalize="words"
              />
            </View>
          </View>
        </View>

        <View style={styles.shiftContainer}>
          <Text style={styles.label}>Shift Timing</Text>
          <View style={styles.shiftButtons}>
            <TouchableOpacity
              style={[styles.shiftButton, shiftStartTime ? styles.shiftButtonActive : null]}
              onPress={handleShiftStart}
            >
              <Text style={[styles.shiftButtonText, shiftStartTime ? styles.shiftButtonTextActive : null]}>
                Shift Start
              </Text>
              {shiftStartTime && <Text style={styles.timeText}>{shiftStartTime}</Text>}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.shiftButton, shiftEndTime ? styles.shiftButtonActive : null]}
              onPress={handleShiftEnd}
            >
              <Text style={[styles.shiftButtonText, shiftEndTime ? styles.shiftButtonTextActive : null]}>
                Shift End
              </Text>
              {shiftEndTime && <Text style={styles.timeText}>{shiftEndTime}</Text>}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={handleDone}>
            <Text style={styles.actionButtonText}>Done</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.backButton]} onPress={handleBack}>
            <Text style={[styles.actionButtonText, styles.backButtonText]}>Back</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 20, paddingBottom: 20,
    backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e0e0e0',
  },
  appTitle: { fontSize: 28, fontWeight: 'bold', color: '#333' },
  logoPlaceholder: {
    width: 60, height: 60, backgroundColor: '#007AFF',
    borderRadius: 30, justifyContent: 'center', alignItems: 'center',
  },
  logoText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  content: { flex: 1, padding: 20 },
  inputContainer: { marginBottom: 25 },
  label: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 8 },
  input: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd',
    borderRadius: 8, paddingHorizontal: 15, paddingVertical: 12, fontSize: 16,
  },
  routeContainer: { marginBottom: 25 },
  routeInputs: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd',
    borderRadius: 8, padding: 15,
  },
  routeField: { marginBottom: 15 },
  routeLabel: { fontSize: 16, fontWeight: '500', color: '#666', marginBottom: 5 },
  routeInput: {
    borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 6,
    paddingHorizontal: 12, paddingVertical: 8, fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  shiftContainer: { marginBottom: 30 },
  shiftButtons: { flexDirection: 'row', justifyContent: 'space-between', gap: 15 },
  shiftButton: {
    flex: 1, backgroundColor: '#fff', borderWidth: 2, borderColor: '#007AFF',
    borderRadius: 8, paddingVertical: 15, alignItems: 'center', justifyContent: 'center',
  },
  shiftButtonActive: { backgroundColor: '#007AFF' },
  shiftButtonText: { fontSize: 16, fontWeight: '600', color: '#007AFF' },
  shiftButtonTextActive: { color: '#fff' },
  timeText: { fontSize: 14, color: '#666', marginTop: 5 },
  actionButtons: { flexDirection: 'row', justifyContent: 'space-between', gap: 15, marginTop: 20 },
  actionButton: {
    flex: 1, backgroundColor: '#007AFF', borderRadius: 8,
    paddingVertical: 15, alignItems: 'center',
  },
  backButton: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#007AFF' },
  actionButtonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  backButtonText: { color: '#007AFF' },
});
