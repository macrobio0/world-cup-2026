# Mundial 2026 — Simulador

App de simulación del Mundial 2026: captura resultados de la fase de grupos, calcula tablas automáticamente,
y simula el bracket de eliminación hasta la final.

## Cómo funciona

- **Resultados oficiales**: están escritos en el código (`src/App.jsx`, campo `preResult` de cada partido en `GROUP_MATCHES`).
  Tú los actualizas y haces `git push`; cuando se actualiza el sitio, todos los que lo visiten verán los resultados nuevos.
- **Simulaciones personales**: cada persona que abre el sitio puede llenar los partidos que aún no tienen resultado oficial,
  y elegir resultados del bracket de eliminación. Esto se guarda en `localStorage` del navegador de cada persona —
  nadie más lo ve, y no se pierde al cerrar la pestaña (solo se borra si esa persona limpia datos del navegador o usa
  el botón "Borrar mi simulación").

## Cómo actualizar resultados oficiales (tú, como administrador)

1. Abre `src/App.jsx`.
2. Busca el partido en el arreglo `GROUP_MATCHES` (cada uno tiene un `id` único, por ejemplo `'E1'`).
3. Cambia `preResult: null` por `preResult: [golesEquipoA, golesEquipoB]`. Ejemplo:
   ```js
   { id: 'E1', group: 'E', matchday: 1, teamA: 'Germany', teamB: 'Curaçao', ..., preResult: [3, 0] },
   ```
4. Guarda, haz commit y push a GitHub. La página se actualiza sola en 1-2 minutos (GitHub Pages + Actions, ver abajo).

## Despliegue en GitHub Pages (gratis)

### 1. Crea el repositorio
- Sube todo este proyecto a un nuevo repositorio en tu cuenta de GitHub, por ejemplo `world-cup-2026-simulator`.

### 2. Ajusta el `base` en `vite.config.js`
Abre `vite.config.js` y asegúrate de que `base` coincida con el nombre exacto de tu repositorio:
```js
base: '/world-cup-2026-simulator/',
```
(Si el nombre de tu repo es diferente, cámbialo aquí también.)

### 3. Instala dependencias y prueba localmente (opcional)
```bash
npm install
npm run dev
```
Abre la URL que te muestre (normalmente `http://localhost:5173`).

### 4. Configura GitHub Pages con GitHub Actions
Crea el archivo `.github/workflows/deploy.yml` con este contenido (ya incluido en este proyecto):

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

### 5. Activa GitHub Pages
- En tu repo, ve a **Settings → Pages**.
- En "Source", selecciona **GitHub Actions**.

### 6. Listo
- Cada vez que hagas `git push` a `main`, la app se reconstruye y publica automáticamente.
- Tu sitio quedará disponible en: `https://TU-USUARIO.github.io/world-cup-2026-simulator/`

Comparte esa URL con tus amigos. Cada persona que la abra podrá hacer su propia simulación de forma independiente.

## Estructura del proyecto

```
world-cup-app/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── src/
│   ├── main.jsx
│   ├── index.css
│   └── App.jsx       <- aquí están los datos de partidos y resultados oficiales
└── .github/workflows/deploy.yml
```
