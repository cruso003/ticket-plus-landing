import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://sir-george2500:Luther100@cluster0.5khj47c.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { name, email, role } = body;

    // Validate input
    if (!name || !email || !role) {
      return new Response(JSON.stringify({ message: 'All fields are required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const client = new MongoClient(uri);
    await client.connect();
    const database = client.db('ticketplus-landing');
    const collection = database.collection('testers');

    await collection.insertOne({ name, email, role, createdAt: new Date() });
    await client.close();

    return new Response(JSON.stringify({ message: 'Successfully created user' }), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Database connection error:', error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};

