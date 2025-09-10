// echo-client-info
// This Edge Function reads the `x-client-info` header from the incoming request
// and returns a JSON response containing the header value and all headers for debugging.

console.info("echo-client-info function starting");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get all headers for debugging
    const allHeaders: Record<string, string> = {};
    req.headers.forEach((value, key) => {
      allHeaders[key] = value;
    });

    // Try multiple variations to capture the header
    const clientInfo =
      req.headers.get("x-client-info") ||
      req.headers.get("X-Client-Info") ||
      req.headers.get("X-CLIENT-INFO");

    // Also check if it's coming through with a different name
    const clientInfoAlternatives = {
      "x-client-info": req.headers.get("x-client-info"),
      "X-Client-Info": req.headers.get("X-Client-Info"),
      "user-agent": req.headers.get("user-agent"),
      "User-Agent": req.headers.get("User-Agent"),
    };

    const payload = {
      xclientinfo: clientInfo ?? null,
      alternatives: clientInfoAlternatives,
      allHeaders: allHeaders,
      method: req.method,
      url: req.url,
      timestamp: new Date().toISOString(),
    };

    return new Response(JSON.stringify(payload, null, 2), {
      status: 200,
      headers: {
        ...corsHeaders,
        "content-type": "application/json",
        connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("echo-client-info error", err);
    const errBody = {
      error: "internal_server_error",
      message: err.message,
    };
    return new Response(JSON.stringify(errBody), {
      status: 500,
      headers: {
        ...corsHeaders,
        "content-type": "application/json",
      },
    });
  }
});
