export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders() });
    }

    if (request.method === "POST") {
      const data = await request.json();
      const { species, catch_time, location } = data;

      try {
        await env.DB.prepare(
          `INSERT INTO catches (species, catch_time, location) VALUES (?, ?, ?)`
        )
        .bind(species, catch_time, location)
        .run();
      } catch (err) {
        console.error("DB insert failed:", err);
        return new Response(JSON.stringify({ 
          success: false, 
          message: "Database error", 
          error: err.message 
        }), {
          status: 500,
          headers: { ...corsHeaders(), "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ 
        success: true,
        message: "Catch logged successfully!"
      }), {
        status: 200,
        headers: { ...corsHeaders(), "Content-Type": "application/json" },
      });
    }

    return new Response("Method Not Allowed", { 
      status: 405, 
      headers: corsHeaders() 
    });
  },
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}