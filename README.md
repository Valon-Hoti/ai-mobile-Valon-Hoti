# UniTrack - Student Organization Web App

**Autori:** Valon Hoti

## Përshkrimi i Projektit

UniTrack është një aplikacion web që kam ndërtuar për të ndihmuar studentët të organizojnë më mirë studimet e tyre. Aplikacioni mundëson menaxhimin e lëndëve, detyrave, provimeve dhe orarit javor në një vend të vetëm. Gjithashtu ofron një sistem njoftimesh që të lajmëron për afatet që po afrojnë.

## Teknologjitë e Përdorura

- **React 18** - Frontend framework
- **Vite** - Build tool dhe dev server
- **Supabase** - Authentication dhe PostgreSQL database
- **Custom CSS** - Styling me mobile-first approach

## Funksionaliteti Kryesor

**Dashboard**
- Shfaq statistika për detyrat (totale, të përfunduara, afatet që afrojnë)
- Lista e detyrave dhe provimeve që po afrojnë
- Quick navigation për seksionet e tjera

**Menaxhimi i Lëndëve**
- Shtimi, modifikimi dhe fshirja e lëndëve
- Zgjedhja e ngjyrave për organizim më të mirë
- Ruajtja e emrit të profesorit

**Detyrat dhe Provimet**
- 4 kategori: Provime, Kolokviume, Projekte, Prezantime
- Çdo detyrë ka titull, përshkrim, lëndë, datë dhe orë
- Mundësia për t'i shënuar si të përfunduara
- Filtrim sipas kategorisë, statusit dhe lëndës

**Orari Javor**
- Shfaqja e leksioneve për çdo ditë të javës
- Informacione për orën e fillimit/mbarimit, sallën dhe profesorin
- Layout me kolona për çdo ditë

**Sistemi i Njoftimeve**
- Alerta automatike bazuar në llojin e detyrës:
  - Provime dhe Kolokviume: 3 ditë përpara
  - Projekte: 2 ditë përpara
  - Prezantime: 1 ditë përpara
- Ngjyra të ndryshme sipas urgjencës
- Shfaqje e afateve të kaluara

## Skedaret Kryesore

```
login-app/
├── src/
│   ├── components/
│   │   ├── Auth.jsx              # Faqja e login/signup
│   │   ├── MainApp.jsx           # Container me navigation
│   │   ├── Dashboard.jsx         # Dashboard me statistika
│   │   ├── Courses.jsx           # Menaxhimi i lëndëve
│   │   ├── Tasks.jsx             # Menaxhimi i detyrave
│   │   ├── Schedule.jsx          # Orari javor
│   │   └── Notifications.jsx     # Sistemi i njoftimeve
│   ├── App.jsx                   # Main component
│   └── supabaseClient.js         # Konfigurimi i Supabase
├── SUPABASE_SETUP.md             # SQL queries për database setup
└── package.json
```

## Database Schema

Aplikacioni përdor tre tabela në Supabase:

- **courses** - Informacioni për lëndët (emri, profesori, ngjyra)
- **tasks** - Detyrat dhe provimet (titulli, përshkrimi, lloji, data, statusi)
- **schedule** - Orari javor (dita, ora fillimit/mbarimit, salla)

Të gjitha tabelat kanë Row Level Security (RLS) që siguron që çdo përdorues të shohë vetëm të dhënat e veta.

## Gjendja Aktuale

Aplikacioni është funksional dhe gati për përdorim. Të gjitha features kryesore janë implementuar dhe funksionojnë:
- Autentifikimi me Supabase
- CRUD operations për lëndët, detyrat dhe orarin
- Sistemi i njoftimeve me alerta automatike
- Mobile-responsive design
- Filtrimi dhe kërkimi i të dhënave

Për të përdorur aplikacionin, duhet të konfigurosh Supabase credentials në environment variables (SUPABASE_URL dhe SUPABASE_ANON_KEY) dhe të ekzekutosh SQL queries nga SUPABASE_SETUP.md për të krijuar tabelat.
