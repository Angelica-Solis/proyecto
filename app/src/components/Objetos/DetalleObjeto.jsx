import { useEffect, useState } from "react";


import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import objetooService from "@/services/ObjetoService"; //
import { ArrowLeft, Calendar, Globe, User } from "lucide-react";
import { LoadingGrid } from "../ui/custom/LoadingGrid";
import { ErrorAlert } from "../ui/custom/ErrorAlert";
import { EmptyState } from "../ui/custom/EmptyState";
import { Card, CardContent } from "../ui/card";

export function ObjetoDetalle() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await objetooService.getDetalleObjeto(id);
                // Si la petición es exitosa, se guardan los datos
                console.log(response.data)
                setData(response.data);
                if (!response.data.success) {
                    setError(response.data.message)
                }
            } catch (err) {
                // Si el error no es por cancelación, se registra
                if (err.name !== "AbortError") setError(err.message);
            } finally {
                // Independientemente del resultado, se actualiza el loading
                setLoading(false);
            }
        };
        fetchData(id)
    }, [id]);


    if (loading) return <LoadingGrid count={1} type="grid" />;
    if (error) return <ErrorAlert title="Error al cargar detalle del objeto" message={error} />;
    if (!data || data.data.length === 0)
        return <EmptyState message="No se encontraron detalles de objeto en este apartado." />;

    return (
        <div className="max-w-5xl mx-auto py-12 px-4 flex flex-col items-center">

            <div className="w-full md:w-4/5 space-y-6">

                <div className="text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                        {data.data.nombreObjeto}
                    </h1>
                </div>

                <Card className="shadow-xl border border-border">
                    <CardContent className="p-8">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">

                            {/* Columna izquierda */}
                            <div className="space-y-6">

                                <div className="flex items-start gap-3">
                                    <User className="h-5 w-5 text-primary mt-1" />
                                    <div>
                                        <span className="font-semibold">Descripción:</span>
                                        <p className="text-muted-foreground">
                                            {data.data.descripcionObjeto}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Calendar className="h-5 w-5 text-primary mt-1" />
                                    <div>
                                        <span className="font-semibold">Fecha Registro:</span>
                                        <p className="text-muted-foreground">
                                            {data.data.fechaRegistro}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Globe className="h-5 w-5 text-primary mt-1" />
                                    <div>
                                        <span className="font-semibold">Condición:</span>
                                        <p className="text-muted-foreground">
                                            {data.data.condicion}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Globe className="h-5 w-5 text-primary mt-1" />
                                    <div>
                                        <span className="font-semibold">Estado:</span>
                                        <p className="text-muted-foreground">
                                            {data.data.estado}
                                        </p>
                                    </div>
                                </div>

                            </div>

                            {/* Columna derecha */}
                            <div className="space-y-6">

                                <div className="flex items-start gap-3">
                                    <Globe className="h-5 w-5 text-primary mt-1" />
                                    <div>
                                        <span className="font-semibold">Propietario:</span>
                                        <p className="text-muted-foreground">
                                            {data.data.propietario}
                                        </p>
                                    </div>
                                </div>

                                {/* Categorias */}
                                <div className="flex items-start gap-3">
                                    <Globe className="h-5 w-5 text-primary mt-1" />
                                    <div>
                                        <span className="font-semibold">Categorías:</span>
                                        <div className="flex flex-col">
                                            {data.data.categorias?.map((cat, index) => (
                                                <span key={index} className="text-muted-foreground">
                                                    {cat.nombreCategoria}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Imagen*/}
                                <div className="flex flex-col items-center">
                                    <span className="font-semibold mb-2">Imagen:</span>
                                    {data.data.imagenes?.map((img, index) => (
                                        <img
                                            key={index}
                                            src={`http://127.0.0.1:81/proyecto/api/uploads/${img.nombreImagen}`}
                                            alt={data.data.nombreObjeto}
                                            className=" w-64 rounded-xl shadow-lg border border-border object-cover hover:scale-105 transition-transform" />))}
                                </div>
                            </div>

                            {/* Subastas */}
                            <div className="col-span-2 flex items-start gap-3">
                                <Globe className="h-5 w-5 text-primary mt-1" />
                                <div>
                                    <span className="font-semibold">Subastas:</span>

                                    <div className="flex flex-col gap-2 mt-1">
                                        {data.data.subastas?.map((subasta, index) => (
                                            <div key={index} className="text-muted-foreground border-l-2 border-primary pl-3">

                                                <div>
                                                    Subasta Nº {subasta.id}
                                                </div>

                                                <div>
                                                    Inicio: {subasta.fechaInicio}
                                                </div>

                                                <div>
                                                    Cierre: {subasta.fechaCierre}
                                                </div>

                                                <div>
                                                    Estado:
                                                    <span>
                                                        {" "}{subasta.estado}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <Button
                type="button"
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 bg-accent text-white hover:bg-accent/90 mt-6">
                <ArrowLeft className="w-4 h-4" />
                Regresar
            </Button>
        </div>
    );
}