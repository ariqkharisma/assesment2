"use client";

import Loading from "@/components/Loading";
import { useRouter } from "next/navigation";
import React from "react";

function Profile() {
  const [loading, setLoading] = React.useState(false);
  const [profile, setProfile] = React.useState({} as any);
  const [error, setError] = React.useState("");
  const router = useRouter();

  const getProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/profile", {
        method: "GET",
        headers: {
          Authorization: localStorage.getItem("token") || "",
        },
      });

      if (res.ok) {
        const profile = await res.json();
        setProfile(profile);
      }

      setError((await res.json()).message);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    getProfile();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center">
      {loading && <Loading />}
      <div className="fixed flex justify-center bg-white border-b-2 border-gray-300 w-full h-[50px]">
        <button
          className="mx-4 px-2 font-semibold"
          onClick={() => router.push("/tasks")}
        >
          Task
        </button>
        <button className="mx-4 px-2 font-semibold border-b-2 border-red-500">
          Profile
        </button>
      </div>
      <button onClick={() => {localStorage.removeItem("token"); router.push("/")}} className="fixed top-3 right-8">Logout</button>
      <div className="h-screen flex flex-col justify-center items-center">
        {profile && (
          <div>
            <p className="mx-4 px-2 font-semibold">Email: {profile.email}</p>
            <p className="mx-4 px-2 font-semibold">
              Full Name: {profile.full_name}
            </p>
          </div>
        )}
         {error && <p className="mx-4 px-2 text-red-500">{error}</p>}
      </div>
    </main>
  );
}

export default Profile;
