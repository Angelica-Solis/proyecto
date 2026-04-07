import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
//npm install date-fns -D
import { format, parse } from "date-fns";
import { useNavigate } from "react-router-dom";

// shadcn/ui
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// icons
import { Save, ArrowLeft } from "lucide-react";

// servicios
import ShopRentalService from "../../services/ShopRentalService";
import UserService from "../../services/UserService";


// ✅ Esquema de validación Yup
const movieRentalSchema = yup.object({
    customer_id: yup.number().typeError("Seleccione un cliente").required("El cliente es requerido"),
    rental_date: yup
        .string()
        .required("Especifique una fecha")
        .matches(/^([0-2][0-9]|3[0-1])(\/|-)(0[1-9]|1[0-2])\2(\d{4})$/, "Formato dd/mm/yyyy")
        .test("is-future-date", "La fecha no puede ser menor a la actual", (value) => {
            const currentDate = format(new Date(), "dd/MM/yyyy");
            const inputDate = parse(value, "dd/MM/yyyy", new Date());
            const today = parse(currentDate, "dd/MM/yyyy", new Date());
            return inputDate >= today;
        }),
});

export function CreateMovieRental() {
    const navigate = useNavigate();
    const idShopRental = 1;
    const currentDate = format(new Date(), "dd/MM/yyyy");


    const [dataShopRental, setDataShopRental] = useState({});
    const [dataUsers, setDataUsers] = useState([]);
    const [error, setError] = useState("");
    const { idResultado } = useParams();

    /*** React Hook Form ***/
    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            shop_id: "",
            shop_name: "",
            customer_id: "",
            rental_date: currentDate,
            movies: [],
            total: 0,
        },
        resolver: yupResolver(movieRentalSchema),
    });

    //  Cargar datos de resultado 
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await ResultadoSubastaService.getById(idResultado);
                const resultado = res.data.data;

                setValue("idResultado", resultado.id);
                setValue("montoPagado", resultado.montoFinal);
                setValue("fechaPago", currentDate);
                setValue("idEstadoPago", 1); // Pendiente

            } catch (err) {
                setError(err.message);
            }
        };
        fetchData();
    }, [idResultado]);

    /*** Enviar formulario ***/
    const onSubmit = async (dataForm) => {
        const payload = {
            idResultado: dataForm.idResultado,
            montoPagado: dataForm.montoPagado,
            fechaPago: dataForm.fechaPago,
            idEstadoPago: 1
        };

        await PagoService.create(payload);
    };
    if (error) return <p className="text-red-600">{error}</p>;

    return (
        <Card className="p-6 max-w-3xl mx-auto bg-neutral-900 text-gray-100 border border-gray-700 mt-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Crear Alquiler de Películas</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Fecha */}
                <div>
                    <Label htmlFor="rental_date">Fecha</Label>
                    <Controller
                        name="rental_date"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                id="rental_date"
                                placeholder="dd/mm/yyyy"
                                className="bg-neutral-800 border-gray-700 text-gray-100 mt-1"
                            />
                        )}
                    />
                    {errors.rental_date && <p className="text-sm text-red-500 mt-1">{errors.rental_date.message}</p>}
                </div>

                {/* Tienda */}
                <div>
                    <Label htmlFor="shop_name">Tienda</Label>
                    <Controller
                        name="shop_name"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                id="shop_name"
                                readOnly
                                className="bg-neutral-800 border-gray-700 text-gray-400 cursor-not-allowed mt-1"
                                value={dataShopRental?.name || ""}
                            />
                        )}
                    />
                </div>

                {/* Cliente */}
                <div>
                    <Label htmlFor="customer_id">Cliente</Label>
                    <Controller
                        name="customer_id"
                        control={control}
                        render={({ field }) => (
                            <select
                                {...field}
                                id="customer_id"
                                className="w-full mt-1 bg-neutral-800 border border-gray-700 rounded-md text-gray-100 py-2 px-3"
                            >
                                <option value="">Seleccione un cliente</option>
                                {dataUsers.map((customer) => (
                                    <option key={customer.id} value={customer.id}>
                                        {customer.name}
                                    </option>
                                ))}
                            </select>
                        )}
                    />
                    {errors.customer_id && <p className="text-sm text-red-500 mt-1">{errors.customer_id.message}</p>}
                </div>

                {/* Carrito */}
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2 text-gray-100">Películas</h3>
                    {/*  <Cart />*/}
                </div>

                {/* Botones */}
                <div className="flex justify-between gap-4 mt-8">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600"
                                    onClick={() => navigate(-1)}
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Regresar
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Volver al listado</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <Button type="submit" className="flex items-center gap-2 bg-primary text-white">
                        <Save className="w-4 h-4" />
                        Guardar
                    </Button>
                </div>
            </form>
        </Card>
    );
}
