import { EmptyState } from '@/components/EmptyState';
import { LinkCard } from '@/components/LinkCard';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { api } from '@/lib/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    RefreshControl,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LinksScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const queryClient = useQueryClient();

  const {
    data: linksData,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['links', { search: searchQuery, tag: selectedTag, page }],
    queryFn: () => api.getLinks({ search: searchQuery, tag: selectedTag, page, pageSize: 20 }),
    keepPreviousData: true,
  });

  const deleteMutation = useMutation({
    mutationFn: api.deleteLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] });
    },
    onError: (error) => {
      Alert.alert('Error', 'Failed to delete link');
    },
  });

  const handleDelete = useCallback((id: string) => {
    Alert.alert(
      'Delete Link',
      'Are you sure you want to delete this link?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteMutation.mutate(id),
        },
      ]
    );
  }, [deleteMutation]);

  const handleLoadMore = useCallback(() => {
    if (linksData && linksData.items.length < linksData.total) {
      setPage(prev => prev + 1);
    }
  }, [linksData]);

  const handleRefresh = useCallback(() => {
    setPage(1);
    refetch();
  }, [refetch]);

  const renderItem = useCallback(({ item }: { item: any }) => (
    <LinkCard
      link={item}
      onDelete={() => handleDelete(item.id)}
      onPress={() => {
        // Handle link press - could open in browser or show details
        console.log('Link pressed:', item.url);
      }}
    />
  ), [handleDelete]);

  const renderFooter = useCallback(() => {
    if (!linksData || linksData.items.length >= linksData.total) {
      return null;
    }
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#007aff" />
      </View>
    );
  }, [linksData]);

  if (isError) {
    return (
      <SafeAreaView style={styles.container}>
        <ThemedView style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>Failed to load links</ThemedText>
          <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
            <ThemedText style={styles.retryButtonText}>Retry</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.title}>My Links</ThemedText>
        <ThemedText style={styles.subtitle}>
          {user?.email}
        </ThemedText>
      </ThemedView>

      <View style={styles.searchContainer}>
        <View style={[
          styles.searchInputContainer,
          { backgroundColor: colorScheme === 'dark' ? '#2c2c2e' : '#f2f2f7' }
        ]}>
          <IconSymbol name="magnifyingglass" size={20} color="#8e8e93" />
          <TextInput
            style={[
              styles.searchInput,
              { color: colorScheme === 'dark' ? '#ffffff' : '#000000' }
            ]}
            placeholder="Search links..."
            placeholderTextColor="#8e8e93"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <IconSymbol name="xmark.circle.fill" size={20} color="#8e8e93" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={linksData?.items || []}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={handleRefresh} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          !isLoading ? (
            <EmptyState
              title="No links yet"
              subtitle="Add your first link to get started"
              icon="bookmark"
            />
          ) : null
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.6,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100, // Account for tab bar
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#007aff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
