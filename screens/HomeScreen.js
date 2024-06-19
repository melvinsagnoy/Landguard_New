import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Modal from 'react-native-modal';

const HomeScreen = ({ navigation }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [notifications, setNotifications] = useState([]); // State for notifications

  useEffect(() => {
    // Sample notifications data
    setNotifications([
      { id: 1, text: 'Hazardous area ahead on Highway 1', location: 'Near Central Park', category: 'Traffic' },
      { id: 2, text: 'Slow down! Traffic congestion near Elm Street', location: 'Downtown Area', category: 'Traffic' },
      { id: 3, text: 'Accident reported near Park Avenue', location: 'Central District', category: 'Safety' },
      { id: 4, text: 'Roadblock near Main Street', location: 'Suburb Area', category: 'Traffic' },
      { id: 5, text: 'Construction work near the bridge', location: 'Near Riverbend', category: 'Work Zone' },
      { id: 6, text: 'Heavy traffic reported near Market Square', location: 'Downtown Area', category: 'Traffic' },
    ]);
  }, []);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleSettings = () => {
    setModalVisible(false);
    navigation.navigate('Settings');
  };

  const handleLogout = () => {
    setModalVisible(false);
    navigation.navigate('Landing');
  };

  const renderNotificationsByCategory = (category) => {
    return notifications
      .filter((notification) => notification.category === category)
      .map((notification) => (
        <View key={notification.id} style={styles.notificationItem}>
          <Text style={styles.notificationText}>
            {notification.text} - {notification.location}
          </Text>
        </View>
      ));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image source={require('../assets/icon.png')} style={styles.logo} />
        </View>
        <Text style={styles.headerTitle}>LANDGUARD</Text>
        <TouchableOpacity style={styles.menuIconContainer} onPress={toggleModal}>
          <Icon name="ellipsis-v" size={30} color="#fff" />
        </TouchableOpacity>
      </View>

      <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
        <View style={styles.modalContent}>
          <TouchableOpacity onPress={handleSettings}>
            <Text style={styles.modalText}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.modalText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <ScrollView style={styles.notificationContainer}>
        <Text style={styles.notificationTitle}>Hazard Alerts</Text>
        <Text style={styles.categoryTitle}>Traffic:</Text>
        {renderNotificationsByCategory('Traffic')}
        <Text style={styles.categoryTitle}>Safety:</Text>
        {renderNotificationsByCategory('Safety')}
        <Text style={styles.categoryTitle}>Work Zone:</Text>
        {renderNotificationsByCategory('Work Zone')}
      </ScrollView>

      <View style={styles.navbar}>
        <Icon name="home" size={30} color="#545151" onPress={() => navigation.navigate('Home')} />
        <Icon name="search" size={30} color="#545151" onPress={() => navigation.navigate('Search')} />
        <Icon name="plus-circle" size={30} color="#545151" onPress={() => navigation.navigate('Add')} />
        <Icon name="bell" size={30} color="#545151" onPress={() => navigation.navigate('Notifications')} />
        <Icon name="user" size={30} color="#545151" onPress={() => navigation.navigate('Profile')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0E0E0',
  },
  header: {
    marginTop: 15,
    backgroundColor: '#545151',
    padding: 20,
    height: 90,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    marginLeft: -20,
    marginTop: 25,
    fontSize: 20,
    color: '#E0C55B',
    fontWeight: 'bold',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    marginTop: 35,
    height: 50,
    width: 50,
    borderRadius: 10,
  },
  menuIconContainer: {
    marginTop: 20,
    marginRight: 10,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalText: {
    fontSize: 18,
    padding: 10,
  },
  notificationContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#545151',
    borderRadius: 10,
    padding: 30,
    marginTop: 20,
    marginBottom: 90,
    marginHorizontal: 10,
    height: 800,
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  notificationItem: {
    marginBottom: 10,
  },
  notificationText: {
    fontSize: 16,
  },
  navbar: {
    position: 'fixed', // Keep this fixed at the bottom
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default HomeScreen;
