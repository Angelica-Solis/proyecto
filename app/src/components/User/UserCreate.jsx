import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Save, ArrowLeft, User, Mail, Lock, Shield } from "lucide-react";
import userService from "../../services/UserService";

const inputBase =
    "w-full bg-white/[0.03] border border-[#C9A84C]/20 text-[#F5F0E8] font-light text-sm px-4 py-3 outline-none transition-all duration-200 placeholder:text-[#F5F0E8]/20 focus:border-[#C9A84C] focus:bg-[#C9A84C]/[0.04]";

const errorInput = "border-red-500/50";

export function CreateUsuario() {
    const navigate = useNavigate();

    const [roles, setRoles] = useState([]); // 🔥 estado para roles

    const schema = yup.object({
        nombreUsuario: yup.string().required("El nombre es requerido"),
        emailUsuario: yup
            .string()
            .email("Correo inválido")
            .required("El correo es requerido"),
        contrasenna: yup
            .string()
            .required("La contraseña es requerida")
            .min(3, "Mínimo 3 caracteres"),
        IdRol: yup
            .number()
            .typeError("Seleccione un rol")
            .required("El rol es requerido"),
    });

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            nombreUsuario: "",
            emailUsuario: "",
            contrasenna: "",
            IdRol: "",
        },
        resolver: yupResolver(schema),
    });

    // Cargar roles
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const res = await userService.getRoles();
                setRoles(res.data.data);
            } catch (err) {
                console.error("Error cargando roles:", err);
                toast.error("Error al cargar roles");
            }
        };

        fetchRoles();
    }, []);

    const onSubmit = async (data) => {
        try {
            data.IdRol = parseInt(data.IdRol);
            data.IdEstado = 1; 

            const res = await userService.createUsuario(data);

            if (res.data) {
                toast.success("Usuario creado correctamente");
                navigate("/", { replace: true });
            }
        } catch (err) {
            console.error(err);
            toast.error("Error al crear usuario");
        }
    };

    return (
        <div
            className="min-h-screen bg-[#080807] text-[#F5F0E8] flex items-center justify-center px-6 py-16"
            style={{
                backgroundImage:
                    "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(201,168,76,0.08) 0%, transparent 70%)",
            }}
        >
            <div className="w-full max-w-lg bg-[#0E0D0B] border border-[#C9A84C]/20 relative">

                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent" />

                <div className="px-10 pt-10 pb-6 border-b border-[#C9A84C]/10">
                    <div className="flex items-center gap-3 mb-3">
                        <span className="block w-8 h-px bg-[#C9A84C]" />
                        <span className="text-[#C9A84C] text-[0.6rem] font-semibold tracking-[0.2em] uppercase">
                            Administración
                        </span>
                    </div>
                    <h1 className="text-4xl font-light tracking-wide" style={{ fontFamily: "Georgia, serif" }}>
                        Crear <em className="text-[#C9A84C] italic">Usuario</em>
                    </h1>
                </div>

                <div className="px-10 py-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                        {/* Nombre */}
                        <div>
                            <label className="flex items-center gap-2 text-[#C9A84C]/70 text-[0.6rem] font-semibold tracking-[0.15em] uppercase mb-2">
                                <User size={11} /> Nombre
                            </label>
                            <Controller
                                name="nombreUsuario"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        placeholder="Nombre completo"
                                        className={`${inputBase} ${errors.nombreUsuario ? errorInput : ""}`}
                                    />
                                )}
                            />
                            {errors.nombreUsuario && (
                                <p className="mt-1 text-red-400/80 text-[0.68rem] tracking-wide">
                                    {errors.nombreUsuario.message}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="flex items-center gap-2 text-[#C9A84C]/70 text-[0.6rem] font-semibold tracking-[0.15em] uppercase mb-2">
                                <Mail size={11} /> Correo electrónico
                            </label>
                            <Controller
                                name="emailUsuario"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        type="email"
                                        placeholder="usuario@elgaraje.com"
                                        className={`${inputBase} ${errors.emailUsuario ? errorInput : ""}`}
                                    />
                                )}
                            />
                            {errors.emailUsuario && (
                                <p className="mt-1 text-red-400/80 text-[0.68rem] tracking-wide">
                                    {errors.emailUsuario.message}
                                </p>
                            )}
                        </div>

                        {/* Contraseña */}
                        <div>
                            <label className="flex items-center gap-2 text-[#C9A84C]/70 text-[0.6rem] font-semibold tracking-[0.15em] uppercase mb-2">
                                <Lock size={11} /> Contraseña
                            </label>
                            <Controller
                                name="contrasenna"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        type="password"
                                        placeholder="Mínimo 3 caracteres"
                                        className={`${inputBase} ${errors.contrasenna ? errorInput : ""}`}
                                    />
                                )}
                            />
                            {errors.contrasenna && (
                                <p className="mt-1 text-red-400/80 text-[0.68rem] tracking-wide">
                                    {errors.contrasenna.message}
                                </p>
                            )}
                        </div>

                        {/* Rol dinámico*/}
                        <div>
                            <label className="flex items-center gap-2 text-[#C9A84C]/70 text-[0.6rem] font-semibold tracking-[0.15em] uppercase mb-2">
                                <Shield size={11} /> Rol
                            </label>
                            <Controller
                                name="IdRol"
                                control={control}
                                render={({ field }) => (
                                    <select
                                        {...field}
                                        className={`${inputBase} cursor-pointer appearance-none ${errors.IdRol ? errorInput : ""}`}
                                        style={{
                                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23C9A84C' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                                            backgroundRepeat: "no-repeat",
                                            backgroundPosition: "right 1rem center",
                                        }}
                                    >
                                        <option value="" disabled className="bg-[#0E0D0B]">
                                            Seleccione un rol
                                        </option>

                                        {roles.map((rol) => (
                                            <option key={rol.id} value={rol.id} className="bg-[#0E0D0B]">
                                                {rol.nombreRol}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            />
                            {errors.IdRol && (
                                <p className="mt-1 text-red-400/80 text-[0.68rem] tracking-wide">
                                    {errors.IdRol.message}
                                </p>
                            )}
                        </div>

                        <div className="h-px bg-gradient-to-r from-transparent via-[#C9A84C]/15 to-transparent" />

                        <div className="flex justify-between items-center pt-1">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="flex items-center gap-2 text-[#F5F0E8]/40 border border-[#F5F0E8]/15 px-5 py-3 text-[0.65rem] font-semibold tracking-[0.15em] uppercase transition-all duration-200 hover:text-[#F5F0E8] hover:border-[#F5F0E8]/40"
                            >
                                <ArrowLeft size={13} /> Regresar
                            </button>

                            <button
                                type="submit"
                                className="flex items-center gap-2 bg-[#C9A84C] text-[#080807] px-6 py-3 text-[0.65rem] font-semibold tracking-[0.15em] uppercase transition-all duration-200 hover:bg-[#DEB96A]"
                            >
                                <Save size={13} /> Guardar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}