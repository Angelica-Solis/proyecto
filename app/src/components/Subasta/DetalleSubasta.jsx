import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useParams } from "react-router-dom";
import subastaaService from "@/services/SubastaService";
import { ArrowBigDownIcon, ArrowLeft, Calendar, CircleDollarSign, Download, Flag, Gavel, Layers, Package, ShieldCheck, Tag, TrendingUp } from "lucide-react";
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

export function SubastaDetalle() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await subastaaService.getDetalle(id);
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
    if (error) return <ErrorAlert title="Error al cargar detalle de la subasta" message={error} />;
    if (!data || data.data.length === 0)
        return <EmptyState message="No se encontraron detalles de la subasta en este apartado." />;

    const d = data.data;

    return (
        <div className="min-h-screen bg-[#080807] text-[#F5F0E8] p-10 font-sans">

            {/* Encabezado */}
            <div className="flex justify-between items-end mb-10">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-7 h-px bg-[#C9A84C]" />
                        <span className="text-[#C9A84C] uppercase tracking-[0.4em] text-[12px] font-medium">
                            Panel de Control
                        </span>
                    </div>
                    <h1 className="text-4xl font-light tracking-tight leading-none">
                        Detalle de{" "}
                        <em className="text-[#C9A84C] not-italic font-light">Subasta</em>
                    </h1>
                </div>

                <Button
                    asChild
                    className="flex items-center gap-2 rounded-none border border-[#C9A84C]/25 bg-[#C9A84C]/[0.07] text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#080807] transition-all duration-300 text-[12px] tracking-[0.3em] uppercase font-medium px-5 h-9"
                >
                    <Link to={`/puja/listado/${d.id}`}>
                        <Gavel className="h-4 w-4" />
                        Historial de Pujas
                    </Link>
                </Button>
            </div>

            {/* Contenido principal */}
            <div className="border border-[#C9A84C]/20 bg-[#0E0D0B] overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#C9A84C]/[0.07]">

                    {/* Columna izquierda */}
                    <div className="p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-5 h-px bg-[#C9A84C]" />
                            <span className="text-[#C9A84C] uppercase tracking-[0.4em] text-[11px] font-medium">
                                Información de Subasta
                            </span>
                        </div>

                        <DetailRow icon={Calendar} label="Fecha de Inicio" value={d.fechaInicio} />
                        <DetailRow icon={Calendar} label="Fecha de Cierre" value={d.fechaCierre} />
                        <DetailRow icon={CircleDollarSign} label="Precio Base" value={d.precioBase} />
                        <DetailRow icon={TrendingUp} label="Incremento Mínimo" value={d.incrementoMinimo} />
                        <DetailRow icon={Gavel} label="Cantidad de Pujas" value={d.cantidadPujas} />

                        <div className="flex items-start gap-3 py-4">
                            <Flag className="h-4 w-4 text-[#C9A84C] mt-0.5 shrink-0" />
                            <div className="flex flex-col gap-1">
                                <span className="text-[11px] font-medium tracking-[0.35em] uppercase text-[#F5F0E8]/40">
                                    Estado Actual
                                </span>
                                <span className="inline-flex items-center gap-1.5 mt-1 px-3 py-1 border border-[#C9A84C]/25 bg-[#C9A84C]/[0.07] text-[#C9A84C] text-[11px] font-medium tracking-[0.3em] uppercase w-fit">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] shadow-[0_0_6px_#C9A84C] animate-pulse" />
                                    {d.estadoNombre}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Columna derecha */}
                    <div className="p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-5 h-px bg-[#C9A84C]" />
                            <span className="text-[#C9A84C] uppercase tracking-[0.4em] text-[11px] font-medium">
                                Objeto en Subasta
                            </span>
                        </div>

                        <DetailRow icon={Tag} label="Nombre" value={d?.objeto?.nombreObjeto} />
                        <DetailRow icon={ShieldCheck} label="Condición" value={d?.objeto?.condicion} />

                        {/* Categorías */}
                        <div className="flex items-start gap-3 py-4 border-b border-[#C9A84C]/[0.07]">
                            <Layers className="h-4 w-4 text-[#C9A84C] mt-0.5 shrink-0" />
                            <div className="flex flex-col gap-1.5">
                                <span className="text-[11px] font-medium tracking-[0.35em] uppercase text-[#F5F0E8]/40">
                                    Categorías
                                </span>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {d?.objeto?.categorias?.map((cat, i) => (
                                        <span key={i} className="px-3 py-0.5 border border-[#C9A84C]/25 bg-[#C9A84C]/[0.07] text-[#C9A84C] text-[12px] tracking-widest">
                                            {cat.nombreCategoria}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Imagenes */}
                        <div className="flex items-start gap-3 py-4">
                            <Package className="h-4 w-4 text-[#C9A84C] mt-0.5 shrink-0" />
                            <div className="flex flex-col gap-2 w-full">
                                <span className="text-[11px] font-medium tracking-[0.35em] uppercase text-[#F5F0E8]/40">
                                    Producto
                                </span>
                                <div className="flex flex-wrap gap-3 mt-1">
                                    {d?.objeto?.imagenes?.map((img, i) => (
                                        <img
                                            key={i}
                                            src={`http://127.0.0.1:81/proyecto/api/uploads/${img.nombreImagen}`}
                                            alt="Objeto"
                                            className="w-52 border border-[#C9A84C]/20 object-cover"
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

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