import { useEffect, useState } from "react";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import objetooService from "@/services/ObjetoService";
import { ArrowLeft, Info, Trash2, Edit, Plus, Eye, EyeOff, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@/hooks/useUser";

export function ObjetoTable() {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [verEliminados, setVerEliminados] = useState(false);

    const { authorize } = useUser();
    const canManage = authorize(["Administrador", "Vendedor"]);

    const cargarObjetos = () => {
        setLoading(true);

        const peticion = verEliminados
            ? objetooService.getEliminados()
            : objetooService.getListadoObjeto();

        peticion
            .then((response) => {
                setData(response.data.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        cargarObjetos();
    }, [verEliminados]);

    const handleDelete = async (id) => {
        if (window.confirm("¿Deseas mover este objeto a la papelera?")) {
            try {
                await objetooService.delete(id);
                toast.success("Objeto eliminado lógicamente");
                cargarObjetos();
            } catch (error) {
                toast.error("Error al eliminar");
            }
        }
    };

    const handleRestore = async (id) => {
        try {
            await objetooService.restore(id);
            toast.success("Objeto restaurado");
            setVerEliminados(false);
            cargarObjetos();
        } catch {
            toast.error("No se pudo restaurar");
        }
    };

    const objetosFiltrados = data.filter(obj =>
        verEliminados ? obj.idEstadoObjeto === '4' : obj.idEstadoObjeto !== '4'
    );


    return (
        <div className="min-h-screen bg-[#080807] text-[#F5F0E8] p-10 font-sans">

            {/* Encabezado */}
            <div className="mb-10">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-7 h-px bg-[#C9A84C]" />
                            <span className="text-[#C9A84C] uppercase tracking-[0.4em] text-[12px] font-medium">
                                {verEliminados ? "Archivo / Papelera" : "Panel de Control"}
                            </span>
                        </div>
                        <h1 className="text-4xl font-light tracking-tight leading-none">
                            {verEliminados ? "Objetos " : "Listado de "}
                            <em className="text-[#C9A84C] not-italic font-light">
                                {verEliminados ? "Eliminados" : "Objetos"}
                            </em>
                        </h1>
                    </div>

                    {canManage && (
                        <div className="flex items-center gap-4">

                            {/* Toggle papelera */}
                            <div className="relative group/btn">
                                <Button
                                    onClick={() => setVerEliminados(!verEliminados)}
                                    className={`w-10 h-10 p-0 rounded border transition-all duration-300 ${verEliminados
                                        ? "border-blue-400/40 bg-blue-400/10 text-blue-400 hover:bg-blue-400/20"
                                        : "border-[#F5F0E8]/20 bg-transparent text-[#F5F0E8]/50 hover:border-[#F5F0E8] hover:text-[#F5F0E8]"
                                        }`}
                                >
                                    {verEliminados ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                                </Button>
                                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-0.5 bg-[#1a1a16] text-[#F5F0E8] text-[10px] whitespace-nowrap border border-[#C9A84C]/20 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none z-10 tracking-wide">
                                    {verEliminados ? "Ver activos" : "Ver papelera"}
                                </span>
                            </div>

                            {/* Crear */}
                            {!verEliminados && (
                                <div className="relative group/btn">
                                    <Button
                                        onClick={() => navigate('/objeto/create')}
                                        className="w-10 h-10 p-0 rounded border border-[#C9A84C]/40 bg-[#C9A84C]/10 text-[#C9A84C] hover:border-[#C9A84C] hover:bg-[#C9A84C]/20 hover:shadow-[0_0_12px_rgba(201,168,76,0.3)] transition-all duration-300"
                                    >
                                        <Plus className="h-5 w-5" />
                                    </Button>
                                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-0.5 bg-[#1a1a16] text-[#F5F0E8] text-[10px] whitespace-nowrap border border-[#C9A84C]/20 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none z-10 tracking-wide">
                                        Crear nuevo
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Tabla */}
            <div className="border border-[#C9A84C]/20 bg-[#0E0D0B] overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="border-b border-[#C9A84C]/20 bg-[#C9A84C]/5">
                            {["Nombre", "Imagen", "Condición", "Dueño", "Acciones"].map((h, i) => (
                                <TableHead
                                    key={i}
                                    className={`text-[#C9A84C] text-[11px] tracking-[0.35em] uppercase ${i === 4 ? "text-right pr-4" : ""}`}
                                >
                                    {h}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10">
                                    Cargando...
                                </TableCell>
                            </TableRow>
                        ) : objetosFiltrados.map((objetoo, index) => {
                            console.log("OBJETO:", objetoo);

                            return (
                                <TableRow key={index} className="border-b border-[#C9A84C]/[0.07]">

                                    <TableCell>{objetoo.nombreObjeto}</TableCell>

                                    <TableCell>
                                        <img
                                            src={`http://127.0.0.1:81/proyecto/api/uploads/${objetoo.imagenPrincipal}`}
                                            className="w-16 h-16 object-cover border border-[#C9A84C]/25"
                                        />
                                    </TableCell>

                                    <TableCell>{objetoo.condicion}</TableCell>
                                    <TableCell>{objetoo.duenno}</TableCell>

                                    <TableCell className="pr-4">
                                        <div className="flex justify-end gap-2">

                                            {/* DETALLE */}
                                            <div className="relative group/btn">
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    asChild
                                                    className="bg-blue-500/10 text-blue-400 hover:bg-blue-500/25 rounded"
                                                >
                                                    <Link to={`/objeto/detalle/${objetoo.id}`}>
                                                        <Info className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-0.5 bg-[#1a1a16] text-[#F5F0E8] text-[10px] whitespace-nowrap border border-[#C9A84C]/20 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none z-10 tracking-wide">
                                                    Ver detalle
                                                </span>
                                            </div>

                                            {/* SOLO ADMIN/VENDEDOR */}
                                            {canManage && (
                                                verEliminados ? (
                                                    /* RESTAURAR */
                                                    <div className="relative group/btn">
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            onClick={() => handleRestore(objetoo.id)}
                                                            className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/25 rounded"
                                                        >
                                                            <RotateCcw className="h-4 w-4" />
                                                        </Button>
                                                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-0.5 bg-[#1a1a16] text-[#F5F0E8] text-[10px] whitespace-nowrap border border-[#C9A84C]/20 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none z-10 tracking-wide">
                                                            Restaurar
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <>
                                                        {/* EDITAR */}
                                                        <div className="relative group/btn">
                                                            <Button
                                                                size="icon"
                                                                variant="ghost"
                                                                onClick={() => navigate(`/objeto/update/${objetoo.id}`)}
                                                                className="bg-[#C9A84C]/10 text-[#C9A84C] hover:bg-[#C9A84C]/25 rounded"
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-0.5 bg-[#1a1a16] text-[#F5F0E8] text-[10px] whitespace-nowrap border border-[#C9A84C]/20 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none z-10 tracking-wide">
                                                                Editar
                                                            </span>
                                                        </div>

                                                        {/* ELIMINAR */}
                                                        <div className="relative group/btn">
                                                            <Button
                                                                size="icon"
                                                                variant="ghost"
                                                                onClick={() => handleDelete(objetoo.id)}
                                                                className="bg-red-500/10 text-red-400 hover:bg-red-500/25 rounded"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-0.5 bg-[#1a1a16] text-[#F5F0E8] text-[10px] whitespace-nowrap border border-[#C9A84C]/20 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none z-10 tracking-wide">
                                                                Eliminar
                                                            </span>
                                                        </div>
                                                    </>
                                                )
                                            )}

                                        </div>
                                    </TableCell>

                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>

            {/* Footer */}
            <div className="mt-8 flex">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 border border-[#F5F0E8]/30 bg-[#F5F0E8]/[0.06] text-[#F5F0E8] hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all text-[9px] tracking-[0.3em] uppercase px-5 h-9"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Regresar
                </button>
            </div>

        </div>
    );
}