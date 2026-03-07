import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import objetooService from "@/services/ObjetoService";
import { ArrowLeft, Calendar, Globe, User, Layers, ShieldCheck, Flag, Gavel } from "lucide-react";
import { LoadingGrid } from "../ui/custom/LoadingGrid";
import { ErrorAlert } from "../ui/custom/ErrorAlert";
import { EmptyState } from "../ui/custom/EmptyState";

function DetailRow({ icon: Icon, label, value }) {
    return (
        <div className="flex items-start gap-3 py-4 border-b border-[#C9A84C]/[0.07] last:border-0">
            <Icon className="h-4 w-4 text-[#C9A84C] mt-0.5 shrink-0" />
            <div className="flex flex-col gap-0.5">
                <span className="text-[11px] font-medium tracking-[0.35em] uppercase text-[#F5F0E8]/40">
                    {label}
                </span>
                <span className="text-[15px] font-light text-[#F5F0E8] tracking-wide">
                    {value}
                </span>
            </div>
        </div>
    );
}

export function ObjetoDetalle() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await objetooService.getDetalleObjeto(id);
                setData(response.data);
                if (!response.data.success) setError(response.data.message);
            } catch (err) {
                if (err.name !== "AbortError") setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData(id);
    }, [id]);

    if (loading) return <LoadingGrid count={1} type="grid" />;
    if (error) return <ErrorAlert title="Error al cargar detalle del objeto" message={error} />;
    if (!data || data.data.length === 0)
        return <EmptyState message="No se encontraron detalles de objeto en este apartado." />;

    const d = data.data;

    return (
        <div className="min-h-screen bg-[#080807] text-[#F5F0E8] p-10 font-sans">

            {/* Encabezado */}
            <div className="mb-10">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-7 h-px bg-[#C9A84C]" />
                    <span className="text-[#C9A84C] uppercase tracking-[0.4em] text-[12px] font-medium">
                        Panel de Control
                    </span>
                </div>
                <h1 className="text-4xl font-light tracking-tight leading-none">
                    Detalle de{" "}
                    <em className="text-[#C9A84C] not-italic font-light">{d.nombreObjeto}</em>
                </h1>
            </div>

            <div className="space-y-4">

                {/* Informacion principal */}
                <div className="border border-[#C9A84C]/20 bg-[#0E0D0B] overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#C9A84C]/[0.07]">

                        {/* Columna izquierda */}
                        <div className="p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-5 h-px bg-[#C9A84C]" />
                                <span className="text-[#C9A84C] uppercase tracking-[0.4em] text-[11px] font-medium">
                                    Información del Objeto
                                </span>
                            </div>

                            <DetailRow icon={User} label="Descripción" value={d.descripcionObjeto} />
                            <DetailRow icon={Calendar} label="Fecha Registro" value={d.fechaRegistro} />
                            <DetailRow icon={ShieldCheck} label="Condición" value={d.condicion} />

                            {/* Estado */}
                            <div className="flex items-start gap-3 py-4 border-b border-[#C9A84C]/[0.07]">
                                <Flag className="h-4 w-4 text-[#C9A84C] mt-0.5 shrink-0" />
                                <div className="flex flex-col gap-1">
                                    <span className="text-[11px] font-medium tracking-[0.35em] uppercase text-[#F5F0E8]/40">
                                        Estado
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 mt-1 px-3 py-1 border border-[#C9A84C]/25 bg-[#C9A84C]/[0.07] text-[#C9A84C] text-[11px] font-medium tracking-[0.3em] uppercase w-fit">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] shadow-[0_0_6px_#C9A84C] animate-pulse" />
                                        {d.estado}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Columna derecha */}
                        <div className="p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-5 h-px bg-[#C9A84C]" />
                                <span className="text-[#C9A84C] uppercase tracking-[0.4em] text-[11px] font-medium">
                                    Propietario y Categorías
                                </span>
                            </div>

                            <DetailRow icon={Globe} label="Propietario" value={d.propietario} />

                            {/* Categorías */}
                            <div className="flex items-start gap-3 py-4 border-b border-[#C9A84C]/[0.07]">
                                <Layers className="h-4 w-4 text-[#C9A84C] mt-0.5 shrink-0" />
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-[11px] font-medium tracking-[0.35em] uppercase text-[#F5F0E8]/40">
                                        Categorías
                                    </span>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {d.categorias?.map((cat, i) => (
                                            <span key={i} className="px-3 py-0.5 border border-[#C9A84C]/25 bg-[#C9A84C]/[0.07] text-[#C9A84C] text-[12px] tracking-widest">
                                                {cat.nombreCategoria}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Imagenes */}
                            <div className="flex items-start gap-3 py-4">
                                <Globe className="h-4 w-4 text-[#C9A84C] mt-0.5 shrink-0" />
                                <div className="flex flex-col gap-2 w-full">
                                    <span className="text-[11px] font-medium tracking-[0.35em] uppercase text-[#F5F0E8]/40">
                                        Imágenes
                                    </span>
                                    <div className="flex flex-wrap gap-3 mt-1">
                                        {d.imagenes?.map((img, i) => (
                                            <img
                                                key={i}
                                                src={`http://127.0.0.1:81/proyecto/api/uploads/${img.nombreImagen}`}
                                                alt={d.nombreObjeto}
                                                className="w-52 border border-[#C9A84C]/20 object-cover hover:border-[#C9A84C]/60 transition-all duration-300"
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Subastas asociadas */}
                <div className="border border-[#C9A84C]/20 bg-[#0E0D0B] overflow-hidden">
                    <div className="flex items-center gap-3 p-6 border-b border-[#C9A84C]/20 bg-[#C9A84C]/5">
                        <Gavel className="h-4 w-4 text-[#C9A84C]" />
                        <span className="text-[#C9A84C] uppercase tracking-[0.4em] text-[11px] font-medium">
                            Subastas Asociadas
                        </span>
                    </div>

                    {d.subastas && d.subastas.length > 0 ? (
                        <div>
                            {d.subastas.map((subasta, index) => (
                                <div
                                    key={index}
                                    className={`
                                        flex justify-between items-center px-8 py-5
                                        border-b border-[#C9A84C]/[0.07] last:border-0
                                        hover:bg-[#C9A84C]/[0.06] transition-colors duration-200
                                        ${index % 2 !== 0 ? "bg-[#F5F0E8]/[0.03]" : "bg-transparent"}
                                    `}
                                >
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[11px] font-medium tracking-[0.35em] uppercase text-[#F5F0E8]/40">
                                            ID #{subasta.id}
                                        </span>
                                        <div className="flex gap-6 mt-1">
                                            <div>
                                                <p className="text-[11px] tracking-[0.25em] uppercase text-[#F5F0E8]/40">Inicio</p>
                                                <p className="text-[13px] font-light text-[#F5F0E8]">{subasta.fechaInicio}</p>
                                            </div>
                                            <div>
                                                <p className="text-[11px] tracking-[0.25em] uppercase text-[#F5F0E8]/40">Cierre</p>
                                                <p className="text-[13px] font-light text-[#F5F0E8]">{subasta.fechaCierre}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 border border-[#C9A84C]/25 bg-[#C9A84C]/[0.07] text-[#C9A84C] text-[11px] font-medium tracking-[0.3em] uppercase">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] shadow-[0_0_6px_#C9A84C] animate-pulse" />
                                        {subasta.estado}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-16 flex flex-col items-center gap-3">
                            <div className="w-2 h-2 border border-[#C9A84C]/50 rotate-45" />
                            <span className="text-[12px] tracking-[0.35em] uppercase text-[#F5F0E8]/40">
                                Sin subastas asociadas
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Boton regresar */}
            <div className="mt-8 flex">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 border border-[#F5F0E8]/30 bg-[#F5F0E8]/[0.06] text-[#F5F0E8] hover:border-[#C9A84C] hover:text-[#C9A84C] hover:bg-[#C9A84C]/[0.07] transition-all duration-300 text-[9px] tracking-[0.3em] uppercase font-medium px-5 h-9"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Regresar
                </button>
            </div>

        </div>
    );
}