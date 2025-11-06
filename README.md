# UniTrack - Student Organization Web App

**Autori:** Valon Hoti

## Pershkrimi i Projektit

UniTrack eshte nje aplikacion web qe e kam bere per te ndihmuar studentet te organizojne me mire studimet. Aplikacioni mundeson menaxhimin e lendeve, detyrave, provimeve dhe orarit javor ne nje vend. Gjithashtu ka nje sistem njoftimesh qe te lajmeron per afatet qe po afrojne.

## Teknologjite e Perdorura

- React 18 - Frontend framework
- Vite - Build tool dhe dev server
- Supabase - Authentication, PostgreSQL database dhe Storage
- Custom CSS - Styling me mobile-first approach

## Funksionaliteti Kryesor

**Dashboard**
- Statistika per detyrat (totale, te perfunduara, afatet qe afrojne)
- Lista e detyrave dhe provimeve qe po afrojne
- Quick navigation per seksionet e tjera

**Menaxhimi i Lendeve**
- Shtimi, modifikimi dhe fshirja e lendeve
- Zgjedhja e ngjyrave per organizim me te mire
- Ruajtja e emrit te profesorit

**Detyrat dhe Provimet**
- 4 kategori: Provime, Kolokviume, Projekte, Prezantime
- Cdo detyre ka titull, pershkrim, lende, date dhe ore
- Mundesite per t'i shenuar si te perfunduara
- Filtrim sipas kategorise, statusit dhe lendes

**Orari Javor**
- Shfaqja e leksioneve per cdo dite te javes
- Informacione per oren e fillimit/mbarimit, sallen dhe profesorin
- Layout me kolona per cdo dite

**Sistemi i Njoftimeve**
- Alerta automatike bazuar ne llojin e detyres:
  - Provime dhe Kolokviume: 3 dite perpara
  - Projekte: 2 dite perpara
  - Prezantime: 1 dite perpara
- Ngjyra te ndryshme sipas urgjences
- Shfaqje e afateve te kaluara

**Upload Imazhe**
- Ngarkimi i imazheve ne Supabase Storage
- Shfaqje e public URL per cdo imazh te ngarkuar
- Organizim automatik i skedareve sipas user_id

## Skedaret Kryesore

login-app/src/components/:
- Auth.jsx - Faqja e login/signup
- MainApp.jsx - Container me navigation
- Dashboard.jsx - Dashboard me statistika
- Courses.jsx - Menaxhimi i lendeve
- Tasks.jsx - Menaxhimi i detyrave
- Schedule.jsx - Orari javor
- Notifications.jsx - Sistemi i njoftimeve
- Upload.jsx - Ngarkimi i imazheve

login-app/src/:
- App.jsx - Main component
- supabaseClient.js - Konfigurimi i Supabase

## Database dhe Storage

**Database - Tre tabela ne Supabase:**
- courses - Informacioni per lendet (emri, profesori, ngjyra)
- tasks - Detyrat dhe provimet (titulli, pershkrimi, lloji, data, statusi)
- schedule - Orari javor (dita, ora fillimit/mbarimit, salla)

Te gjitha tabelat kane Row Level Security (RLS) qe siguron qe cdo perdorues te shoje vetem te dhenat e veta.

**Supabase Storage:**
- Bucket: user_uploads (per imazhe)
- Organizim i skedareve: {user_id}/{random_number}.{extension}
- Public access per shfaqjen e imazheve

## Gjendja Aktuale

Aplikacioni eshte funksional dhe gati per perdorim. Te gjitha features kryesore jane implementuar:
- Autentifikimi me Supabase
- CRUD operations per lendet, detyrat dhe orarin
- Sistemi i njoftimeve me alerta automatike
- Upload dhe shfaqje e imazheve
- Mobile-responsive design
- Filtrimi dhe kerkimi i te dhenave
-  Upload dhe shfaqje e imazheve




