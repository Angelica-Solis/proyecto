import { useEffect, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

// shadcn/ui
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// icons
import { Plus, Save, ArrowLeft, Tag, AlignLeft, ToggleLeft, Eye, User, ImageIcon } from "lucide-react";

// servicios
import objetoService from "../../services/ObjetoService";
import ImageService from "../../services/ImageService";
import userService from "../../services/UserService";
import categoriaService from "../../services/CategoriaService";

// componentes reutilizables
import { CustomMultiSelect } from "../ui/custom/custom-multiple-select";
import { CustomSelect } from "../ui/custom/custom-select";
import { CustomInputField } from "../ui/custom/custom-input-field";

export function UpdateObjeto() {
    const navigate = useNavigate();
    const { id } = useParams();
    const BASE_URL_image = import.meta.env.VITE_BASE_URL + "uploads";

    const [file, setFile] = useState(null);
    const [fileURL, setFileURL] = useState(null);
    const [error, setError] = useState("");
    const usuarioActual = 1;
    const [vendedor, setVendedor] = useState({ id: 0, nombre: "" });
    const [dataCategorias, setCategorias] = useState([]);

    const objetoSchema = yup.object({
        nombreObjeto: yup.string().required("El nombre del objeto es requerido").min(2, "El nombre del objeto debe tener al menos 2 caracteres"),
        descripcionObjeto: yup.string().required("La descripcion del objeto es requerida"),
        idCondicion: yup.number().typeError("Seleccione una condición").required("La condición es requerida"),
        idEstadoObjeto: yup.number().typeError("Seleccione un estado").required("El estado es requerido"),
        categorias: yup.array().of(yup.number()).min(1, "Seleccione al menos una categoría"),
    });

    const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm({
        defaultValues: {
            nombreObjeto: "",
            descripcionObjeto: "",
            idCondicion: "",
            idVendedor: usuarioActual,
            idEstadoObjeto: "",
            categorias: []
        },
        resolver: yupResolver(objetoSchema),
    });
    // Traer categorias
    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const res = await categoriaService.getCategorias();

                const categorias = res.data.data.map(c => ({
                    ...c,
                    id: parseInt(c.id)
                }));

                console.log("Categorias:", categorias);

                setCategorias(categorias);
            } catch (err) {
                console.error("Error cargando categorías:", err);
            }
        };

        fetchCategorias();
    }, []);

    //Definir vendedor 
    useEffect(() => {
        const fetchVendedor = async () => {
            try {
                const res = await userService.getUserById(usuarioActual);
                setVendedor(res.data.data);
                setValue("idVendedor", res.data.data.id);
            } catch (err) {
                console.error("Error al cargar vendedor:", err);
            }
        };
        fetchVendedor();
    }, [usuarioActual, setValue]);

    const handleChangeImage = (e) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setFileURL(URL.createObjectURL(selectedFile));
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const objetoRes = await objetoService.getObjetoById(id);
                if (objetoRes.data) {
                    const objeto = objetoRes.data.data;
                    reset({
                        nombreObjeto: objeto.nombreObjeto,
                        descripcionObjeto: objeto.descripcionObjeto,
                        idCondicion: objeto.idCondicion,
                        idEstadoObjeto: objeto.idEstadoObjeto,
                        idVendedor: objeto.idVendedor,
                        categorias: objeto.categorias.map(c => parseInt(c.id))
                    });
                    if (objeto.imagenes && objeto.imagenes.length > 0) {
                        setFileURL(`${BASE_URL_image}/${objeto.imagenes[0].nombreImagen}`);
                    }
                    console.log("OBJETO COMPLETO:", objeto);
                }
            } catch (err) {
                if (err.name !== "AbortError") setError(err.message);
            }
        };
        fetchData();
    }, [BASE_URL_image, id, reset]);

    // Envio del formulario
    const onSubmit = async (dataForm) => {
        try {
            const dataToSend = {
                ...dataForm,
                id: parseInt(id),
            };

            if (file) {
                dataToSend.imagenPrincipal = true;
                dataToSend.nombreImagen = file.name;
            }
            console.log("DATA A ENVIAR:", dataToSend);

            const response = await objetoService.getUpdateObjeto(dataToSend);

            if (response.data) {
                if (file) {
                    try {
                        const formData = new FormData();
                        formData.append("file", file);
                        formData.append("objeto_id", response.data.data.id);

                        await ImageService.updateImage(formData);
                    } catch (err) {
                        console.error("Error subiendo la imagen:", err);
                        toast.error("Objeto actualizado, pero la imagen no se pudo subir");
                    }
                }

                toast.success("Objeto actualizado correctamente", {
                    duration: 2000
                });

                setTimeout(() => {
                    navigate("/objeto/listado");
                }, 2000);
            }

        } catch (err) {
            console.error(err);
            setError("Error al actualizar el objeto");
            toast.error("Error al actualizar el objeto");
        }
    };

    if (error) return (
        <div className="min-h-screen bg-[#0A0A05] flex items-center justify-center">
            <p className="text-red-400 text-sm tracking-widest uppercase">{error}</p>
        </div>
    );

    /* Clases reutilizables */
    const labelCls = "flex items-center gap-2 text-[10px] font-semibold tracking-[0.2em] uppercase text-[#C9A84C]/70 mb-1.5";
    const inputCls = "w-full h-11 px-4 bg-[#0D0D08] border border-[#C9A84C]/20 text-[#F5F0E8] placeholder:text-[#F5F0E8]/20 rounded-none focus:outline-none focus:border-[#C9A84C]/60 transition-colors text-sm";
    const errorCls = "text-[11px] text-red-400/80 tracking-wide mt-1";
    const selectCls = `${inputCls} appearance-none cursor-pointer`;

    return (
        <div className="min-h-screen bg-[#0A0A05] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-2xl">

                {/* Header */}
                <div className="mb-8 border-l-2 border-[#C9A84C] pl-4">
                    <p className="text-[10px] tracking-[0.3em] uppercase text-[#C9A84C]/60 mb-1">Gestión de Objetos</p>
                    <h2 className="text-2xl font-light text-[#F5F0E8] tracking-wide">Actualizar Objeto</h2>
                </div>

                {/* Card */}
                <div className="border border-[#C9A84C]/15 bg-[#0D0D08] p-8 space-y-7 relative">

                    {/* Decorative corner */}
                    <span className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[#C9A84C]/30" />
                    <span className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-[#C9A84C]/30" />

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">

                        {/* Grid de nombre y descripcion*/}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                            {/* Nombre */}
                            <div>
                                <label className={labelCls}>
                                    <Tag className="w-3 h-3" />
                                    Nombre del objeto
                                </label>
                                <Controller
                                    name="nombreObjeto"
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            {...field}
                                            id="nombreObjeto"
                                            placeholder="Nombre del objeto"
                                            className={inputCls}
                                        />
                                    )}
                                />
                                {errors.nombreObjeto && <p className={errorCls}>{errors.nombreObjeto.message}</p>}
                            </div>

                            {/* Descripción */}
                            <div>
                                <label className={labelCls}>
                                    <AlignLeft className="w-3 h-3" />
                                    Descripción
                                </label>
                                <Controller
                                    name="descripcionObjeto"
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            {...field}
                                            id="descripcionObjeto"
                                            placeholder="Descripción del objeto"
                                            className={inputCls}
                                        />
                                    )}
                                />
                                {errors.descripcionObjeto && <p className={errorCls}>{errors.descripcionObjeto.message}</p>}
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-[#C9A84C]/10" />

                        {/* Grid de condicion y estado*/}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                            {/* Condición */}
                            <div>
                                <label className={labelCls}>
                                    <ToggleLeft className="w-3 h-3" />
                                    Condición
                                </label>
                                <Controller
                                    name="idCondicion"
                                    control={control}
                                    render={({ field }) => (
                                        <select {...field} className={selectCls}>
                                            <option value="" disabled>Seleccionar…</option>
                                            <option value={1}>Nuevo</option>
                                            <option value={2}>Usado</option>
                                        </select>
                                    )}
                                />
                                {errors.idCondicion && <p className={errorCls}>{errors.idCondicion.message}</p>}
                            </div>

                            {/* Estado */}
                            <div>
                                <label className={labelCls}>
                                    <Eye className="w-3 h-3" />
                                    Estado
                                </label>
                                <Controller
                                    name="idEstadoObjeto"
                                    control={control}
                                    render={({ field }) => (
                                        <select {...field} className={selectCls}>
                                            <option value="" disabled>Seleccionar…</option>
                                            <option value={1}>Disponible</option>
                                            <option value={2}>En subasta</option>
                                            <option value={3}>Vendido</option>
                                        </select>
                                    )}
                                />
                                {errors.idEstadoObjeto && <p className={errorCls}>{errors.idEstadoObjeto.message}</p>}
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-[#C9A84C]/10" />

                        {/* Dueño */}
                        <div>
                            <label className={labelCls}>
                                <User className="w-3 h-3" />
                                Dueño
                            </label>
                            <Controller
                                name="duenno"
                                control={control}
                                render={() => (
                                    <input
                                        readOnly
                                        value={vendedor?.nombreUsuario || ""}
                                        className={`${inputCls} cursor-not-allowed opacity-50`}
                                    />
                                )}
                            />
                            <Controller
                                name="idVendedor"
                                control={control}
                                render={({ field }) => <input type="hidden" {...field} />}
                            />
                        </div>

                        {/* Categorías */}
                        <div>
                            <label className={labelCls}>Categorías</label>

                            <Controller
                                name="categorias"
                                control={control}
                                render={({ field }) => (
                                    <div className="space-y-2">
                                        {dataCategorias.map((categoria) => (
                                            <label
                                                key={categoria.id}
                                                className="flex items-center gap-3 p-2 border border-[#C9A84C]/20 cursor-pointer"
                                            >
                                                <input
                                                    type="checkbox"
                                                    value={categoria.id}
                                                    checked={field.value?.includes(categoria.id)}
                                                    onChange={(e) => {
                                                        const checked = e.target.checked;
                                                        const value = parseInt(e.target.value);

                                                        if (checked) {
                                                            field.onChange([
                                                                ...(field.value || []),
                                                                value
                                                            ]);
                                                        } else {
                                                            field.onChange(
                                                                field.value.filter(id => id !== value)
                                                            );
                                                        }
                                                    }}
                                                />

                                                <span>{categoria.nombreCategoria}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            />

                            {errors.categorias && (
                                <p className={errorCls}>{errors.categorias.message}</p>
                            )}
                        </div>

                        {/* Divider */}
                        <div className="border-t border-[#C9A84C]/10" />

                        {/* Imagen */}
                        <div>
                            <label className={labelCls}>
                                <ImageIcon className="w-3 h-3" />
                                Imagen
                            </label>

                            <div
                                onClick={() => document.getElementById("image").click()}
                                className="group relative w-48 h-48 border border-dashed border-[#C9A84C]/25 flex items-center justify-center cursor-pointer overflow-hidden hover:border-[#C9A84C]/60 transition-all duration-300"
                            >
                                {!fileURL ? (
                                    <div className="text-center px-4">
                                        <ImageIcon className="w-6 h-6 text-[#C9A84C]/30 mx-auto mb-2" />
                                        <p className="text-[11px] text-[#F5F0E8]/30 tracking-widest uppercase">Seleccionar</p>
                                        <p className="text-[10px] text-[#F5F0E8]/20 mt-0.5">jpg · png · máx 5MB</p>
                                    </div>
                                ) : (
                                    <>
                                        <img
                                            src={fileURL}
                                            alt="preview"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <p className="text-[10px] tracking-widest uppercase text-[#C9A84C]">Cambiar</p>
                                        </div>
                                    </>
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

                        {/* Divider */}
                        <div className="border-t border-[#C9A84C]/10" />

                        {/* Botones */}
                        <div className="flex items-center justify-between gap-4 pt-1">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="flex items-center gap-2 px-5 py-2.5 border border-[#C9A84C]/25 text-[#C9A84C]/70 text-[11px] tracking-[0.2em] uppercase hover:border-[#C9A84C]/60 hover:text-[#C9A84C] transition-all duration-200"
                            >
                                <ArrowLeft className="w-3.5 h-3.5" />
                                Regresar
                            </button>

                            <button
                                type="submit"
                                className="flex items-center gap-2 px-8 py-2.5 bg-[#C9A84C] text-[#0A0A05] text-[11px] font-semibold tracking-[0.2em] uppercase hover:bg-[#D4B565] transition-all duration-200 active:scale-[0.98]"
                            >
                                <Save className="w-3.5 h-3.5" />
                                Guardar cambios
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}