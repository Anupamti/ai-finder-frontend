import { createClient } from '@supabase/supabase-js';
import { OpenAI } from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const pinecone = new Pinecone();

async function run() {
  const index = pinecone.Index(process.env.PINECONE_INDEX_NAME!);

  const { data: users, error } = await supabase.from('users').select('*');
  if (error) throw error;

  for (const user of users) {
    const input = `${user.bio} Interests: ${user.interests.join(', ')}`;

    const embeddingRes = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input,
    });

    const embedding = embeddingRes.data[0].embedding;

    // Store vector in Pinecone
    await index.upsert([
      {
        id: user.id,
        values: embedding,
        metadata: {
          name: user.name,
          bio: user.bio,
          profession: user.profession,
          interests: user.interests,
        },
      },
    ]);

    // (Optional) Store in Supabase too
    await supabase.from('users').update({ embedding }).eq('id', user.id);

    console.log(`✅ Embedded & indexed ${user.name}`);
  }
}

run();
