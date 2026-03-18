import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Info, Edit, Rocket, XCircle, Plus } from "lucide-react";
import subastaService from "@/services/SubastaService";
import { toast } from "sonner";

export function SubastaMantenimiento() {
const navigate = useNavigate();
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);

  // 1. Cargar todas las subastas al inicio
    const cargarSubastas = () => {
    setLoading(true);
    subastaService.getAll()
        .then((response) => {
        setData(response.data.data);
        setLoading(false);
        })
        .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
        });
    };

    useEffect(() => {
    cargarSubastas();
    }, []);

  // 2. Funciones de Acción
    const handlePublicar = async (id) => {
    try {
        await subastaService.publicar(id);
        toast.success("Subasta publicada con éxito");
      cargarSubastas(); // Recargar tabla
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

    return (
    <div className="container mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-8">
        <div>
        <div className="flex items-center gap-3 mb-3">
            <div className="w-7 h-px bg-[#C9A84C]" />
            <span className="text-[#C9A84C] uppercase tracking-[0.4em] text-[12px] font-medium">
            Panel de Gestión
            </span>
        </div>

        <h1 className="text-4xl font-light tracking-tight leading-none">
            Mantenimiento de{" "}
            <em className="text-[#C9A84C] not-italic font-light">
            Subastas
            </em>
        </h1>
        </div>
        
        {/* Botón Crear Nueva */}
        <Button 
            onClick={() => navigate("/mantenimiento/subastas/crear")}
            className="bg-[#C9A84C] hover:bg-[#A68A3D] text-black font-bold px-6"
        >
            <Plus className="mr-2 h-4 w-4" /> NUEVA SUBASTA
        </Button>
        </div>

        <div className="rounded-sm border border-[#F5F0E8]/10 bg-[#0F0F0F]/40 backdrop-blur-sm">
        <Table>
            <TableHeader className="bg-[#F5F0E8]/[0.02]">
            <TableRow className="border-[#F5F0E8]/10 hover:bg-transparent">
                <TableHead className="text-[#F5F0E8]/40 uppercase text-[11px] tracking-[0.2em]">ID</TableHead>
                <TableHead className="text-[#F5F0E8]/40 uppercase text-[11px] tracking-[0.2em]">Objeto</TableHead>
                <TableHead className="text-[#F5F0E8]/40 uppercase text-[11px] tracking-[0.2em]">Precio Base</TableHead>
                <TableHead className="text-[#F5F0E8]/40 uppercase text-[11px] tracking-[0.2em]">Estado</TableHead>
                <TableHead className="text-[#F5F0E8]/40 uppercase text-[11px] tracking-[0.2em] text-right">Acciones</TableHead>
            </TableRow>
            </TableHeader>
            
            <TableBody>
            {data.length > 0 ? (
                data.map((item) => (
                <TableRow key={item.id} className="border-[#F5F0E8]/5 hover:bg-[#F5F0E8]/[0.02] transition-colors">
                    <TableCell className="font-mono text-[#C9A84C]">#{item.id}</TableCell>
                    <TableCell className="text-[#F5F0E8]/80">{item.objeto?.nombreObjeto}</TableCell>
                    <TableCell className="text-[#F5F0E8]/80">₡{item.precioBase}</TableCell>
                    <TableCell>
                    <span
                        className={`px-2 py-1 text-[10px] uppercase tracking-widest rounded ${
                        item.idEstadoSubasta === "1"
                            ? "bg-green-500/10 text-green-400"
                            : item.idEstadoSubasta === "2"
                            ? "bg-gray-500/10 text-gray-400"
                            : item.idEstadoSubasta === "3"
                            ? "bg-red-500/10 text-red-400"
                            : item.idEstadoSubasta === "4"
                            ? "bg-blue-500/10 text-blue-400"
                            : "bg-yellow-500/10 text-yellow-400"
                        }`}
                    >
                        {
                        item.idEstadoSubasta === "1"
                            ? "Activa"
                            : item.idEstadoSubasta === "2"
                            ? "Finalizada"
                            : item.idEstadoSubasta === "3"
                            ? "Cancelada"
                            : item.idEstadoSubasta === "4"
                            ? "Borrador"
                            : "Desconocido"
                        }
                    </span>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                    {/* ACCIÓN: EDITAR (Solo Borradores) */}
                    {item.idEstadoSubasta === 4 && (
                        <>
                        <Button 
                            variant="outline" size="icon" className="h-8 w-8 border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                            onClick={() => navigate(`/mantenimiento/subastas/editar/${item.id}`)}
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                            variant="outline" size="icon" className="h-8 w-8 border-green-500/30 text-green-400 hover:bg-green-500/10"
                            onClick={() => handlePublicar(item.id)}
                            title="Publicar ahora"
                        >
                            <Rocket className="h-4 w-4" />
                        </Button>
                        </>
                    )}

                    {/* ACCIÓN: CANCELAR (Solo si es activa y no tiene pujas según lógica backend) */}
                    {item.idEstadoSubasta === 1 && item.cantidadPujas === 0 && (
                        <Button 
                        variant="outline" size="icon" className="h-8 w-8 border-red-500/30 text-red-400 hover:bg-red-500/10"
                        onClick={() => handleCancelar(item.id)}
                        title="Cancelar Subasta"
                        >
                        <XCircle className="h-4 w-4" />
                        </Button>
                    )}

                    <Button variant="ghost" size="icon" className="h-8 w-8 text-[#F5F0E8]/40 hover:text-[#C9A84C]"
                        onClick={() => navigate(`/subasta/detalle/${item.id}`)}
                    >
                        <Info className="h-4 w-4" />
                    </Button>
                    </TableCell>
                </TableRow>
                ))
            ) : (
                <TableRow>
                <TableCell colSpan={5} className="py-20 text-center text-[#F5F0E8]/20 italic">
                    No hay registros en el historial de mantenimiento
                </TableCell>
                </TableRow>
            )}
            </TableBody>
        </Table>
        </div>
    </div>
    );
}