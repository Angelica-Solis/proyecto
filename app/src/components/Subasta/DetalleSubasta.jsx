import { useEffect, useState } from "react";


import { Button } from "@/components/ui/button";
import { Link, useNavigate, useParams } from "react-router-dom";
import subastaaService from "@/services/SubastaService"; //
import { ArrowLeft, Calendar, CircleDollarSign, Flag, Gavel, Info, Layers, Package, ShieldCheck, Tag, TrendingUp } from "lucide-react";
import { LoadingGrid } from "../ui/custom/LoadingGrid";
import { ErrorAlert } from "../ui/custom/ErrorAlert";
import { EmptyState } from "../ui/custom/EmptyState";
import { Card, CardContent } from "../ui/card";

export function SubastaDetalle() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await subastaaService.getDetalle(id);
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
    if (error) return <ErrorAlert title="Error al cargar detalle de la subasta" message={error} />;
    if (!data || data.data.length === 0)
        return <EmptyState message="No se encontraron detalles de la subasta en este apartado." />;

    return (
        <div className="max-w-5xl mx-auto py-12 px-4 flex flex-col items-center">

            <div className="w-full md:w-4/5 space-y-6">

                <div className="text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                        Detalle de la Subasta
                    </h1>
                </div>

                <Card className="shadow-xl border border-border relative">
                    <CardContent className="p-8">

                        {/* Botón para historial de pujas */}
                        <Button
                            asChild
                            title="Historial de pujas"
                            className="
                            absolute top-6 right-6
                            flex items-center gap-2
                            bg-primary text-primary-foreground
                            hover:bg-primary/90
                            hover:scale-105
                            shadow-lg hover:shadow-xl
                            transition-all duration-200
                            rounded-lg px-4 py-2">
                            <Link to={`/puja/listado/${data.data.id}`}>
                                <Gavel className="h-5 w-5" />
                                Historial de pujas
                            </Link>
                        </Button>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">

                            {/* Columna izquierda */}
                            <div className="space-y-6">

                                <div className="flex items-start gap-3">
                                    <Calendar className="h-5 w-5 text-primary mt-1" />
                                    <div>
                                        <span className="font-semibold">Fecha de Inicio:</span>
                                        <p className="text-muted-foreground">
                                            {data.data.fechaInicio}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Calendar className="h-5 w-5 text-primary mt-1" />
                                    <div>
                                        <span className="font-semibold">Fecha de Cierre:</span>
                                        <p className="text-muted-foreground">
                                            {data.data.fechaCierre}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <CircleDollarSign className="h-5 w-5 text-primary mt-1" />
                                    <div>
                                        <span className="font-semibold">Precio Base:</span>
                                        <p className="text-muted-foreground">
                                            {data.data.precioBase}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <TrendingUp className="h-5 w-5 text-primary mt-1" />
                                    <div>
                                        <span className="font-semibold">Incremento Mínimo:</span>
                                        <p className="text-muted-foreground">
                                            {data.data.incrementoMinimo}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Flag className="h-5 w-5 text-primary mt-1" />
                                    <div>
                                        <span className="font-semibold">Estado Actual:</span>
                                        <p className="text-muted-foreground">
                                            {data.data.estadoNombre}
                                        </p>
                                    </div>
                                </div>
                                {/* Falta pujas */}
                            </div>

                            {/* Columna derecha */}
                            <div className="space-y-6">

                                {/* Objeto */}
                                <div className="flex items-start gap-4 border-l-4 border-primary pl-5 py-2">

                                    <Package className="h-6 w-6 text-primary mt-1" />

                                    <div className="flex flex-col gap-5 w-full">

                                        <span className="font-semibold text-lg">Objeto</span>

                                        {/* Nombre */}
                                        <div className="flex items-start gap-3">
                                            <Tag className="h-5 w-5 text-primary mt-1" />
                                            <div>
                                                <span className="font-medium">Nombre</span>
                                                <p className="text-muted-foreground">
                                                    {data?.data?.objeto?.nombreObjeto}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Categorías */}
                                        <div className="flex items-start gap-3">
                                            <Layers className="h-5 w-5 text-primary mt-1" />
                                            <div>
                                                <span className="font-medium">Categorías</span>

                                                {data?.data?.objeto?.categorias?.map((cat, index) => (
                                                    <p key={index} className="text-muted-foreground">
                                                        {cat.nombreCategoria}
                                                    </p>
                                                ))}

                                            </div>
                                        </div>

                                        {/* Condición */}
                                        <div className="flex items-start gap-3">
                                            <ShieldCheck className="h-5 w-5 text-primary mt-1" />
                                            <div>
                                                <span className="font-medium">Condición</span>
                                                <p className="text-muted-foreground">
                                                    {data?.data?.objeto?.condicion}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Imagen */}
                                        <div className="flex items-start gap-3">

                                            <div>
                                                <span className="font-medium block mb-2">Producto</span>

                                                {data?.data?.objeto?.imagenes?.map((img, index) => (

                                                    <img
                                                        key={index}
                                                        src={`http://127.0.0.1:81/proyecto/api/uploads/${img.nombreImagen}`}
                                                        alt="Objeto"
                                                        className="w-64 rounded-xl shadow-md border border-border"
                                                    />

                                                ))}

                                            </div>
                                        </div>

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