import { useEffect, useState } from "react";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import pujaaService from "@/services/PujaService";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export function PujaTable() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        pujaaService.historial(id)
            .then((response) => { setData(response.data.data); setLoading(false); })
            .catch((error) => { console.error("Error:", error); setLoading(false); });
    }, [id]);

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
                    Historial de{" "}
                    <em className="text-[#C9A84C] not-italic font-light">Pujas</em>
                </h1>
                <p className="text-[12px] font-light tracking-[0.25em] uppercase text-[#F5F0E8]/40 mt-3">
                    Registro de todas las ofertas realizadas
                </p>
            </div>

            {/* Tabla */}
            <div className="border border-[#C9A84C]/20 bg-[#0E0D0B] overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="border-b border-[#C9A84C]/20 bg-[#C9A84C]/5 hover:bg-[#C9A84C]/5">
                            {["Usuario", "Monto Ofertado", "Fecha y Hora"].map((h, i) => (
                                <TableHead key={i} className="text-[#C9A84C] text-[11px] font-medium tracking-[0.35em] uppercase py-4 border-b border-[#C9A84C]/20">
                                    {h}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow className="hover:bg-transparent border-0">
                                <TableCell colSpan={3} className="py-16 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-7 h-7 rounded-full border-2 border-[#C9A84C]/20 border-t-[#C9A84C] animate-spin" />
                                        <span className="text-[12px] tracking-[0.35em] uppercase text-[#F5F0E8]/40">
                                            Cargando historial…
                                        </span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : data.length > 0 ? (
                            data.map((puja, index) => (
                                <TableRow
                                    key={index}
                                    className={`
                                        border-b border-[#C9A84C]/[0.07] transition-colors duration-200
                                        hover:bg-[#C9A84C]/[0.06]
                                        ${index % 2 !== 0 ? "bg-[#F5F0E8]/[0.03]" : "bg-transparent"}
                                    `}
                                >
                                    <TableCell className="py-3">
                                        <span className="text-base font-light italic text-[#F5F0E8]">
                                            {puja.nombreUsuario}
                                        </span>
                                    </TableCell>
                                    <TableCell className="py-3">
                                        <span className="inline-flex items-center justify-center px-2.5 py-0.5 border border-[#C9A84C]/25 bg-[#C9A84C]/[0.07] text-[#C9A84C] text-[13px] font-medium tracking-widest">
                                            ₡ {puja.monto}
                                        </span>
                                    </TableCell>
                                    <TableCell className="py-3">
                                        <span className="text-[13px] font-light tracking-wide text-[#F5F0E8]/50">
                                            {new Date(puja.fechaHora).toLocaleString()}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow className="hover:bg-transparent border-0">
                                <TableCell colSpan={3} className="py-16 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-2 h-2 border border-[#C9A84C]/50 rotate-45" />
                                        <span className="text-[12px] tracking-[0.35em] uppercase text-[#F5F0E8]/40">
                                            No hay pujas registradas
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