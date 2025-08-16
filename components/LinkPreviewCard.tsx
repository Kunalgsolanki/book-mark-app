import { useColorScheme } from '@/hooks/useColorScheme';
import { Image } from 'expo-image';
import React from 'react';
import {
    StyleSheet,
    View,
} from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

interface LinkPreview {
  url: string;
  title: string;
  description: string;
  image?: string;
  site: string;
}

interface LinkPreviewCardProps {
  preview: LinkPreview;
}

export function LinkPreviewCard({ preview }: LinkPreviewCardProps) {
  const colorScheme = useColorScheme();

  return (
    <ThemedView style={[
      styles.container,
      { 
        backgroundColor: colorScheme === 'dark' ? '#2c2c2e' : '#f8f9fa',
        borderColor: colorScheme === 'dark' ? '#3a3a3c' : '#e5e5ea',
      }
    ]}>
      <View style={styles.content}>
        <View style={styles.textContent}>
          <ThemedText style={styles.title} numberOfLines={2}>
            {preview.title}
          </ThemedText>
          <ThemedText style={styles.description} numberOfLines={3}>
            {preview.description}
          </ThemedText>
          <ThemedText style={styles.site}>
            {preview.site}
          </ThemedText>
        </View>
        
        {preview.image && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: preview.image }}
              style={styles.image}
              contentFit="cover"
              placeholder="blurhash"
              placeholderContentFit="cover"
            />
          </View>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
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
    marginBottom: 6,
    lineHeight: 20,
  },
  description: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 8,
    lineHeight: 18,
  },
  site: {
    fontSize: 12,
    opacity: 0.6,
    fontWeight: '500',
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
});
