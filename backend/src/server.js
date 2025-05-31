import cookieParser from 'cookie-parser';
import cors from 'cors';
import "dotenv/config";
import express from 'express';
import authRoutes from './routes/auth.route.js';
import chatRoutes from './routes/chat.route.js';
import userRoutes from './routes/user.route.js';
import path from "path";


// import { connectDB } from './lib/db.js';
import mongoose from 'mongoose';

const app = express();
const PORT = process.env.PORT;

const __dirname = path.resolve();

// Connect to MongoDB
const connectDB = async () =>{
    try {
        await mongoose.connect('mongodb+srv://thorixrover:PacaranKali2@cluster0.oswmlmi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')

        console.log('MongoDB connected succcesfully')
    } catch (error) {
        console.error('MongoDb connection failed:', error);
        process.exit(1);
    }
}
connectDB();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5175"
  ],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// connectDB();
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/chat", chatRoutes)
app.get('/', (_, res) => {
    res.send('API is running!');
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});