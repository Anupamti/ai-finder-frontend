# AI Finder

AI Finder is a platform designed to help users find people based on personalized queries, leveraging AI to parse natural-language inputs and rank results based on similarity to user preferences. The platform integrates Pinecone for vector search and Supabase for data storage, enabling users to find people based on interests, professions, and additional filters.

## Thought Process

The idea behind this project is to enable users to perform natural-language searches to find people based on attributes like profession, interests, and personality traits. The system leverages OpenAI's GPT model to extract key search intents from user input, which are then transformed into filters for searching through user data stored in Supabase. The results are returned with relevant personas ranked by similarity, and an explanation of the match is provided by the AI, improving the overall search experience.

### Core Features:

- **Natural-language search**: Allows users to input freeform queries like “Find me artists who love hiking and talk like Tarantino.”
- **AI parsing**: GPT-4 parses the query, extracting key filters and generating a vector embedding to perform the search.
- **Search results ranked by persona match**: The results are sorted based on how closely they match the user query.
- **AI-generated explanations**: AI provides a short explanation of why each result is a good match (e.g., “Both love absurd humor and slow cinema”).

### Tech Stack:

- **Frontend**: Next.js for the application framework.
- **Backend**: Next.js API routes for serverless endpoints.
- **Database**: Supabase for storing user data in the `users` table.
- **Search engine**: Pinecone for vector-based search.
- **AI/ML**: OpenAI GPT-4 for extracting filters and generating embeddings.

### Key Technologies:

- **Supabase**: A fully managed Postgres database with real-time features.
- **Pinecone**: A vector search engine used to store and search embeddings.
- **OpenAI GPT-4**: Used to parse user input and generate embeddings for semantic search.
- **Next.js**: A React framework for building the application and API routes.
- **TypeScript**: For type safety and better code maintainability.

## Setup Instructions

### Prerequisites:

1. **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
2. **Supabase account** (for the database)
   - [Sign up here](https://supabase.io/)
3. **Pinecone account** (for vector search)
   - [Sign up here](https://www.pinecone.io/)
4. **OpenAI API key**
   - [Get API key here](https://platform.openai.com/)

### Steps to Set Up:

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/Anupamti/ai-finder-frontend.git
   cd ai-finder-frontend.

   ```

2. **Install Dependencies**:

   ```bash
   npm install
   # or
   yarn install

   ```

3. **Set Up Environment Variables**:

   ```bash
   (In .env Add the keys below)

   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   PINECONE_API_KEY=your_pinecone_api_key
   OPENAI_API_KEY=your_openai_api_key
   ```

4. **Set Up Supabase**:

   ```bash
   create a table called users with the following columns

   id (UUID)

   name (Text)

   bio (Text)

   profession (Text)

   interests (Array of Text)

   embedding (Vector Embedding from Pinecone)(Optional)

   ```

5. **Set Up Pinecone**:

   - Sign into your Pinecone account and create an index for storing vector embeddings.
   - Use the `text-embedding-3-small model` from OpenAI to generate embeddings for the bios and interests of users in the users table.

6. **Run the Application**:
   ```bash
   npm run dev
   # or
   yarn dev


   ```
