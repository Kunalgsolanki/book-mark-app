import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import React from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const colorScheme = useColorScheme();

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ]
    );
  };

  const getInitials = (email: string) => {
    return email
      .split('@')[0]
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedView style={styles.content}>
          <View style={styles.header}>
            <View style={[
              styles.avatar,
              { backgroundColor: colorScheme === 'dark' ? '#007aff' : '#007aff' }
            ]}>
              <ThemedText style={styles.avatarText}>
                {user?.email ? getInitials(user.email) : 'U'}
              </ThemedText>
            </View>
            <ThemedText style={styles.name}>
              {user?.email ? user.email.split('@')[0] : 'User'}
            </ThemedText>
            <ThemedText style={styles.email}>
              {user?.email || 'No email'}
            </ThemedText>
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Account</ThemedText>
            
            <TouchableOpacity
              style={[
                styles.menuItem,
                { borderBottomColor: colorScheme === 'dark' ? '#3a3a3c' : '#e5e5ea' }
              ]}
              onPress={() => {
                // Handle account settings
                Alert.alert('Coming Soon', 'Account settings will be available soon.');
              }}
            >
              <View style={styles.menuItemContent}>
                <IconSymbol name="person.circle" size={24} color="#007aff" />
                <ThemedText style={styles.menuItemText}>Account Settings</ThemedText>
              </View>
              <IconSymbol name="chevron.right" size={20} color="#8e8e93" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.menuItem,
                { borderBottomColor: colorScheme === 'dark' ? '#3a3a3c' : '#e5e5ea' }
              ]}
              onPress={() => {
                // Handle notifications
                Alert.alert('Coming Soon', 'Notification settings will be available soon.');
              }}
            >
              <View style={styles.menuItemContent}>
                <IconSymbol name="bell" size={24} color="#007aff" />
                <ThemedText style={styles.menuItemText}>Notifications</ThemedText>
              </View>
              <IconSymbol name="chevron.right" size={20} color="#8e8e93" />
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>App</ThemedText>
            
            <TouchableOpacity
              style={[
                styles.menuItem,
                { borderBottomColor: colorScheme === 'dark' ? '#3a3a3c' : '#e5e5ea' }
              ]}
              onPress={() => {
                // Handle about
                Alert.alert('About', 'Bookmark App v1.0.0\n\nA personal reading list app built with React Native and Supabase.');
              }}
            >
              <View style={styles.menuItemContent}>
                <IconSymbol name="info.circle" size={24} color="#007aff" />
                <ThemedText style={styles.menuItemText}>About</ThemedText>
              </View>
              <IconSymbol name="chevron.right" size={20} color="#8e8e93" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.menuItem,
                { borderBottomColor: colorScheme === 'dark' ? '#3a3a3c' : '#e5e5ea' }
              ]}
              onPress={() => {
                // Handle help
                Alert.alert('Help', 'Need help? Contact support at support@bookmarkapp.com');
              }}
            >
              <View style={styles.menuItemContent}>
                <IconSymbol name="questionmark.circle" size={24} color="#007aff" />
                <ThemedText style={styles.menuItemText}>Help & Support</ThemedText>
              </View>
              <IconSymbol name="chevron.right" size={20} color="#8e8e93" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.signOutButton,
              { backgroundColor: colorScheme === 'dark' ? '#ff3b30' : '#ff3b30' }
            ]}
            onPress={handleSignOut}
          >
            <IconSymbol name="rectangle.portrait.and.arrow.right" size={20} color="#ffffff" />
            <ThemedText style={styles.signOutButtonText}>Sign Out</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    opacity: 0.6,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    opacity: 0.8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 12,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 'auto',
    marginBottom: 20,
  },
  signOutButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
