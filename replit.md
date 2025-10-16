# Mobile Login App with Supabase Authentication

## Overview
A mobile-responsive web login application built with React and Supabase authentication. Features a clean, modern UI with email/password authentication.

## Project Structure
- **Framework**: React with Vite
- **Authentication**: Supabase
- **Styling**: Custom CSS with mobile-first design
- **Port**: 5000

## Features
- User sign up with email verification
- User sign in with email/password
- Session management
- Mobile-responsive design
- Clean, modern UI with gradient backgrounds

## Recent Changes
- **Oct 16, 2025**: Initial project setup
  - Created React app with Vite
  - Implemented Supabase authentication
  - Built mobile-responsive login UI
  - Configured environment variables from Replit secrets
  - Set up workflow to run on port 5000

## Environment Variables
The app uses the following environment variables (managed through Replit Secrets):
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anonymous/public key

These are automatically injected into the app via `setup-env.sh` script.

## Architecture
- `src/components/Auth.jsx`: Login/signup form component
- `src/components/Home.jsx`: Authenticated user home screen
- `src/supabaseClient.js`: Supabase client configuration
- `src/App.jsx`: Main app component with session management

## User Preferences
None specified yet.
