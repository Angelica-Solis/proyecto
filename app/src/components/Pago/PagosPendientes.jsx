import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, Crown, CheckCircle, Clock, Gavel } from "lucide-react";
import pagoService from "@/services/PagoService";
import subastaService from "@/services/SubastaService";
import { toast } from "sonner";
import { useUser } from "@/hooks/useUser";

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

function EstadoBadge({ estado, idEstado }) {
    const isPendiente = idEstado == 1;
    return (
        <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] tracking-[0.2em] uppercase font-semibold border whitespace-nowrap ${
                isPendiente
                    ? "border-amber-500/40 bg-amber-500/10 text-amber-400"
                    : "border-green-500/40 bg-green-500/10 text-green-400"
            }`}
        >
            {isPendiente ? (
                <Clock className="w-3 h-3" />
            ) : (
                <CheckCircle className="w-3 h-3" />
            )}
            {estado}
        </span>
    );
}

export function PagosPendientes() {
    const navigate = useNavigate();
    const { user } = useUser();
    const [subastas, setSubastas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [procesando, setProcesando] = useState(null);

    const cargarDatos = async () => {
        try {
            setLoading(true);
            const res = await subastaService.getFinalizadas();
            const todas = res.data.data ?? res.data ?? [];
            const detalles = await Promise.all(
                todas.map((s) => subastaService.getDetalle(s.id).catch(() => null))
            );
            const misSubastas = detalles
                .filter(Boolean)
                .map((r) => r.data.data ?? r.data)
                .filter((s) => {
                    const ganador = s.historialPujas?.[0];
                    return ganador && String(ganador.idUsuario) === String(user?.id);
                });
            setSubastas(misSubastas);
        } catch (error) {
            console.error(error);
            toast.error("Error al cargar los datos");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.id) cargarDatos();
    }, [user]);

    const handlePagar = async (subasta) => {
        setProcesando(subasta.id);
        try {
            const montoFinal = subasta.historialPujas?.[0]?.monto ?? subasta.precioBase;
            const idResultado = subasta.pago?.idResultado;
            if (!idResultado) {
                toast.error("No se encontró el resultado de esta subasta");
                return;
            }
            await pagoService.create({
                idResultado,
                montoPagado: montoFinal,
                idEstadoPago: 1,
            });
            toast.success("Pago registrado — pendiente de confirmación");
            await cargarDatos();
        } catch (error) {
            const msg = error.response?.data?.message ?? "Error al registrar el pago";
            toast.error(msg);
        } finally {
            setProcesando(null);
        }
    };

    const handleConfirmar = async (subasta) => {
        const idPago = subasta.pago?.id;
        if (!idPago) return;
        setProcesando(subasta.id);
        try {
            await pagoService.confirmarPago(idPago);
            console.log("subasta.pago completo:", subasta.pago);4
                console.log("idPago:", idPago);

            toast.success("Pago confirmado exitosamente");
            await cargarDatos();
        } catch (error) {
            toast.error("Error al confirmar el pago");
        } finally {
            setProcesando(null);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#080807] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 rounded-full border-2 border-[#C9A84C]/20 border-t-[#C9A84C] animate-spin" />
                <span className="text-[11px] tracking-[0.4em] uppercase text-[#F5F0E8]/40">Cargando pagos…</span>
            </div>
        </div>
    );

    return (
        <div
            className="min-h-screen text-[#F5F0E8]"
            style={{ background: "linear-gradient(160deg, #080807 0%, #0f0e0a 50%, #080807 100%)", fontFamily: "'Georgia', serif" }}
        >
            {/* Textura de fondo */}
            <div
                className="pointer-events-none fixed inset-0 z-0 opacity-[0.025]"
                style={{
                    backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                    backgroundSize: "128px",
                }}
            />

            <div className="relative z-10 max-w-5xl mx-auto p-6 md:p-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="group flex items-center gap-2.5 px-4 py-2 border border-[#C9A84C]/40 bg-[#C9A84C]/5 hover:bg-[#C9A84C]/15 hover:border-[#C9A84C]/80 transition-all duration-300 text-[#C9A84C]/70 hover:text-[#C9A84C]"
                    >
                        <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
                        <span className="text-[10px] tracking-[0.3em] uppercase font-semibold">Regresar</span>
                    </button>
                    <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-[#C9A84C]/60" />
                        <span className="text-[10px] tracking-[0.35em] uppercase text-[#F5F0E8]/40">Mis Pagos</span>
                    </div>
                </div>

                {/* Título */}
                <div className="mb-8">
                    <SectionLabel>Panel de pagos</SectionLabel>
                    <h1 className="text-3xl font-light italic text-[#F5F0E8] mt-1">Subastas Ganadas</h1>
                    <GoldDivider />
                </div>

                {/* Sin resultados */}
                {subastas.length === 0 ? (
                    <div className="flex flex-col items-center gap-4 py-24 opacity-30">
                        <Gavel className="w-8 h-8 text-[#C9A84C]" />
                        <span className="text-[11px] tracking-[0.3em] uppercase text-[#F5F0E8]">
                            No tienes subastas ganadas pendientes de pago
                        </span>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <div className="border border-[#C9A84C]/20 bg-[#0E0D0B] min-w-[720px]">
                            {/* Brillo superior */}
                            <div className="h-px bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent" />

                            {/* Encabezado de tabla */}
                            <div className="grid grid-cols-[1fr_1.2fr_1.2fr_1fr_180px] gap-4 px-6 py-3 border-b border-[#C9A84C]/10">
                                <SectionLabel>N° Subasta</SectionLabel>
                                <SectionLabel>Objeto</SectionLabel>
                                <SectionLabel>Monto</SectionLabel>
                                <SectionLabel>Estado</SectionLabel>
                                <SectionLabel className="text-right">Acción</SectionLabel>
                            </div>

                            {/* Filas */}
                            <div className="divide-y divide-[#C9A84C]/8">
                                {subastas.map((subasta) => {
                                    const pago = subasta.pago ?? null;
                                    const monto = subasta.historialPujas?.[0]?.monto ?? subasta.precioBase;
                                    const enProceso = procesando === subasta.id;
                                    const yaPagado = pago?.idEstadoPago == 2;
                                    const pendiente = pago?.idEstadoPago == 1;

                                    return (
                                        <div
                                            key={subasta.id}
                                            className="grid grid-cols-[1fr_1.2fr_1.2fr_1fr_180px] gap-4 px-6 py-4 items-center hover:bg-[#C9A84C]/[0.03] transition-colors"
                                        >
                                            {/* N° Subasta */}
                                            <div className="flex items-center gap-2">
                                                <Crown className="w-3.5 h-3.5 text-[#C9A84C]/60 shrink-0" />
                                                <span className="text-sm font-mono text-[#F5F0E8]/70">
                                                    #{String(subasta.id).padStart(4, "0")}
                                                </span>
                                            </div>

                                            {/* Objeto */}
                                            <p className="text-sm text-[#F5F0E8]/80 truncate">
                                                {subasta.objeto?.nombreObjeto ?? "—"}
                                            </p>

                                            {/* Monto */}
                                            <p className="text-sm font-bold text-[#C9A84C] font-mono tabular-nums">
                                                {fmt(pago?.montoPagado ?? monto)}
                                            </p>

                                            {/* Estado */}
                                            <div>
                                                {pago ? (
                                                    <EstadoBadge estado={pago.estado} idEstado={pago.idEstadoPago} />
                                                ) : (
                                                    <span className="text-[10px] tracking-[0.2em] uppercase text-[#F5F0E8]/25 whitespace-nowrap">
                                                        Sin registro
                                                    </span>
                                                )}
                                            </div>

                                            {/* Acción - ancho fijo y alineado a la derecha */}
                                            <div className="flex justify-end">
                                                {yaPagado ? (
                                                    <span className="inline-flex items-center justify-center gap-1.5 w-full min-w-[130px] text-[10px] tracking-[0.2em] uppercase text-green-400/70 whitespace-nowrap">
                                                        <CheckCircle className="w-3.5 h-3.5" />
                                                        Completado
                                                    </span>
                                                ) : pendiente ? (
                                                    <button
                                                        onClick={() => handleConfirmar(subasta)}
                                                        disabled={enProceso}
                                                        className="relative group overflow-hidden flex items-center justify-center gap-2 w-full min-w-[130px] px-3 py-2 border border-green-500/50 bg-green-500/10 text-green-400 text-[10px] tracking-[0.25em] uppercase font-bold hover:bg-green-500/20 hover:border-green-500/80 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        <span className="absolute inset-0 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-500 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg]" />
                                                        <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                                                        {enProceso ? "Procesando..." : "Confirmar Pago"}
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handlePagar(subasta)}
                                                        disabled={enProceso}
                                                        className="relative group overflow-hidden flex items-center justify-center gap-2 w-full min-w-[130px] px-3 py-2 bg-gradient-to-r from-[#C9A84C] via-[#E2C36A] to-[#C9A84C] border border-[#C9A84C] text-[#080807] text-[10px] tracking-[0.25em] uppercase font-bold hover:shadow-[0_0_25px_rgba(201,168,76,0.4)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        <span className="absolute inset-0 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-500 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg]" />
                                                        <CreditCard className="w-3.5 h-3.5 shrink-0" />
                                                        {enProceso ? "Procesando..." : "Pagar"}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Brillo inferior */}
                            <div className="h-px bg-gradient-to-r from-transparent via-[#C9A84C]/30 to-transparent" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}