const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Koneksi ke MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => console.log("Connected to MongoDB"));

// Model Buku
const BookSchema = new mongoose.Schema({
    title: String,
    author: String,
    year: Number,
});

const Book = mongoose.model("Book", BookSchema);

// Routes
app.get("/", (req, res) => {
    res.send("Welcome to API Buku 📚");
});

// Tambah Buku
app.post("/books", async (req, res) => {
    try {
        const { title, author, year } = req.body;
        const newBook = new Book({ title, author, year });
        await newBook.save();
        res.status(201).json(newBook);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ambil Semua Buku
app.get("/books", async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Hapus Buku
app.delete("/books/:id", async (req, res) => {
    try {
        await Book.findByIdAndDelete(req.params.id);
        res.json({ message: "Buku berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Jalankan Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
