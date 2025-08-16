import { useColorScheme } from '@/hooks/useColorScheme';
import { Image } from 'expo-image';
import React from 'react';
import {
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { ThemedText } from './ThemedText';
import { IconSymbol } from './ui/IconSymbol';

interface Link {
  id: string;
  url: string;
  title: string;
  description: string;
  image?: string;
  tags: string[];
  created_at: string;
}

interface LinkCardProps {
  link: Link;
  onPress: () => void;
  onDelete: () => void;
}

const { width } = Dimensions.get('window');

export function LinkCard({ link, onPress, onDelete }: LinkCardProps) {
  const colorScheme = useColorScheme();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString();
  };

  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { 
          backgroundColor: colorScheme === 'dark' ? '#2c2c2e' : '#ffffff',
          borderColor: colorScheme === 'dark' ? '#3a3a3c' : '#e5e5ea',
        }
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.textContent}>
          <ThemedText style={styles.title} numberOfLines={2}>
            {link.title}
          </ThemedText>
          <ThemedText style={styles.description} numberOfLines={2}>
            {link.description}
          </ThemedText>
          <View style={styles.meta}>
            <ThemedText style={styles.domain}>
              {getDomain(link.url)}
            </ThemedText>
            <ThemedText style={styles.date}>
              {formatDate(link.created_at)}
            </ThemedText>
          </View>
          {link.tags.length > 0 && (
            <View style={styles.tags}>
              {link.tags.slice(0, 3).map((tag, index) => (
                <View
                  key={index}
                  style={[
                    styles.tag,
                    { backgroundColor: colorScheme === 'dark' ? '#007aff' : '#e3f2fd' }
                  ]}
                >
                  <ThemedText style={[
                    styles.tagText,
                    { color: colorScheme === 'dark' ? '#ffffff' : '#007aff' }
                  ]}>
                    {tag}
                  </ThemedText>
                </View>
              ))}
              {link.tags.length > 3 && (
                <ThemedText style={styles.moreTags}>
                  +{link.tags.length - 3} more
                </ThemedText>
              )}
            </View>
          )}
        </View>
        
        {link.image && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: link.image }}
              style={styles.image}
              contentFit="cover"
              placeholder="blurhash"
              placeholderContentFit="cover"
            />
          </View>
        )}
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={onDelete}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <IconSymbol name="trash" size={16} color="#ff3b30" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    position: 'relative',
  },
  content: {
    flexDirection: 'row',
    gap: 12,
  },
  textContent: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    lineHeight: 20,
  },
  description: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 8,
    lineHeight: 18,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  domain: {
    fontSize: 12,
    opacity: 0.6,
    fontWeight: '500',
  },
  date: {
    fontSize: 12,
    opacity: 0.6,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    alignItems: 'center',
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '500',
  },
  moreTags: {
    fontSize: 11,
    opacity: 0.6,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
