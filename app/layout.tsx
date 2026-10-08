import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "SimpleHealthTracker · Tu salud, día a día",
  description: "Un diario sencillo para cuidar tus hábitos y ver tu evolución.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
