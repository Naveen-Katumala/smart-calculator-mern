import Calculator from "../components/Calculator";

function Home() {
  return (
    <main className="home">
      <h1>Smart Calculator</h1>

      <Calculator />

      <p style={{ marginTop: "25px", color: "#94a3b8" }}>
        Simple • Smart • Powerful
      </p>
    </main>
  );
}

export default Home;