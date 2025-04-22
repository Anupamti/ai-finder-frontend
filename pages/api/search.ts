export default async function handler(req, res) {
  const { query } = req.body;

  // Simulate backend response
  const fakeResults = [
    {
      name: "Lana D.",
      bio: "Artist + deep thinker. Loves slow jazz and writes essays on consciousness.",
      score: 0.92,
      reason: "Shares love of jazz and introspective vibe like Naval.",
    },
    {
      name: "Eli M.",
      bio: "Startup founder, meditates daily, into Stoicism and saxophone.",
      score: 0.88,
      reason: "Stoic thinker + jazz lover = perfect match.",
    },
  ];

  res.status(200).json({ matches: fakeResults });
}
