import subastaImg from "../../assets/fondo subasta.jpg";

export function Home() {
  return (
    <div className="relative w-full h-screen flex items-center justify-center text-center overflow-hidden font-sans">
      {/* Fondo con overlay de degradado para mejor legibilidad */}
      <div
        className="absolute inset-0 -z-10 bg-black"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url(${subastaImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="px-4 max-w-5xl text-white">
        {/* TÍTULO: Usamos tracking-tighter y un font-black para impacto máximo */}
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4 drop-shadow-2xl leading-none italic uppercase">
          EL GARAJE <br /> 
          <span className="text-secondary">DE TUS SUEÑOS</span>
        </h1>

        {/* SUBTÍTULO: Tracking-widest y peso ligero para contraste elegante */}
        <p className="text-sm md:text-xl text-white/80 mb-10 tracking-[0.2em] uppercase font-light max-w-2xl mx-auto">
          Subastas exclusivas de los vehículos más extraordinarios del mundo.
        </p>
        
        <div className="flex flex-col md:flex-row justify-center gap-6">
          <a
            href="/subastas"
            className="px-10 py-4 bg-primary text-white rounded-sm font-bold shadow-2xl hover:bg-red-700 transition-all duration-300 uppercase tracking-widest text-sm"
          >
            Explorar Lotes
          </a> 
          <a
            href="/registro"
            className="px-10 py-4 border-2 border-white text-white rounded-sm font-bold backdrop-blur-sm hover:bg-white hover:text-black transition-all duration-300 uppercase tracking-widest text-sm"
          >
            Iniciar Sesión / Registrarse
          </a>
        </div>
      </div>
    </div>
  );
}