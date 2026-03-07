export function Footer() {
  return (
    <footer className="fixed bottom-0 w-full bg-black/90 backdrop-blur-md border-t text-white flex items-center justify-center px-6"
      style={{
        height: 56,
        borderColor: "rgba(201,168,76,0.2)",
        fontFamily: "'Montserrat', sans-serif",
      }}
    >
      <div className="w-full max-w-7xl flex items-center justify-between">

        {/* Izquierda — marca */}
        <div className="flex items-center gap-3">
          {/* Diamond micrologo */}
          <div style={{
            width: 18, height: 18,
            border: "1px solid rgba(201,168,76,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <div style={{ width: 6, height: 6, background: "#C9A84C", transform: "rotate(45deg)" }} />
          </div>
          <p style={{
            margin: 0, fontSize: 9, fontWeight: 400,
            letterSpacing: "0.35em", textTransform: "uppercase",
            color: "rgba(245,240,232,0.7)",
          }}>
            El Garaje
            <span style={{ margin: "0 10px", color: "rgba(201,168,76,0.4)" }}>·</span>
            <span style={{ color: "rgba(201,168,76,0.7)", fontWeight: 300 }}>Luxury Auto Auctions</span>
          </p>
        </div>

        {/* Centro línea decorativa */}
        <div className="hidden md:flex items-center gap-3 flex-1 mx-8" style={{ maxWidth: 200 }}>
          <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, rgba(201,168,76,0.25))" }} />
          <div style={{ width: 4, height: 4, border: "1px solid rgba(201,168,76,0.35)", transform: "rotate(45deg)", flexShrink: 0 }} />
          <div style={{ flex: 1, height: 1, background: "linear-gradient(to left, transparent, rgba(201,168,76,0.25))" }} />
        </div>

        {/* Derecha el copyright */}
        <p style={{
          margin: 0, fontSize: 8, fontWeight: 300,
          letterSpacing: "0.25em", textTransform: "uppercase",
          color: "rgba(245,240,232,0.3)",
        }}>
          &copy; {new Date().getFullYear()} Exclusive Motors Group
          <span style={{ margin: "0 8px", color: "rgba(201,168,76,0.3)" }}>|</span>
          <span style={{ color: "rgba(201,168,76,0.35)" }}>ISW-613</span>
        </p>

      </div>
    </footer>
  );
}