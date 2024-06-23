import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Dimensions, Animated, Image, ActivityIndicator } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import NavBar from './NavBar';

const AddScreen = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [heading, setHeading] = useState(0);
  const [destination, setDestination] = useState('');
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [pathCoordinates, setPathCoordinates] = useState([]);
  const [currentAddress, setCurrentAddress] = useState('');
  const [fontsLoaded] = useFonts({
    Poppins: require('../assets/fonts/Poppins-Regular.ttf'),
  });
  const [loading, setLoading] = useState(true);
  const spinValue = new Animated.Value(0);

  useEffect(() => {
    const fetchLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
      fetchAddress(location.coords.latitude, location.coords.longitude);

      Location.watchHeadingAsync((headingObj) => {
        setHeading(headingObj.trueHeading || 0);
      });
    };

    fetchLocation();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const fetchAddress = async (latitude, longitude) => {
    try {
      let addressResponse = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (addressResponse && addressResponse.length > 0) {
        let currentAddress = `${addressResponse[0].name}, ${addressResponse[0].city}, ${addressResponse[0].region}, ${addressResponse[0].country}`;
        setCurrentAddress(currentAddress);
      }
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  };

  const handleDestinationChange = (text) => {
    setDestination(text);
  };

  const navigateToDestination = async () => {
    try {
      let geoLocation = await Location.geocodeAsync(destination);

      if (geoLocation && geoLocation.length > 0) {
        setDestinationLocation(geoLocation[0]);
        const { latitude, longitude } = location;
        setPathCoordinates([
          { latitude, longitude },
          { latitude: geoLocation[0].latitude, longitude: geoLocation[0].longitude },
        ]);
      } else {
        console.log('No geocode results found');
      }
    } catch (error) {
      console.error('Error finding destination:', error);
    }
  };

  const calculateDistance = () => {
    if (location && destinationLocation) {
      const { latitude, longitude } = location;
      const { latitude: destLat, longitude: destLng } = destinationLocation;
      const distance = haversineDistance(latitude, longitude, destLat, destLng);
      return `${distance.toFixed(2)} km`;
    } else if (location && destination === 'Current Location') {
      return '0.00 km';
    }
    return '';
  };

  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const toRadians = (angle) => {
    return angle * (Math.PI / 180);
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (!fontsLoaded || loading || !location) {
    return (
      <View style={styles.loadingContainer}>
        <Animated.Image
          source={require('../assets/tire.png')}
          style={[styles.loadingIcon, { transform: [{ rotate: spin }] }]}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        pitchEnabled={true}
        rotateEnabled={true}
        showsCompass={true}
        showsBuildings={true}
        showsTraffic={true}
        zoomEnabled={true}
        loadingEnabled={true}
        loadingIndicatorColor="#666666"
        loadingBackgroundColor="#eeeeee"
        moveOnMarkerPress={true}
      >
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          anchor={{ x: 0.5, y: 0.5 }}
        >
          <MaterialCommunityIcons
            name="arrow-up-circle-outline"
            size={40}
            color="#1976D2"
            style={{ transform: [{ rotate: `${heading}deg` }] }}
          />
        </Marker>

        {destinationLocation && (
          <Marker
            coordinate={{
              latitude: destinationLocation.latitude,
              longitude: destinationLocation.longitude,
            }}
            title="Destination"
            description={destination}
          />
        )}

        {pathCoordinates.length > 0 && (
          <Polyline
            coordinates={pathCoordinates}
            strokeColor="#1976D2"
            strokeWidth={3}
          />
        )}
      </MapView>

      <View style={styles.addressContainer}>
        <View style={styles.currentLocationContainer}>
          <Text style={styles.currentLocationLabel}>Current Location:</Text>
          <Text style={styles.currentLocationText}>{currentAddress}</Text>
        </View>

        <View style={styles.destinationContainer}>
          {destinationLocation && (
            <View>
              <Text style={styles.currentLocationLabel}>Where to GO?</Text>
              <Text style={styles.addressText}>{destination}</Text>
              <Text style={styles.distanceText}>{calculateDistance()}</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter destination..."
          onChangeText={handleDestinationChange}
          value={destination}
        />
        <TouchableOpacity style={styles.searchButton} onPress={navigateToDestination}>
          <Text style={styles.searchButtonText}>Go</Text>
        </TouchableOpacity>
      </View>
      <NavBar navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  addressContainer: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  currentLocationContainer: {
    backgroundColor: 'rgba(224, 197, 91, 0.6)',
    top: 100,
    borderRadius: 10,
    padding: 10,
    minWidth: 160,
    maxWidth: Dimensions.get('window').width / 2 - 30,
  },
  destinationContainer: {
    backgroundColor: 'rgba(91, 225, 199, 0.6)',
    top: 100,
    borderRadius: 10,
    padding: 10,
    minWidth: 160,
    maxWidth: Dimensions.get('window').width / 2 - 30,
  },
  currentLocationLabel: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  currentLocationText: {
    fontSize: 14,
    color: '#333',
  },
  addressText: {
    fontSize: 14,
    color: '#333',
  },
  distanceText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  inputContainer: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'transparent',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
    color: 'black',
  },
  searchButton: {
    backgroundColor: '#1976D2',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingIcon: {
    width: 100,
    height: 100,
  },
});

export default AddScreen;
