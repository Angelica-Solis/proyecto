import { useEffect, useState } from "react";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import UserService from "@/services/UserService";
import { ArrowLeft, Info, Pencil, Trash2 } from "lucide-react";

export function UserTable() {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        UserService.getUsers()
            .then((response) => { setData(response.data.data); setLoading(false); })
            .catch((error) => { console.error("Error al obtener usuarios:", error); setLoading(false); });
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
                    <em className="text-[#C9A84C] not-italic font-light">Usuarios</em>
                </h1>
            </div>

            {/* Tabla */}
            <div className="border border-[#C9A84C]/20 bg-[#0E0D0B] overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="border-b border-[#C9A84C]/20 bg-[#C9A84C]/5 hover:bg-[#C9A84C]/5">
                            {["Nombre", "Rol", "Estado", ""].map((h, i) => (
                                <TableHead
                                    key={i}
                                    className={`text-[#C9A84C] text-[11px] font-medium tracking-[0.35em] uppercase py-4 border-b border-[#C9A84C]/20 ${i === 3 ? "text-right" : ""}`}
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
                                <TableCell colSpan={4} className="py-16 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-7 h-7 rounded-full border-2 border-[#C9A84C]/20 border-t-[#C9A84C] animate-spin" />
                                        <span className="text-[12px] tracking-[0.35em] uppercase text-[#F5F0E8]/40">
                                            Cargando usuarios…
                                        </span>
                                    </div>
                                </TableCell>
                            </TableRow>

                        ) : data.length > 0 ? (
                            data.map((user, index) => (
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
                                            {user.nombreUsuario}
                                        </span>
                                    </TableCell>

                                    {/* Rol */}
                                    <TableCell className="py-3">
                                        <span className="inline-flex items-center justify-center px-2.5 py-0.5 border border-[#C9A84C]/25 bg-[#C9A84C]/[0.07] text-[#C9A84C] text-[12px] font-medium tracking-widest">
                                            {user.rol}
                                        </span>
                                    </TableCell>

                                    {/* Estado */}
                                    <TableCell className="py-3">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 border border-[#C9A84C]/25 bg-[#C9A84C]/[0.07] text-[#C9A84C] text-[11px] font-medium tracking-[0.3em] uppercase">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] shadow-[0_0_6px_#C9A84C] animate-pulse" />
                                            {user.estado}
                                        </span>
                                    </TableCell>

                                    {/* Acciones */}
                                    <TableCell className="py-3 pr-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            {/* Boton de info*/}
                                            <div className="relative group/info">
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    asChild
                                                    className="w-8 h-8 p-0 rounded-none border border-[#C9A84C]/20 text-[#F5F0E8]/50 hover:border-[#C9A84C] hover:text-[#C9A84C] hover:bg-[#C9A84C]/[0.07] transition-all duration-300">
                                                    <Link to={`/user/detail/${user.id}`}>
                                                        <Info className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 text-[10px] font-medium tracking-wider uppercase bg-[#1A1A0F] border border-[#C9A84C]/30 text-[#C9A84C] opacity-0 group-hover/info:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                                                    Detalle
                                                </span>
                                            </div>

                                            {/* Boton de editar */}
                                            <div className="relative group/edit">
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    asChild
                                                    className="w-8 h-8 p-0 rounded-none border border-sky-500/20 text-sky-400/50 hover:border-sky-400 hover:text-sky-300 hover:bg-sky-400/[0.07] transition-all duration-300">
                                                    <Link to={`/user/update/${user.id}`}>
                                                    <Pencil className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 text-[10px] font-medium tracking-wider uppercase bg-[#0a1520] border border-sky-500/30 text-sky-300 opacity-0 group-hover/edit:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                                                    Editar
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))

                        ) : (
                            /* Estado: vacío */
                            <TableRow className="hover:bg-transparent border-0">
                                <TableCell colSpan={4} className="py-16 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-2 h-2 border border-[#C9A84C]/50 rotate-45" />
                                        <span className="text-[12px] tracking-[0.35em] uppercase text-[#F5F0E8]/40">
                                            No hay usuarios para mostrar
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