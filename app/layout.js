import { Inter } from "next/font/google";  
import "./globals.css";  
import SessionWraper from "./Components/SessionWraper"; // Corrected import  

const inter = Inter({ subsets: ["latin"] });  

export const metadata = {  
  title: "Admin - Ecommerce Website",  
  description: "Ecommerce Website Admin Portal",  
};  

export default function RootLayout({ children }) { 
  return (  
    <html lang="en" >  
      <SessionWraper>  
        <body className={inter.className}>{children}</body>  
      </SessionWraper>  
    </html>  
  );  
}