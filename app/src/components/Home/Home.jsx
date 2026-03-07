import { useEffect, useRef, useState } from "react";
import subastaImg from "../../assets/fondo subasta.jpg";

//Parallax hook
function useParallax(speed = 0.4) {
  const ref = useRef(null);
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2 - window.innerHeight / 2;
      setOffset(center * speed);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [speed]);
  return [ref, offset];
}

//Revela la imagen al hacer scroll
function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

//Paleta
const G = {
  gold: "#C9A84C",
  goldLight: "#E2C97E",
  goldDim: "rgba(201,168,76,0.55)",
  goldGhost: "rgba(201,168,76,0.07)",
  goldBorder: "rgba(201,168,76,0.22)",
  dark: "#080807",
  darkCard: "#0E0D0B",
  white: "#F5F0E8",
  whiteDim: "rgba(245,240,232,0.5)",
};

function CarCard({ car, delay }) {
  const [ref, visible] = useReveal(0.1);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(44px)",
        transition: `opacity 0.9s ease ${delay}s, transform 0.9s ease ${delay}s, border-color 0.4s, box-shadow 0.4s`,
        background: G.darkCard,
        border: `1px solid ${hovered ? G.goldDim : G.goldBorder}`,
        cursor: "pointer",
        overflow: "hidden",
        boxShadow: hovered ? `0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px ${G.goldDim}` : "none",
      }}
    >
      <div style={{ height: 270, overflow: "hidden", position: "relative" }}>
        <div style={{
          height: "100%",
          backgroundImage: `url(${car.img})`,
          backgroundSize: "cover", backgroundPosition: "center",
          transform: hovered ? "scale(1.07)" : "scale(1)",
          transition: "transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94)",
          filter: hovered ? "brightness(1)" : "brightness(0.85)",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(135deg, rgba(201,168,76,0.08), transparent 60%)`,
          opacity: hovered ? 1 : 0, transition: "opacity 0.5s",
        }} />
        <div style={{
          position: "absolute", top: 14, left: 14,
          background: "rgba(8,8,7,0.85)", backdropFilter: "blur(10px)",
          border: `1px solid ${G.goldBorder}`, padding: "4px 14px",
          fontFamily: "'Montserrat', sans-serif", fontWeight: 500,
          fontSize: 9, letterSpacing: "0.3em", color: G.gold, textTransform: "uppercase",
        }}>{car.lot}</div>
        <div style={{
          position: "absolute", top: 14, right: 14,
          background: "rgba(8,8,7,0.7)", backdropFilter: "blur(10px)",
          border: `1px solid ${G.goldBorder}`, padding: "4px 10px",
          fontFamily: "'Montserrat', sans-serif", fontWeight: 300,
          fontSize: 8, letterSpacing: "0.2em", color: G.whiteDim, textTransform: "uppercase",
        }}>{car.date}</div>
      </div>
      <div style={{ padding: "22px 24px 26px" }}>
        <p style={{
          fontFamily: "'Montserrat', sans-serif", fontWeight: 300, fontSize: 10,
          letterSpacing: "0.3em", color: G.gold, textTransform: "uppercase", margin: "0 0 6px"
        }}>
          {car.year} · {car.origin}
        </p>
        <h3 style={{
          fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 400,
          fontStyle: "italic", color: G.white, margin: "0 0 18px", lineHeight: 1.15
        }}>{car.name}</h3>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          borderTop: `1px solid ${G.goldBorder}`, paddingTop: 16
        }}>
          <div>
            <p style={{
              fontFamily: "'Montserrat', sans-serif", fontWeight: 300, fontSize: 9,
              letterSpacing: "0.25em", color: G.whiteDim, textTransform: "uppercase", margin: "0 0 4px"
            }}>Estimado</p>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif", fontSize: 20,
              color: G.gold, margin: 0, fontWeight: 500
            }}>{car.estimate}</p>
          </div>
          <div style={{
            width: 38, height: 38,
            border: `1px solid ${hovered ? G.gold : G.goldBorder}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: hovered ? G.gold : G.whiteDim, fontSize: 15,
            transform: hovered ? "translateX(3px)" : "translateX(0)",
            transition: "all 0.35s",
          }}>→</div>
        </div>
      </div>
    </div>
  );
}

//Parallax Divider
function ParallaxDivider() {
  const [ref, offset] = useParallax(0.28);
  const [textRef, visible] = useReveal(0.2);
  return (
    <section ref={ref} style={{ position: "relative", height: "70vh", overflow: "hidden" }}>
      <div style={{
        position: "absolute", inset: "-20%",
        backgroundImage: `url(https://images.unsplash.com/photo-1547245324-d777c6f05e80?w=1600&q=85)`,
        backgroundSize: "cover", backgroundPosition: "center",
        transform: `translateY(${offset}px)`,
        transition: "transform 0.05s linear", willChange: "transform",
        filter: "brightness(0.22) saturate(0.4)",
      }} />
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(105deg, rgba(8,8,7,0.92) 0%, rgba(8,8,7,0.5) 55%, rgba(8,8,7,0.82) 100%)` }} />
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(115deg, transparent 48%, rgba(201,168,76,0.06) 48.1%, transparent 66%)`, pointerEvents: "none" }} />
      <div ref={textRef} style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "0 8% 0 10%",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateX(-44px)",
        transition: "opacity 1.1s ease, transform 1.1s ease",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 22 }}>
          <div style={{ width: 40, height: 1, background: G.gold }} />
          <span style={{
            fontFamily: "'Montserrat', sans-serif", fontWeight: 300,
            fontSize: 9, letterSpacing: "0.4em", color: G.gold, textTransform: "uppercase"
          }}>
            Consigna tu vehículo
          </span>
        </div>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(40px,5.5vw,84px)", fontWeight: 300, lineHeight: 1.05,
          maxWidth: 620, margin: "0 0 24px", color: G.white
        }}>
          ¿Tienes un auto <br />
          <em style={{ color: G.gold }}>extraordinario</em> <br />
          para vender?
        </h2>
        <p style={{
          fontFamily: "'Montserrat', sans-serif", fontWeight: 300,
          fontSize: 12, color: G.whiteDim, lineHeight: 1.9, maxWidth: 380, marginBottom: 36
        }}>
          Nuestros especialistas evalúan tu vehículo y lo posicionan ante los mejores compradores del mundo.
        </p>
        <a href="/consignar" style={{
          alignSelf: "flex-start",
          fontFamily: "'Montserrat', sans-serif", fontWeight: 400,
          fontSize: 9, letterSpacing: "0.35em", textTransform: "uppercase",
          color: G.white, textDecoration: "none",
          border: `1px solid ${G.goldBorder}`, padding: "14px 44px",
          transition: "all 0.35s",
        }}
          onMouseEnter={e => { e.target.style.background = G.gold; e.target.style.color = G.dark; e.target.style.borderColor = G.gold; }}
          onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.color = G.white; e.target.style.borderColor = G.goldBorder; }}
        >Solicitar Tasación</a>
      </div>
    </section>
  );
}


// Home
export function Home() {
  const [heroRef, heroOffset] = useParallax(0.45);
  const [loaded, setLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [statsRef, statsVisible] = useReveal(0.2);
  const [lotsRef, lotsVisible] = useReveal(0.1);
  const [ctaRef, ctaVisible] = useReveal(0.2);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80);
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { clearTimeout(t); window.removeEventListener("scroll", onScroll); };
  }, []);

  const navScrolled = scrollY > 60;

  const lots = [
    { img: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80", name: "Ferrari 250 GTO", year: "1962", origin: "Italia", estimate: "$48,000,000", lot: "LOT 001", date: "15 Abr" },
    { img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80", name: "Porsche 917K", year: "1970", origin: "Alemania", estimate: "$14,500,000", lot: "LOT 002", date: "15 Abr" },
    { img: "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800&q=80", name: "Lamborghini Miura SV", year: "1971", origin: "Italia", estimate: "$3,200,000", lot: "LOT 003", date: "22 Abr" },
  ];

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Montserrat:wght@200;300;400;500&display=swap" rel="stylesheet" />

      <div style={{ background: G.dark, color: G.white, fontFamily: "'Montserrat', sans-serif", overflowX: "hidden" }}>


        {/* Imagen o parte de inicio que ve el usuario, portada */}
        <section ref={heroRef} style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden" }}>
          <div style={{
            position: "absolute", inset: "-25%",
            backgroundImage: `url(${subastaImg})`,
            backgroundSize: "cover", backgroundPosition: "center",
            transform: `translateY(${heroOffset}px)`,
            transition: "transform 0.05s linear", willChange: "transform",
            filter: "brightness(0.4) saturate(0.65)",
          }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(110deg, rgba(8,8,7,0.9) 0%, rgba(8,8,7,0.28) 55%, rgba(8,8,7,0.65) 100%)" }} />
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: `linear-gradient(120deg, transparent 42%, rgba(201,168,76,0.06) 42.1%, transparent 62%)` }} />
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: `linear-gradient(to top, ${G.dark} 0%, transparent 35%)` }} />

          {/* Annio */}
          <div style={{
            position: "absolute", right: "4%", bottom: "6%",
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(100px,16vw,210px)", fontWeight: 300, fontStyle: "italic",
            color: "transparent", WebkitTextStroke: `1px rgba(201,168,76,0.07)`,
            lineHeight: 1, pointerEvents: "none", userSelect: "none",
          }}>2025</div>

          {/* Label del lado izquierdo del inicio*/}
          <div style={{
            position: "absolute", left: 24, top: "50%",
            transform: "translateY(-50%) rotate(-90deg)",
            fontFamily: "'Montserrat', sans-serif", fontWeight: 300,
            fontSize: 8, letterSpacing: "0.4em", color: G.goldDim,
            textTransform: "uppercase", whiteSpace: "nowrap",
          }}>Est. 2009 · Subastas Exclusivas</div>

          {/* Contenido */}
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 8% 0 10%" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 14, marginBottom: 28,
              opacity: loaded ? 1 : 0,
              transform: loaded ? "translateY(0)" : "translateY(18px)",
              transition: "opacity 0.9s ease 0.1s, transform 0.9s ease 0.1s",
            }}>
              <div style={{ width: 36, height: 1, background: G.gold }} />
              <span style={{ fontSize: 8, fontWeight: 400, letterSpacing: "0.45em", color: G.gold, textTransform: "uppercase" }}>
                Subasta Primavera · 15 de Abril, 2025
              </span>
              <span style={{
                width: 6, height: 6, borderRadius: "50%", background: G.gold,
                boxShadow: `0 0 10px ${G.gold}`, animation: "glow 2s infinite"
              }} />
            </div>

            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(60px, 9.5vw, 136px)", fontWeight: 300, lineHeight: 0.9,
              margin: "0 0 6px",
              opacity: loaded ? 1 : 0,
              transform: loaded ? "translateX(0)" : "translateX(-36px)",
              transition: "opacity 1.1s ease 0.25s, transform 1.1s ease 0.25s",
            }}>
              <em>El Garaje</em>
              <br />
              <span style={{
                fontWeight: 300, fontStyle: "normal", fontSize: "0.52em", letterSpacing: "0.18em",
                color: "transparent", WebkitTextStroke: `1px rgba(245,240,232,0.18)`, textTransform: "uppercase",
              }}>De Tus</span>
              <br />
              <span style={{ color: G.gold, fontStyle: "italic" }}>Sueños</span>
            </h1>

            <div style={{
              display: "flex", alignItems: "center", gap: 16, margin: "28px 0",
              opacity: loaded ? 1 : 0, transition: "opacity 0.9s ease 0.55s",
            }}>
              <div style={{ width: 60, height: 1, background: `linear-gradient(to right, ${G.gold}, transparent)` }} />
              <div style={{ width: 5, height: 5, border: `1px solid ${G.gold}`, transform: "rotate(45deg)" }} />
            </div>

            <p style={{
              fontFamily: "'Montserrat', sans-serif", fontWeight: 200,
              fontSize: 12, letterSpacing: "0.22em", color: G.whiteDim,
              textTransform: "uppercase", maxWidth: 440, lineHeight: 1.9, margin: "0 0 44px",
              opacity: loaded ? 1 : 0,
              transform: loaded ? "translateY(0)" : "translateY(18px)",
              transition: "opacity 0.9s ease 0.6s, transform 0.9s ease 0.6s",
            }}>
              Subastas exclusivas de los vehículos más extraordinarios del mundo.
            </p>

            <div style={{
              display: "flex", gap: 16,
              opacity: loaded ? 1 : 0,
              transform: loaded ? "translateY(0)" : "translateY(18px)",
              transition: "opacity 0.9s ease 0.8s, transform 0.9s ease 0.8s",
            }}>
              <a href="/subastas" style={{
                padding: "15px 48px", background: G.gold, color: G.dark,
                fontFamily: "'Montserrat', sans-serif", fontWeight: 500,
                fontSize: 9, letterSpacing: "0.35em", textTransform: "uppercase", textDecoration: "none",
                transition: "all 0.35s",
              }}
                onMouseEnter={e => { e.target.style.background = G.goldLight; e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = `0 12px 40px rgba(201,168,76,0.3)`; }}
                onMouseLeave={e => { e.target.style.background = G.gold; e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "none"; }}
              >Explorar Lotes</a>
              <a href="/registro" style={{
                padding: "15px 48px", background: "transparent",
                border: `1px solid rgba(245,240,232,0.22)`,
                color: G.white, fontFamily: "'Montserrat', sans-serif",
                fontWeight: 300, fontSize: 9, letterSpacing: "0.35em",
                textTransform: "uppercase", textDecoration: "none", transition: "all 0.35s",
              }}
                onMouseEnter={e => { e.target.style.borderColor = G.gold; e.target.style.color = G.gold; }}
                onMouseLeave={e => { e.target.style.borderColor = "rgba(245,240,232,0.22)"; e.target.style.color = G.white; }}
              >Iniciar Sesión / Registrarse</a>
            </div>
          </div>

          {/* Indicador de hacer scroll*/}
          <div style={{
            position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
            opacity: loaded ? 1 : 0, transition: "opacity 1.2s ease 1.4s",
          }}>
            <span style={{ fontSize: 7, fontWeight: 300, letterSpacing: "0.4em", color: G.goldDim, textTransform: "uppercase" }}>Scroll</span>
            <div style={{ width: 1, height: 52, background: `linear-gradient(to bottom, ${G.gold}, transparent)`, animation: "scrollDrop 2.2s ease-in-out infinite" }} />
          </div>
        </section>

        {/* Barra con porcentajes o datos */}
        <div ref={statsRef} style={{
          borderTop: `1px solid ${G.goldBorder}`, borderBottom: `1px solid ${G.goldBorder}`,
          padding: "38px 40px", background: G.goldGhost,
          opacity: statsVisible ? 1 : 0,
          transform: statsVisible ? "translateY(0)" : "translateY(28px)",
          transition: "opacity 0.9s ease, transform 0.9s ease",
        }}>
          <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", justifyContent: "space-around" }}>
            {[
              { val: "2,400+", lbl: "Vehículos Subastados" },
              { val: "$890M", lbl: "Volumen Total" },
              { val: "15 Años", lbl: "De Experiencia" },
              { val: "98%", lbl: "Tasa de Venta" },
            ].map(({ val, lbl }, i) => (
              <div key={lbl} style={{
                textAlign: "center",
                borderRight: i < 3 ? `1px solid ${G.goldBorder}` : "none",
                padding: "0 40px",
                opacity: statsVisible ? 1 : 0,
                transform: statsVisible ? "translateY(0)" : "translateY(20px)",
                transition: `opacity 0.8s ease ${i * 0.1}s, transform 0.8s ease ${i * 0.1}s`,
              }}>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 38, fontWeight: 400, color: G.gold, margin: "0 0 6px" }}>{val}</p>
                <p style={{ fontSize: 8, fontWeight: 300, letterSpacing: "0.3em", color: G.whiteDim, textTransform: "uppercase", margin: 0 }}>{lbl}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tarjetas de objetos a subastar*/}
        <section style={{ padding: "100px 60px" }}>
          <div ref={lotsRef} style={{
            display: "flex", justifyContent: "space-between", alignItems: "flex-end",
            marginBottom: 56,
            opacity: lotsVisible ? 1 : 0,
            transform: lotsVisible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.9s ease, transform 0.9s ease",
          }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <div style={{ width: 28, height: 1, background: G.gold }} />
                <span style={{ fontSize: 8, fontWeight: 400, letterSpacing: "0.4em", color: G.gold, textTransform: "uppercase" }}>Próxima Subasta</span>
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(36px,5vw,68px)", fontWeight: 300, margin: 0, lineHeight: 1 }}>
                Lotes <em style={{ color: G.gold }}>Estelares</em>
              </h2>
            </div>
            <a href="/subastas" style={{
              fontSize: 8, fontWeight: 300, letterSpacing: "0.3em", color: G.whiteDim,
              textDecoration: "none", textTransform: "uppercase",
              borderBottom: `1px solid ${G.goldBorder}`, paddingBottom: 4, transition: "color 0.3s, border-color 0.3s",
            }}
              onMouseEnter={e => { e.target.style.color = G.gold; e.target.style.borderColor = G.gold; }}
              onMouseLeave={e => { e.target.style.color = G.whiteDim; e.target.style.borderColor = G.goldBorder; }}
            >Ver catálogo completo →</a>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 3 }}>
            {lots.map((car, i) => <CarCard key={car.lot} car={car} delay={i * 0.13} />)}
          </div>
        </section>

        {/* Para que al hacer scroll en la imagen del suzuki se separe del contenido de lotes o tarjetas */}
        <ParallaxDivider />

        {/*Mensaje para el usuario */}
        <section ref={ctaRef} style={{
          padding: "120px 40px", textAlign: "center",
          opacity: ctaVisible ? 1 : 0,
          transform: ctaVisible ? "translateY(0)" : "translateY(36px)",
          transition: "opacity 1s ease, transform 1s ease",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, marginBottom: 24 }}>
            <div style={{ width: 50, height: 1, background: `linear-gradient(to right, transparent, ${G.gold})` }} />
            <div style={{ width: 6, height: 6, border: `1px solid ${G.gold}`, transform: "rotate(45deg)" }} />
            <div style={{ width: 50, height: 1, background: `linear-gradient(to left, transparent, ${G.gold})` }} />
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(42px,6.5vw,96px)", fontWeight: 300, lineHeight: 1, margin: "0 0 20px" }}>
            Tu próxima <em style={{ color: G.gold }}>adquisición</em>
            <br />te espera
          </h2>
          <p style={{
            fontSize: 10, fontWeight: 300, letterSpacing: "0.22em", color: G.whiteDim,
            textTransform: "uppercase", maxWidth: 380, margin: "0 auto 48px"
          }}>
            Accede al catálogo completo y participa en subastas en tiempo real
          </p>
          <a href="/registro" style={{
            display: "inline-block", padding: "16px 60px",
            background: G.gold, color: G.dark,
            fontFamily: "'Montserrat', sans-serif", fontWeight: 500,
            fontSize: 9, letterSpacing: "0.38em", textTransform: "uppercase", textDecoration: "none",
            transition: "all 0.35s",
          }}
            onMouseEnter={e => { e.target.style.background = G.goldLight; e.target.style.transform = "translateY(-3px)"; e.target.style.boxShadow = `0 16px 50px rgba(201,168,76,0.35)`; }}
            onMouseLeave={e => { e.target.style.background = G.gold; e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "none"; }}
          >Crear Cuenta Gratuita</a>
        </section>

        <style>{`
        @keyframes scrollDrop {
        0%   { transform: scaleY(0); transform-origin: top; opacity: 1; }
        60%  { transform: scaleY(1); transform-origin: top; }
        100% { transform: scaleY(1); transform-origin: bottom; opacity: 0; }
        }
        @keyframes glow {
        0%, 100% { opacity: 1; box-shadow: 0 0 10px #C9A84C; }
        50%       { opacity: 0.5; box-shadow: 0 0 4px #C9A84C; }
        }
        * { box-sizing: border-box; }
        html, body { overflow-x: hidden; max-width: 100%; }
`}</style>
      </div>
    </>
  );
}