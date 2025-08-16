import { CreateLinkRequest, Link, PaginatedLinksResponse } from '../types';
import { supabase } from '../utils/supabase';

export async function createLink(userId: string, linkData: CreateLinkRequest): Promise<Link> {
  const { data, error } = await supabase
    .from('links')
    .insert({
      user_id: userId,
      url: linkData.url,
      title: linkData.title,
      description: linkData.description,
      image: linkData.image,
      tags: linkData.tags
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create link: ${error.message}`);
  }

  return data;
}

export async function getLinks(
  userId: string,
  page: number = 1,
  pageSize: number = 20,
  search?: string,
  tag?: string
): Promise<PaginatedLinksResponse> {
  let query = supabase
    .from('links')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .eq('deleted_at', null)
    .order('created_at', { ascending: false });

  // Apply search filter
  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,url.ilike.%${search}%`);
  }

  // Apply tag filter
  if (tag) {
    query = query.contains('tags', [tag]);
  }

  // Apply pagination
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    throw new Error(`Failed to fetch links: ${error.message}`);
  }

  return {
    items: data || [],
    total: count || 0,
    page,
    pageSize
  };
}

export async function deleteLink(userId: string, linkId: string): Promise<void> {
  const { error } = await supabase
    .from('links')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', linkId)
    .eq('user_id', userId);

  if (error) {
    throw new Error(`Failed to delete link: ${error.message}`);
  }
}

export async function getLinkById(userId: string, linkId: string): Promise<Link | null> {
  const { data, error } = await supabase
    .from('links')
    .select('*')
    .eq('id', linkId)
    .eq('user_id', userId)
    .eq('deleted_at', null)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    throw new Error(`Failed to fetch link: ${error.message}`);
  }

  return data;
}
