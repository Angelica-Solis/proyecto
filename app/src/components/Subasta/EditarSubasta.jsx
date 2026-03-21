import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Save, ArrowLeft, Pencil } from "lucide-react";
import subastaService from "@/services/SubastaService";
import { de } from "zod/v4/locales";

export function EditarSubasta() {
const { id } = useParams();
const navigate = useNavigate();
const [loading, setLoading] = useState(false);
const { register, handleSubmit, setValue, formState: { errors } } = useForm();

    useEffect(() => {
    // Cargar datos actuales para editar
    subastaService.getDetalle(id)
        .then((response) => {
        const s = response.data.data;
        setValue("id", s.id);
        setValue("fechaInicio", s.fechaInicio.replace(" ", "T"));
        setValue("fechaCierre", s.fechaCierre.replace(" ", "T"));
        setValue("precioBase", s.precioBase);
        setValue("incremento", s.incrementoMinimo);
        })
        .catch(() => toast.error("Error al cargar los datos de la subasta"));
    }, [id, setValue]);

    const onSubmit = async (data) => {
    setLoading(true);
    try {
        await subastaService.update(data);
        toast.success("Subasta actualizada correctamente");
        navigate("/subastas"), 1500;
    } catch (error) {
      // Sonner muestra el mensaje exacto enviado por el throw Exception de PHP
        const mensajeError = error.response?.data?.message || "Fallo técnico al actualizar";
        toast.error(mensajeError, { duration: 5000 });
    } finally {
        setLoading(false);
    }
    };

    return (
    <div className="p-8 max-w-2xl mx-auto bg-[#1A1A1A] border border-[#F5F0E8]/10 rounded-lg">
        <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="text-[#F5F0E8]/60">
            <ArrowLeft className="w-4 h-4" />
        </Button>
            <h1 className="text-4xl font-light tracking-tight leading-none flex items-center gap-2">
                Editar{" "}
                <span className="flex items-center gap-2 text-[#C9A84C] not-italic font-light">
                    Subasta
                    <Pencil className="w-5 h-5" />
                </span>
            </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
            <Label className="text-[#F5F0E8]/60 text-[10px] uppercase">Fecha Inicio</Label>
            <Input type="datetime-local" {...register("fechaInicio", { required: "La fecha de inicio es obligatoria" })} className="bg-transparent text-[#F5F0E8]" />
            {errors.fechaInicio && (
            <p className="text-red-400 text-xs">
                {errors.fechaInicio.message}
            </p>
            )}
            </div>
            <div className="space-y-2">
            <Label className="text-[#F5F0E8]/60 text-[10px] uppercase">Fecha Cierre</Label>
            <Input type="datetime-local" {...register("fechaCierre", { required: "La fecha de cierre es obligatoria" })} className="bg-transparent text-[#F5F0E8]" />
            {errors.fechaCierre && (
            <p className="text-red-400 text-xs">
                {errors.fechaCierre.message}
            </p>
            )}
            </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
            <Label className="text-[#F5F0E8]/60 text-[10px] uppercase">Precio Base (₡)</Label>
            <Input type="number" {...register("precioBase", { required: "Este campo es obligatorio", min: { value: 1, message: "Debe ser mayor que 0"}})} className="bg-transparent text-[#F5F0E8]" />
            {errors.precioBase && (
            <p className="text-red-400 text-xs">
                {errors.precioBase.message}
            </p>
            )}
            </div>
            <div className="space-y-2">
            <Label className="text-[#F5F0E8]/60 text-[10px] uppercase">Incremento (₡)</Label>
            <Input type="number" {...register("incremento", { required: "Este campo es obligatorio", min: { value: 1, message: "Debe ser mayor que 0"}})} className="bg-transparent text-[#F5F0E8]" />
            {errors.incremento && (
            <p className="text-red-400 text-xs">
                {errors.incremento.message}
            </p>
            )}
            </div>
        </div>

        <div className="flex justify-end pt-6">
            <Button type="submit" disabled={loading} className="bg-[#C9A84C] text-black hover:bg-[#B3933B] px-10">
            {loading ? "GUARDANDO..." : "GUARDAR CAMBIOS"}
            <Save className="ml-2 w-4 h-4" />
            </Button>
        </div>
        </form>
    </div>
    );
}
export default EditarSubasta;
