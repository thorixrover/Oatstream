import { generateStreamToken } from "../lib/stream.js";

export async function getStreamToken(req, res) {
    try {
        const userId = req.user.id; // Ambil ID dari user yang sudah login
        const token = generateStreamToken(userId); // Kirim id ke fungsi token

        res.status(200).json({ token });
    } catch (error) {
        console.log("Error in getStreamToken Controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
