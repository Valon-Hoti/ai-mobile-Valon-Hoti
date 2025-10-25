import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5000,
    allowedHosts: [
      "88193c16-6b03-427d-b5c5-cf936134be96-00-3przo058mtq6p.janeway.replit.dev",
    ],
    hmr: {
      clientPort: 5000,
    },
  },
});
