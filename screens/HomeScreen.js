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
  Switch,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import NavBar from './NavBar';
import { auth } from '../firebaseConfig';
import CreatePostModal from './CreatePostModal';
import { useFonts } from 'expo-font';
import { useTheme } from 'react-native-paper';

const HomeScreen = ({ navigation, toggleTheme, isDarkTheme }) => {
  const { colors } = useTheme();
  const [isCreatePostModalVisible, setCreatePostModalVisible] = useState(false);
  const [isMenuModalVisible, setMenuModalVisible] = useState(false);
  const [isSettingsModalVisible, setSettingsModalVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [posts, setPosts] = useState([]);
  const [iconScales, setIconScales] = useState({
    home: new Animated.Value(1),
    search: new Animated.Value(1),
    add: new Animated.Value(1),
    bell: new Animated.Value(1),
    user: new Animated.Value(1),
  });
  const [activeNav, setActiveNav] = useState('home');
  const [user, setUser] = useState(null);
  const [fontsLoaded] = useFonts({
    Poppins: require('../assets/fonts/Poppins-Regular.ttf'),
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        navigation.navigate('Login');
      }
    });

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
    setSettingsModalVisible(true);
  };

  const handleLogout = () => {
    auth.signOut().then(() => {
      setMenuModalVisible(false);
      navigation.navigate('Login');
    }).catch((error) => {
      console.error('Error logging out: ', error);
    });
  };

  const addNewPost = (newPost) => {
    setPosts((prevPosts) => [...prevPosts, newPost]);
  };

  const renderNewsFeed = () => {
    return posts.map((post, index) => (
      <View key={index} style={styles.feedItem}>
        <View style={styles.feedContent}>
          <Text style={[styles.feedTitle, { color: colors.text }]}>{post.title}</Text>
          <Text style={[styles.feedDescription, { color: colors.text }]}>{post.description}</Text>
          <Text style={[styles.feedAddress, { color: colors.text }]}>{post.address}</Text>
          <Text style={[styles.feedTimestamp, { color: colors.text }]}>{post.timestamp}</Text>
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
    setActiveNav(navButton);
    navigation.navigate(screen);
  };

  const handleCreatePost = () => {
    setCreatePostModalVisible(true);
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CreatePostModal
        isVisible={isCreatePostModalVisible}
        onClose={toggleCreatePostModal}
        onSubmit={addNewPost}
      />

      <Modal
        visible={isMenuModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={toggleMenuModal}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <TouchableOpacity onPress={handleSettings}>
              <Text style={[styles.modalText1, { color: colors.text }]}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout}>
              <Text style={[styles.modalText2, { color: colors.text }]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isSettingsModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSettingsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <View style={styles.settingOption}>
              <Text style={[styles.settingText, { color: colors.text }]}>Dark Mode</Text>
              <Switch value={isDarkTheme} onValueChange={toggleTheme} />
            </View>
            <TouchableOpacity onPress={() => setSettingsModalVisible(false)}>
              <Text style={[styles.modalText2, { color: colors.text }]}>Close</Text>
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
        <Text style={[styles.headerTitle, { color: colors.text }]}>RoadGuard</Text>
        <TouchableOpacity style={styles.menuIconContainer} onPress={toggleMenuModal}>
          <MaterialIcons name="menu" size={30} color={colors.text} />
        </TouchableOpacity>

        {user && (
          <TouchableOpacity style={styles.profileIconContainer} onPress={() => navigation.navigate('Profile')}>
            <Image
              source={{ uri: user.photoURL || 'https://via.placeholder.com/150' }}
              style={styles.profileIcon}
            />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={[styles.newsFeedContainer, { backgroundColor: colors.background }]}>
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
    paddingTop: 15,
  },
  createPostButtonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  headerHead: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 20,
    height: 120,
    zIndex: -1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 25,
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
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  modalContent: {
    padding: 50,
    borderRadius: 10,
    width: '80%',
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
    fontFamily: 'Poppins',
  },
  feedDescription: {
    fontSize: 14,
    marginBottom: 5,
    fontFamily: 'Poppins',
  },
  feedAddress: {
    fontSize: 12,
    marginBottom: 5,
    fontStyle: 'italic',
    fontFamily: 'Poppins',
  },
  feedTimestamp: {
    fontSize: 12,
    marginBottom: 5,
    color: '#777',
    fontFamily: 'Poppins',
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
    fontFamily: 'Poppins',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  createPostText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  settingOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 10,
  },
  settingText: {
    fontSize: 18,
  },
});

export default HomeScreen;
