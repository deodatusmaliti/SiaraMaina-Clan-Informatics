export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const data = await request.json();

    // Inserts into your Cloudflare D1 Database table named 'entries'
    await env.DB.prepare(
      "INSERT INTO entries (name, content) VALUES (?, ?)"
    ).bind(data.name, data.content).run();

    return new Response(JSON.stringify({ success: true, message: "Data saved!" }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
