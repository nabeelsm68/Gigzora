import "./globals.css";

import Sidebar from "@/components/ui/sidebar";
import Topbar from "@/components/ui/topbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased">

        <div className="flex h-screen overflow-hidden">

          <Sidebar />

          <div className="flex-1 overflow-auto">

            <Topbar />

            <main className="p-8">
              {children}
            </main>

          </div>

        </div>

      </body>
    </html>
  );
}