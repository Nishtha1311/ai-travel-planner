import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata = {
  title: "TravelAI - AI Travel Planner",
  description: "Plan smarter trips with AI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}