const Calculation = require("../models/Calculation");

// Save calculation
const saveCalculation = async (req, res) => {

    try {

        const { expression, result } = req.body;

        if (
            typeof expression !== "string" ||
            !expression.trim() ||
            typeof result !== "number" ||
            !Number.isFinite(result)
        ) {
            return res.status(400).json({
                message: "Valid expression and numeric result are required"
            });
        }

        const calculation = await Calculation.create({
            expression,
            result
        });

        res.status(201).json({
            message: "Calculation saved successfully",
            calculation
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


// Get calculation history
const getCalculations = async (req, res) => {

    try {

        const calculations = await Calculation.find()
            .sort({ createdAt: -1 });

        res.status(200).json(calculations);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


// Delete one calculation
const deleteCalculation = async (req, res) => {

    try {

        const calculation = await Calculation.findByIdAndDelete(
            req.params.id
        );

        if (!calculation) {
            return res.status(404).json({
                message: "Calculation not found"
            });
        }

        res.status(200).json({
            message: "Calculation deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


// Delete all calculations
const clearHistory = async (req, res) => {

    try {

        await Calculation.deleteMany({});

        res.status(200).json({
            message: "Calculation history cleared"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


module.exports = {
    saveCalculation,
    getCalculations,
    deleteCalculation,
    clearHistory
};