import User from "@models/User";
import { connectToDB } from "@mongodb";

export async function GET(req, { params }) {
  try {
    await connectToDB();
    const { query } = params;

    const searchedContacts = await User.find({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    });

    return new Response(JSON.stringify(searchedContacts), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify(searchedContacts), { status: 500 });
  }
}
