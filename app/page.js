"use client"
import Image from "next/image";
import Navbar from "./Components/Navbar";
import Sidebar from "./Components/Sidebar";
import Form from "./Components/form";
import { useSession, signIn, signOut } from "next-auth/react"
export default function Home() {
  const { data: session } = useSession()
  if (!session) {
    return (
      <main className="min-h-screen bg-blue-950 flex justify-center items-center flex-col gap-[5px]">
        <h2 className="text-[30px] font-bold text-center text-white ">Login Form</h2>
        <form id="loginForm" className="space-y-4 w-[80%] sm:w-[30%]">
          <input
            type="text"
            name="username"
            id="username"
            placeholder="Username"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></input>
          <input
            type="text"
            name="email"
            id="email"
            placeholder="Email"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></input>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Submit
          </button>
        </form>
        <div className="text-white">OR</div>
        <button onClick={() => signIn()}
          className=" text-black py-2 bg-white rounded-lg hover:bg-gray-300 transition-colors w-[80%] sm:w-[30%] h-[40px] flex justify-center items-center">    <svg class="w-5 h-5 mr-2" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.09 0 5.49 1.26 7.15 2.3L35.68 7C32.23 4.67 28.39 3.5 24 3.5 14.73 3.5 6.88 9.83 3.34 18.03l6.54 5.07C11.65 17.33 17.37 13.5 24 13.5"></path>
            <path fill="#34A853" d="M10.95 27.16C9.85 24.36 9.5 21.12 9.5 17.5c0-1.76.26-3.47.7-5.1L3.3 7.17C1.28 11.45 0 16.58 0 22c0 5.06 1.17 9.81 3.3 13.83l7.65-6.04"></path>
            <path fill="#FBBC05" d="M10.95 27.16l-7.65 6.04C6.73 40.91 14.42 46.5 24 46.5c5.12 0 9.9-1.55 13.65-4.19L30.14 36.7C27.38 38.68 24.08 39.5 24 39.5c-6.73 0-12.7-4.68-14.05-12.34"></path>
            <path fill="#4285F4" d="M47.5 24.5c0-1.2-.11-2.38-.33-3.5H24v7h13.32c-.61 3.23-2.66 5.97-5.32 7.63L41.35 41C45.92 37.47 48 31.65 48 24.5"></path>
          </svg>
          Sign in with Google </button>
      </main>
    );
  }
  return (
    <>
      <Navbar />
      <main className="w-[100vw] h-[80vh] flex " >
        <div className="w-[20%]"><Sidebar /></div>
        <div className=" bg-white w-[80%] h-full flex flex-col p-4 text9-blue-50">
          <Form />
        </div>
      </main>
    </>
  );
}
