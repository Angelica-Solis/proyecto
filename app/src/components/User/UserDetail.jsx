import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, User, Mail, Calendar, Activity, Gavel, Package } from "lucide-react";
import UserService from "@/services/UserService";

function DetailRow({ icon: Icon, label, value }) {
    return (
        <div className="flex items-start gap-3 py-4 border-b border-[#C9A84C]/[0.07] last:border-0">
            <Icon className="h-4 w-4 text-[#C9A84C] mt-0.5 shrink-0" />
            <div className="flex flex-col gap-0.5">
                <span className="text-[11px] font-medium tracking-[0.35em] uppercase text-[#F5F0E8]/40">
                    {label}
                </span>
                <span className="text-[15px] font-light text-[#F5F0E8] tracking-wide">
                    {value}
                </span>
            </div>
        </div>
    );
}

export function UserDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        UserService.getUserDetail(id)
            .then((res) => { setUser(res.data.data); setLoading(false); })
            .catch((err) => { console.error("Error al cargar:", err); setLoading(false); });
    }, [id]);

    return (
        <div className="min-h-screen bg-[#080807] text-[#F5F0E8] p-10 font-sans">

            {/* Encabezado */}
            <div className="flex justify-between items-end mb-10">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-7 h-px bg-[#C9A84C]" />
                        <span className="text-[#C9A84C] uppercase tracking-[0.4em] text-[12px] font-medium">
                            Panel de Control
                        </span>
                    </div>
                    <h1 className="text-4xl font-light tracking-tight leading-none">
                        Detalle de{" "}
                        <em className="text-[#C9A84C] not-italic font-light">Usuario</em>
                    </h1>
                </div>
            </div>

            {/* Estado: cargando */}
            {loading ? (
                <div className="border border-[#C9A84C]/20 bg-[#0E0D0B] py-16 flex flex-col items-center gap-3">
                    <div className="w-7 h-7 rounded-full border-2 border-[#C9A84C]/20 border-t-[#C9A84C] animate-spin" />
                    <span className="text-[12px] tracking-[0.35em] uppercase text-[#F5F0E8]/40">
                        Cargando perfil…
                    </span>
                </div>

            ) : !user ? (
                <div className="border border-[#C9A84C]/20 bg-[#0E0D0B] py-16 flex flex-col items-center gap-3">
                    <div className="w-2 h-2 border border-[#C9A84C]/50 rotate-45" />
                    <span className="text-[12px] tracking-[0.35em] uppercase text-[#F5F0E8]/40">
                        Usuario no encontrado
                    </span>
                </div>

            ) : (
                <div className="space-y-4">

                    {/* Informacion basica + estadisticas */}
                    <div className="border border-[#C9A84C]/20 bg-[#0E0D0B] overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#C9A84C]/[0.07]">

                            {/* Columna izquierda de datos del usuario */}
                            <div className="p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-5 h-px bg-[#C9A84C]" />
                                    <span className="text-[#C9A84C] uppercase tracking-[0.4em] text-[11px] font-medium">
                                        Información Personal
                                    </span>
                                </div>

                                {/* Avatar + nombre */}
                                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#C9A84C]/[0.07]">
                                    <div className="w-12 h-12 border border-[#C9A84C]/25 bg-[#C9A84C]/[0.07] flex items-center justify-center shrink-0">
                                        <User className="h-6 w-6 text-[#C9A84C]" />
                                    </div>
                                    <div>
                                        <p className="text-xl font-light italic text-[#F5F0E8]">{user.nombreUsuario}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="px-2.5 py-0.5 border border-[#C9A84C]/25 bg-[#C9A84C]/[0.07] text-[#C9A84C] text-[11px] tracking-widest">
                                                {user.nombreRol}
                                            </span>
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 border border-[#C9A84C]/25 bg-[#C9A84C]/[0.07] text-[#C9A84C] text-[11px] tracking-[0.3em] uppercase">
                                                <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] shadow-[0_0_6px_#C9A84C] animate-pulse" />
                                                {user.descripcionEstado}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <DetailRow icon={Mail} label="Email" value={user.emailUsuario} />
                                <DetailRow icon={Calendar} label="Registro" value={new Date(user.fecha_registro).toLocaleDateString()} />
                            </div>

                            {/* Columna derecha de estadisticas */}
                            <div className="p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-5 h-px bg-[#C9A84C]" />
                                    <span className="text-[#C9A84C] uppercase tracking-[0.4em] text-[11px] font-medium">
                                        Estadísticas
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {/* Subastas creadas */}
                                    <div className="border border-[#C9A84C]/20 bg-[#C9A84C]/[0.04] p-6 flex flex-col gap-3">
                                        <Package className="h-5 w-5 text-[#C9A84C]" />
                                        <p className="text-[40px] font-light text-[#C9A84C] leading-none">
                                            {user.cantidadSubastas || 0}
                                        </p>
                                        <p className="text-[11px] font-medium tracking-[0.3em] uppercase text-[#F5F0E8]/40">
                                            Subastas Creadas
                                        </p>
                                    </div>

                                    {/* Pujas realizadas */}
                                    <div className="border border-[#C9A84C]/20 bg-[#C9A84C]/[0.04] p-6 flex flex-col gap-3">
                                        <Gavel className="h-5 w-5 text-[#C9A84C]" />
                                        <p className="text-[40px] font-light text-[#C9A84C] leading-none">
                                            {user.cantidadPujas || 0}
                                        </p>
                                        <p className="text-[11px] font-medium tracking-[0.3em] uppercase text-[#F5F0E8]/40">
                                            Pujas Realizadas
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Historial de actividad */}
                    <div className="border border-[#C9A84C]/20 bg-[#0E0D0B] overflow-hidden">
                        <div className="flex items-center gap-3 p-6 border-b border-[#C9A84C]/20 bg-[#C9A84C]/5">
                            <Activity className="h-4 w-4 text-[#C9A84C]" />
                            <span className="text-[#C9A84C] uppercase tracking-[0.4em] text-[11px] font-medium">
                                {user.nombreRol === "Vendedor" ? "Historial de Ventas" : "Historial de Participación"}
                            </span>
                        </div>

                        {user.actividad && user.actividad.length > 0 ? (
                            <div>
                                {user.actividad.map((item, index) => (
                                    <div
                                        key={index}
                                        className={`
                                            flex justify-between items-center px-8 py-5
                                            border-b border-[#C9A84C]/[0.07] last:border-0
                                            hover:bg-[#C9A84C]/[0.06] transition-colors duration-200
                                            ${index % 2 !== 0 ? "bg-[#F5F0E8]/[0.03]" : "bg-transparent"}
                                        `}
                                    >
                                        <div>
                                            <p className="text-base font-light italic text-[#F5F0E8]">
                                                {item.titulo}
                                            </p>
                                            <p className="text-[12px] font-light tracking-wide text-[#F5F0E8]/40 mt-1">
                                                {item.fecha ? new Date(item.fecha).toLocaleString() : "Fecha no disponible"}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span className="inline-flex items-center justify-center px-3 py-1 border border-[#C9A84C]/25 bg-[#C9A84C]/[0.07] text-[#C9A84C] text-[13px] font-medium tracking-widest">
                                                ${parseFloat(item.monto).toLocaleString()}
                                            </span>
                                            <p className="text-[11px] tracking-[0.3em] uppercase text-[#F5F0E8]/40 mt-1">Monto</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-16 flex flex-col items-center gap-3">
                                <div className="w-2 h-2 border border-[#C9A84C]/50 rotate-45" />
                                <span className="text-[12px] tracking-[0.35em] uppercase text-[#F5F0E8]/40">
                                    {user.nombreRol === "Administrador" ? "Perfil sin actividad comercial." : "Sin movimientos registrados."}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Boton regresar */}
            <div className="mt-8 flex">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 border border-[#F5F0E8]/30 bg-[#F5F0E8]/[0.06] text-[#F5F0E8] hover:border-[#C9A84C] hover:text-[#C9A84C] hover:bg-[#C9A84C]/[0.07] transition-all duration-300 text-[9px] tracking-[0.3em] uppercase font-medium px-5 h-9"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Regresar
                </button>
            </div>

        </div>
    );
}