# UniTrack - Supabase Database Setup

## Database Tables

Krijo këto tabela në Supabase dashboard:

### 1. courses (Lëndët)
```sql
CREATE TABLE courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  professor TEXT,
  color TEXT DEFAULT '#6366f1',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only see their own courses
CREATE POLICY "Users can view their own courses" 
  ON courses FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own courses" 
  ON courses FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own courses" 
  ON courses FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own courses" 
  ON courses FOR DELETE 
  USING (auth.uid() = user_id);
```

### 2. schedule (Orari Javor)
```sql
CREATE TABLE schedule (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  room TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE schedule ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own schedule" 
  ON schedule FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own schedule" 
  ON schedule FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own schedule" 
  ON schedule FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own schedule" 
  ON schedule FOR DELETE 
  USING (auth.uid() = user_id);
```

### 3. tasks (Provime, Kolokviume, Projekte, Prezantime)
```sql
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('provim', 'kolokvium', 'projekt', 'prezantim')),
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own tasks" 
  ON tasks FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tasks" 
  ON tasks FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks" 
  ON tasks FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks" 
  ON tasks FOR DELETE 
  USING (auth.uid() = user_id);
```

## Si të ekzekutosh këto SQL queries:

1. Shko te Supabase Dashboard: https://supabase.com/dashboard
2. Zgjidh projektin tënd
3. Shko te **SQL Editor** nga menu në të majtë
4. Kopjo dhe ngjit secilin SQL block më sipër
5. Kliko **Run** për të ekzekutuar

Pas krijimit të tabelave, aplikacioni do të jetë gati për të ruajtur të dhënat!
