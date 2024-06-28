"use client";

import Loading from "@/components/Loading";
import { useRouter } from "next/navigation";
import React from "react";

export default function Home() {
  const [isUser, setIsUser] = React.useState(true);
  const [form, setForm] = React.useState({ email: "", password: "" });
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: isUser ? JSON.stringify(form) : JSON.stringify({ email: "guest", password: "guest" }),
      });

      if (res.ok) {
        localStorage.setItem("token", (await res.json()).access_token);
        return router.push("/tasks");
      }

      setError((await res.json()).message);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      {loading && <Loading />}
      <div className="border border-black flex flex-col items-center justify-center rounded-lg w-[90%] sm:w-[400px] py-10">
        <div className="flex justify-center">
          <button
            onClick={() => setIsUser(true)}
            className={
              "border border-black rounded-tl-lg rounded-bl-lg px-8 hover:bg-blue-300 " +
              (isUser ? " bg-blue-300" : "")
            }
          >
            User
          </button>
          <button
            onClick={() => setIsUser(false)}
            className={
              "border border-black rounded-tr-lg rounded-br-lg px-8 hover:bg-blue-300" +
              (!isUser ? " bg-blue-300" : "")
            }
          >
            Guest
          </button>
        </div>
        {isUser && (
          <>
            <div className="flex flex-col mt-8 w-[80%]">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                className="border border-black px-4 py-2 rounded"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              ></input>
            </div>
            <div className="flex flex-col mt-4 w-[80%]">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                className="border border-black px-4 py-2 rounded"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              ></input>
            </div>
          </>
        )}

        {error && <p className="text-red-500">{error}</p>}
        <button
          onClick={handleLogin}
          className="mt-10 bg-green-600 text-white px-8 py-2 rounded-md hover:bg-green-700"
        >
          Login
        </button>
      </div>
    </main>
  );
}
