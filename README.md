# Ley Laboral Argentina — Consultor IA PRO

Plataforma web interactiva sobre la **Ley 27.802 de Modernización Laboral** (publicada el 06/03/2026), orientada a dueños y gerentes de PyMEs argentinas. Permite consultar los cambios clave, calcular ahorros con el RIFL, gestionar el blindaje legal del Art. 30, y consultar a un asistente IA especializado.

---

## Módulos

| # | Módulo | Descripción |
|---|--------|-------------|
| 1 | Inicio | Dashboard con métricas clave y alertas de riesgo |
| 2 | Ley vieja vs nueva | Comparativa de 12 cambios con acordeones antes/después |
| 3 | Calculadora RIFL | Proyección de ahorro en contribuciones patronales |
| 4 | Blindaje Art. 30 | Checklist mensual de documentación para contratistas |
| 5 | Plan de acción | Hoja de ruta inmediata, corto y mediano plazo |
| 6 | Consultor IA | Chat con modelo de lenguaje especializado en la ley |

---

## Stack

- **Frontend**: HTML5 + CSS3 + JavaScript vanilla (un único `index.html` sin dependencias locales)
- **Backend proxy**: Cloudflare Worker (`worker.js`) — la API key de Anthropic nunca se expone al navegador
- **Fuentes**: Google Fonts (DM Sans + DM Mono) vía CDN
- **Deploy**: GitHub Pages (frontend) + Cloudflare Workers plan gratuito (proxy)

---

## Deploy paso a paso

### Paso 1 — Clonar el repositorio

```bash
git clone https://github.com/TU-USUARIO/TU-REPO.git
cd TU-REPO
```

### Paso 2 — Deploy del Cloudflare Worker

Necesitás una cuenta en [Cloudflare](https://cloudflare.com) (plan gratuito alcanza).

```bash
# Instalar Wrangler CLI
npm install -g wrangler

# Autenticarse con Cloudflare
wrangler login

# Configurar la API key de Anthropic como Secret (nunca en el código)
wrangler secret put ANTHROPIC_API_KEY
# → Te pedirá pegar la key. Obtenerla en: https://console.anthropic.com/settings/keys

# Deploy del Worker
wrangler deploy
```

Al finalizar, Wrangler te mostrará la URL del Worker. Ejemplo:
```
https://ley-laboral-consultor.TU-SUBDOMINIO.workers.dev
```

### Paso 3 — Conectar el Worker al frontend

Abrí `index.html` y buscá esta línea cerca del inicio del bloque `<script>`:

```js
const WORKER_URL = 'https://ley-laboral-consultor.TU-SUBDOMINIO.workers.dev';
```

Reemplazá `TU-SUBDOMINIO` por el subdominio real que te asignó Cloudflare. Guardá el archivo.

### Paso 4 — Deploy en GitHub Pages

```bash
git add .
git commit -m "Deploy inicial"
git push origin main
```

Luego en GitHub:
1. Ir a **Settings → Pages**
2. Source: **Deploy from a branch**
3. Branch: `main`, carpeta: `/ (root)`
4. Guardar

La app estará disponible en `https://TU-USUARIO.github.io/TU-REPO/` en 1–2 minutos.

---

## Costos estimados

| Servicio | Plan | Costo |
|----------|------|-------|
| GitHub Pages | Free | $0/mes |
| Cloudflare Workers | Free (100k req/día) | $0/mes |
| Cloudflare Rate Limiter | Incluido en Workers Free | $0/mes |
| Anthropic Claude API | Pay-per-use | ~$3–8/mes (uso normal PyME) |

---

## Configuración del rate limiter

El Worker incluye un rate limiter de 20 consultas por IP cada 10 minutos. Esto está configurado en `wrangler.toml`. Si necesitás ajustar el límite, modificá estos valores:

```toml
simple = { limit = 20, period = 600 }
```

`limit`: cantidad máxima de requests. `period`: ventana de tiempo en segundos.

---

## Advertencia legal

La información proporcionada por esta aplicación tiene carácter informativo y divulgativo. No constituye asesoramiento legal, no crea relación profesional de ningún tipo, y no reemplaza la consulta con un abogado especializado en derecho laboral. Las disposiciones de la Ley 27.802 están sujetas a reglamentación parcial; verificá el estado de vigencia antes de tomar decisiones.

---

*Corte informativo: 13/03/2026*
