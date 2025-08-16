import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

// Get environment variables with fallbacks
import Constants from 'expo-constants';

// Read Supabase config from Expo Constants’ extra
const {
  extra: { supabaseUrl, supabaseAnonKey },
} = Constants.expoConfig as { extra: Record<string, string> };

 // eslint-disable-next-line @typescript-eslint/no-unused-vars
 // supabaseUrl and supabaseAnonKey are provided via Constants.expoConfig.extra



export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: {
      async getItem(key: string) {
        // Implement secure storage here if needed
        return null;
      },
      async setItem(key: string, value: string) {
        // Implement secure storage here if needed
      },
      async removeItem(key: string) {
        // Implement secure storage here if needed
      },
    },
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
