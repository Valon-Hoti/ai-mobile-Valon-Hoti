# UniTrack 🎓

**UniTrack** është një aplikacion web modern për menaxhimin e studimeve, i dizajnuar për të ndihmuar studentët të organizojnë më mirë orarin, provimet dhe detyrat e tyre.



## ✨ Karakteristikat Kryesore

### 🏠 Dashboard
- **Pasqyrë e plotë** e të gjitha detyrave dhe provimeve
- **Statistika në kohë reale**: totali i detyrave, të përfunduara, afatet që afrojnë
- **Quick actions** për navigim të shpejtë
- **Afatet që afrojnë** me shfaqje vizuale dhe ngjyra

### 📖 Menaxhimi i Lëndëve
- Shtoni, modifikoni dhe fshini lëndët
- Personalizoni me **8 ngjyra** të ndryshme
- Ruani emrin e profesorit për çdo lëndë
- Interface me karta të bukura dhe responsive

### ✏️ Detyrat & Provimet
Menaxhoni 4 kategori të detyrimeve me ngjyra dhe ikona unike:
- 📝 **Provime** (e kuqe)
- 📋 **Kolokviume** (portokalli)
- 💼 **Projekte** (blu)
- 🎤 **Prezantime** (vjollcë)

**Features:**
- Filtroni sipas kategorisë, statusit ose lëndës
- Shtoni titull, përshkrim, datë dhe orë
- Shënoni si të përfunduar me një klik
- Lidhje me lëndët për organizim më të mirë

### 📅 Orari Javor
- Shikoni orarin tuaj të plotë për javën
- Shtoni leksione me kohë fillimi/mbarimi
- Ruani sallën dhe profesorin për çdo orë
- Layout me kolona për çdo ditë të javës

### 🔔 Sistemi i Njoftimeve
**Alerta automatike** të personalizuara sipas llojit të detyrës:
- **Provime & Kolokviume**: Njoftime 3 ditë përpara
- **Projekte**: Njoftime 2 ditë përpara
- **Prezantime**: Njoftime 1 ditë përpara
- **Afate të kaluara**: Shfaqje me prioritet të lartë

Ngjyra dhe ikona që tregojnë urgjencën:
- 🔴 Urgjencë e lartë (sot/nesër)
- 🟡 Urgjencë mesatare (2-3 ditë)
- 🔵 Normale
- ⚠️ Afate të kaluara

## 🛠️ Teknologjitë e Përdorura

- **Frontend**: React 18 me Vite
- **Styling**: Custom CSS (Mobile-first design)
- **Backend**: Supabase
  - Authentication (Email/Password)
  - PostgreSQL Database
  - Row Level Security (RLS)
- **Hosting**: Replit

## 🗄️ Struktura e Databazës

### Tabela: `courses`
Ruajtja e informacionit për lëndët
```sql
- id (UUID, primary key)
- user_id (UUID, foreign key)
- name (text) - Emri i lëndës
- professor (text) - Emri i profesorit
- color (text) - Ngjyra për identifikim vizual
- created_at (timestamp)
```

### Tabela: `tasks`
Ruajtja e detyrave, provimeve dhe projekteve
```sql
- id (UUID, primary key)
- user_id (UUID, foreign key)
- course_id (UUID, foreign key, nullable)
- title (text) - Titulli i detyrës
- description (text) - Përshkrimi
- type (text) - 'provim', 'kolokvium', 'projekt', 'prezantim'
- due_date (timestamp) - Data dhe ora e afatit
- completed (boolean) - Statusi
- created_at (timestamp)
```

### Tabela: `schedule`
Ruajtja e orarit javor
```sql
- id (UUID, primary key)
- user_id (UUID, foreign key)
- course_id (UUID, foreign key)
- day_of_week (integer) - 0-6 (0=E Diel)
- start_time (time) - Ora e fillimit
- end_time (time) - Ora e mbarimit
- room (text) - Salla/dhoma
- created_at (timestamp)
```

## 🚀 Si të Filloni

### Parakushtet
- Llogari në [Supabase](https://supabase.com)
- Node.js 18+ të instaluar

### Hapat për Setup

1. **Klononi projektin**
   ```bash
   git clone <repository-url>
   cd login-app
   ```

2. **Instaloni dependencies**
   ```bash
   npm install
   ```

3. **Konfiguroni Supabase**
   - Krijoni një projekt të ri në Supabase Dashboard
   - Ekzekutoni SQL queries nga `SUPABASE_SETUP.md` për të krijuar tabelat
   - Kopjoni `SUPABASE_URL` dhe `SUPABASE_ANON_KEY`

4. **Vendosni environment variables**
   
   Në Replit Secrets ose `.env`:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Nisni aplikacionin**
   ```bash
   npm run dev
   ```

   Aplikacioni do të hapet në `http://localhost:5000`

## 📱 Design & UX

### Mobile-First Responsive
- Funksionon perfekt në desktop, tablet dhe mobile
- Breakpoints për ekrane të ndryshme
- Touch-friendly interface për mobile

### Tema Vizuale
- Gradient purple/blue (inspiruar nga ambientet akademike)
- Card-based layout për lehtësi leximi
- Ikona emoji për UI më miqësor
- Smooth animations dhe hover effects
- Text shadows për lexueshmëri më të mirë

### Accessibility
- Ngjyra të qarta dhe kontrast i lartë
- Butona të mëdha dhe lehtë për t'u klikuar
- Loading states për çdo veprim
- Error handling dhe feedback vizual

## 🔐 Siguria

- **Row Level Security (RLS)**: Çdo përdorues sheh vetëm të dhënat e veta
- **Authentication me Supabase**: Menaxhim i sigurt i session-it
- **User isolation**: Të gjitha queries filtrohen sipas `user_id`
- **Defensive filtering**: Kontrolle shtesë në update/delete operations

## 📂 Struktura e Projektit

```
login-app/
├── src/
│   ├── components/
│   │   ├── Auth.jsx/css          # Login/Signup
│   │   ├── MainApp.jsx/css       # Container + Navigation
│   │   ├── Dashboard.jsx/css     # Dashboard kryesor
│   │   ├── Courses.jsx/css       # Menaxhimi i lëndëve
│   │   ├── Tasks.jsx/css         # Detyrat & Provimet
│   │   ├── Schedule.jsx/css      # Orari javor
│   │   └── Notifications.jsx/css # Sistemi i njoftimeve
│   ├── App.jsx                   # Root component
│   ├── supabaseClient.js         # Supabase config
│   └── main.jsx                  # Entry point
├── SUPABASE_SETUP.md             # SQL setup instructions
└── package.json
```

## 🎯 Përdorimi

1. **Krijoni një llogari** ose hyni në të ekzistueshmen
2. **Shtoni lëndët** që merrni këtë semestër
3. **Plotësoni orarin** tuaj javor
4. **Shtoni detyrat** dhe provimet me afatet përkatëse
5. **Kontrolloni njoftimet** për të qenë gjithmonë të përgatitur!

## 🌟 Funksionalitete të Ardhshme

- [ ] Email notifications (përveç njoftimeve në aplikacion)
- [ ] Calendar view (kalendar vizual për orarin)
- [ ] Export/Import functionality (backup të dhënash)
- [ ] Statistika më të detajuara (performance tracking)
- [ ] Dark mode
- [ ] Integrim me Google Calendar
- [ ] Ndarje të orarit me shokë (social features)

## 📄 Licensa

Projekt akademik - të gjitha të drejtat e rezervuara.

## 🤝 Kontributi

Ky është një projekt personal. Sugjerime dhe feedback janë të mirëpritur!

---

**Ndërtuar me ❤️ për studentët shqiptarë**
