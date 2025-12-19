import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/**
 * GitHub Pages:
 * - Si tu repo se llama "cotizador-hogar", dejá base así.
 * - Si se llama diferente, cambiá "/cotizador-hogar/" por "/NOMBRE_DEL_REPO/".
 */
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === "production" ? "/proyectofinal-untref-benjamin-gonzalez/" : "/",
}));
