import express from "express";
import mongoose from "mongoose";
// import { handleError } from './utils.js';  
import dotenv from 'dotenv';
dotenv.config();


const app = express()


const mongoURI = process.env.MONGO;

const connect = async ()=>{

    mongoose.connect(mongoURI)
    .then(() => console.log('Connected to MongoDB!'))
    .catch((err) => console.error('MongoDB connection error:', err));
}





app.listen(8800 , ()=>{
    connect()
    console.log("Backend server is running!")
})