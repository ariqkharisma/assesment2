import supabase from "@/utils/connect-db";

export default async function login(req : Request) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const { email, password } = await req.json();

  const { data, error } = await supabase
  .from('users')
  .select('email, full_name, role')
  .eq('email', email)
  .eq('password', password);

  if (error) {
    return new Response('Invalid credentials', { status: 401 });
  } else {
    return new Response(JSON.stringify(data), {
      status: 200,
    });
  }
}