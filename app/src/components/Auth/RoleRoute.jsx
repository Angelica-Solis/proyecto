import { useEffect, useRef } from "react";
import { useUser } from "../../hooks/useUser";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import PropTypes from "prop-types";

export function RoleRoute({ children, requiredRoles }) {
    const { authorize, user } = useUser();
    const hasShownToast = useRef(false);
    const navigate = useNavigate();

    const isAuthorized = authorize(requiredRoles);
    console.log("USER DESDE CONTEXTO:", user);
    console.log("ROL DEL USER:", user?.rol || user?.role);
    console.log("ROLES REQUERIDOS:", requiredRoles);

    useEffect(() => {
        if (!isAuthorized && !hasShownToast.current) {
            toast.error("Acceso no autorizado", { duration: 3000 });
            hasShownToast.current = true;
        }
    }, [isAuthorized]);

    if (isAuthorized) {
        return children;
    }

    return (
        <div className="min-h-[60vh] flex items-center justify-center px-4">
            <div className="text-center max-w-sm w-full space-y-5">

                {/* Car icon */}
                <div className="flex justify-center animate-bounce">
                    <svg width="120" height="72" viewBox="0 0 120 72" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="10" y="34" width="100" height="26" rx="6" fill="#3f3f46"/>
                        <path d="M28 34 C32 18 42 14 60 14 C78 14 88 18 92 34Z" fill="#52525b"/>
                        <rect x="6" y="52" width="108" height="8" rx="4" fill="#3f3f46"/>
                        <circle cx="28" cy="60" r="9" fill="#18181b" stroke="#71717a" strokeWidth="3"/>
                        <circle cx="28" cy="60" r="4" fill="#3f3f46"/>
                        <circle cx="92" cy="60" r="9" fill="#18181b" stroke="#71717a" strokeWidth="3"/>
                        <circle cx="92" cy="60" r="4" fill="#3f3f46"/>
                        <rect x="33" y="20" width="20" height="14" rx="2" fill="#93c5fd" opacity="0.5"/>
                        <rect x="55" y="20" width="20" height="14" rx="2" fill="#93c5fd" opacity="0.5"/>
                        <rect x="2" y="44" width="10" height="5" rx="2" fill="#fbbf24"/>
                        <rect x="108" y="44" width="10" height="5" rx="2" fill="#ef4444"/>
                        <circle cx="60" cy="20" r="13" fill="#991b1b" stroke="#fca5a5" strokeWidth="1.5"/>
                        <rect x="58" y="13" width="4" height="8" rx="2" fill="white"/>
                        <rect x="58" y="23" width="4" height="4" rx="2" fill="white"/>
                    </svg>
                </div>

                {/* Badge */}
                <span className="inline-block bg-red-100 text-red-700 text-xs font-medium uppercase tracking-widest px-3 py-1 rounded-full border border-red-200">
                    Acceso restringido
                </span>

                <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-foreground">
                        No tienes permisos para esta sección
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Esta área está reservada para usuarios autorizados. Si crees que es un error, contacta al administrador de la subasta.
                    </p>
                </div>

                <div className="flex gap-2 justify-center flex-wrap">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Regresar
                    </Button>
                </div>

            </div>
        </div>
    );
}

RoleRoute.propTypes = {
    children: PropTypes.node.isRequired,
    requiredRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};