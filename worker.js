// Cloudflare Worker — proxy seguro hacia la API de Anthropic
// La API key vive como Secret en Cloudflare, nunca se expone al navegador

export default {
  async fetch(request, env, ctx) {
    // CORS preflight
    if (request.method === "OPTIONS") {
      return corsResponse(null, 204);
    }

    if (request.method !== "POST") {
      return corsResponse(JSON.stringify({ error: "Method not allowed" }), 405);
    }

    // Rate limit por IP: 20 requests / 10 minutos
    const ip = request.headers.get("CF-Connecting-IP") || "unknown";
    if (env.RATE_LIMITER) {
      const { success } = await env.RATE_LIMITER.limit({ key: `rl:${ip}` });
      if (!success) {
        return corsResponse(
          JSON.stringify({ error: "Demasiadas consultas. Esperá unos minutos e intentá de nuevo." }),
          429
        );
      }
    }

    // Parsear body
    let body;
    try {
      body = await request.json();
    } catch {
      return corsResponse(JSON.stringify({ error: "Body inválido" }), 400);
    }

    if (!body.messages || !Array.isArray(body.messages)) {
      return corsResponse(JSON.stringify({ error: "Falta el campo messages" }), 400);
    }

    // Forzar modelo y max_tokens (el cliente no los controla)
    const payload = {
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: body.system || "",
      messages: body.messages,
    };

    // Llamar a Anthropic
    let res;
    try {
      res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      return corsResponse(
        JSON.stringify({ error: "Error de conexión con el servicio de IA." }),
        502
      );
    }

    const data = await res.json();
    return corsResponse(JSON.stringify(data), res.status);
  },
};

function corsResponse(body, status = 200) {
  return new Response(body, {
    status,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json",
    },
  });
}
