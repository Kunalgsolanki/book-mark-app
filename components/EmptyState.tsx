import { useColorScheme } from '@/hooks/useColorScheme';
import React from 'react';
import {
    StyleSheet,
    View,
} from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { IconSymbol } from './ui/IconSymbol';

interface EmptyStateProps {
  title: string;
  subtitle: string;
  icon: string;
}

export function EmptyState({ title, subtitle, icon }: EmptyStateProps) {
  const colorScheme = useColorScheme();

  return (
    <ThemedView style={styles.container}>
      <View style={[
        styles.iconContainer,
        { backgroundColor: colorScheme === 'dark' ? '#3a3a3c' : '#f2f2f7' }
      ]}>
        <IconSymbol name={icon} size={48} color="#8e8e93" />
      </View>
      <ThemedText style={styles.title}>{title}</ThemedText>
      <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.6,
    textAlign: 'center',
    lineHeight: 22,
  },
});
