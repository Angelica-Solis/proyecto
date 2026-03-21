import { useEffect, useState } from "react";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import objetooService from "@/services/ObjetoService";
import { ArrowLeft, Info, Trash2, Edit, Plus } from "lucide-react";

export function ObjetoTable() {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        objetooService.getListadoObjeto()
            .then((response) => { setData(response.data.data); setLoading(false); })
            .catch((error) => { console.error("Error al obtener los objetos:", error); setLoading(false); });
    }, []);

    const handleDelete = (id) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar este objeto?")) {
            // Aquí va la logica de eliminacion
            console.log("Eliminar objeto:", id);
        }
    };

    return (
        <div className="min-h-screen bg-[#080807] text-[#F5F0E8] p-10 font-sans">

            {/* Encabezado */}
            <div className="mb-10">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-7 h-px bg-[#C9A84C]" />
                            <span className="text-[#C9A84C] uppercase tracking-[0.4em] text-[12px] font-medium">
                                Panel de Control
                            </span>
                        </div>
                        <h1 className="text-4xl font-light tracking-tight leading-none">
                            Listado de{" "}
                            <em className="text-[#C9A84C] not-italic font-light">Objetos</em>
                        </h1>
                    </div>

                    {/* Boton agregar */}
                    <div className="group relative">
                        <Button
                            onClick={() => navigate('/objeto/create')}
                            className="w-10 h-10 p-0 rounded-none border border-[#C9A84C]/40 bg-[#C9A84C]/10 text-[#C9A84C] hover:border-[#C9A84C] hover:bg-[#C9A84C]/20 hover:shadow-[0_0_12px_rgba(201,168,76,0.3)] transition-all duration-300"
                        >
                            <Plus className="h-5 w-5" />
                        </Button>
                        {/* Tooltip */}
                        <span className="absolute top-12 right-0 px-3 py-1.5 bg-[#C9A84C] text-[#080807] text-[10px] font-medium tracking-[0.2em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                            Agregar Objeto
                        </span>
                    </div>
                </div>
            </div>

            {/* Tabla */}
            <div className="border border-[#C9A84C]/20 bg-[#0E0D0B] overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="border-b border-[#C9A84C]/20 bg-[#C9A84C]/5 hover:bg-[#C9A84C]/5">
                            {["Nombre", "Imagen", "Condición", "Dueño", "Acciones"].map((h, i) => (
                                <TableHead
                                    key={i}
                                    className={`text-[#C9A84C] text-[11px] font-medium tracking-[0.35em] uppercase py-4 border-b border-[#C9A84C]/20 ${i === 4 ? "text-right pr-4" : ""}`}
                                >
                                    {h}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>

                        {/* Estado: cargando */}
                        {loading ? (
                            <TableRow className="hover:bg-transparent border-0">
                                <TableCell colSpan={5} className="py-16 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-7 h-7 rounded-full border-2 border-[#C9A84C]/20 border-t-[#C9A84C] animate-spin" />
                                        <span className="text-[12px] tracking-[0.35em] uppercase text-[#F5F0E8]/40">
                                            Cargando objetos…
                                        </span>
                                    </div>
                                </TableCell>
                            </TableRow>

                        ) : data.length > 0 ? (
                            data.map((objetoo, index) => (
                                <TableRow
                                    key={index}
                                    className={`
                                        border-b border-[#C9A84C]/[0.07] transition-colors duration-200
                                        hover:bg-[#C9A84C]/[0.06]
                                        ${index % 2 !== 0 ? "bg-[#F5F0E8]/[0.03]" : "bg-transparent"}
                                    `}
                                >
                                    {/* Nombre */}
                                    <TableCell className="py-3">
                                        <span className="text-base font-light italic text-[#F5F0E8]">
                                            {objetoo.nombreObjeto}
                                        </span>
                                    </TableCell>

                                    {/* Imagen del objeto */}
                                    <TableCell className="py-3">
                                        <img
                                            src={`http://127.0.0.1:81/proyecto/api/uploads/${objetoo.imagenPrincipal}`}
                                            alt={objetoo.nombreObjeto}
                                            className="w-16 h-16 object-cover border border-[#C9A84C]/25 hover:border-[#C9A84C]/60 transition-all duration-300"
                                        />
                                    </TableCell>

                                    {/* Condicion */}
                                    <TableCell className="py-3">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 border border-[#C9A84C]/25 bg-[#C9A84C]/[0.07] text-[#C9A84C] text-[11px] font-medium tracking-[0.3em] uppercase">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] shadow-[0_0_6px_#C9A84C]" />
                                            {objetoo.condicion}
                                        </span>
                                    </TableCell>

                                    {/* Dueño */}
                                    <TableCell className="py-3">
                                        <span className="text-[13px] font-light tracking-wide text-[#F5F0E8]/50">
                                            {objetoo.duenno}
                                        </span>
                                    </TableCell>

                                    {/* Acciones */}
                                    <TableCell className="py-3 pr-4">
                                        <div className="flex items-center justify-end gap-2">
                                            {/* Boton ver detalle*/}
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                asChild
                                                className="w-8 h-8 p-0 rounded-none border border-[#C9A84C]/20 text-[#F5F0E8]/50 hover:border-[#C9A84C] hover:text-[#C9A84C] hover:bg-[#C9A84C]/[0.07] transition-all duration-300"
                                            >
                                                <Link to={`/objeto/detalle/${objetoo.id}`}>
                                                    <Info className="h-4 w-4" />
                                                </Link>
                                            </Button>

                                            {/* Boton modificar */}
                                            <div className="group relative">
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() => navigate(`/objeto/editar/${objetoo.id}`)}
                                                    className="w-8 h-8 p-0 rounded-none border border-[#4A9EFF]/20 text-[#4A9EFF]/70 hover:border-[#4A9EFF] hover:text-[#4A9EFF] hover:bg-[#4A9EFF]/[0.1] transition-all duration-300"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                {/* Tooltip */}
                                                <span className="absolute bottom-10 right-0 px-2 py-1 bg-[#4A9EFF] text-[#080807] text-[9px] font-medium tracking-[0.15em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                                                    Modificar
                                                </span>
                                            </div>

                                            {/* Boton eliminar */}
                                            <div className="group relative">
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() => handleDelete(objetoo.id)}
                                                    className="w-8 h-8 p-0 rounded-none border border-[#FF4A4A]/20 text-[#FF4A4A]/70 hover:border-[#FF4A4A] hover:text-[#FF4A4A] hover:bg-[#FF4A4A]/[0.1] transition-all duration-300"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                                {/* Tooltip */}
                                                <span className="absolute bottom-10 right-0 px-2 py-1 bg-[#FF4A4A] text-[#080807] text-[9px] font-medium tracking-[0.15em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                                                    Eliminar
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))

                        ) : (
                            /* Estado: vacío */
                            <TableRow className="hover:bg-transparent border-0">
                                <TableCell colSpan={5} className="py-16 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-2 h-2 border border-[#C9A84C]/50 rotate-45" />
                                        <span className="text-[12px] tracking-[0.35em] uppercase text-[#F5F0E8]/40">
                                            No hay objetos para mostrar
                                        </span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}

                    </TableBody>
                </Table>
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