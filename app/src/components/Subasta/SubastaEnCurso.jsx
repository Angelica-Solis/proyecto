import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Crown, Clock, TrendingUp, User, Gavel, ChevronLeft, ChevronRight, History } from "lucide-react";
import subastaService from "@/services/SubastaService";
import pujaService from "@/services/PujaService";
import { toast } from "sonner";
import Pusher from "pusher-js";

const fmt = (n) =>
    new Intl.NumberFormat("es-CR", { style: "currency", currency: "CRC", maximumFractionDigits: 0 }).format(n);

function GoldDivider() {
    return (
        <div className="flex items-center gap-3 my-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#C9A84C]/50 to-transparent" />
            <div className="w-1.5 h-1.5 rotate-45 bg-[#C9A84C]/60" />
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#C9A84C]/50 to-transparent" />
        </div>
    );
}

function SectionLabel({ children }) {
    return (
        <p className="text-[10px] tracking-[0.28em] text-[#C9A84C]/70 uppercase font-semibold mb-1">
            {children}
        </p>
    );
}

function Gallery({ imagenes }) {
    const [current, setCurrent] = useState(0);
    if (!imagenes || imagenes.length === 0) return null;

    return (
        <div className="relative overflow-hidden bg-[#111008]" style={{ aspectRatio: "16/9" }}>
            <img
                src={`http://127.0.0.1:81/proyecto/api/uploads/${imagenes[current].nombreImagen}`}
                alt="objeto"
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080807]/80 via-transparent to-[#080807]/20 pointer-events-none" />

            {imagenes.length > 1 && (
                <>
                    <button
                        onClick={() => setCurrent((c) => (c - 1 + imagenes.length) % imagenes.length)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#080807]/70 border border-[#C9A84C]/30 flex items-center justify-center text-[#C9A84C] hover:bg-[#C9A84C]/20 transition-colors z-10"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setCurrent((c) => (c + 1) % imagenes.length)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#080807]/70 border border-[#C9A84C]/30 flex items-center justify-center text-[#C9A84C] hover:bg-[#C9A84C]/20 transition-colors z-10"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </>
            )}

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {imagenes.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className={`transition-all duration-300 rounded-full ${i === current ? "w-6 h-1.5 bg-[#C9A84C]" : "w-1.5 h-1.5 bg-white/30"}`}
                    />
                ))}
            </div>

            <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1 bg-[#080807]/80 border border-[#C9A84C]/30 z-10">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[9px] tracking-[0.3em] uppercase text-[#C9A84C] font-medium">En Vivo</span>
            </div>
        </div>
    );
}

export function SubastaEnCurso() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [subasta, setSubasta] = useState(null);
    const [loading, setLoading] = useState(true);
    const [monto, setMonto] = useState("");
    const [loadingPuja, setLoadingPuja] = useState(false);
    const [usuarioActual, setUsuarioActual] = useState(5);

    useEffect(() => {
        const cargar = async () => {
            try {
                const response = await subastaService.getDetalle(id);
                setSubasta(response.data.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        cargar();
    }, [id]);

    //PUSHER
    useEffect(() => {
        const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
            cluster: import.meta.env.VITE_PUSHER_CLUSTER,
        });

        const channel = pusher.subscribe("subasta");

        channel.bind("nueva-puja", async (data) => {
            try {
                const { liderAnterior, idUsuario: nuevoLider } = data;

                // 1. Recargar subasta
                const response = await subastaService.getDetalle(id);
                const nuevaSubasta = response.data.data;

                setSubasta(nuevaSubasta);

                const usuarioActual = nuevaSubasta.usuarioActual;

                console.log("liderAnterior:", liderAnterior);
                console.log("nuevoLider:", nuevoLider);
                console.log("usuarioActual:", usuarioActual);

                // 2. VALIDACIÓN 
                if (
                    liderAnterior !== null &&
                    liderAnterior !== nuevoLider &&
                    liderAnterior === usuarioActual
                ) {
                    toast.error("Puja ha sido superada");
                }

            } catch (error) {
                console.error(error);
            }
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, [id]);
    // enviar puja 
    const handleRealizarPuja = async () => {
        try {
            setLoadingPuja(true);

            const res = await pujaService.createPuja(
                { idSubasta: id, monto: parseFloat(monto) },
                usuarioActual 
            );

            // actualizar subasta
            const response = await subastaService.getDetalle(id);
            setSubasta(response.data.data);
            setMonto("");

        } catch (error) {
            const mensaje = error.response?.data?.message || "Error al realizar la puja";
            toast.error(mensaje);
        } finally {
            setLoadingPuja(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#080807] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 rounded-full border-2 border-[#C9A84C]/20 border-t-[#C9A84C] animate-spin" />
                <span className="text-[11px] tracking-[0.4em] uppercase text-[#F5F0E8]/40">Cargando subasta…</span>
            </div>
        </div>
    );

    if (!subasta) return (
        <div className="min-h-screen bg-[#080807] flex items-center justify-center">
            <div className="flex flex-col items-center gap-3 opacity-30">
                <div className="w-2 h-2 border border-[#C9A84C] rotate-45" />
                <span className="text-[11px] tracking-[0.3em] uppercase text-[#F5F0E8]">Error al cargar la subasta</span>
            </div>
        </div>
    );

    const pujaActual = subasta.historialPujas?.length > 0
        ? subasta.historialPujas[0].monto
        : subasta.precioBase;

    const topBidder = subasta.historialPujas?.length > 0
        ? subasta.historialPujas[0].nombreUsuario
        : null;

    return (
        <div
            className="min-h-screen text-[#F5F0E8]"
            style={{ background: "linear-gradient(160deg, #080807 0%, #0f0e0a 50%, #080807 100%)", fontFamily: "'Georgia', serif" }}
        >
            <div
                className="pointer-events-none fixed inset-0 z-0 opacity-[0.025]"
                style={{
                    backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                    backgroundSize: "128px",
                }}
            />

            <div className="relative z-10 max-w-7xl mx-auto p-6 md:p-10">

                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="group flex items-center gap-2.5 px-4 py-2 border border-[#C9A84C]/40 bg-[#C9A84C]/5 hover:bg-[#C9A84C]/15 hover:border-[#C9A84C]/80 transition-all duration-300 text-[#C9A84C]/70 hover:text-[#C9A84C]"
                    >
                        <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
                        <span className="text-[10px] tracking-[0.3em] uppercase font-semibold">Regresar</span>
                    </button>

                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-[10px] tracking-[0.35em] uppercase text-[#F5F0E8]/40">Subasta en curso</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-6">

                    {/* Columna izquierda */}
                    <div className="space-y-5">
                        <Gallery imagenes={subasta.objeto?.imagenes} />

                        <div className="border border-[#C9A84C]/20 bg-[#0E0D0B] p-5">
                            <SectionLabel>Información del Objeto</SectionLabel>
                            <GoldDivider />

                            <h1 className="text-2xl md:text-3xl font-light mt-3 mb-3 leading-tight italic">
                                {subasta.objeto?.nombreObjeto}
                            </h1>
                            <p className="text-[#F5F0E8]/55 text-sm leading-relaxed">
                                {subasta.objeto?.descripcionObjeto}
                            </p>

                            <div className="mt-5 pt-4 border-t border-[#C9A84C]/15 flex items-center gap-3">
                                <div className="w-9 h-9 bg-[#C9A84C]/10 border border-[#C9A84C]/30 flex items-center justify-center">
                                    <User className="w-4 h-4 text-[#C9A84C]/70" />
                                </div>
                                <div>
                                    <SectionLabel>Vendedor</SectionLabel>
                                    <p className="text-[#F5F0E8]/80 text-sm font-semibold">{subasta.vendedor?.nombreUsuario}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Columna derecha */}
                    <div className="flex flex-col gap-4">

                        {/* Info de la subasta */}
                        <div className="space-y-4">
                            <div className="relative overflow-hidden border border-[#C9A84C]/60 bg-[#0E0D0B]">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#C9A84C]/10 via-[#C9A84C]/5 to-transparent pointer-events-none" />
                                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent" />

                                <div className="relative p-6">
                                    <div className="flex items-center justify-between mb-1">
                                        <SectionLabel>Puja más Alta Actual</SectionLabel>
                                        <TrendingUp className="w-4 h-4 text-[#C9A84C]" />
                                    </div>

                                    <p className="text-4xl md:text-5xl font-light text-[#C9A84C] tracking-tight mt-2"
                                        style={{ textShadow: "0 0 40px rgba(201,168,76,0.4)" }}>
                                        {fmt(pujaActual)}
                                    </p>

                                    {topBidder && (
                                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#C9A84C]/20">
                                            <Crown className="w-3.5 h-3.5 text-[#C9A84C]" />
                                            <span className="text-[11px] tracking-[0.2em] uppercase text-[#C9A84C]/80">
                                                Mejor postor: <span className="text-[#C9A84C] font-bold">{topBidder}</span>
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="border border-[#C9A84C]/15 bg-[#0E0D0B] p-4 hover:border-[#C9A84C]/35 transition-colors">
                                    <SectionLabel>Precio Base</SectionLabel>
                                    <p className="text-base font-light text-[#F5F0E8] mt-1">{fmt(subasta.precioBase)}</p>
                                </div>
                                <div className="border border-[#C9A84C]/15 bg-[#0E0D0B] p-4 hover:border-[#C9A84C]/35 transition-colors">
                                    <SectionLabel>Incremento Mínimo</SectionLabel>
                                    <p className="text-base font-light text-[#F5F0E8] mt-1">{fmt(subasta.incrementoMinimo)}</p>
                                </div>
                                <div className="col-span-2 border border-[#C9A84C]/15 bg-[#0E0D0B] p-4 hover:border-[#C9A84C]/35 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <SectionLabel>Fecha de Cierre</SectionLabel>
                                        <Clock className="w-3.5 h-3.5 text-[#C9A84C]/50" />
                                    </div>
                                    <p className="text-base font-light text-[#F5F0E8] mt-1 font-mono">{subasta.fechaCierre}</p>
                                </div>
                            </div>

                            <div className="border border-[#C9A84C]/20 bg-[#0E0D0B] p-4">
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-2">
                                        <History className="w-4 h-4 text-[#C9A84C]/60" />
                                        <SectionLabel>Historial de Pujas</SectionLabel>
                                    </div>
                                    <span className="text-[10px] text-[#F5F0E8]/25 tracking-widest">
                                        {subasta.historialPujas?.length ?? 0} ofertas
                                    </span>
                                </div>
                                <GoldDivider />

                                {!subasta.historialPujas || subasta.historialPujas.length === 0 ? (
                                    <div className="flex flex-col items-center gap-2 py-8 opacity-20">
                                        <Gavel className="w-5 h-5 text-[#C9A84C]" />
                                        <span className="text-[10px] tracking-[0.25em] uppercase">No hay pujas aún</span>
                                    </div>
                                ) : (
                                    <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1 mt-2">
                                        {subasta.historialPujas.map((p, i) => (
                                            <div
                                                key={i}
                                                className={`flex items-center justify-between px-3 py-2.5 transition-colors ${i === 0
                                                    ? "bg-[#C9A84C]/10 border border-[#C9A84C]/30"
                                                    : "bg-[#F5F0E8]/[0.02] border border-transparent hover:border-[#C9A84C]/10"
                                                    }`}
                                            >
                                                <div className="flex items-center gap-2.5">
                                                    {i === 0
                                                        ? <Crown className="w-3 h-3 text-[#C9A84C] shrink-0" />
                                                        : <div className="w-3 h-3 rounded-full border border-[#F5F0E8]/15 shrink-0" />
                                                    }
                                                    <div>
                                                        <p className={`text-sm font-semibold leading-tight ${i === 0 ? "text-[#C9A84C]" : "text-[#F5F0E8]/70"}`}>
                                                            {p.nombreUsuario}
                                                        </p>
                                                        <p className="text-[10px] text-[#F5F0E8]/30 font-sans">{p.fechaHora}</p>
                                                    </div>
                                                </div>
                                                <p className={`text-sm font-bold tabular-nums font-sans ${i === 0 ? "text-[#C9A84C]" : "text-[#F5F0E8]/60"}`}>
                                                    {fmt(p.monto)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/*  separador */}
                        <div className="flex items-center gap-3 py-2">
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#C9A84C]/40 to-transparent" />
                            <Gavel className="w-3.5 h-3.5 text-[#C9A84C]/50" />
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#C9A84C]/40 to-transparent" />
                        </div>

                        {/*  CAJA DE PUJA  */}
                        <div className="relative border border-[#C9A84C]/60 bg-[#0E0D0B] overflow-hidden">
                            {/* Brillo superior */}
                            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent" />
                            {/* Fondo dorado sutil */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[#C9A84C]/8 via-transparent to-transparent pointer-events-none" />

                            <div className="relative p-5 space-y-4">
                                <div className="flex items-center justify-between">
                                    <SectionLabel>Tu Oferta</SectionLabel>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]/60 animate-pulse" />
                                        <span className="text-[9px] tracking-[0.3em] uppercase text-[#C9A84C]/50">En vivo</span>
                                    </div>
                                </div>

                                <input
                                    type="number"
                                    value={monto}
                                    onChange={(e) => setMonto(e.target.value)}
                                    placeholder="Ingrese su monto"
                                    className="w-full px-4 py-3 bg-[#080807] border border-[#C9A84C]/25 text-[#F5F0E8] text-lg font-light placeholder:text-[#F5F0E8]/20 focus:border-[#C9A84C]/70 focus:outline-none transition-colors duration-200 font-mono"
                                />

                                <button
                                    onClick={handleRealizarPuja}
                                    disabled={loadingPuja}
                                    className="relative group w-full overflow-hidden flex items-center justify-center gap-3 py-3.5 bg-gradient-to-r from-[#C9A84C] via-[#E2C36A] to-[#C9A84C] border border-[#C9A84C] text-[#080807] font-bold text-[11px] tracking-[0.4em] uppercase transition-all duration-300 hover:shadow-[0_0_35px_rgba(201,168,76,0.5)] hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                >
                                    <span className="absolute inset-0 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg]" />
                                    <Gavel className="w-4 h-4 shrink-0" />
                                    <span>{loadingPuja ? "Pujando..." : "Confirmar Puja"}</span>
                                </button>
                            </div>
                        </div>

                    </div>
                </div>

            </div>

        </div>
    );
}