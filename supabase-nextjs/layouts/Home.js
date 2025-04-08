'use client'
import React from "react";

// components

import Navbar from "../components/Navbars/HomeNavbar.js";
import Sidebar from "../components/Sidebar/Sidebar.js";
import HeaderStats from "../components/Headers/HeaderStats.js";
import FooterAdmin from "../components/Footers/FooterAdmin.js";

export default function Home({ children }) {
return (
    <>
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100 min-h-screen flex flex-col">
        <Navbar />
        {/* Header */}
        {/* <HeaderStats /> */}
        <div className="flex-1 px-4 md:px-10 mx-auto w-full pt-20">
          {children}
        </div>
        <FooterAdmin />
      </div>
    </>
  );
}