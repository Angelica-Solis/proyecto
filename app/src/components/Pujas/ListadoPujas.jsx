import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import pujaaService from "@/services/PujaService";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";

export function PujaTable() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        pujaaService.historial(id)
            .then((response) => {
                setData(response.data.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error:", error);
                setLoading(false);
            });
    }, [id]);

    if (loading)
        return (
            <div className="flex justify-center items-center h-40">
                <span className="text-white/60 text-sm">
                    Cargando historial...
                </span>
            </div>
        );

    return (
        <div className="max-w-3xl mx-auto px-6 py-10">

            {/* Título */}
            <h1 className="text-2xl font-semibold text-white mb-1">
                Historial de Pujas
            </h1>
            <p className="text-sm text-white/50 mb-6">
                Registro de todas las ofertas realizadas
            </p>

            {/* Tabla */}
            <div className="overflow-hidden border border-white/10">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-white/5 border-b border-white/10 hover:bg-white/5">
                            <TableHead className="text-xs font-semibold text-white/60 uppercase tracking-wider py-3 px-4">
                                Usuario
                            </TableHead>
                            <TableHead className="text-xs font-semibold text-white/60 uppercase tracking-wider py-3 px-4">
                                Monto ofertado
                            </TableHead>
                            <TableHead className="text-xs font-semibold text-white/60 uppercase tracking-wider py-3 px-4">
                                Fecha y hora
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length > 0 ? (
                            data.map((puja, index) => (
                                <TableRow
                                    key={index}
                                    className="border-b border-white/10 hover:bg-white/5 transition-colors duration-150">
                                    <TableCell className="py-3 px-4 font-medium text-white">
                                        {puja.nombreUsuario}
                                    </TableCell>
                                    <TableCell className="py-3 px-4 text-white">
                                        ₡ {puja.monto}
                                    </TableCell>
                                    <TableCell className="py-3 px-4 text-sm text-white/60">
                                        {new Date(puja.fechaHora).toLocaleString()}
                                    </TableCell>
                                </TableRow>
                            ))) : (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center py-10 text-sm text-white/40">
                                    No hay pujas registradas
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            {/* Botón de regresar */}
            <div className="mt-6">
                <Button variant="outline" onClick={() => navigate(-1)} className="flex items-center gap-2 border-white/20 text-white bg-transparent hover:bg-white/10 hover:text-white">
                    <ArrowLeft className="w-4 h-4" />Regresar</Button>
            </div>
        </div>
    );
}