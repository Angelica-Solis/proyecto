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
import UserService from "@/services/UserService"; //
import { Info } from "lucide-react";

export function UserTable() {
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
    // Llamada directa usando Axios al cargar el componente
    UserService.getUsers() //
    .then((response) => {
        console.log("Datos del servidor:", response.data.data);
        setData(response.data.data);
        setLoading(false);
    })
    .catch((error) => {
        console.error("Error al obtener usuarios:", error);
        setLoading(false);
    });
    }, []);

    if (loading) return <div className="p-4 text-center">Cargando usuarios...</div>;

    return (
    <div className="rounded-md border m-4">
    <Table>
        <TableHeader className="bg-muted/50">
        <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
        </TableHeader>
        <TableBody>
        {data.length > 0 ? (
            data.map((user, index) => (
            <TableRow key={index}>
                <TableCell className="font-medium">{user.nombreUsuario}</TableCell>
                <TableCell>{user.rol}</TableCell>
                <TableCell>
                <Badge variant="outline">{user.estado}</Badge>
                </TableCell>
                <TableCell className="text-right">
                <Button size="icon" variant="ghost" asChild>
                    <Link to={`/user/detail/${user.id}`}>
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