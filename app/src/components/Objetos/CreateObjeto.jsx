import { useEffect, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// shadcn/ui
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// icons
import { Save, ArrowLeft, Upload, X } from "lucide-react";

// servicios
import objetoService from "../../services/ObjetoService";
import ImageService from "../../services/ImageService";
import userService from "../../services/UserService";
import categoriaService from "../../services/CategoriaService";
import condicionService from "../../services/CondicionService";

export function CreateObjeto() {
    const navigate = useNavigate();

    /*** Estados para preview de imágenes ***/
    const [files, setFiles] = useState([]);
    const [fileURLs, setFileURLs] = useState([]);
    const [error, setError] = useState("");
    const [fileURL, setFileURL] = useState(null);
    const usuarioActual = 1; //idvendedor 
    const [vendedor, setVendedor] = useState({ id: 0, nombre: "" });
    const [categoriasOpciones, setCategoriasOpciones] = useState([]);
    const [condicionOpciones, setCondicionOpciones] = useState([]);

    /*** Esquema de validación Yup ***/
    const objetoSchema = yup.object({
        nombreObjeto: yup.string()
            .required('El nombre del objeto es requerido')
            .min(2, 'El nombre debe tener al menos 2 caracteres'),
        descripcionObjeto: yup.string()
            .required('La descripción del objeto es requerida')
            .min(10, 'La descripción debe tener al menos 10 caracteres'),
        idCondicion: yup
            .number()
            .typeError('Seleccione una condición')
            .required('La condición es requerida'),
        idEstadoObjeto: yup
            .number()
            .default(1), // Siempre será 1 (Disponible)
        categorias: yup.array()
            .min(1, 'Seleccione al menos una categoría')
            .required('Las categorías son requeridas'),

        imagen: yup
            .mixed()
            .required("Debes subir una imagen")
    });

    /*** React Hook Form ***/
    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm({
        defaultValues: {
            nombreObjeto: "",
            descripcionObjeto: "",
            duenno: usuarioActual,
            idCondicion: "",
            idEstadoObjeto: 1, // Disponible por defecto
            categorias: []
        },
        resolver: yupResolver(objetoSchema)
    });
    const handleChangeImage = (e) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFiles([selectedFile]);
            setFileURL(URL.createObjectURL(selectedFile));
        }
    };

    //Cargar categorias
    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const res = await categoriaService.getCategorias();

                const categorias = res.data.data.map(c => ({
                    ...c,
                    id: parseInt(c.id)
                }));

                console.log("Categorias:", categorias);

                setCategoriasOpciones(categorias);

            } catch (err) {
                console.error("Error cargando categorías:", err);
            }
        };

        fetchCategorias();
    }, []);

    //Cargar condicion
    useEffect(() => {
        const fetchCondiciones = async () => {
            try {
                const res = await condicionService.getCondicion();

                const condiciones = res.data.data.map(c => ({
                    ...c,
                    id: parseInt(c.id)
                }));

                console.log("Condiciones:", condiciones);

                setCondicionOpciones(condiciones);

            } catch (err) {
                console.error("Error cargando condiciones:", err);
            }
        };

        fetchCondiciones();
    }, []);

    // Cargar info del vendedor
    useEffect(() => {
        const fetchVendedor = async () => {
            try {
                const res = await userService.getUserById(usuarioActual);
                setVendedor(res.data.data);
                setValue("idVendedor", res.data.data.id); // Esto se envía al backend
            } catch (err) {
                console.error("Error al cargar vendedor:", err);
            }
        };
        fetchVendedor();
    }, [usuarioActual, setValue]);

    /*** Submit ***/
    const onSubmit = async (dataForm) => {
        if (files.length === 0) {
            toast.error("Debes seleccionar al menos una imagen para el objeto");
            return;
        }

        try {
            console.log("Datos del formulario:", dataForm);

            // Crear objeto en el API
            const response = await objetoService.createObjeto(dataForm);

            if (response.data) {
                // Subir imágenes
                const objetoId = response.data.data.id;

                for (const file of files) {
                    const formData = new FormData();
                    formData.append("file", file);
                    formData.append("objeto_id", objetoId);

                    console.log("Enviando imagen:", file);

                    const res = await ImageService.createImage(formData);
                    console.log("Respuesta imagen:", res.data);
                }

                // Notificar
                toast.success(
                    `Objeto creado exitosamente: ${response.data.data.nombreObjeto}`,
                    { duration: 3000 }
                );

                // Redireccionar a la lista
                navigate("/objeto/table");
            } else if (response.error) {
                setError(response.error);
                toast.error(response.error);
            }
        } catch (err) {
            console.error(err);
            setError("Error al crear objeto");
            toast.error("Error al crear el objeto");
        }
    };

    if (error) return <p className="text-red-600">{error}</p>;

    return (
        <div className="min-h-screen bg-[#080807] text-[#F5F0E8] p-10 font-sans">
            <Card className="max-w-4xl mx-auto bg-[#0E0D0B] border border-[#C9A84C]/20 p-8">
                {/* Encabezado */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-7 h-px bg-[#C9A84C]" />
                        <span className="text-[#C9A84C] uppercase tracking-[0.4em] text-[12px] font-medium">
                            GESTIÓN DE OBJETOS
                        </span>
                    </div>
                    <h1 className="text-3xl font-light tracking-tight">
                        Crear <em className="text-[#C9A84C] not-italic">Objeto</em>
                    </h1>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Nombre del objeto */}
                    <div>
                        <Label className="block mb-2 text-[#C9A84C] text-[11px] font-medium tracking-[0.2em] uppercase">
                            <span className="text-[#F5F0E8]">📦</span> Nombre del Objeto
                        </Label>
                        <Controller
                            name="nombreObjeto"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    placeholder="Ingrese el nombre del objeto"
                                    className="bg-[#080807] border border-[#C9A84C]/20 text-[#F5F0E8] placeholder:text-[#F5F0E8]/30 focus:border-[#C9A84C] h-11"
                                />
                            )}
                        />
                        {errors.nombreObjeto && (
                            <p className="text-sm text-red-500 mt-1">{errors.nombreObjeto.message}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Dueño */}
                        <div>
                            <Label className="block mb-2 text-[#C9A84C] text-[11px] font-medium tracking-[0.2em] uppercase">
                                <span className="text-[#F5F0E8]">👤</span> Dueño
                            </Label>
                            <Controller
                                name="duenno" // solo para mostrar
                                control={control}
                                render={() => (
                                    <Input
                                        readOnly
                                        value={vendedor?.nombreUsuario || ""}
                                        className="bg-[#080807]/50 border border-[#C9A84C]/20 text-[#F5F0E8] cursor-not-allowed h-11"
                                    />
                                )}
                            />
                            {/* Campo hidden para enviar al backend */}
                            <Controller
                                name="idVendedor"
                                control={control}
                                render={({ field }) => <input type="hidden" {...field} />}
                            />
                            {errors.duenno && (
                                <p className="text-sm text-red-500 mt-1">{errors.duenno.message}</p>
                            )}
                        </div>

                        {/* Condición */}
                        <div>
                            <Label className="block mb-2 text-[#C9A84C] text-[11px] font-medium tracking-[0.2em] uppercase">
                                <span className="text-[#F5F0E8]">⚙️</span> Condición
                            </Label>
                            <Controller
                                name="idCondicion"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        onValueChange={(value) => field.onChange(parseInt(value))}
                                        value={field.value?.toString()}
                                    >
                                        <SelectTrigger className="bg-[#080807] border border-[#C9A84C]/20 text-[#F5F0E8] h-11">
                                            <SelectValue placeholder="Seleccione condición" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#0E0D0B] border border-[#C9A84C]/20">
                                            {condicionOpciones.map((condicion) => (
                                                <SelectItem
                                                    key={condicion.id}
                                                    value={condicion.id.toString()}
                                                >
                                                    {condicion.descripcionCondicion}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.idCondicion && (
                                <p className="text-sm text-red-500 mt-1">{errors.idCondicion.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Estado */}
                    <div>
                        <Label className="block mb-2 text-[#C9A84C] text-[11px] font-medium tracking-[0.2em] uppercase">
                            <span className="text-[#F5F0E8]">📊</span> Estado
                        </Label>
                        <Controller
                            name="idEstadoObjeto"
                            control={control}
                            render={({ field }) => (
                                <div className="bg-[#080807]/50 border border-[#C9A84C]/20 h-11 flex items-center px-3 cursor-not-allowed">
                                    <span className="inline-flex items-center gap-2 text-[#F5F0E8]/70">
                                        <span className="w-2 h-2 rounded-full bg-[#C9A84C] shadow-[0_0_6px_#C9A84C]" />
                                        Disponible
                                    </span>
                                </div>
                            )}
                        />
                        <p className="text-xs text-[#F5F0E8]/40 mt-1">Este campo está fijo en Disponible para nuevos objetos</p>
                    </div>

                    {/* Categorías */}
                    <div>
                        <Label className="block mb-2 text-[#C9A84C] text-[11px] font-medium tracking-[0.2em] uppercase">
                            <span className="text-[#F5F0E8]">🏷️</span> Categorías
                        </Label>
                        <Controller
                            name="categorias"
                            control={control}
                            render={({ field }) => (
                                <div className="space-y-2">
                                    {categoriasOpciones.map((categoria) => (
                                        <label
                                            key={categoria.id}
                                            className="flex items-center gap-3 p-3 border border-[#C9A84C]/20 bg-[#080807] hover:bg-[#C9A84C]/5 cursor-pointer transition-colors"
                                        >
                                            <input
                                                type="checkbox"
                                                value={categoria.id}
                                                checked={field.value?.includes(categoria.id)}
                                                onChange={(e) => {
                                                    const checked = e.target.checked;
                                                    const value = parseInt(e.target.value);
                                                    if (checked) {
                                                        field.onChange([...(field.value || []), value]);
                                                    } else {
                                                        field.onChange(
                                                            field.value?.filter((id) => id !== value) || []
                                                        );
                                                    }
                                                }}
                                                className="w-4 h-4 accent-[#C9A84C]"
                                            />
                                            <span className="text-[#F5F0E8] text-sm">{categoria.nombreCategoria}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        />
                        {errors.categorias && (
                            <p className="text-sm text-red-500 mt-1">{errors.categorias.message}</p>
                        )}
                    </div>

                    {/* Descripción */}
                    <div>
                        <Label className="block mb-2 text-[#C9A84C] text-[11px] font-medium tracking-[0.2em] uppercase">
                            <span className="text-[#F5F0E8]">📝</span> Descripción
                        </Label>
                        <Controller
                            name="descripcionObjeto"
                            control={control}
                            render={({ field }) => (
                                <Textarea
                                    {...field}
                                    placeholder="Describa el objeto en detalle"
                                    className="bg-[#080807] border border-[#C9A84C]/20 text-[#F5F0E8] placeholder:text-[#F5F0E8]/30 focus:border-[#C9A84C] min-h-[120px] resize-none"
                                />
                            )}
                        />
                        {errors.descripcionObjeto && (
                            <p className="text-sm text-red-500 mt-1">{errors.descripcionObjeto.message}</p>
                        )}
                    </div>

                    {/* Imágenes */}
                    <div>
                        <Label className="block mb-2 text-[#C9A84C] text-[11px] font-medium tracking-[0.2em] uppercase">
                            <span className="text-[#F5F0E8]">📷</span> Imágenes
                        </Label>

                        {/* Imagen */}
                        <div className="mb-6">
                            <Label htmlFor="image" className="block mb-1 text-sm font-medium">
                                Imagen
                            </Label>

                            <div
                                className="relative w-56 h-56 border-2 border-dashed border-muted/50 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden hover:border-primary transition-colors"
                                onClick={() => document.getElementById("image").click()}
                            >
                                {!fileURL && (
                                    <div className="text-center px-4">
                                        <p className="text-sm text-muted-foreground">Haz clic o arrastra una imagen</p>
                                        <p className="text-xs text-muted-foreground">(jpg, png, máximo 5MB)</p>
                                    </div>
                                )}
                                {fileURL && (
                                    <img
                                        src={fileURL}
                                        alt="preview"
                                        className="w-full h-full object-contain rounded-lg shadow-sm"
                                    />
                                )}
                            </div>

                            <input
                                type="file"
                                id="image"
                                className="hidden"
                                accept="image/*"
                                onChange={handleChangeImage}
                            />
                        </div>
                    </div>

                    {/* Botones */}
                    <div className="flex justify-between gap-4 pt-6 border-t border-[#C9A84C]/20">
                        <Button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 border border-[#F5F0E8]/30 bg-[#F5F0E8]/[0.06] text-[#F5F0E8] hover:border-[#C9A84C] hover:text-[#C9A84C] hover:bg-[#C9A84C]/[0.07] transition-all duration-300 text-[9px] tracking-[0.3em] uppercase font-medium px-5 h-10"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            Regresar
                        </Button>

                        <Button
                            type="submit"
                            className="flex items-center gap-2 border border-[#C9A84C] bg-[#C9A84C] text-[#080807] hover:bg-[#C9A84C]/90 transition-all duration-300 text-[9px] tracking-[0.3em] uppercase font-medium px-8 h-10"
                        >
                            <Save className="w-4 h-4" />
                            Guardar Cambios
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}