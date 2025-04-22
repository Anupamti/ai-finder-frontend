// pages/api/search.js or .ts if you're using TypeScript
import { openai } from '../../lib/openai';
import { Pinecone } from '@pinecone-database/pinecone';


export default async function handler(req, res) {
  try {
    const { query } = req.body;

    const parsed = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'Extract filters and vibe prompt from user input.',
        },
        {
          role: 'user',
          content: query,
        },
      ],
      functions: [
        {
          name: 'extractSearchIntent',
          parameters: {
            type: 'object',
            properties: {
              filters: {
                type: 'object',
                properties: {
                  profession: { type: 'string' },
                  interests: {
                    type: 'array',
                    items: { type: 'string' },
                  },
                },
              },
              vibePrompt: { type: 'string' },
            },
            required: ['filters', 'vibePrompt'],
          },
        },
      ],
      function_call: { name: 'extractSearchIntent' },
    });

    const { filters, vibePrompt } = JSON.parse(
      parsed.choices[0].message.function_call.arguments
    );

    // Generate embedding for the vibe prompt
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: vibePrompt,
    });

    const embedding = embeddingResponse.data[0].embedding;

    const pinecone = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY
    });
 
    const index = pinecone.Index(process.env.PINECONE_INDEX_NAME);

    const results = await index.query({
      vector: embedding,
      topK: 10,
      filter: {
        profession: filters.profession,
        interests: { $in: filters.interests },
      },
    });

    res.status(200).json({ matches: results });
  } catch (error) {
    console.error('Search API error:', error);
    res.status(500).json({ error: 'Something went wrong.' });
  }
}
