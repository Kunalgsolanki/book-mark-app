# Quick Setup Guide

## 🚀 Get the App Running in 5 Minutes

### 1. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 2. Set Up Environment Variables

**Frontend:**
Copy `env.example` to `.env` and update with your Supabase credentials:

```bash
cp env.example .env
```

Edit `.env`:
```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here
EXPO_PUBLIC_API_BASE_URL=http://localhost:3001
```

**Backend:**
```bash
cd server
cp env.example .env
```

Edit `server/.env`:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
PORT=3001
NODE_ENV=development
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=20
CORS_ORIGIN=http://localhost:8081,http://localhost:19006
```

### 3. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Copy your project URL and anon key from Settings > API
3. Run the SQL schema in the SQL editor:

```sql
-- Copy and paste the contents of server/supabase-schema.sql
```

### 4. Start the Backend

```bash
cd server
npm run dev
```

You should see: `🚀 Server running on port 3001`

### 5. Start the Frontend

In a new terminal:
```bash
npm start
```

### 6. Test the App

1. Open the app in Expo Go or your preferred simulator
2. You'll see the authentication screen
3. Enter your email to receive a magic link
4. Click the link in your email to sign in
5. Start adding bookmarks!

## 🔧 Troubleshooting

### "supabaseUrl is required" Error
- Make sure you've copied `env.example` to `.env`
- Verify your Supabase URL and anon key are correct
- Restart the Expo development server

### "Route missing default export" Error
- The components should already be properly exported
- Try clearing the Metro cache: `npx expo start --clear`

### Backend Connection Issues
- Ensure the backend is running on port 3001
- Check that `EXPO_PUBLIC_API_BASE_URL` is set correctly
- Verify CORS settings in the backend

### Magic Link Not Working
- Check your email spam folder
- Verify the redirect URL in Supabase Auth settings
- Add `bookmarkapp://auth/callback` to your Supabase redirect URLs

## 📱 Features to Try

1. **Add a Link**: Go to the "Add Link" tab and paste a URL
2. **Preview**: Click "Preview" to see the link metadata
3. **Save**: Add tags and save to your reading list
4. **Search**: Use the search bar to find your saved links
5. **Delete**: Swipe or tap the delete button on any link
6. **Profile**: Check out your profile and sign out

## 🎯 Next Steps

- Set up your own Supabase project
- Deploy the backend to a hosting service
- Customize the UI and add more features
- Add offline support and push notifications

## 🆘 Need Help?

- Check the main README.md for detailed documentation
- Review the server README.md for backend setup
- Create an issue if you encounter problems
