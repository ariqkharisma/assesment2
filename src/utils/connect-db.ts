import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wxabuppqyjgflvaxjpgq.supabase.co';
const supabaseKey = 'SUPABASE_KEY';

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;