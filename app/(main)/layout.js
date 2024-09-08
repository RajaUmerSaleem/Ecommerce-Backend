import { Inter } from "next/font/google";
import Head from "next/head";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Admin - Portal",
  description: "Portal for Admin to Hanlde his leads, sales, Data",
};

export default function AdminLayout({ children }) {
  return (
    <>
      <div className={inter.className}>
      <Navbar />
        <main className="w-full h-[100vh] flex">
          <div className="w-[20%]"><Sidebar /></div>
          <div className=" bg-white w-[80%] h-full flex flex-col p-4 text9-blue-50">
            {children}
          </div>
        </main>
      </div>
    </>
  );
}
