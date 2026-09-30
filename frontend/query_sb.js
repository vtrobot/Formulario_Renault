import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aslxcwsomqncxoahmlhl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzbHhjd3NvbXFuY3hvYWhtbGhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk4ODQ1NjgsImV4cCI6MjEwNTQ2MDU2OH0.GClmotsiFaFenG1p0YVBeyKTyHmZl6pIEAVlXomsLq0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.from('pecas').select('*').limit(1);
  console.log('pecas data:', data);
  console.log('pecas error:', error);
}

run();
