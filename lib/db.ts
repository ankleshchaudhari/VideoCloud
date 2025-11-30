import mongoose from "mongoose";

// Getting the MongoDB connection string from .env file
const MONGODB_URI=process.env.MONGODB_URI!;

// If no MongoDB URL found, stop the server & show error
if(!MONGODB_URI){
    throw new Error("Please define mongodb_uri in env variables");
}

// Global cache so Next.js doesn't create multiple DB connections during hot reload
let cached = global.mongoose

// If cache doesn't exist yet, create it
if(!cached)
{
    cached=global.mongoose={conn:null , promise:null}
}

export async function connectionToDatabase()
{
    // If already connected, return the existing connection
    if(cached.conn)
    {
        return cached.conn
    }

    // If no connection promise exists, create one (Promose : Saves the connection process so you don't reconnect again)
    if(!cached.promise)
    {

        const opts={
            bufferCommands: true, // Mongoose stores commands(i.eany DB operations) before making actual connection
                                 //Without buffering: our queries run too early and fail.
            maxPoolSize:10, // Max number of DB connections
        }

        // Create a new connection promise
        mongoose.connect(MONGODB_URI,opts).then(()=>mongoose.connection)
    }

    try{
        // Wait for the promise to finish → gives us the actual connection
        cached.conn=await cached.promise
    }
    catch(error)
    {
        cached.promise=null;
        throw error;
    }

    //return DB connection
    return cached.conn;
}