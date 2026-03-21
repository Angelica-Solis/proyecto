import { useEffect, useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, ArrowLeft, User, Mail, ToggleLeft, Calendar, Shield } from "lucide-react";

import UserService from "../../services/UserService";
import { Controller, useForm } from "react-hook-form";

export function UpdateUser() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [error, setError] = useState("");

    const usuarioSchema = yup.object({
        nombreUsuario: yup.string().required("El nombre es requerido"),
        emailUsuario: yup.string().email("Email inválido").required("El email es requerido"),
        IdEstado: yup.number().typeError("Seleccione un estado").required("Seleccione un estado"),
    });

    const { control, handleSubmit, reset, watch, formState: { errors } } = useForm({
        defaultValues: {
            nombreUsuario: "",
            emailUsuario: "",
            IdRol: "",
            IdEstado: "",
            fecha_registro: ""
        },
        resolver: yupResolver(usuarioSchema),
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const usuarioRes = await UserService.getUserById(id);
                console.log(usuarioRes.data.data);
                if (usuarioRes.data) {
                    const u = usuarioRes.data.data;
                    console.log("OBJETO COMPLETO:", u);
                    console.log("ROL:", u.nombreRol);
                    reset({
                        nombreUsuario: u.nombreUsuario,
                        emailUsuario: u.emailUsuario,
                        IdRol: u.IdRol,
                        fecha_registro: u.fecha_registro,
                        nombreRol: u.nombreRol,
                        IdEstado: u.descripcionEstado === "Activo" ? 1 : 2
                    });
                }
            } catch (err) {
                if (err.name !== "AbortError") setError(err.message);
            }
        };
        fetchData();
    }, [id, reset]);

    const onSubmit = async (dataForm) => {
        try {
            dataForm.id = id;
            const isValid = await usuarioSchema.isValid(dataForm);
            if (!isValid) return;

            const response = await UserService.getUserUpdate(dataForm);
            if (response.data) {
                toast.success(`Usuario actualizado correctamente`, { duration: 3000 });
                navigate("/user/table");
            } else if (response.error) {
                setError(response.error);
            }
        } catch (err) {
            console.error(err);
            console.error("ERROR COMPLETO:", err.response?.data);
            if (err.name !== "AbortError") setError(err.message);
        }
    };

    // Campo reutilizable con ícono
    const Field = ({ label, icon: Icon, name, type = "text", readOnly = false, placeholder }) => (
        <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-medium tracking-widest uppercase text-[#C9A84C]/70 flex items-center gap-2">
                <Icon className="w-3.5 h-3.5" />
                {label}
            </Label>
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <Input
                        {...field}
                        readOnly={readOnly}
                        value={field.value || ""}
                        type={type}
                        placeholder={placeholder}
                        className="
                            rounded-none border-[#C9A84C]/20 bg-[#C9A84C]/[0.03]
                            text-[#F5F0E8] placeholder:text-[#F5F0E8]/20
                            focus-visible:ring-0 focus-visible:border-[#C9A84C]/60
                            hover:border-[#C9A84C]/40
                            disabled:opacity-40 disabled:cursor-not-allowed
                            transition-colors duration-200 h-10
                        "
                    />
                )}
            />
            {errors[name] && (
                <p className="text-xs text-red-400/80 tracking-wide mt-0.5">
                    ⚠ {errors[name].message}
                </p>
            )}
        </div>
    );

    if (error) return (
        <div className="flex items-center justify-center h-40">
            <p className="text-red-400 border border-red-500/30 px-4 py-2 text-sm tracking-wide">⚠ {error}</p>
        </div>
    );

    return (
        <div className="max-w-2xl mx-auto px-4 py-10">

            {/* Header */}
            <div className="mb-8 border-l-2 border-[#C9A84C] pl-4">
                <p className="text-[10px] tracking-[0.3em] uppercase text-[#C9A84C]/50 mb-1">Gestión de usuarios</p>
                <h2 className="text-2xl font-semibold text-[#F5F0E8] tracking-wide">Actualizar Usuario</h2>
            </div>

            {/* Card */}
            <div className="border border-[#C9A84C]/15 bg-[#C9A84C]/[0.02] p-8">

                {/* Linea decorativa superior */}
                <div className="w-full h-px bg-gradient-to-r from-[#C9A84C]/40 via-[#C9A84C]/10 to-transparent mb-8" />

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                    {/* Fila 1: Nombre + Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <Field
                            label="Nombre de usuario"
                            icon={User}
                            name="nombreUsuario"
                            placeholder="Ej. Juan Pérez"
                        />
                        <Field
                            label="Correo electrónico"
                            icon={Mail}
                            name="emailUsuario"
                            type="email"
                            placeholder="correo@ejemplo.com"
                        />
                    </div>

                    {/* Fila 2: Rol + Estado */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <Field
                            label="Rol"
                            icon={Shield}
                            name="nombreRol"
                            readOnly
                            placeholder="rol"
                        />

                        {/* Estado*/}
                        <div className="flex flex-col gap-1.5">
                            <Label className="text-xs font-medium tracking-widest uppercase text-[#C9A84C]/70 flex items-center gap-2">
                                <ToggleLeft className="w-3.5 h-3.5" />
                                Estado
                            </Label>
                            <Controller
                                name="IdEstado"
                                control={control}
                                render={({ field }) => (
                                    <select
                                        {...field}
                                        className="h-10 px-3 rounded-none border border-[#C9A84C]/20 bg-[#0D0D08] text-[#F5F0E8]"
                                    >
                                        <option value={1}>Activo</option>
                                        <option value={2}>Bloqueado</option>
                                    </select>
                                )}
                            />
                            {errors.IdEstado && (
                                <p className="text-xs text-red-400/80 tracking-wide mt-0.5">
                                    {errors.IdEstado.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Fecha de registro (solo lectura) */}
                    <Field
                        label="Fecha de registro"
                        icon={Calendar}
                        name="fecha_registro"
                        readOnly
                        placeholder="—"
                    />

                    {/* Separador */}
                    <div className="w-full h-px bg-[#C9A84C]/10 my-2" />

                    {/* Botones */}
                    <div className="flex items-center justify-between gap-4 pt-2">

                        {/* Regresar */}
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => navigate(-1)}
                            className="
                                rounded-none border border-[#F5F0E8]/15
                                text-[#F5F0E8]/50 hover:text-[#F5F0E8]
                                hover:border-[#F5F0E8]/40 hover:bg-[#F5F0E8]/[0.04]
                                transition-all duration-300 px-5 gap-2
                            "
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Regresar
                        </Button>

                        {/* Guardar */}
                        <Button
                            type="submit"
                            className="
                                rounded-none flex-1 max-w-[200px]
                                bg-[#C9A84C] hover:bg-[#C9A84C]/90
                                text-[#0D0D08] font-semibold tracking-widest uppercase text-xs
                                border border-[#C9A84C] hover:border-[#E8C96A]
                                shadow-[0_0_20px_rgba(201,168,76,0.15)]
                                hover:shadow-[0_0_30px_rgba(201,168,76,0.3)]
                                transition-all duration-300 gap-2 h-10
                            "
                        >
                            <Save className="w-4 h-4" />
                            Guardar cambios
                        </Button>
                    </div>

                </form>

                {/* Línea decorativa inferior */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-[#C9A84C]/10 to-[#C9A84C]/40 mt-8" />
            </div>
        </div>
    );
}