import { useEffect, useState } from "react";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import objetooService from "@/services/ObjetoService";
import { ArrowLeft, Info } from "lucide-react";

export function ObjetoTable() {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        objetooService.getListadoObjeto()
            .then((response) => { setData(response.data.data); setLoading(false); })
            .catch((error) => { console.error("Error al obtener los objetos:", error); setLoading(false); });
    }, []);

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
                    Listado de{" "}
                    <em className="text-[#C9A84C] not-italic font-light">Objetos</em>
                </h1>
            </div>

            {/* Tabla */}
            <div className="border border-[#C9A84C]/20 bg-[#0E0D0B] overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="border-b border-[#C9A84C]/20 bg-[#C9A84C]/5 hover:bg-[#C9A84C]/5">
                            {["Nombre", "Imagen", "Condición", "Dueño", ""].map((h, i) => (
                                <TableHead
                                    key={i}
                                    className={`text-[#C9A84C] text-[11px] font-medium tracking-[0.35em] uppercase py-4 border-b border-[#C9A84C]/20 ${i === 4 ? "text-right" : ""}`}
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
                                    <TableCell className="py-3 pr-4 text-right">
                                        <Button size="icon" variant="ghost" asChild className="w-8 h-8 p-0 rounded-none border border-[#C9A84C]/20 text-[#F5F0E8]/50 hover:border-[#C9A84C] hover:text-[#C9A84C] hover:bg-[#C9A84C]/[0.07] transition-all duration-300">
                                            <Link to={`/objeto/detalle/${objetoo.id}`}>
                                                <Info className="h-4 w-4" />
                                            </Link>
                                        </Button>
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