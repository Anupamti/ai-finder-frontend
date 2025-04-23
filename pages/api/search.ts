import { NextApiRequest, NextApiResponse } from "next";
import { openai } from "../../lib/openai";
import { Pinecone } from "@pinecone-database/pinecone";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { query } = req.body;

    if (!query || typeof query !== "string") {
      return res.status(400).json({ error: "Missing or invalid query" });
    }

    const parsed = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Extract filters and vibe prompt from user input.",
        },
        {
          role: "user",
          content: query,
        },
      ],
      functions: [
        {
          name: "extractSearchIntent",
          parameters: {
            type: "object",
            properties: {
              filters: {
                type: "object",
                properties: {
                  profession: { type: "string" },
                  interests: {
                    type: "array",
                    items: { type: "string" },
                  },
                },
              },
              vibePrompt: { type: "string" },
            },
            required: ["filters", "vibePrompt"],
          },
        },
      ],
      function_call: { name: "extractSearchIntent" },
    });

    const functionCall = parsed.choices[0].message.function_call;
    if (!functionCall?.arguments) {
      return res.status(500).json({ error: "Failed to parse search intent" });
    }

    const { filters, vibePrompt } = JSON.parse(functionCall.arguments);

    if (
      !filters ||
      !filters.profession ||
      !Array.isArray(filters.interests) ||
      filters.interests.length === 0
    ) {
      return res.status(400).json({ error: "Missing or invalid filters" });
    }

    console.log("Filters:", filters);
    console.log("Vibe Prompt:", vibePrompt);

    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: vibePrompt,
    });

    const embedding = embeddingResponse.data[0].embedding;

    console.log("Vibe embedding:", embedding);

    const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
    const index = pinecone.Index(process.env.PINECONE_INDEX_NAME!);

    // Query Pinecone with filters
    console.log("Querying Pinecone with filter:", {
      vector: embedding,
      topK: 10,
      filter: {
        profession: { $eq: filters.profession },
        interests: { $in: filters.interests },
      },
    });

    const results = await index.query({
      vector: embedding,
      topK: 10,
      filter: {
        profession: { $eq: filters.profession },
        interests: { $in: filters.interests },
      },
      includeMetadata: true,
    });

    const explainedMatches = results.matches.map((match: any) => ({
      ...match,
      explanation: `This match works because both share similar interests in ${filters.interests.join(
        ", "
      )}.`,
    }));

    if (!explainedMatches || explainedMatches.length === 0) {
      return res.status(404).json({ message: "No matches found" });
    }

    res.status(200).json({ matches: explainedMatches });
  } catch (error) {
    console.error("Search API error:", error);
    res.status(500).json({ error: "Something went wrong." });
  }
};

export default handler;
