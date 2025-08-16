import { LinkPreviewCard } from '@/components/LinkPreviewCard';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';
import { api } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface LinkPreview {
  url: string;
  title: string;
  description: string;
  image?: string;
  site: string;
}

export default function AddLinkScreen() {
  const [url, setUrl] = useState('');
  const [preview, setPreview] = useState<LinkPreview | null>(null);
  const [tags, setTags] = useState('');
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const colorScheme = useColorScheme();
  const queryClient = useQueryClient();

  const previewMutation = useMutation({
    mutationFn: api.previewUrl,
    onSuccess: (data) => {
      setPreview(data);
    },
    onError: (error) => {
      Alert.alert('Error', 'Failed to fetch preview. Please check the URL and try again.');
    },
  });

  const saveMutation = useMutation({
    mutationFn: api.createLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] });
      Alert.alert('Success', 'Link saved successfully!', [
        { text: 'OK', onPress: () => resetForm() }
      ]);
    },
    onError: (error) => {
      Alert.alert('Error', 'Failed to save link. Please try again.');
    },
  });

  const handlePreview = async () => {
    if (!url.trim()) {
      Alert.alert('Error', 'Please enter a URL');
      return;
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      setUrl(`https://${url}`);
    }

    setIsPreviewing(true);
    try {
      await previewMutation.mutateAsync(url);
    } finally {
      setIsPreviewing(false);
    }
  };

  const handleSave = async () => {
    if (!preview) {
      Alert.alert('Error', 'Please preview the link first');
      return;
    }

    setIsSaving(true);
    try {
      const tagArray = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      await saveMutation.mutateAsync({
        url: preview.url,
        title: preview.title,
        description: preview.description,
        image: preview.image,
        tags: tagArray,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setUrl('');
    setPreview(null);
    setTags('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ThemedView style={styles.content}>
            <View style={styles.header}>
              <ThemedText style={styles.title}>Add New Link</ThemedText>
              <ThemedText style={styles.subtitle}>
                Paste a URL to save it to your reading list
              </ThemedText>
            </View>

            <View style={styles.form}>
              <ThemedText style={styles.label}>URL</ThemedText>
              <View style={styles.urlContainer}>
                <TextInput
                  style={[
                    styles.urlInput,
                    { 
                      backgroundColor: colorScheme === 'dark' ? '#2c2c2e' : '#f2f2f7',
                      color: colorScheme === 'dark' ? '#ffffff' : '#000000',
                      borderColor: colorScheme === 'dark' ? '#3a3a3c' : '#d1d1d6',
                    }
                  ]}
                  placeholder="https://example.com"
                  placeholderTextColor={colorScheme === 'dark' ? '#8e8e93' : '#8e8e93'}
                  value={url}
                  onChangeText={setUrl}
                  keyboardType="url"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="url"
                />
                <TouchableOpacity
                  style={[
                    styles.previewButton,
                    { 
                      backgroundColor: isPreviewing ? '#8e8e93' : '#007aff',
                      opacity: isPreviewing ? 0.6 : 1,
                    }
                  ]}
                  onPress={handlePreview}
                  disabled={isPreviewing}
                >
                  {isPreviewing ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                  ) : (
                    <ThemedText style={styles.previewButtonText}>Preview</ThemedText>
                  )}
                </TouchableOpacity>
              </View>

              {preview && (
                <View style={styles.previewSection}>
                  <ThemedText style={styles.label}>Preview</ThemedText>
                  <LinkPreviewCard preview={preview} />
                  
                  <ThemedText style={styles.label}>Tags (optional)</ThemedText>
                  <TextInput
                    style={[
                      styles.tagsInput,
                      { 
                        backgroundColor: colorScheme === 'dark' ? '#2c2c2e' : '#f2f2f7',
                        color: colorScheme === 'dark' ? '#ffffff' : '#000000',
                        borderColor: colorScheme === 'dark' ? '#3a3a3c' : '#d1d1d6',
                      }
                    ]}
                    placeholder="reading, tech, tutorial (comma separated)"
                    placeholderTextColor={colorScheme === 'dark' ? '#8e8e93' : '#8e8e93'}
                    value={tags}
                    onChangeText={setTags}
                    multiline
                  />

                  <TouchableOpacity
                    style={[
                      styles.saveButton,
                      { 
                        backgroundColor: isSaving ? '#8e8e93' : '#34c759',
                        opacity: isSaving ? 0.6 : 1,
                      }
                    ]}
                    onPress={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <ActivityIndicator size="small" color="#ffffff" />
                    ) : (
                      <ThemedText style={styles.saveButtonText}>Save to Reading List</ThemedText>
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </ThemedView>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
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
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  form: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
  },
  urlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  urlInput: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  previewButton: {
    height: 50,
    paddingHorizontal: 20,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  previewSection: {
    marginTop: 24,
  },
  tagsInput: {
    height: 80,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  saveButton: {
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
