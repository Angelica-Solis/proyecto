import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import objetooService from "@/services/ObjetoService"; //
import { Info } from "lucide-react";

export function ObjetoTable() {
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
    // Llamada directa usando Axios al cargar el componente
    objetooService.getListadoObjeto() //
    .then((response) => {
        console.log("Datos del servidor:", response.data.data);
        setData(response.data.data);
        setLoading(false);
    })
    .catch((error) => {
        console.error("Error al obtener los objetoos:", error);
        setLoading(false);
    });
    }, []);

    if (loading) return <div className="p-4 text-center">Cargando objetoos...</div>;

    return (
    <div className="rounded-md border m-4">
    <Table>
        <TableHeader className="bg-muted/50">
        <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Categorias</TableHead>
            <TableHead>Condicion</TableHead>
            <TableHead>Dueño</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
        </TableHeader>
        <TableBody>
        {data.length > 0 ? (
            data.map((objetoo, index) => (
            <TableRow key={index}>
                <TableCell className="font-medium">{objetoo.nombreObjeto}</TableCell>
                <TableCell>{objetoo.categorias}</TableCell>
                
                <Badge variant="outline">{objetoo.condicion}</Badge>
                
                <TableCell>{objetoo.duenno}</TableCell>
                <TableCell className="text-right">
                <Button size="icon" variant="ghost" asChild>
                    <Link to={`/objeto/detalle/${objetoo.id}`}>
                    <Info className="h-4 w-4" />
                    </Link>
                </Button>
                </TableCell>
            </TableRow>
            ))
        ) : (
            <TableRow>
            <TableCell colSpan={4} className="text-center">No hay datos</TableCell>
            </TableRow>
        )}
        </TableBody>
    </Table>
    </div>
);
}