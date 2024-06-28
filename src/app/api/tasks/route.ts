import supabase from "@/utils/connect-db";
import verifyToken from "@/utils/verify-token";

export async function POST(req: Request) {
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

  const user_id = user.id;
  const { task, status } = await req.json();

  let { data, error } = await supabase
    .from("tasks")
    .insert([{ task, status, user_id }]);

  if (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 400,
    });
  }

  return new Response(
    JSON.stringify({ message: "Task created successfully" }),
    { status: 201 }
  );
}

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
    .from("tasks")
    .select("*")
    .eq("user_id", user.id);

  if (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 400,
    });
  }

  return new Response(JSON.stringify(data), { status: 200 });
}

export async function PUT(req: Request) {
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

  const { id, status } = await req.json();
  let { data, error } = await supabase
    .from("tasks")
    .update({ status, created_at: new Date() })
    .eq("id", id);

  if (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 400,
    });
  }

  return new Response(JSON.stringify(data), { status: 200 });
}

export async function DELETE(req: Request) {
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

  const { id } = await req.json();

  let { data, error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 400,
    });
  }

  return new Response(JSON.stringify(data), { status: 200 });
}