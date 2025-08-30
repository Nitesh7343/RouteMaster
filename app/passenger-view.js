// app/passenger-view.js
import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import api from './api';

export default function PassengerView({ route }) {
  const busId = route?.params?.busId || 'BUS12';
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const fetchLoc = async () => {
      try {
        const res = await api.get(`/api/passenger/bus/${busId}`);
        const coords = res.data.location?.coordinates;
        if (coords) setLocation({ lng: coords[0], lat: coords[1], lastUpdated: res.data.lastUpdated });
      } catch (err) { console.log(err.message); }
    };
    fetchLoc();
    const id = setInterval(fetchLoc, 5000);
    return () => clearInterval(id);
  }, [busId]);

  return (
    <View style={{ padding: 16 }}>
      {location ? (
        <>
          <Text>Bus: {busId}</Text>
          <Text>Lat: {location.lat}</Text>
          <Text>Lng: {location.lng}</Text>
          <Text>Last Updated: {new Date(location.lastUpdated).toLocaleString()}</Text>
        </>
      ) : <Text>Waiting for location...</Text>}
    </View>
  );
}
