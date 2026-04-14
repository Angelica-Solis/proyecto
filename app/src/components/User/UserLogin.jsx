import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useUser } from "@/hooks/useUser";
import UserService from "@/services/UserService";
import { CustomInputField } from "../ui/custom/custom-input-field";

const schema = yup.object({
    email: yup.string().email("Correo inválido").required("El correo es obligatorio"),
    password: yup.string().required("La contraseña es obligatoria"),
});

export function Login() {
    const { saveUser } = useUser();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({ resolver: yupResolver(schema) });

    const onSubmit = async (data) => {
        try {
            const response = await UserService.loginUser(data);
            const token =
                typeof response.data === "string"
                    ? response.data
                    : response.data?.data;

            if (token) {
                saveUser(token);
                toast.success("Inicio de sesión exitoso");
                setTimeout(() => {
                    navigate("/", { replace: true });
                }, 150);
            } else {
                toast.error("Credenciales inválidas");
            }
        } catch (error) {
            console.error("ERROR LOGIN:", error);
            toast.error("Error al iniciar sesión");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] relative overflow-hidden">

            {/* Background subtle texture / vignette */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#111008] to-[#0a0a0a] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(180,145,50,0.06)_0%,_transparent_70%)] pointer-events-none" />

            {/* Decorative corner lines */}
            <div className="absolute top-8 left-8 w-16 h-16 border-t border-l border-[#b4912e]/30 pointer-events-none" />
            <div className="absolute bottom-8 right-8 w-16 h-16 border-b border-r border-[#b4912e]/30 pointer-events-none" />

            {/* Card */}
            <div className="relative z-10 w-full max-w-md mx-4">

                {/* Logo / Brand header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-3 mb-4">
                        {/* Diamond icon matching site */}
                        <div className="w-7 h-7 border border-[#b4912e] rotate-45 flex items-center justify-center">
                            <div className="w-3 h-3 bg-[#b4912e] rotate-0" />
                        </div>
                        <div className="text-left">
                            <p className="text-white text-sm font-semibold tracking-[0.25em] uppercase leading-none">El Garaje</p>
                            <p className="text-[#b4912e]/70 text-[9px] tracking-[0.3em] uppercase leading-none mt-0.5">Subastas de Lujo</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 justify-center mb-1">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#b4912e]/40" />
                        <p className="text-[#b4912e]/60 text-[10px] tracking-[0.4em] uppercase">Acceso Exclusivo</p>
                        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#b4912e]/40" />
                    </div>
                </div>

                {/* Main card */}
                <div className="bg-[#0f0f0f] border border-[#b4912e]/20 p-8 shadow-2xl shadow-black/60 relative">
                    {/* Inner gold corner accents */}
                    <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#b4912e]/60" />
                    <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-[#b4912e]/60" />
                    <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-[#b4912e]/60" />
                    <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[#b4912e]/60" />

                    <h2 className="text-white text-2xl font-light tracking-[0.15em] uppercase text-center mb-8">
                        Iniciar Sesión
                    </h2>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                        {/* Email field */}
                        <div className="space-y-1.5">
                            <label className="block text-[#b4912e]/80 text-[10px] tracking-[0.35em] uppercase font-medium">
                                Correo Electrónico
                            </label>
                            <input
                                type="email"
                                placeholder="ejemplo@correo.com"
                                {...register("email")}
                                className="w-full bg-transparent border border-white/10 text-white placeholder:text-white/20 px-4 py-3 text-sm tracking-wide outline-none focus:border-[#b4912e]/60 focus:bg-[#b4912e]/5 transition-all duration-300"
                            />
                            {errors.email && (
                                <p className="text-red-400/80 text-[11px] tracking-wide mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Password field */}
                        <div className="space-y-1.5">
                            <label className="block text-[#b4912e]/80 text-[10px] tracking-[0.35em] uppercase font-medium">
                                Contraseña
                            </label>
                            <input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                {...register("password")}
                                className="w-full bg-transparent border border-white/10 text-white placeholder:text-white/30 px-4 py-3 text-sm tracking-widest outline-none focus:border-[#b4912e]/60 focus:bg-[#b4912e]/5 transition-all duration-300"
                            />
                            {errors.password && (
                                <p className="text-red-400/80 text-[11px] tracking-wide mt-1">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full mt-2 bg-[#b4912e] hover:bg-[#c9a83c] disabled:opacity-50 disabled:cursor-not-allowed text-black text-[11px] font-semibold tracking-[0.35em] uppercase py-4 transition-all duration-300 hover:shadow-lg hover:shadow-[#b4912e]/20"
                        >
                            {isSubmitting ? "Verificando..." : "Ingresar"}
                        </button>

                        {/* Divider */}
                        <div className="flex items-center gap-3 pt-1">
                            <div className="h-px flex-1 bg-white/8" />
                            <span className="text-white/20 text-[9px] tracking-[0.3em] uppercase">o</span>
                            <div className="h-px flex-1 bg-white/8" />
                        </div>

                        {/* Register link*/}
                        <a
                            href="/user/create"
                            className="block w-full text-center border border-white/20 hover:border-[#b4912e]/50 text-white/60 hover:text-[#b4912e] text-[11px] tracking-[0.3em] uppercase py-3.5 transition-all duration-300"
                        >
                            Crear Cuenta
                        </a>
                    </form>
                </div>

                {/* Footer note */}
                <p className="text-center text-white/20 text-[9px] tracking-[0.3em] uppercase mt-6">
                    © 2026 Exclusive Motors Group
                </p>
            </div>
        </div>
    );
}