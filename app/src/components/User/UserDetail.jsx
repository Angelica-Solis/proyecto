import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Mail, Calendar, Activity, Gavel, Package } from "lucide-react"; 
import UserService from "@/services/UserService";

export function UserDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    UserService.getUserDetail(id)
        .then((res) => {
        const data = res.data.data;
        setUser(data);
        setLoading(false);
        })
        .catch((err) => {
        console.error("Error al cargar:", err);
        setLoading(false);
        });
    }, [id]);

    if (loading) return <div className="p-10 text-center font-bold">Cargando perfil del usuario...</div>;
    if (!user) return <div className="p-10 text-center text-red-500">Error: Usuario no encontrado.</div>;

    return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Volver
        </Button>

      {/* 1. INFORMACIÓN BÁSICA */}
        <Card className="border-t-4 border-primary">
        <CardHeader className="flex flex-row items-center gap-4">
            <div className="p-4 bg-primary/10 rounded-full">
            <User className="h-8 w-8 text-primary" />
            </div>
            <div>
            <CardTitle className="text-2xl font-bold">{user.nombreUsuario}</CardTitle>
            <Badge className="mt-1 font-semibold">{user.nombreRol}</Badge>
            <Badge variant="outline" className="ml-2 text-green-600 border-green-600">
                {user.descripcionEstado}
            </Badge>
            </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm border-t pt-6">
            <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" /> 
            <strong>Email:</strong> {user.emailUsuario}
            </div>
            <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" /> 
            <strong>Registro:</strong> {new Date(user.fecha_registro).toLocaleDateString()}
            </div>
        </CardContent>
        </Card>

      {/* 2. CAMPOS CALCULADOS (ESTADÍSTICAS) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-blue-50/50">
            <CardContent className="p-6 flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-blue-600 uppercase">Subastas Creadas</p>
                <p className="text-3xl font-bold text-blue-900">{user.cantidadSubastas || 0}</p>
            </div>
            <Package className="h-10 w-10 text-blue-200" />
            </CardContent>
        </Card>

        <Card className="bg-green-50/50">
            <CardContent className="p-6 flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-green-600 uppercase">Pujas Realizadas</p>
                <p className="text-3xl font-bold text-green-900">{user.cantidadPujas || 0}</p>
            </div>
            <Gavel className="h-10 w-10 text-green-200" />
            </CardContent>
        </Card>
        </div>

      {/* 3. HISTORIAL DETALLADO */}
        <Card>
        <CardHeader className="bg-muted/50">
            <CardTitle className="text-lg flex items-center gap-2 uppercase tracking-wider">
            <Activity className="h-5 w-5" /> 
            {user.nombreRol === 'Vendedor' ? 'Historial de Ventas' : 'Historial de Participación'}
            </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
            {user.actividad && user.actividad.length > 0 ? (
            <div className="divide-y">
                {user.actividad.map((item, index) => (
                <div key={index} className="py-4 px-6 flex justify-between items-center hover:bg-muted/30 transition-colors">
                    <div>
                    <p className="font-bold text-slate-800 uppercase text-sm">{item.titulo}</p>
                    <p className="text-xs text-muted-foreground">
                        {item.fecha ? new Date(item.fecha).toLocaleString() : 'Fecha no disponible'}
                    </p>
                    </div>
                    <div className="text-right">
                    <p className="font-mono font-bold text-green-600 text-lg">
                        ${parseFloat(item.monto).toLocaleString()}
                    </p>
                    <span className="text-[10px] text-muted-foreground uppercase">Monto</span>
                    </div>
                </div>
                ))}
            </div>
            ) : (
            <p className="text-center py-10 text-muted-foreground italic">
                {user.nombreRol === 'Administrador' ? 'Perfil sin actividad comercial.' : 'Sin movimientos registrados.'}
            </p>
            )}
        </CardContent>
        </Card>
    </div>
    );
}