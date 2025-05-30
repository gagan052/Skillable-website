import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "./routes/user.route.js";
import gigRoute from "./routes/gig.route.js";
import orderRoute from "./routes/order.route.js";
import conversationRoute from "./routes/conversation.route.js";
import messageRoute from "./routes/message.route.js";
import reviewRoute from "./routes/review.route.js";
import authRoute from "./routes/auth.route.js";
import followRoute from "./routes/follow.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
dotenv.config();
mongoose.set("strictQuery", true);

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("✅ Connected to MongoDB!");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
  }
};

// const connect = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO);
//     console.log("Connected to mongoDB!");
//   } catch (error) {
//     console.log(error);
//   }
// };

// app.use(cors({ origin: "http://localhost:5173", credentials: true }));
const allowedOrigins = [
  "http://localhost:5173", 
  "http://localhost:5175", 
  "https://skillable-gagan.onrender.com",
    "https://skillable-l8gt.onrender.com",
      "https://skillable-gagan-z3vk.onrender.com",

    ];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like curl, postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: "GET, POST, PUT, DELETE, OPTIONS",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));


app.options('*', cors());

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/gigs", gigRoute);
app.use("/api/orders", orderRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);
app.use("/api/reviews", reviewRoute);
app.use("/api/follows", followRoute);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";

  return res.status(errorStatus).send(errorMessage);
});

app.listen(8080, () => {
  connect();
  console.log("Backend server is running! at 8080");
});
