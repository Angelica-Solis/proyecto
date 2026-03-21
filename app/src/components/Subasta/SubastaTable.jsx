import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Info, Edit, Rocket, XCircle, Plus, Trash2, Ban } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import subastaService from "@/services/SubastaService";
import { toast } from "sonner";

export function SubastaTable() {
    const navigate = useNavigate();
    const [filtro, setFiltro] = useState("activas");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Función de carga unificada
    const cargarSubastas = () => {
        setLoading(true);
        let peticion;

        if (filtro === "activas") {
            peticion = subastaService.getActivas();
        } else if (filtro === "finalizadas") {
            peticion = subastaService.getFinalizadas();
        } else {
            peticion = subastaService.getAll(); // Modo Mantenimiento General
        }

        peticion
            .then((response) => {
                setData(response.data.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error al obtener subastas:", error);
                setLoading(false);
            });
    };

    useEffect(() => {
        cargarSubastas();
    }, [filtro]);

    // Lógica de Acciones
    const handlePublicar = async (id) => {
        try {
            await subastaService.publicar(id);
            toast.success("Subasta publicada con éxito");
            cargarSubastas();
        } catch (error) {
            toast.error(error.response?.data?.message || "Error al publicar");
        }
    };

    const handleCancelar = async (id) => {
        if (window.confirm("¿Está seguro de cancelar esta subasta?")) {
            try {
                await subastaService.cancelar(id);
                toast.success("Subasta cancelada");
                cargarSubastas();
            } catch (error) {
                toast.error(error.response?.data?.message || "No se pudo cancelar");
            }
        }
    };

    const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas cancelar esta subasta? Esta acción no se puede deshacer.")) {
        try {
            await subastaService.cancelar(id);
            toast.success("Subasta cancelada correctamente");
            cargarSubastas();
        } catch (error) {
            toast.error(error.response?.data?.message || "No se pudo cancelar la subasta");
        }
    }
};

    // Helper para insignias de estado
    const getEstadoBadge = (idEstado) => {
        const estados = {
            "1": { label: "Activa", class: "bg-green-500/10 text-green-400 border-green-500/20" },
            "2": { label: "Finalizada", class: "bg-gray-500/10 text-gray-400 border-gray-500/20" },
            "3": { label: "Cancelada", class: "bg-red-500/10 text-red-400 border-red-500/20" },
            "4": { label: "Borrador", class: "bg-blue-500/10 text-blue-400 border-blue-500/20" }
        };
        const est = estados[idEstado] || { label: "Desconocido", class: "bg-yellow-500/10 text-yellow-400" };
        return (
            <span className={`px-2 py-0.5 border text-[9px] uppercase tracking-widest rounded-none ${est.class}`}>
                {est.label}
            </span>
        );
    };

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
                    {/* Filtro */}
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

                    {/* Botón Crear */}
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

            {/* Contenedor de Tabla */}
            <div className="border border-[#C9A84C]/20 bg-[#0E0D0B] overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="border-b border-[#C9A84C]/20 bg-[#C9A84C]/5 hover:bg-[#C9A84C]/5">
                            <TableHead className="text-[#C9A84C] text-[11px] font-medium tracking-[0.35em] uppercase py-4 pl-6">Objeto</TableHead>
                            <TableHead className="text-[#C9A84C] text-[11px] font-medium tracking-[0.35em] uppercase py-4 text-center">Precio / Inicio</TableHead>
                            <TableHead className="text-[#C9A84C] text-[11px] font-medium tracking-[0.35em] uppercase py-4 text-center">Cierre</TableHead>
                            <TableHead className="text-[#C9A84C] text-[11px] font-medium tracking-[0.35em] uppercase py-4 text-center">Pujas</TableHead>
                            <TableHead className="text-[#C9A84C] text-[11px] font-medium tracking-[0.35em] uppercase py-4 text-center">Estado</TableHead>
                            <TableHead className="text-[#C9A84C] text-[11px] font-medium tracking-[0.35em] uppercase py-4 text-center">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="py-20 text-center">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-8 h-8 rounded-full border-2 border-[#C9A84C]/20 border-t-[#C9A84C] animate-spin" />
                                        <span className="text-[11px] tracking-[0.4em] uppercase text-[#F5F0E8]/40">Sincronizando registros…</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : data.length > 0 ? (
                            data.map((item, idx) => (
                                <TableRow key={item.id} className={`border-b border-[#C9A84C]/[0.07] hover:bg-[#C9A84C]/[0.06] transition-colors duration-200 ${idx % 2 !== 0 ? "bg-[#F5F0E8]/[0.02]" : "bg-transparent"}`}>
                                    <TableCell className="py-5 pl-6 italic font-light text-[#F5F0E8]">{item.objeto?.nombreObjeto || item.nombreObjeto}</TableCell>
                                    
                                    <TableCell className="py-5 text-center text-[#F5F0E8]/60 text-[13px]">
                                        {item.precioBase ? `₡${Number(item.precioBase).toLocaleString()}` : item.fechaInicio}
                                    </TableCell>
                                    
                                    <TableCell className="py-5 text-center text-[#F5F0E8]/60 text-[13px]">{item.fechaCierre}</TableCell>
                                    
                                    <TableCell className="py-5 text-center font-mono text-[#C9A84C] font-medium">{item.cantidadPujas}</TableCell>
                                    
                                    <TableCell className="py-5 text-center">
                                        {getEstadoBadge(item.idEstadoSubasta || (filtro === "activas" ? "1" : "2"))}
                                    </TableCell>
                                    
                                    <TableCell className="py-5 text-center">
                                        <div className="flex items-center justify-center gap-3">
                                            
                                            {/* Mantenimiento: Solo para Borradores (Estado 4) */}
                                                {item.idEstadoSubasta == 4 && (
                                                    <>
                                                        {/* Botón Modificar */}
                                                        <div className="group relative">
                                                            <Button 
                                                                size="icon" variant="ghost" 
                                                                className="h-8 w-8 rounded-none border border-blue-500/20 text-blue-400 hover:border-blue-500 hover:bg-blue-500/10 transition-all duration-300"
                                                                onClick={() => navigate(`/mantenimiento/subastas/editar/${item.id}`)}
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            <span className="absolute bottom-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-blue-500 text-[#080807] text-[9px] font-medium tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap pointer-events-none">
                                                                Modificar
                                                            </span>
                                                        </div>

                                                        {/* Botón Publicar */}
                                                        <div className="group relative">
                                                            <Button 
                                                                size="icon" variant="ghost" 
                                                                className="h-8 w-8 rounded-none border border-green-500/20 text-green-400 hover:border-green-500 hover:bg-green-500/10 transition-all duration-300"
                                                                onClick={() => handlePublicar(item.id)}
                                                            >
                                                                <Rocket className="h-4 w-4" />
                                                            </Button>
                                                            <span className="absolute bottom-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-green-500 text-[#080807] text-[9px] font-medium tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap pointer-events-none">
                                                                Publicar
                                                            </span>
                                                        </div>

                                                        {/* Botón Cancelar Borrador */}
                                                        <div className="group relative">
                                                            <Button 
                                                                size="icon" variant="ghost" 
                                                                className="h-8 w-8 rounded-none border border-red-500/20 text-red-400 hover:border-red-500 hover:bg-red-500/10 transition-all duration-300"
                                                                onClick={() => handleDelete(item.id)}
                                                            >
                                                                <Ban className="h-4 w-4" />
                                                            </Button>
                                                            <span className="absolute bottom-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-red-600 text-white text-[9px] font-medium tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap pointer-events-none">
                                                                Cancelar Subasta
                                                            </span>
                                                        </div>
                                                    </>
                                                )}

                                            {/* Cancelar: Activas sin pujas */}
                                            {item.idEstadoSubasta == 1 && item.cantidadPujas == 0 && (
                                                <div className="group relative">
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 rounded-none border border-red-500/20 text-red-400 hover:border-red-500 hover:bg-red-500/10 transition-all duration-300"
                                                        onClick={() => handleCancelar(item.id)}>
                                                        <XCircle className="h-4 w-4" />
                                                    </Button>
                                                    <span className="absolute bottom-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-red-500 text-[#080807] text-[9px] font-medium tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">Cancelar</span>
                                                </div>
                                            )}

                                            {/* Info Detalle */}
                                            <div className="group relative">
                                                <Button size="icon" variant="ghost" asChild className="h-8 w-8 rounded-none border border-[#C9A84C]/20 text-[#F5F0E8]/40 hover:border-[#C9A84C] hover:text-[#C9A84C] hover:bg-[#C9A84C]/[0.07] transition-all duration-300">
                                                    <Link to={`/subasta/detalle/${item.id}`}><Info className="h-4 w-4" /></Link>
                                                </Button>
                                                <span className="absolute bottom-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#C9A84C] text-[#080807] text-[9px] font-medium tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">Detalles</span>
                                            </div>

                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="py-20 text-center">
                                    <div className="flex flex-col items-center gap-3 opacity-20">
                                        <div className="w-2 h-2 border border-[#C9A84C] rotate-45" />
                                        <span className="text-[11px] tracking-[0.3em] uppercase">No hay subastas registradas</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Footer / Regresar */}
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