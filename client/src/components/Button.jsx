function Button({ label, onClick, type = "number" }) {
  return (
    <button
      className={`calc-button ${type}`}
      onClick={() => onClick(label)}
    >
      {label}
    </button>
  );
}

export default Button;