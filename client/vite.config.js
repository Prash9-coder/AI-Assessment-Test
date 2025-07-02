import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { componentTagger } from "lovable-tagger";
import { fileURLToPath, URL } from 'node:url';

// Vite configuration
export default defineConfig(({ mode }) => ({
  // Server Configuration
  server: {
    host: "::", // Allows connections from any IP address
    port: 8081, // Sets the development server to listen on port 8081
  },

  // Plugins Configuration
  plugins: [
    react(), // React plugin for Vite
    mode === "development" && componentTagger(), // Only use componentTagger in development mode
  ].filter(Boolean),

  // Aliases for module resolution
  resolve: {
    alias: {
      "@": fileURLToPath(new URL('./src', import.meta.url)), // Alias "@" to point to the src directory
    },
  },
}));
