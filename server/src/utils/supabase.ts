import { createClient } from '@supabase/supabase-js';
import { AuthUser } from '../types';

const supabaseUrl = "https://atjimbuhenthdyjdydgn.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0amltYnVoZW50aGR5amR5ZGduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyNTM2MjYsImV4cCI6MjA3MDgyOTYyNn0.Rbdq25KP48jtZR6xrOw0zRH80E8ArFSH7RuG-xTodkI"

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function verifyAuthToken(token: string): Promise<AuthUser | null> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email!,
      aud: user.aud,
      role: user.role
    };
  } catch (error) {
    console.error('Error verifying auth token:', error);
    return null;
  }
}

export function extractTokenFromHeader(authHeader: string | undefined): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}
