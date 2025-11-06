# Supabase Storage Setup për Upload Feature

## Hapat për të krijuar Storage Bucket

1. **Hyr në Supabase Dashboard**
   - Shko te projekti tënd në https://supabase.com/dashboard
   - Zgjidh projektin tënd

2. **Krijoni Storage Bucket**
   - Nga menuja në të majtë, kliko **Storage**
   - Kliko **New Bucket**
   - Emri i bucket: `user_uploads`
   - Public bucket: ✅ (aktivizo)
   - Kliko **Create Bucket**

3. **Konfiguro Storage Policies (opsionale por i rekomanduar)**

   Për të lejuar vetëm përdoruesit e autentifikuar të ngarkojnë:

   ```sql
   -- Policy për INSERT (upload)
   CREATE POLICY "Users can upload their own images"
   ON storage.objects FOR INSERT
   TO authenticated
   WITH CHECK (
     bucket_id = 'user_uploads' AND
     (storage.foldername(name))[1] = auth.uid()::text
   );

   -- Policy për SELECT (read/download)
   CREATE POLICY "Anyone can view uploaded images"
   ON storage.objects FOR SELECT
   TO public
   USING (bucket_id = 'user_uploads');

   -- Policy për DELETE
   CREATE POLICY "Users can delete their own images"
   ON storage.objects FOR DELETE
   TO authenticated
   USING (
     bucket_id = 'user_uploads' AND
     (storage.foldername(name))[1] = auth.uid()::text
   );
   ```

4. **Testo Upload Feature**
   - Hyr në aplikacionin UniTrack
   - Kliko në "Upload" nga navigation
   - Zgjidh një imazh nga kompjuteri
   - Imazhi do të ngarkohet dhe do të shfaqet public URL

## Informacione Shtesë

- **Struktura e skedarëve**: Skedarët ruhen si `{user_id}/{random_number}.{extension}`
- **Public Access**: Të gjithë mund t'i shohin imazhet e ngarkuara nëpërmjet public URL
- **Siguria**: Vetëm përdoruesit e autentifikuar mund të ngarkojnë imazhe
- **File Types**: Pranon vetëm imazhe (image/*)

## Troubleshooting

Nëse hasni probleme:

1. **Error: "Bucket not found"**
   - Sigurohu që bucket `user_uploads` është krijuar
   - Kontrollo emrin e bucket në Supabase Dashboard

2. **Error: "Access denied"**
   - Sigurohu që bucket është public
   - Kontrollo storage policies në Supabase

3. **Imazhi nuk shfaqet**
   - Kontrollo që URL është valid
   - Sigurohu që bucket është public
