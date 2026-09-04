import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    // 1. Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method Not Allowed' });
    }

    try {
        // 2. Read the raw text stream coming from your HTML fetch form
        let rawBody = '';
        for await (const chunk of req) {
            rawBody += chunk;
        }

        // 3. Parse the stream text into a readable JSON object
        const body = JSON.parse(rawBody);
        const { name, content } = body;

        // 4. Validate that fields aren't completely empty
        if (!name || !content) {
            return res.status(400).json({ success: false, error: 'Name and Content are required.' });
        }

        // 5. Fire the dynamic variables into your Vercel Postgres table
        await sql`
            INSERT INTO entries (name, content) 
            VALUES (${name}, ${content});
        `;

        // 6. Return standard success to your browser window
        return res.status(200).json({ success: true, message: 'Data saved successfully!' });

    } catch (error) {
        // Returns the actual text error so you can read exactly what broke
        return res.status(500).json({ success: false, error: error.message });
    }
}
