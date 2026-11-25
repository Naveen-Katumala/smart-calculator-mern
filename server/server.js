const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const calculationRoutes = require("./routes/calculationRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
    res.send("Smart Calculator Backend is Running!");
});

// Calculation routes
app.use("/api/calculations", calculationRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {

    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });

};

startServer();