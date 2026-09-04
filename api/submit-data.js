export default async function handler(req, res) {
    // 1. Only allow POST requests (form submissions)
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method Not Allowed' });
    }

    try {
        const { name, content } = req.body;

        // 2. Send the data to your Cloudflare D1 Database using Cloudflare's HTTP API
        // (We will set up these API keys in Vercel in the next step)
        const accountId = process.env.CF_ACCOUNT_ID;
        const databaseId = process.env.CF_DATABASE_ID;
        const apiToken = process.env.CF_API_TOKEN;

        const cfUrl = `https://cloudflare.com{accountId}/d1/database/${databaseId}/query`;

        const response = await fetch(cfUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sql: "INSERT INTO entries (name, content) VALUES (?, ?);",
                params: [name, content]
            })
        });

        const result = await response.json();

        if (result.success) {
            return res.status(200).json({ success: true, message: 'Data saved successfully!' });
        } else {
            return res.status(500).json({ success: false, error: result.errors[0].message });
        }

    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}
