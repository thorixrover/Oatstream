import { StreamChat } from 'stream-chat';
import "dotenv/config";

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
    console.error("Stream API Key and Secret are required.");
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async (user) => {
    try {
        console.log("Creating Stream user:", user);  // Debug
        await streamClient.upsertUsers([user]);
        return user;
    } catch (error) {
        console.error("Error upserting Stream user:", error);
    }
};


// todo: do it later
export const generateStreamToken = (userId) => {
    try {
        // Ensure userId is a string
        const userIdStr = userId.toString();
        return streamClient.createToken(userIdStr);
    } catch (error) {
        console.error("Error generating Stream token:", error);
    }
};
