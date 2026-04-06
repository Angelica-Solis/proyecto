import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";
// Servicios
import subastaService from "@/services/SubastaService";
import ObjetoService from "@/services/ObjetoService";

export function CrearSubasta() {
  const navigate = useNavigate();
  const [objetos, setObjetos] = useState([]);
  const [loading, setLoading] = useState(false);

  // Variable lógica simulada (Nombre del vendedor fijo en la UI)
  const vendedorNombre = "Usuario Vendedor Demo"; 

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      precioBase: 0,
      incremento: 0,
      idEstadoSubasta: 4 // Forzamos Borrador por defecto
    }
  });


  useEffect(() => {
    // Cargar objetos activos para el selector
    ObjetoService.getActivos() 
      .then(res => setObjetos(res.data.data))
      .catch(() => toast.error("Error al cargar tus objetos"));
  }, []);

  const onSubmit = async (data) => {
  // 1. Validación preventiva en el cliente
  if (new Date(data.fechaCierre) <= new Date(data.fechaInicio)) {
    toast.error("La fecha de cierre debe ser posterior a la de inicio");
    return;
  }

  const datosFormateados = {
    ...data,
    idObjeto: parseInt(data.idObjeto),
    idEstadoSubasta: parseInt(data.idEstadoSubasta || 4),
    precioBase: parseFloat(data.precioBase),
    incremento: parseFloat(data.incremento)
  };

  setLoading(true);
  try {
    const response = await subastaService.create(datosFormateados);
    
    //todo salió bien
    toast.success("Subasta guardada como borrador");
    
    // pequeño delay para que el usuario lea el éxito antes de irse
    setTimeout(() => navigate("/subastas"), 1500);

  } catch (error) {
    // 3. CAPTURA DETALLADA DEL ERROR
    // Intentamos obtener el mensaje del JSON del servidor, si no, el mensaje de Axios
    const errorServer = error.response?.data?.message;
    const errorGenerico = "Error de conexión con el servidor";
    
    const mensajeAMostrar = errorServer || error.message || errorGenerico;

    // Mostramos el error exacto en Sonner
    toast.error(mensajeAMostrar, {
      description: "Por favor, revisa los datos ingresados.",
      duration: 5000, // Más tiempo para que el usuario lo lea
    });

    console.error("Detalle técnico del fallo:", error.response?.data);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="container mx-auto px-6 py-10 max-w-3xl">
      {/* Encabezado */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="text-[#C9A84C]">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
        <h1 className="text-4xl font-light tracking-tight leading-none">
            Nueva{" "}
            <em className="text-[#C9A84C] not-italic font-light">
            Subasta
            </em>
        </h1>
        </div>
        <div className="flex items-center gap-3 mb-3">
            <div className="w-7 h-px bg-[#C9A84C]" />
            <span className="text-[#C9A84C] uppercase tracking-[0.4em] text-[12px] font-medium">
            Registro de Borrador
            </span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-[#0F0F0F]/40 p-8 border border-[#F5F0E8]/10 rounded-sm backdrop-blur-sm">
        
        {/* Fila 1: Vendedor (Solo lectura) y Objeto */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-[#F5F0E8]/60 text-[10px] uppercase tracking-widest">Usuario Vendedor</Label>
            <Input 
              value={vendedorNombre} 
              disabled 
              className="bg-[#F5F0E8]/5 border-[#F5F0E8]/10 text-[#C9A84C] font-semibold cursor-not-allowed"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[#F5F0E8]/60 text-[10px] uppercase tracking-widest">Seleccionar Objeto</Label>
            <Select onValueChange={(val) => setValue("idObjeto", val)}>
              <SelectTrigger className="bg-transparent border-[#F5F0E8]/20 text-[#F5F0E8]">
                <SelectValue placeholder="Seleccione un objeto activo" />
              </SelectTrigger>
              <SelectContent className="bg-[#080807] border-[#C9A84C]/30 text-[#F5F0E8]">
                {objetos.map(obj => (
                  <SelectItem key={obj.id} value={obj.id.toString()}>{obj.nombreObjeto}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.idObjeto && <span className="text-red-500 text-xs">Requerido</span>}
          </div>
        </div>

        {/* Fila 2: Fechas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-[#F5F0E8]/60 text-[10px] uppercase tracking-widest">Fecha y Hora Inicio</Label>
            <Input 
              type="datetime-local" 
              {...register("fechaInicio", { required: true })}
              className="bg-transparent border-[#F5F0E8]/20 text-[#F5F0E8]"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[#F5F0E8]/60 text-[10px] uppercase tracking-widest">Fecha y Hora Cierre</Label>
            <Input 
              type="datetime-local" 
              {...register("fechaCierre", { required: true })}
              className="bg-transparent border-[#F5F0E8]/20 text-[#F5F0E8]"
            />
          </div>
        </div>

        {/* Fila 3: Precios */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-[#F5F0E8]/60 text-[10px] uppercase tracking-widest">Precio Base (₡)</Label>
            <Input 
              type="number" 
              {...register("precioBase", { required: true, min: 1 })}
              className="bg-transparent border-[#F5F0E8]/20 text-[#F5F0E8]"
            />
            {errors.precioBase && <span className="text-red-400 text-[10px]">Debe ser mayor a 0</span>}
          </div>
          <div className="space-y-2">
            <Label className="text-[#F5F0E8]/60 text-[10px] uppercase tracking-widest">Incremento Mínimo (₡)</Label>
            <Input 
              type="number" 
              {...register("incremento", { required: true, min: 1 })}
              className="bg-transparent border-[#F5F0E8]/20 text-[#F5F0E8]"
            />
            {errors.incremento && <span className="text-red-400 text-[10px]">Debe ser mayor a 0</span>}
          </div>
        </div>

        {/* Botones */}
        <div className="pt-6 flex justify-end gap-4">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="text-[#F5F0E8]/40 hover:text-[#F5F0E8]"
          >
            CANCELAR
          </Button>
          <Button 
            type="submit" 
            disabled={loading}
            className="bg-[#C9A84C] hover:bg-[#A68A3D] text-black font-bold px-10"
          >
            <Save className="mr-2 h-4 w-4" /> {loading ? "GUARDANDO..." : "GUARDAR BORRADOR"}
          </Button>
        </div>
      </form>
    </div>
  );
}
export default CrearSubasta;