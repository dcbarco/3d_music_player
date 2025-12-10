# Guía de Despliegue en Vercel

Este proyecto está listo para ser desplegado en Vercel. Sigue estos pasos:

## Opción 1: Despliegue Automático con Git (Recomendado)

1.  Sube tu código a un repositorio de GitHub, GitLab o Bitbucket.
2.  Inicia sesión en [Vercel](https://vercel.com) y haz clic en **"Add New..."** > **"Project"**.
3.  Importa tu repositorio.
4.  Vercel detectará automáticamente que es un proyecto **Vite**.
5.  La configuración de construcción (Build settings) debería ser:
    *   **Framework Preset:** Vite
    *   **Build Command:** `npm run build` (o `vite build`)
    *   **Output Directory:** `dist`
6.  Haz clic en **"Deploy"**.

## Opción 2: Despliegue desde la Línea de Comandos (CLI)

1.  Asegúrate de tener instalado Vercel CLI:
    ```bash
    npm i -g vercel
    ```
2.  En la terminal, dentro de la carpeta del proyecto, ejecuta:
    ```bash
    vercel
    ```
3.  Sigue las instrucciones en pantalla (login, confirmar proyecto, etc.).
    *   Usa la configuración predeterminada cuando te pregunte.

## Notas Importantes

*   **vercel.json**: Se ha añadido un archivo `vercel.json` para asegurar que el enrutamiento funcione correctamente (útil si decides agregar más páginas o rutas en el futuro).
*   **Archivos Estáticos**: El archivo `playlist.json` en la carpeta `public` se servirá correctamente.
