function Display({ value, previousValue }) {
  return (
    <div className="display">
      <div className="previous-value">
        {previousValue}
      </div>

      <div className="current-value">
        {value}
      </div>
    </div>
  );
}

export default Display;