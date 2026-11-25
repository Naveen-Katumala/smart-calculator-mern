const express = require("express");

const router = express.Router();

const {
    saveCalculation,
    getCalculations,
    deleteCalculation,
    clearHistory
} = require("../controllers/calculationController");


// POST - Save calculation
router.post("/", saveCalculation);

// GET - Get all calculations
router.get("/", getCalculations);

// DELETE - Delete all calculations
router.delete("/", clearHistory);

// DELETE - Delete one calculation
router.delete("/:id", deleteCalculation);


module.exports = router;