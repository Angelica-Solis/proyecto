import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Info, Edit, Rocket, XCircle, Plus, Ban, Calendar, Gavel } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import subastaService from "@/services/SubastaService";
import { toast } from "sonner";

export function SubastaTable() {
    const navigate = useNavigate();
    const [filtro, setFiltro] = useState("activas");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const cargarSubastas = () => {
        setLoading(true);
        let peticion;
        if (filtro === "activas") {
            peticion = subastaService.getActivas();
        } else if (filtro === "finalizadas") {
            peticion = subastaService.getFinalizadas();
        } else {
            peticion = subastaService.getAll();
        }
        peticion
            .then((response) => { setData(response.data.data); setLoading(false); })
            .catch((error) => { console.error("Error al obtener subastas:", error); setLoading(false); });
    };

    useEffect(() => { cargarSubastas(); }, [filtro]);

    const handlePublicar = async (id) => {
        try { await subastaService.publicar(id); toast.success("Subasta publicada con éxito"); cargarSubastas(); }
        catch (error) { toast.error(error.response?.data?.message || "Error al publicar"); }
    };

    const handleCancelar = async (id) => {
        if (window.confirm("¿Está seguro de cancelar esta subasta?")) {
            try { await subastaService.cancelar(id); toast.success("Subasta cancelada"); cargarSubastas(); }
            catch (error) { toast.error(error.response?.data?.message || "No se pudo cancelar"); }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("¿Estás seguro de que deseas cancelar esta subasta? Esta acción no se puede deshacer.")) {
            try { await subastaService.cancelar(id); toast.success("Subasta cancelada correctamente"); cargarSubastas(); }
            catch (error) { toast.error(error.response?.data?.message || "No se pudo cancelar la subasta"); }
        }
    };

    const getEstadoBadge = (idEstado) => {
        const estados = {
            "1": { label: "Activa", class: "bg-green-500/10 text-green-400 border-green-500/30" },
            "2": { label: "Finalizada", class: "bg-gray-500/10  text-gray-400  border-gray-500/30" },
            "3": { label: "Cancelada", class: "bg-red-500/10   text-red-400   border-red-500/30" },
            "4": { label: "Borrador", class: "bg-blue-500/10  text-blue-400  border-blue-500/30" },
        };
        const est = estados[idEstado] || { label: "Desconocido", class: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30" };
        return (
            <span className={`px-2 py-0.5 border text-[9px] uppercase tracking-widest ${est.class}`}>
                {est.label}
            </span>
        );
    };

    const ActionBtn = ({ label, colorClass, onClick, children, asChild, to }) => (
        <div className="group relative">
            {asChild ? (
                <Button size="icon" variant="ghost" asChild className={`h-8 w-8 rounded-none border transition-all duration-300 ${colorClass}`}>
                    <Link to={to}>{children}</Link>
                </Button>
            ) : (
                <Button size="icon" variant="ghost" className={`h-8 w-8 rounded-none border transition-all duration-300 ${colorClass}`} onClick={onClick}>
                    {children}
                </Button>
            )}
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#C9A84C] text-[#080807] text-[9px] font-bold tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity z-20 whitespace-nowrap pointer-events-none">
                {label}
            </span>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#080807] text-[#F5F0E8] p-10 font-sans">

            {/* Encabezado */}
            <div className="flex justify-between items-end mb-10">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-7 h-px bg-[#C9A84C]" />
                        <span className="text-[#C9A84C] uppercase tracking-[0.4em] text-[12px] font-medium">
                            Panel de Gestión
                        </span>
                    </div>
                    <h1 className="text-4xl font-light tracking-tight leading-none">
                        Listado de <em className="text-[#C9A84C] not-italic font-light">Subastas</em>
                    </h1>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-light tracking-[0.3em] uppercase text-[#F5F0E8]/50">Filtrar</span>
                        <Select value={filtro} onValueChange={(value) => setFiltro(value)}>
                            <SelectTrigger className="w-[210px] h-9 rounded-none border-[#C9A84C]/25 bg-[#0E0D0B] text-[#F5F0E8] text-[11px] tracking-widest focus:ring-[#C9A84C]/40">
                                <SelectValue placeholder="Estado de subasta" />
                            </SelectTrigger>
                            <SelectContent className="rounded-none border-[#C9A84C]/25 bg-[#0E0D0B] text-[#F5F0E8]">
                                <SelectItem value="activas" className="text-[11px] tracking-widest focus:bg-[#C9A84C]/10">Subastas Activas</SelectItem>
                                <SelectItem value="finalizadas" className="text-[11px] tracking-widest focus:bg-[#C9A84C]/10">Finalizadas / Canceladas</SelectItem>
                                <SelectItem value="mantenimiento" className="text-[11px] tracking-widest text-[#C9A84C] focus:bg-[#C9A84C]/10">Mantenimiento General</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {filtro === "mantenimiento" && (
                        <Button
                            onClick={() => navigate("/mantenimiento/subastas/crear")}
                            className="h-9 rounded-none bg-[#C9A84C] hover:bg-[#A68A3D] text-black text-[11px] tracking-[0.2em] font-bold px-6 transition-all duration-300"
                        >
                            <Plus className="mr-2 h-4 w-4" /> NUEVA SUBASTA
                        </Button>
                    )}
                </div>
            </div>

            {/* Grid de tarjetas */}
            {loading ? (
                <div className="flex flex-col items-center gap-4 py-32">
                    <div className="w-8 h-8 rounded-full border-2 border-[#C9A84C]/20 border-t-[#C9A84C] animate-spin" />
                    <span className="text-[11px] tracking-[0.4em] uppercase text-[#F5F0E8]/40">Sincronizando registros…</span>
                </div>
            ) : data.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-32 opacity-20">
                    <div className="w-2 h-2 border border-[#C9A84C] rotate-45" />
                    <span className="text-[11px] tracking-[0.3em] uppercase">No hay subastas registradas</span>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {data.map((item, idx) => (
                        <div
                            key={item.id}
                            className="group relative flex flex-col bg-[#0E0D0B] border border-[#C9A84C]/20 hover:border-[#C9A84C]/50 transition-all duration-500 overflow-hidden"
                        >
                            {/* Imagen */}
                            <div className="relative w-full overflow-hidden bg-[#111008]" style={{ aspectRatio: "4/3" }}>
                                <img
                                    src={`http://127.0.0.1:81/proyecto/api/uploads/${item.imagen}`}
                                    alt={item.nombreObjeto}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />

                                {/* Número de lote */}
                                <div className="absolute top-3 left-3 px-2 py-1 bg-[#080807]/80 border border-[#C9A84C]/30 text-[#C9A84C] text-[9px] tracking-[0.3em] uppercase font-medium z-10">
                                    LOT {String(idx + 1).padStart(3, "0")}
                                </div>

                                {/* Estado badge */}
                                <div className="absolute top-3 right-3 z-10">
                                    {getEstadoBadge(item.idEstadoSubasta || (filtro === "activas" ? "1" : "2"))}
                                </div>

                                {/* Gradiente inferior */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#080807] via-transparent to-transparent opacity-70" />

                                {/* BOTÓN PARTICIPAR solo activas */}
                                {item.idEstadoSubasta == 1 && (
                                    <div className="absolute inset-x-0 bottom-0 flex justify-center pb-4 z-10 translate-y-3 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out">
                                        <button
                                            onClick={() => navigate(`/subastas/participar/${item.id}`)}
                                            className="relative flex items-center gap-2 px-5 py-2.5 bg-[#C9A84C] hover:bg-[#E0BC5A] text-[#080807] text-[10px] font-bold tracking-[0.2em] uppercase overflow-hidden transition-colors duration-200 shadow-[0_0_30px_rgba(201,168,76,0.5)]"
                                        >
                                            {/* Shimmer sweep */}
                                            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
                                            <Gavel className="w-3.5 h-3.5 shrink-0" />
                                            Participar en Subasta
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Contenido */}
                            <div className="flex flex-col flex-1 p-4">

                                {/* Fecha cierre */}
                                <div className="flex items-center gap-1.5 mb-2">
                                    <Calendar className="w-3 h-3 text-[#C9A84C]/60" />
                                    <span className="text-[10px] tracking-[0.2em] uppercase text-[#F5F0E8]/40">
                                        {item.fechaCierre || "—"}
                                    </span>
                                </div>

                                {/* Nombre objeto */}
                                <h3 className="text-base font-light italic text-[#F5F0E8] leading-snug mb-3 line-clamp-2" style={{ fontFamily: "'Georgia', serif" }}>
                                    {item.objeto?.nombreObjeto || item.nombreObjeto}
                                </h3>

                                {/* Divisor dorado */}
                                <div className="h-px bg-gradient-to-r from-[#C9A84C]/40 via-[#C9A84C]/20 to-transparent mb-3" />

                                {/* Precio / Inicio */}
                                <div className="mb-1">
                                    <p className="text-[9px] tracking-[0.3em] uppercase text-[#F5F0E8]/40 mb-0.5">
                                        {item.precioBase ? "Precio Base" : "Fecha Inicio"}
                                    </p>
                                    <p className="text-lg font-light text-[#C9A84C] tracking-tight" style={{ fontFamily: "'Georgia', serif" }}>
                                        {item.precioBase
                                            ? `₡${Number(item.precioBase).toLocaleString()}`
                                            : item.fechaInicio}
                                    </p>
                                </div>

                                {/* Pujas */}
                                <div className="flex items-center gap-1.5 mt-2">
                                    <Gavel className="w-3 h-3 text-[#C9A84C]/50" />
                                    <span className="text-[10px] text-[#F5F0E8]/40 tracking-widest">
                                        <span className="font-mono text-[#C9A84C] font-medium">{item.cantidadPujas}</span> puja{item.cantidadPujas !== 1 ? "s" : ""}
                                    </span>
                                </div>

                                {/* Acciones */}
                                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#C9A84C]/10">

                                    {item.idEstadoSubasta == 4 && (
                                        <>
                                            <ActionBtn
                                                label="Modificar"
                                                colorClass="border-blue-500/20 text-blue-400 hover:border-blue-500 hover:bg-blue-500/10"
                                                onClick={() => navigate(`/mantenimiento/subastas/editar/${item.id}`)}
                                            >
                                                <Edit className="h-3.5 w-3.5" />
                                            </ActionBtn>
                                            <ActionBtn
                                                label="Publicar"
                                                colorClass="border-green-500/20 text-green-400 hover:border-green-500 hover:bg-green-500/10"
                                                onClick={() => handlePublicar(item.id)}
                                            >
                                                <Rocket className="h-3.5 w-3.5" />
                                            </ActionBtn>
                                            <ActionBtn
                                                label="Cancelar"
                                                colorClass="border-red-500/20 text-red-400 hover:border-red-500 hover:bg-red-500/10"
                                                onClick={() => handleDelete(item.id)}
                                            >
                                                <Ban className="h-3.5 w-3.5" />
                                            </ActionBtn>
                                        </>
                                    )}

                                    {item.idEstadoSubasta == 1 && item.cantidadPujas == 0 && (
                                        <ActionBtn
                                            label="Cancelar"
                                            colorClass="border-red-500/20 text-red-400 hover:border-red-500 hover:bg-red-500/10"
                                            onClick={() => handleCancelar(item.id)}
                                        >
                                            <XCircle className="h-3.5 w-3.5" />
                                        </ActionBtn>
                                    )}

                                    <div className="ml-auto">
                                        <ActionBtn
                                            label="Detalles"
                                            colorClass="border-[#C9A84C]/20 text-[#F5F0E8]/40 hover:border-[#C9A84C] hover:text-[#C9A84C] hover:bg-[#C9A84C]/[0.07]"
                                            asChild
                                            to={`/subasta/detalle/${item.id}`}
                                        >
                                            <Info className="h-3.5 w-3.5" />
                                        </ActionBtn>
                                    </div>

                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Footer y btn Regresar */}
            <div className="mt-10 flex">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 border border-[#F5F0E8]/30 bg-[#F5F0E8]/[0.06] text-[#F5F0E8] hover:border-[#C9A84C] hover:text-[#C9A84C] hover:bg-[#C9A84C]/[0.07] transition-all duration-300 text-[10px] tracking-[0.3em] uppercase font-medium px-6 h-10"
                >
                    <ArrowLeft className="w-4 h-4" /> Regresar al Inicio
                </button>
            </div>
        </div>
    );
}