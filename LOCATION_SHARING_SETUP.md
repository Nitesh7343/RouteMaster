# Location Sharing Setup Guide

## Overview
The Route Master app now includes a location sharing feature that allows users to share their live location. This feature is accessible from the home screen and logs location data to the console. In a production app, you would connect this to a backend API.

## Features
- **ON/OFF Toggle Button**: Large circular button that changes color (green when ON, blue border when OFF)
- **Real-time Location Tracking**: Updates location every 10 seconds or when moving 10+ meters
- **Location Logging**: Currently logs location data to console (ready for API integration)
- **Location Display**: Shows current latitude, longitude, and accuracy
- **Status Indicator**: Displays current sharing status

## Setup Instructions

### 1. Current Implementation
The app currently logs location data to the console. You can view the location data in your development console when location sharing is active.

### 2. API Integration (Optional)
To integrate with a backend API:

1. Open `config/database.js`
2. Update the `baseUrl` in `API_CONFIG` to point to your backend API
3. Uncomment the `await saveLocationData(locationDocument);` line in `app/location-sharing.js`

### 3. Location Data Structure
The app generates location data in the following format:

```json
{
  "timestamp": "2024-01-01T12:00:00.000Z",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "accuracy": 5.0,
  "speed": 10.5,
  "heading": 90.0,
  "altitude": 100.0,
  "deviceId": "route-master-device"
}
```

### 3. Permissions
The app has been configured with the necessary permissions:
- **Android**: ACCESS_FINE_LOCATION, ACCESS_COARSE_LOCATION
- **iOS**: NSLocationWhenInUseUsageDescription, NSLocationAlwaysAndWhenInUseUsageDescription

### 4. Usage Flow
1. User fills out route management form
2. Clicks "Done" button
3. App navigates back to login screen
4. User can access location sharing from home screen
5. User can toggle location sharing ON/OFF
6. When ON, location data is logged to console
7. User can go back to home screen with confirmation if sharing is active

## Security Notes
- **Important**: When integrating with a backend API, use proper authentication and HTTPS
- Consider using environment variables for production deployments
- The location data includes sensitive information, handle it securely

## Troubleshooting
- If location sharing fails, check your internet connection
- Ensure location permissions are granted on the device
- Check console logs for detailed error messages
- Verify API endpoint configuration if using backend integration

## Dependencies
- expo-location: For GPS location access
- react-native-dotenv: For environment variable management (optional)

## Testing
1. Run the app: `npm start`
2. Navigate to route management
3. Fill out the form and click "Done"
4. App should return to login screen
5. Login and go to home screen
6. Click "Share Live Location" to access the feature
7. Test the location sharing toggle
8. Check your development console for location data logs
