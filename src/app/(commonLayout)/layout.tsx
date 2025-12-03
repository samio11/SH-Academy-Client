import React from "react";
import { Header } from "./_Components/Home/Navbar";
import { Footer } from "./_Components/Home/Footer";

export default function CommonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header></Header>
      {children}
      <Footer></Footer>
    </div>
  );
}
