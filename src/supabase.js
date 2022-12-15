import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fcajkqpptvlwnvnubizh.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjYWprcXBwdHZsd252bnViaXpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzA4NTM4NjEsImV4cCI6MTk4NjQyOTg2MX0.nXyNoTBhR5ll6OmEaSgb6GGHdTW8_mpr0Mq0Ka9121k';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
