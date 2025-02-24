import Header from "@/components/Header/header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Divya Cell Point",
  description: "A mobile store and service stop",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Header />
      <div className="h-28" />
      {children}
    </div>
  );
}
