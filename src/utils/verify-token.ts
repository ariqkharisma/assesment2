import jwt from "jsonwebtoken";
import supabase from "@/utils/connect-db";

const verifyToken = async (token: string) => {
  const decoded: any = jwt.verify(token, "JWT_SECRET");
  if (!decoded) return false;

  const { data, error } = await supabase
    .from("users")
    .select("id, email, full_name, role")
    .eq("id", decoded.id)
    .single();


  if (error) return false;

  return { id: data.id, email: data.email, full_name: data.full_name, role: data.role };
};

export default verifyToken;
