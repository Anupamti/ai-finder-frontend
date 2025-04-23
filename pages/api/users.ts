// pages/api/users.ts
import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../lib/supabase";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("id,name,bio,profession,interests");

    if (error) {
      // Handle any errors from the Supabase query
      return res.status(500).json({ error: error.message });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    // Return the users in the response
    return res.status(200).json({ users: data });
  } catch (error) {
    // Catch any unexpected errors
    console.error("Error fetching users:", error);
    return res
      .status(500)
      .json({ error: "Something went wrong while fetching users." });
  }
};

export default handler;
