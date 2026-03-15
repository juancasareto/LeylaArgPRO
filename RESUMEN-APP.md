# Ley Laboral Argentina — Consultor IA PRO
## Resumen técnico y funcional

---

## Descripción general

Aplicación web orientada a dueños y gerentes de PyMEs argentinas para entender, aplicar y calcular los efectos de la **Ley 27.802 de Modernización Laboral** (vigente desde el 06/03/2026). Permite consultar los cambios normativos, estimar liquidaciones por despido, auditar el cumplimiento del Art. 30 y hacer consultas legales en lenguaje natural mediante IA.

---

## Stack tecnológico

### Frontend
| Tecnología | Uso |
|---|---|
| **HTML5** | Estructura de la app (archivo único `index.html`) |
| **CSS3** | Diseño completo con variables custom, sin frameworks |
| **JavaScript (ES6+ vanilla)** | Toda la lógica interactiva, sin bundlers ni dependencias |
| **Google Fonts (CDN)** | `DM Sans` (300/400/500) para cuerpo · `DM Mono` (400/500) para números y código |

**Sin frameworks, sin npm, sin build step.** El `index.html` abre directamente en el navegador como `file://` y también desde GitHub Pages.

### Backend / Infraestructura
| Tecnología | Uso |
|---|---|
| **Cloudflare Workers** | Proxy seguro entre el browser y la API de Anthropic. La API key nunca se expone al cliente. |
| **Wrangler CLI** | Deploy y gestión del Worker desde la terminal |
| **GitHub Pages** | Hosting estático del `index.html` (deploy automático desde rama `main`) |

### IA
| Tecnología | Uso |
|---|---|
| **Anthropic Claude API** | Modelo `claude-sonnet-4-20250514` · `max_tokens: 1000` · sistema prompt especializado en Ley 27.802 |

---

## Arquitectura

```
Browser (GitHub Pages)
    │
    │  POST { system, messages }
    ▼
Cloudflare Worker                ← API key vive aquí como Secret
    │
    │  POST + x-api-key header
    ▼
Anthropic API (claude-sonnet-4)
```

El Worker aplica **rate limiting por IP**: 20 requests cada 10 minutos (binding `RATE_LIMITER` en Cloudflare).

---

## Módulos de la aplicación

### 1. Pantalla de inicio (landing)
Presentación de la app con 6 cards de features y botón "Comenzar". Se muestra una sola vez por sesión.

### 2. Inicio
- 4 métricas clave de la ley (multas, RIFL, período de prueba, PER)
- 2 alertas: riesgo residual de "daño generado" (CCyCN) y pendientes de reglamentación
- Acceso rápido a las secciones principales
- 4 preguntas frecuentes que redirigen al Consultor IA con texto precargado

### 3. Comparativa (ley vieja vs nueva)
12 cambios normativos en formato acordeón expandible con columnas ANTES / AHORA. Filtros por categoría: Sanciones · Solidaridad · Contratación · Despido · Procesal · Facultades.

### 4. Calculadora de liquidación final
Calculadora completa de liquidación por despido sin causa con **8 rubros**:

| # | Rubro | Artículo |
|---|---|---|
| 1 | Indemnización por antigüedad | Art. 245 LCT + Ley 27.802 |
| 2 | Preaviso sustitutivo | Art. 232 LCT |
| 3 | Integración del mes de despido | Art. 233 LCT |
| 4 | Haberes del mes en curso | Art. 103 LCT |
| 5 | SAC proporcional del semestre | Arts. 121/123 LCT (fórmula ARCA) |
| 6 | SAC sobre preaviso sustitutivo | Arts. 121 + 232 LCT |
| 7 | SAC sobre integración del mes | Arts. 121 + 233 LCT |
| 8 | Vacaciones proporcionales no gozadas | Art. 156 LCT (divisor 25) |

Features adicionales:
- Tope CCT configurable con doctrina Vizzoti (piso 67%) codificada
- Toggle si el empleado trabajó el preaviso
- Cálculo real por fechas (ingreso + despido), no por sliders aproximados
- Sección colapsable con los 5 rubros derogados por Ley 27.802

### 5. Protección laboral (Art. 30)
Checklist mensual de 10 ítems (7 obligatorios + 3 adicionales) para documentar la relación con contratistas y quedar eximido de solidaridad laboral. Barra de progreso animada con transición danger → warning → success.

### 6. Consultor IA
Chat con IA especializada en Ley 27.802. Sistema prompt con todos los cambios normativos relevantes. 5 preguntas sugeridas. Historial de conversación en sesión. Indicador de escritura animado.

### 7. Plan de acción
Hoja de ruta en 3 etapas: Inmediato / Q2 2026 / Diciembre 2026.

---

## Archivos del repositorio

| Archivo | Descripción |
|---|---|
| `index.html` | App completa (CSS + HTML + JS en un solo archivo) |
| `worker.js` | Cloudflare Worker — proxy hacia Anthropic API |
| `wrangler.toml` | Configuración del Worker (nombre, rate limiter, fecha de compatibilidad) |
| `README.md` | Instrucciones de deploy paso a paso |
| `RESUMEN-APP.md` | Este documento |

---

## Servicios externos y suscripciones

| Servicio | Plan | Costo estimado | Para qué se usa |
|---|---|---|---|
| **GitHub** | Free | $0/mes | Repositorio del código + hosting vía GitHub Pages |
| **GitHub Pages** | Free (incluido en GitHub) | $0/mes | Hosting del `index.html` con HTTPS automático |
| **Cloudflare Workers** | Free tier | $0/mes | Hasta 100.000 requests/día incluidos. Proxy de API. |
| **Anthropic Claude API** | Pay-as-you-go | ~$5–15/mes (uso normal PyME) | `claude-sonnet-4-20250514` · $3/M tokens input · $15/M tokens output |

**Costo total estimado: $0/mes en infraestructura + uso real de la API de Anthropic.**

### Detalle de costos API (referencia)
- Consulta promedio: ~500 tokens de input + ~400 tokens de output ≈ $0.0075 por consulta
- 100 consultas/mes ≈ $0.75 · 500 consultas/mes ≈ $3.75 · 1.000 consultas/mes ≈ $7.50

---

## URLs de producción

| Recurso | URL |
|---|---|
| App (GitHub Pages) | https://juancasareto.github.io/LeylaArgPRO/ |
| Repositorio | https://github.com/juancasareto/LeylaArgPRO |
| Cloudflare Worker | https://ley-laboral-consultor.juancasareto.workers.dev |
| Cloudflare Dashboard | https://dash.cloudflare.com → Workers & Pages → `ley-laboral-consultor` |

---

## Consideraciones legales

- Las respuestas del Consultor IA tienen carácter **informativo** y no reemplazan el asesoramiento legal profesional individualizado.
- Corte informativo de la app: **13/03/2026**.
- Varios artículos de la Ley 27.802 están **pendientes de reglamentación** (RIFL ~mayo 2026, FAL ~junio 2026, PER ~180 días desde reglamentación).
- La calculadora de liquidación es **orientativa**: no incluye retenciones impositivas ni particularidades de convenios colectivos específicos.

---

*Basado en análisis jurídico especializado · Ley 27.802 · Corte informativo: 13/03/2026*
