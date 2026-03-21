import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Layers,
  ChartArea,
  LogIn,
  UserPlus,
  LogOut,
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
  User,
  UsersRound,
  Gavel,
  CarFront,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
} from "@/components/ui/menubar";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";

//Paleta dorada 
const G = {
  gold:       "#C9A84C",
  goldLight:  "#E2C97E",
  goldDim:    "rgba(201,168,76,0.55)",
  goldGhost:  "rgba(201,168,76,0.07)",
  goldBorder: "rgba(201,168,76,0.22)",
  dark:       "#080807",
  white:      "#F5F0E8",
  whiteDim:   "rgba(245,240,232,0.55)",
};

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled,   setScrolled]   = useState(false);
  const userEmail = "Invitado";

  // Detectar scroll para cambiar fondo del header
  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      setScrolled(window.scrollY > 60);
    }, { passive: true });
  }

  const navItems = [
    { title: "Ver Subastas", href: "/subastas", icon: <ShieldCheck className="h-4 w-4" /> },
  ];

  const mantItems = [
    { title: "Listar Usuarios",       href: "/user/table",    icon: <UsersRound className="h-4 w-4" /> },
    { title: "Listado de Objetos",    href: "/objeto/listado",icon: <CarFront   className="h-4 w-4" /> },
    { title: "Gráfico de Alquileres", href: "/rental/graph",  icon: <ChartArea  className="h-4 w-4" /> },
  ];
  const mantenimientoItems = [
  { title: "Mantenimiento de Subastas", href: "/mantenimiento/subastas", icon: <Gavel className="h-4 w-4" /> },
  ];

  const userItems = [
    { title: "Login",       href: "/user/login",   icon: <LogIn    className="h-4 w-4" /> },
    { title: "Registrarse", href: "/user/create",  icon: <UserPlus className="h-4 w-4" /> },
    { title: "Logout",      href: "#login",        icon: <LogOut   className="h-4 w-4" /> },
  ];

  //Estilos reutilizables
  const triggerStyle = {
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: 300,
    fontSize: 10,
    letterSpacing: "0.25em",
    textTransform: "uppercase",
    color: G.whiteDim,
    background: "transparent",
    border: "none",
    cursor: "pointer",
    display: "flex", alignItems: "center", gap: 6,
    padding: "4px 0",
    transition: "color 0.3s",
  };

  const dropdownStyle = {
    background: "rgba(8,8,7,0.97)",
    backdropFilter: "blur(20px)",
    border: `1px solid ${G.goldBorder}`,
    borderRadius: 0,
    padding: "6px 0",
    minWidth: 200,
  };

  const dropItemStyle = {
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: 300,
    fontSize: 10,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: G.whiteDim,
    display: "flex", alignItems: "center", gap: 10,
    padding: "10px 20px",
    textDecoration: "none",
    transition: "color 0.25s, background 0.25s",
    borderBottom: `1px solid rgba(201,168,76,0.06)`,
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500&family=Montserrat:wght@200;300;400;500&display=swap" rel="stylesheet" />

      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        height: 72,
        display: "flex", alignItems: "center",
        padding: "0 40px",
        background: scrolled ? "rgba(8,8,7,0.97)" : "rgba(8,8,7,0.6)",
        borderBottom: `1px solid ${scrolled ? G.goldBorder : "transparent"}`,
        backdropFilter: "blur(18px)",
        transition: "background 0.5s, border-color 0.5s",
      }}>

        {/* Logo*/}
        <Link to="/" style={{
          display: "flex", alignItems: "center", gap: 12,
          textDecoration: "none", flexShrink: 0,
        }}>
          {/* Diamond icono */}
          <div style={{
            width: 32, height: 32,
            border: `1px solid ${G.gold}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <div style={{ width: 10, height: 10, background: G.gold, transform: "rotate(45deg)" }} />
          </div>
          <div className="hidden sm:block">
            <p style={{ margin: 0, fontFamily: "'Montserrat', sans-serif", fontWeight: 400,
              fontSize: 13, letterSpacing: "0.28em", textTransform: "uppercase", color: G.white }}>
              El Garaje
            </p>
            <p style={{ margin: 0, fontFamily: "'Montserrat', sans-serif", fontWeight: 300,
              fontSize: 7, letterSpacing: "0.3em", textTransform: "uppercase", color: G.gold }}>
              Subastas de Lujo
            </p>
          </div>
        </Link>

        {/* Nav */}
        <div className="hidden md:flex flex-1 justify-center">
          <Menubar className="bg-transparent border-none shadow-none space-x-2">

            {/* Subastas */}
            <MenubarMenu>
              <MenubarTrigger style={triggerStyle}
                onMouseEnter={e => e.currentTarget.style.color = G.gold}
                onMouseLeave={e => e.currentTarget.style.color = G.whiteDim}
              >
                <Gavel className="h-3 w-3" style={{ color: G.gold }} />
                Subastas
                <ChevronDown className="h-3 w-3" />
              </MenubarTrigger>
              <MenubarContent style={dropdownStyle}>
                {navItems.map(item => (
                  <MenubarItem key={item.href} asChild>
                    <Link to={item.href} style={dropItemStyle}
                      onMouseEnter={e => { e.currentTarget.style.color = G.gold; e.currentTarget.style.background = G.goldGhost; }}
                      onMouseLeave={e => { e.currentTarget.style.color = G.whiteDim; e.currentTarget.style.background = "transparent"; }}
                    >
                      <span style={{ color: G.gold }}>{item.icon}</span>
                      {item.title}
                    </Link>
                  </MenubarItem>
                ))}
              </MenubarContent>
            </MenubarMenu>
            {/* Usuarios */}
            <MenubarMenu>
              <MenubarTrigger style={triggerStyle}
                onMouseEnter={e => e.currentTarget.style.color = G.gold}
                onMouseLeave={e => e.currentTarget.style.color = G.whiteDim}
              >
                <Layers className="h-3 w-3" style={{ color: G.gold }} />
                Administrar
                <ChevronDown className="h-3 w-3" />
              </MenubarTrigger>
              <MenubarContent style={dropdownStyle}>
                {mantItems.map(item => (
                  <MenubarItem key={item.href} asChild>
                    <Link to={item.href} style={dropItemStyle}
                      onMouseEnter={e => { e.currentTarget.style.color = G.gold; e.currentTarget.style.background = G.goldGhost; }}
                      onMouseLeave={e => { e.currentTarget.style.color = G.whiteDim; e.currentTarget.style.background = "transparent"; }}
                    >
                      <span style={{ color: G.gold }}>{item.icon}</span>
                      {item.title}
                    </Link>
                  </MenubarItem>
                ))}
              </MenubarContent>
            </MenubarMenu>

            {/* Usuario */}
            <MenubarMenu>
              <MenubarTrigger style={triggerStyle}
                onMouseEnter={e => e.currentTarget.style.color = G.gold}
                onMouseLeave={e => e.currentTarget.style.color = G.whiteDim}
              >
                <User className="h-3 w-3" style={{ color: G.gold }} />
                {userEmail}
                <ChevronDown className="h-3 w-3" />
              </MenubarTrigger>
              <MenubarContent style={dropdownStyle}>
                {userItems.map(item => (
                  <MenubarItem key={item.href} asChild>
                    <Link to={item.href} style={dropItemStyle}
                      onMouseEnter={e => { e.currentTarget.style.color = G.gold; e.currentTarget.style.background = G.goldGhost; }}
                      onMouseLeave={e => { e.currentTarget.style.color = G.whiteDim; e.currentTarget.style.background = "transparent"; }}
                    >
                      <span style={{ color: G.gold }}>{item.icon}</span>
                      {item.title}
                    </Link>
                  </MenubarItem>
                ))}
              </MenubarContent>
            </MenubarMenu>

          </Menubar>
        </div>

        {/* Carrito*/}
        <div className="flex items-center gap-5 ml-auto md:ml-0">
          <Link to="/cart" style={{ position: "relative", color: G.whiteDim, transition: "color 0.3s" }}
            onMouseEnter={e => e.currentTarget.style.color = G.gold}
            onMouseLeave={e => e.currentTarget.style.color = G.whiteDim}
          >
            <ShoppingCart className="h-5 w-5" />
            <span style={{
              position: "absolute", top: -8, right: -10,
              background: G.gold, color: G.dark,
              fontSize: 9, fontWeight: 600, fontFamily: "'Montserrat', sans-serif",
              width: 18, height: 18, borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>3</span>
          </Link>

          {/* Bottn de registro*/}
          <Link to="/user/create" className="hidden md:inline-flex" style={{
            fontFamily: "'Montserrat', sans-serif", fontWeight: 400,
            fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase",
            textDecoration: "none", color: G.dark, background: G.gold,
            padding: "9px 24px", transition: "background 0.3s",
          }}
            onMouseEnter={e => e.target.style.background = G.goldLight}
            onMouseLeave={e => e.target.style.background = G.gold}
          >Registrarse</Link>

          {/* Hamburguesa movil */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          

            <SheetContent side="left" style={{
              background: "rgba(8,8,7,0.98)", backdropFilter: "blur(20px)",
              borderRight: `1px solid ${G.goldBorder}`,
              width: 280, padding: 0,
            }}>
              <nav style={{ padding: "32px 28px", display: "flex", flexDirection: "column", gap: 32 }}>

                {/* Logo movil */}
                <Link to="/" onClick={() => setMobileOpen(false)} style={{
                  display: "flex", alignItems: "center", gap: 10, textDecoration: "none",
                }}>
                  <div style={{ width: 26, height: 26, border: `1px solid ${G.gold}`,
                    display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: 8, height: 8, background: G.gold, transform: "rotate(45deg)" }} />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontFamily: "'Montserrat', sans-serif", fontWeight: 400,
                      fontSize: 12, letterSpacing: "0.28em", textTransform: "uppercase", color: G.white }}>El Garaje</p>
                    <p style={{ margin: 0, fontFamily: "'Montserrat', sans-serif", fontWeight: 300,
                      fontSize: 7, letterSpacing: "0.25em", textTransform: "uppercase", color: G.gold }}>Subastas de Lujo</p>
                  </div>
                </Link>

                {/* Grupos */}
                {[
                  { title: "Subastas",    icon: <Gavel   className="h-3 w-3" />, items: navItems  },
                  { title: "Administrar", icon: <Layers  className="h-3 w-3" />, items: mantItems },
                  { title: userEmail,     icon: <User    className="h-3 w-3" />, items: userItems },
                ].map(group => (
                  <div key={group.title}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                      <span style={{ color: G.gold }}>{group.icon}</span>
                      <p style={{ margin: 0, fontFamily: "'Montserrat', sans-serif", fontWeight: 400,
                        fontSize: 8, letterSpacing: "0.4em", textTransform: "uppercase", color: G.gold }}>
                        {group.title}
                      </p>
                    </div>
                    {group.items.map(item => (
                      <Link key={item.href} to={item.href} onClick={() => setMobileOpen(false)} style={{
                        display: "flex", alignItems: "center", gap: 10,
                        padding: "10px 12px",
                        fontFamily: "'Montserrat', sans-serif", fontWeight: 300,
                        fontSize: 10, letterSpacing: "0.18em",
                        textTransform: "uppercase", textDecoration: "none",
                        color: G.whiteDim,
                        borderBottom: `1px solid rgba(201,168,76,0.06)`,
                        transition: "color 0.25s",
                      }}
                        onMouseEnter={e => e.currentTarget.style.color = G.gold}
                        onMouseLeave={e => e.currentTarget.style.color = G.whiteDim}
                      >
                        <span style={{ color: G.gold, opacity: 0.7 }}>{item.icon}</span>
                        {item.title}
                      </Link>
                    ))}
                  </div>
                ))}

              </nav>
            </SheetContent>
          </Sheet>
        </div>

      </header>
    </>
  );
}