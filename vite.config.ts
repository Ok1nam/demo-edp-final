import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react({ jsxRuntime: "automatic" })],
  base: "/demo-edp-final/",

  root: "client", // Ceci est correct, la racine du projet Vite est le dossier 'client'

  build: {
    outDir: path.resolve(__dirname, "dist"), // 'dist' sera à la racine de votre projet global
    emptyOutDir: true, // Vider 'dist' avant chaque build
    rollupOptions: {
      // <<< C'EST ICI LA LIGNE CRUCIALE À VÉRIFIER/MODIFIER ! >>>
      // Le chemin doit être ACCURATEMENT vers client/public/index.html depuis la racine du projet global.
      input: path.resolve(__dirname, "client/public/index.html"),
    },
  },

  // Assurez-vous que publicDir est bien défini comme ceci pour copier les assets de public/ à la racine de dist/
  publicDir: path.resolve(__dirname, "client/public"),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
});