# UniTrack - Student Organization Web App

## Overview
UniTrack është një aplikacion web që ndihmon studentët të organizojnë më mirë orarin, provimet dhe detyrat e tyre. Aplikacioni ofron një pasqyrë të përgjithshme për lëndët dhe obligimet, dhe jep alerta në kohë për afatet e rëndësishme.

## Project Structure
- **Framework**: React with Vite
- **Authentication**: Supabase
- **Database**: Supabase (PostgreSQL)
- **Styling**: Custom CSS with mobile-first design
- **Port**: 5000

## Features
✅ **Autentifikimi i Përdoruesit**
- Sign up dhe sign in me email/password
- Session management me Supabase

✅ **Dashboard**
- Pasqyrë e përgjithshme e detyrave dhe provimeve
- Statistika (totali, të përfunduara, javën e ardhshme)
- Quick actions për navigim të shpejtë

✅ **Menaxhimi i Lëndëve**
- Shtim, modifikim dhe fshirje të lëndëve
- Informacione: emri, profesori, ngjyra
- Grid layout me kartat e lëndëve

✅ **Detyrat dhe Provimet**
- 4 kategori: Provime, Kolokviume, Projekte, Prezantime
- Informacione: titulli, përshkrimi, lloji, lënda, data dhe ora
- Filtrimi sipas kategorisë dhe statusit
- Shënim si të përfunduar

✅ **Orari Javor**
- Orari i leksioneve për çdo ditë të javës
- Informacione: lënda, dita, ora fillimit/mbarimit, salla, profesori
- Layout me kolona për çdo ditë

✅ **Sistemi i Njoftimeve**
- Njoftime automatike bazuar në llojin e detyrës:
  - Provime & Kolokviume: 3 ditë përpara
  - Projekte: 2 ditë përpara  
  - Prezantime: 1 ditë përpara
- Ngjyra dhe ikona sipas urgjencës
- Shfaqje e afateve të kaluara

✅ **Upload Imazhe**
- Upload të imazheve në Supabase Storage
- Storage bucket: user_uploads
- Shfaqje e public URL për çdo imazh të ngarkuar
- Organizim i skedarëve sipas user_id

## Recent Changes
- **Nov 6, 2025**: Shtimi i Upload Feature
  - Komponenti Upload.jsx për ngarkimin e imazheve
  - Integrimi me Supabase Storage
  - Navigation button për Upload section
  - Setup guide për Supabase Storage bucket

- **Oct 25, 2025**: Ndërtimi i aplikacionit UniTrack
  - Krijimi i database schema në Supabase (courses, tasks, schedule)
  - Ndërtimi i Dashboard-it me overview dhe statistika
  - Komponenti për menaxhimin e lëndëve
  - Komponenti për detyra/provime me 4 kategori
  - Orari javor me layout per ditë
  - Sistemi i njoftimeve me alerta automatike
  - Navigation bar me 5 seksione
  - Mobile-responsive design për të gjitha faqet

- **Oct 16, 2025**: Initial project setup
  - Created React app with Vite
  - Implemented Supabase authentication

## Database Schema

### Tabela: courses
- id (UUID, primary key)
- user_id (UUID, foreign key → auth.users)
- name (text) - Emri i lëndës
- professor (text) - Emri i profesorit
- color (text) - Ngjyra për identifikim vizual
- created_at (timestamp)

### Tabela: tasks
- id (UUID, primary key)
- user_id (UUID, foreign key → auth.users)
- course_id (UUID, foreign key → courses, nullable)
- title (text) - Titulli i detyrës
- description (text) - Përshkrimi
- type (text) - Lloji: 'provim', 'kolokvium', 'projekt', 'prezantim'
- due_date (timestamp) - Data dhe ora e afatit
- completed (boolean) - A është përfunduar
- created_at (timestamp)

### Tabela: schedule
- id (UUID, primary key)
- user_id (UUID, foreign key → auth.users)
- course_id (UUID, foreign key → courses)
- day_of_week (integer) - Dita e javës (0-6, 0=E Diel)
- start_time (time) - Ora e fillimit
- end_time (time) - Ora e mbarimit
- room (text) - Salla/dhoma
- created_at (timestamp)

## Environment Variables
The app uses the following environment variables (managed through Replit Secrets):
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anonymous/public key

These are automatically injected into the app via `setup-env.sh` script.

## Architecture

### Components
- `src/App.jsx`: Main app component with authentication routing
- `src/components/Auth.jsx`: Login/signup form component
- `src/components/MainApp.jsx`: Main container with navigation
- `src/components/Dashboard.jsx`: Dashboard with overview and stats
- `src/components/Courses.jsx`: Course management component
- `src/components/Tasks.jsx`: Tasks and exams management
- `src/components/Schedule.jsx`: Weekly schedule component
- `src/components/Notifications.jsx`: Notification system with alerts
- `src/components/Upload.jsx`: Image upload to Supabase Storage
- `src/supabaseClient.js`: Supabase client configuration

### Styling
- Gradient design (purple/blue theme)
- Mobile-responsive layout
- Card-based UI components
- Color coding for different task types
- Emoji icons for visual clarity

## Navigation
- 🏠 Dashboard - Pasqyra kryesore
- 📖 Lëndët - Menaxhimi i lëndëve
- ✏️ Detyrat - Detyrat dhe provimet
- 📅 Orari - Orari javor
- 🔔 Njoftime - Sistemi i alertave
- 📤 Upload - Ngarkimi i imazheve

## User Preferences
- Gjuha: Shqip (Albanian)
- Design: Mobile-responsive, gradient theme
- Alert system: Automatic notifications based on task type

## Next Steps
Aplikacioni është gati për përdorim bazë. Funksionalitete të ardhshme të mundshme:
- Email notifications (përveç njoftimeve në aplikacion)
- Calendar view (kalendar vizual për orarin)
- Export/import functionality
- Statistika më të detajuara
- Dark mode
