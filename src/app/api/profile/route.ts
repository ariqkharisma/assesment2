import supabase from "@/utils/connect-db";
import verifyToken from "@/utils/verify-token";


export async function GET(req: Request) {
  const token = req.headers.get("Authorization");
  if (!token) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  const user = await verifyToken(token);

  if (!user) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  let { data, error } = await supabase
    .from("users")
    .select("email, full_name")
    .eq("id", user.id)
    .single();

  if (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 400,
    });
  }

  return new Response(JSON.stringify(data), { status: 200 });
}