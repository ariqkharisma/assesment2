import supabase from "@/utils/connect-db";
import createAccessToken from "@/utils/generate-token";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  let { data, error } = await supabase.from("users").select("id, email, full_name, role").eq("email", email).eq("password", password);
  
  if (error) {
    return new Response(JSON.stringify({"message": error.message}), { status: 400 });
  } 

  if (!data || data.length === 0) {
    return new Response(JSON.stringify({"message": "Email or password is incorrect"}), { status: 400 });
  }

  const access_token = createAccessToken({ id: data[0].id, email: data[0].email, full_name: data[0].full_name, role: data[0].role });
  return new Response(JSON.stringify({"access_token": access_token, ...data[0]}), { status: 200 });
}
