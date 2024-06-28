"use client";

import Loading from "@/components/Loading";
import { FaRegCheckCircle, FaRegTimesCircle } from "react-icons/fa";
import React from "react";
import { useRouter } from "next/navigation";

export default function Tasks() {
  const [tasks, setTasks] = React.useState([]);
  const [task, setTask] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [role, setRole] = React.useState("");
  const router = useRouter();

  const getRole = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/roles", {
        method: "GET",
        headers: {
          Authorization: localStorage.getItem("token") || "",
        },
      })

      if (res.ok) {
        const role = await res.json();
        setRole(role.role);
      }

      setError((await res.json()).message);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }
  const handleAddTask = async () => {
    if (!task) return setError("Please enter a task");
    setLoading(true);

    if (role === "guest") {
      const prevTasks = localStorage.getItem("tasks") || "[]";
      const parsedPrevTasks = JSON.parse(prevTasks);
      const newTasks =  [...parsedPrevTasks, { task, status: "ongoing", id: Date.now(), created_at: new Date() }];
      localStorage.setItem("tasks", JSON.stringify(newTasks));
      getTasks();
      setLoading(false);
      return
    }

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          Authorization: localStorage.getItem("token") || "",
        },
        body: JSON.stringify({ task: task, status: "ongoing" }),
      })

    } catch (error) {
      console.log(error);
    }
    setLoading(false);
    getTasks();
  }

  const handleUpdateTask = async (id : number, status: string) => {
    setLoading(true);

    if (role === 'guest') {
      const tasks = localStorage.getItem("tasks") || "[]";
      const parsedTasks = JSON.parse(tasks);
      const newTasks = parsedTasks.map((task : any) => {
        if (task.id === id) {
          return { ...task, status };
        }
        return task;
      });
      localStorage.setItem("tasks", JSON.stringify(newTasks));
      getTasks();
      setLoading(false);
      return
    }

    try {
      const res = await fetch("/api/tasks", {
        method: "PUT",
        headers: {
          Authorization: localStorage.getItem("token") || "",
        },
        body: JSON.stringify({ id, status }),
      })
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
    getTasks();
  }

  const handleDeleteTask = async (id : number) => {
    setLoading(true);

    if (role === 'guest') {
      const tasks = localStorage.getItem("tasks") || "[]";
      const parsedTasks = JSON.parse(tasks);
      const newTasks = parsedTasks.filter((task : any) => task.id !== id);
      localStorage.setItem("tasks", JSON.stringify(newTasks));
      getTasks();
      setLoading(false);
      return
    }

    try {
      const res = await fetch(`/api/tasks`, {
        method: "DELETE",
        headers: {
          Authorization: localStorage.getItem("token") || "",
        },
        body: JSON.stringify({ id }),
      })
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
    getTasks();
  }

  const getTasks = async () => {
    setLoading(true);
    if (role === 'guest') {
      const tasks = localStorage.getItem("tasks") || "[]";
      setTasks(JSON.parse(tasks));
      setLoading(false);
      return
    }

    try {
      const res = await fetch("/api/tasks", {
        method: "GET",
        headers: {
          Authorization: localStorage.getItem("token") || "",
        },
      });

      if (res.ok) {
        const tasks = await res.json();
        console.log(tasks);
        setTasks(tasks);
      }

      setError((await res.json()).message);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    getRole();
  }, []);

  React.useEffect(() => {
    role && getTasks();
  }, [role]);

  return (
    <main className="flex min-h-screen flex-col items-center">
      {loading && <Loading />}
      <div className="fixed flex justify-center bg-white border-b-2 border-gray-300 w-full h-[50px]">
        <button className="mx-4 px-2 font-semibold border-b-2 border-red-500">Task</button>
        <button className="mx-4 px-2 font-semibold" onClick={() => router.push("/profile")}>Profile</button>
      </div>
      <button onClick={() => {localStorage.removeItem("token"); router.push("/")}} className="fixed top-3 right-8">Logout</button>
      <div className="flex flex-col items-center justify-center rounded-lg w-[90%] sm:w-[450px] py-10">
        <h1 className="text-3xl mt-10">Task Management</h1>
        <label htmlFor="title" className="mt-6">
          Title
        </label>
        <input
          type="text"
          id="title"
          className="border border-black px-4 py-2 rounded w-full"
          onChange={(e) => setTask( e.target.value )}
        ></input>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button onClick={handleAddTask} className="bg-blue-300 px-6 py-2 rounded-lg hover:bg-blue-400 mt-4">
          Add Task
        </button>
        <h2 className="w-full text-left mt-10 font-bold">Ongoing Task</h2>
        {tasks?.map((task : any) => (
          task.status === "ongoing" && (
            <div key={task.id} className="flex justify-between bg-gray-300 px-4 py-2 mt-2 rounded-md text-left w-full">
              <div>
                <p>{task.task}</p>
                <p className="text-xs">{task.created_at.split("T")[0]}</p>
              </div>
              <div className="flex">
                <button className="h-full hover:text-red-500 px-1" onClick={() => handleDeleteTask(task.id)}><FaRegTimesCircle size={20} /></button>
                <button className="h-full hover:text-green-500" onClick={() => handleUpdateTask(task.id, "done")}><FaRegCheckCircle size={20} /></button>
              </div>
            </div>
          )
        ))}
        <h2 className="w-full text-left mt-10 font-bold">Completed Task</h2>
        {tasks?.map((task : any) => (
          task.status === "done" && (
            <div key={task.id} className="flex justify-between bg-gray-300 px-4 py-2 mt-2 rounded-md text-left w-full">
              <div>
                <p>{task.task}</p>
                <p className="text-xs">{task.created_at.split("T")[0]}</p>
              </div>
              <div className="flex">
                <button className="h-full px-1 hover:text-red-500" onClick={() => handleDeleteTask(task.id)}><FaRegTimesCircle size={20} /></button>
                <button className="h-full hover:text-green-500" onClick={() => handleUpdateTask(task.id, "ongoing")}><FaRegCheckCircle size={20} /></button>
              </div>
            </div>
          )
        ))}
      </div>
    </main>
  );
}
