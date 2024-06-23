import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  Animated,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import NavBar from './NavBar'; // Import NavBar component
import { auth } from '../firebaseConfig'; // Adjust the import path to one level up
import CreatePostModal from './CreatePostModal'; // Import CreatePostModal component
import { useFonts } from 'expo-font';

const HomeScreen = ({ navigation }) => {
  const [isCreatePostModalVisible, setCreatePostModalVisible] = useState(false);
  const [isMenuModalVisible, setMenuModalVisible] = useState(false);
  const [notifications, setNotifications] = useState([]); // Assuming notifications are static
  const [posts, setPosts] = useState([]); // Array to manage posts with new fields
  const [iconScales, setIconScales] = useState({
    home: new Animated.Value(1),
    search: new Animated.Value(1),
    add: new Animated.Value(1),
    bell: new Animated.Value(1),
    user: new Animated.Value(1),
  });
  const [activeNav, setActiveNav] = useState('home'); // State to track active navigation button
  const [user, setUser] = useState(null); // State to track the logged-in user
  const [fontsLoaded] = useFonts({
    Poppins: require('../assets/fonts/Poppins-Regular.ttf'),
  });

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        navigation.navigate('LANDGUARD'); // Navigate to login screen if user is not logged in
      }
    });

    // Clean up the subscription
    return unsubscribe;
  }, []);

  const toggleCreatePostModal = () => {
    setCreatePostModalVisible(!isCreatePostModalVisible);
  };

  const toggleMenuModal = () => {
    setMenuModalVisible((prev) => !prev);
  };

  const handleSettings = () => {
    setMenuModalVisible(false);
    navigation.navigate('Settings');
  };

  const handleLogout = () => {
    auth.signOut().then(() => {
      setMenuModalVisible(false);
      navigation.navigate('LADNGUARD'); // Navigate to login screen after logging out
    }).catch((error) => {
      console.error('Error logging out: ', error);
    });
  };

  const addNewPost = (newPost) => {
    setPosts((prevPosts) => [...prevPosts, newPost]); // Include timestamp for new posts
  };

  const renderNewsFeed = () => {
    return posts.map((post, index) => (
      <View key={index} style={styles.feedItem}>
        <View style={styles.feedContent}>
          <Text style={styles.feedTitle}>{post.title}</Text>
          <Text style={styles.feedDescription}>{post.description}</Text>
          <Text style={styles.feedAddress}>{post.address}</Text>
          <Text style={styles.feedTimestamp}>{post.timestamp}</Text> {/* Display timestamp */}
          <TouchableOpacity style={styles.categoryButton}>
            <Text style={styles.categoryText}>{post.category}</Text>
          </TouchableOpacity>
        </View>
      </View>
    ));
  };

  const animateIcon = (iconName) => {
    Animated.sequence([
      Animated.timing(iconScales[iconName], {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(iconScales[iconName], {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(iconScales[iconName], {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const setActiveScreen = (screen, navButton) => {
    setActiveNav(navButton); // Update active navigation state
    navigation.navigate(screen); // Navigate to the screen
  };

  const handleCreatePost = () => {
    setCreatePostModalVisible(true); // Open modal to create a post
  };

  if (!fontsLoaded) {
    return null; // Load font here
  }

  return (
    <View style={styles.container}>
      <CreatePostModal
        isVisible={isCreatePostModalVisible}
        onClose={toggleCreatePostModal}
        onSubmit={addNewPost} // Pass function to add new posts
      />

      <Modal
        visible={isMenuModalVisible} // Use 'visible' instead of 'isVisible'
        transparent={true} // Optional: makes the background semi-transparent
        animationType="slide" // Optional: adds slide animation
        onRequestClose={toggleMenuModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={handleSettings}>
              <Text style={styles.modalText1}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout}>
              <Text style={styles.modalText2}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.createPostButtonContainer}>
        <TouchableOpacity style={styles.createPostButton} onPress={handleCreatePost}>
          <Text style={styles.createPostText}>CREATE POST</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.headerHead}>
        <Image source={require('../assets/icon.png')} style={styles.headerIcon} />
        <Text style={[styles.headerTitle]}>Landguard</Text>
      <TouchableOpacity style={styles.menuIconContainer} onPress={toggleMenuModal}>
        <MaterialIcons name="menu" size={30} color="#000" />
      </TouchableOpacity>

      {user && (
        <TouchableOpacity style={styles.profileIconContainer} onPress={() => navigation.navigate('Profile')}>
          <Image
            source={{ uri: user.photoURL || 'https://via.placeholder.com/150' }} // Default image if no photoURL
            style={styles.profileIcon}
          />
        </TouchableOpacity>
      )}
      </View>

      <ScrollView style={styles.newsFeedContainer}>
        {renderNewsFeed()}
      </ScrollView>

      <NavBar
        navigation={navigation}
        animateIcon={animateIcon}
        activeNav={activeNav}
        setActiveScreen={setActiveScreen}
        iconScales={iconScales}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0E0E0',
    paddingTop: 15,
  },
  createPostButtonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  headerHead:{
    position: 'absolute',
    top: 0,
    left:0,
    right: 0,
    padding: 20,
    backgroundColor: '#fff',
    height: 120,
    zIndex: -1,
    shadowColor: '#000', // Color of the shadow
    shadowOffset: { width: 0, height: 4 }, // Offset for the shadow
    shadowOpacity: 0.5, // Opacity of the shadow
    shadowRadius: 4, // Blur radius of the shadow
    elevation: 5,
  },
  headerIcon: {
    width: 50,
    height: 50,
    position: 'absolute',
    top: 55,
    left: 15,
    zIndex: 1,
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: '#7C7A7A',
    shadowColor: '#000', // Color of the shadow
    shadowOffset: { width: 0, height: 4 }, // Offset for the shadow
    shadowOpacity: 0.5, // Opacity of the shadow
    shadowRadius: 4, // Blur radius of the shadow
  },
  headerTitle: {
    fontSize: 25,
    color: '#000',
    fontWeight: 'bold',
    position: 'absolute',
    top: 65,
    left: 75,
  },
  menuIconContainer: {
    position: 'absolute',
    top: 60,
    right: 20,
  },
  profileIconContainer: {
    position: 'absolute',
    top: 60,
    right: 60,
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.25)', // semi-transparent background
  },
  modalContent: {
    backgroundColor: 0,
    padding: 50,
    borderRadius: 10,
    width: '100%', // Width adjustment to fit within the overlay
    textAlign: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  modalText1: {
    backgroundColor: '#E0C55B',
    padding: 20,
    width: 200,
    borderRadius: 50,
    fontSize: 18,
    margin: 20,
    color: '#000',
  },
  modalText2: {
    backgroundColor: '#545151',
    padding: 20,
    width: 200,
    borderRadius: 50,
    fontSize: 18,
    margin: 20,
    color: '#fff',
  },
  newsFeedContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#545151',
    borderRadius: 10,
    padding: 20,
    marginTop: 160,
    marginBottom: 120,
    marginHorizontal: 10,
    paddingBottom: 100,
  },
  feedItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  feedContent: {
    flex: 1,
  },
  feedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    fontFamily: 'Poppins', // Apply Poppins font
  },
  feedDescription: {
    fontSize: 14,
    marginBottom: 5,
    fontFamily: 'Poppins', // Apply Poppins font
  },
  feedAddress: {
    fontSize: 12,
    marginBottom: 5,
    fontStyle: 'italic',
    fontFamily: 'Poppins', // Apply Poppins font
  },
  feedTimestamp: {
    fontSize: 12,
    marginBottom: 5,
    color: '#777',
    fontFamily: 'Poppins', // Apply Poppins font
  },
  categoryButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Poppins', // Apply Poppins font
  },
  createPostButton: {
    position: 'absolute',
    right: 7,
    top: 100,
    backgroundColor: '#E0C55B',
    padding: 10,
    paddingVertical: 13,
    borderRadius: 30,
    flexDirection: 'row',
    width: '35%',
    textAlign: 'center',
    shadowColor: '#000', // Color of the shadow
    shadowOffset: { width: 0, height: 4 }, // Offset for the shadow
    shadowOpacity: 0.5, // Opacity of the shadow
    shadowRadius: 4, // Blur radius of the shadow
    elevation: 5, // Elevation for Android to support shadow on some devices
  },
  createPostText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
