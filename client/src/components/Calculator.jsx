import { useState, useEffect } from "react";

import Display from "./Display";
import Button from "./Button";
import History from "./History";

import {
  getCalculations,
  saveCalculation
} from "../services/api";

import "../styles/Calculator.css";

function Calculator() {

  // React States
  const [current, setCurrent] = useState("0");
  const [previous, setPrevious] = useState("");
  const [operator, setOperator] = useState(null);
  const [waiting, setWaiting] = useState(false);
  const [history, setHistory] = useState([]);

  // Fetch history from MongoDB
  useEffect(() => {

    const fetchHistory = async () => {
      try {
        const response = await getCalculations();
        setHistory(response.data);
      } catch (error) {
        console.error("History error:", error.message);
      }
    };

    fetchHistory();

  }, []);

  // Number input
  const handleNumber = (number) => {

    if (waiting || current === "Error") {
      setCurrent(number);
      setWaiting(false);
    } else {
      setCurrent(
        current === "0" ? number : current + number
      );
    }

  };

  // Decimal
  const handleDecimal = () => {

    if (waiting || current === "Error") {
      setCurrent("0.");
      setWaiting(false);
      return;
    }

    if (!current.includes(".")) {
      setCurrent(current + ".");
    }

  };

  // Calculation logic
  const calculate = (first, second, op) => {

    switch (op) {

      case "+":
        return first + second;

      case "-":
        return first - second;

      case "×":
        return first * second;

      case "÷":
        return second === 0 ? "Error" : first / second;

      default:
        return second;

    }

  };

  // Operator handling
  const handleOperator = (nextOperator) => {

    if (current === "Error") return;

    const inputValue = Number(current);

    if (operator && waiting) {
      setOperator(nextOperator);
      return;
    }

    if (operator && previous !== "") {

      const result = calculate(
        Number(previous),
        inputValue,
        operator
      );

      if (result === "Error" || !Number.isFinite(result)) {
        setCurrent("Error");
        setPrevious("");
        setOperator(null);
        setWaiting(true);
        return;
      }

      const formatted = String(
        Number(result.toPrecision(12))
      );

      setCurrent(formatted);
      setPrevious(formatted);

    } else {
      setPrevious(current);
    }

    setOperator(nextOperator);
    setWaiting(true);

  };

  // Save and calculate
  const handleEqual = async () => {

    if (!operator || waiting || current === "Error") return;

    const expression = `${previous} ${operator} ${current}`;

    const result = calculate(
      Number(previous),
      Number(current),
      operator
    );

    if (result === "Error" || !Number.isFinite(result)) {
      setCurrent("Error");
      setPrevious("");
      setOperator(null);
      setWaiting(true);
      return;
    }

    const formatted = Number(result.toPrecision(12));

    setCurrent(String(formatted));
    setPrevious("");
    setOperator(null);
    setWaiting(true);

    // Save calculation to MongoDB
    try {

      await saveCalculation({
        expression,
        result: formatted
      });

      const response = await getCalculations();

      setHistory(response.data);

    } catch (error) {

      console.error("Saving error:", error.message);

    }

  };

  // Clear
  const handleClear = () => {

    setCurrent("0");
    setPrevious("");
    setOperator(null);
    setWaiting(false);

  };

  // Delete
  const handleDelete = () => {

    if (waiting || current === "Error") return;

    setCurrent(
      current.length > 1
        ? current.slice(0, -1)
        : "0"
    );

  };

  // Percentage
  const handlePercentage = () => {

    if (waiting || current === "Error") return;

    setCurrent(String(Number(current) / 100));

  };

  // Positive / Negative
  const handleSign = () => {

    if (current === "0" || current === "Error") return;

    setCurrent(String(Number(current) * -1));

  };

  // Button handler
  const handleClick = (label) => {

    if (/^[0-9]$/.test(label)) {
      handleNumber(label);
    }

    else if (label === ".") {
      handleDecimal();
    }

    else if (["+", "-", "×", "÷"].includes(label)) {
      handleOperator(label);
    }

    else if (label === "=") {
      handleEqual();
    }

    else if (label === "AC") {
      handleClear();
    }

    else if (label === "DEL") {
      handleDelete();
    }

    else if (label === "%") {
      handlePercentage();
    }

    else if (label === "+/-") {
      handleSign();
    }

  };

  // Keyboard support
  useEffect(() => {

    const handleKeyDown = (event) => {

      const key = event.key;

      if (/^[0-9]$/.test(key)) {
        handleClick(key);
      }

      else if (["+", "-"].includes(key)) {
        handleClick(key);
      }

      else if (key === "*") {
        handleClick("×");
      }

      else if (key === "/") {
        event.preventDefault();
        handleClick("÷");
      }

      else if (key === ".") {
        handleClick(".");
      }

      else if (key === "Enter" || key === "=") {
        event.preventDefault();
        handleClick("=");
      }

      else if (key === "Backspace") {
        handleClick("DEL");
      }

      else if (key === "Escape") {
        handleClick("AC");
      }

    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };

  }, [current, previous, operator, waiting]);

  // Calculator buttons
  const buttons = [
    ["AC", "+/-", "%", "÷"],
    ["7", "8", "9", "×"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "+"],
    ["DEL", "0", ".", "="]
  ];

  // UI
  return (

    <div className="calculator">

      <Display
        value={current}
        previousValue={
          previous && operator
            ? `${previous} ${operator}`
            : ""
        }
      />

      <div className="button-grid">

        {buttons.flat().map((label) => {

          let type = "number";

          if (["+", "-", "×", "÷", "="].includes(label)) {
            type = "operator";
          }

          else if (["AC", "DEL", "+/-", "%"].includes(label)) {
            type = "special";
          }

          return (

            <Button
              key={label}
              label={label}
              type={type}
              onClick={handleClick}
            />

          );

        })}

      </div>

      <History history={history} />

    </div>

  );

}

export default Calculator;