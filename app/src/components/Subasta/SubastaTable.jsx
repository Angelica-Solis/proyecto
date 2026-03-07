import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Info } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import subastaService from "@/services/SubastaService";

export function SubastaTable() {
  const navigate = useNavigate();
  const [filtro, setFiltro] = useState("activas");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const peticion = filtro === "activas"
      ? subastaService.getActivas()
      : subastaService.getFinalizadas();

    peticion
      .then((response) => { setData(response.data.data); setLoading(false); })
      .catch((error) => { console.error("Error al obtener subastas:", error); setLoading(false); });
  }, [filtro]);

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
            Listado de{" "}
            <em className="text-[#C9A84C] not-italic font-light">Subastas</em>
          </h1>
        </div>

        {/* Filtro */}
        <div className="flex items-center gap-3">
          <span className="text-[12px] font-light tracking-[0.3em] uppercase text-[#F5F0E8]/50">
            Filtrar
          </span>
          <Select value={filtro} onValueChange={(value) => setFiltro(value)}>
            <SelectTrigger className="w-[210px] h-9 rounded-none border-[#C9A84C]/25 bg-[#0E0D0B] text-[#F5F0E8] text-[12px] tracking-widest focus:ring-[#C9A84C]/40">
              <SelectValue placeholder="Estado de subasta" />
            </SelectTrigger>
            <SelectContent className="rounded-none border-[#C9A84C]/25 bg-[#0E0D0B] text-[#F5F0E8]">
              <SelectItem value="activas" className="text-[12px] tracking-widest focus:bg-[#C9A84C]/10 focus:text-[#C9A84C]">Subastas Activas</SelectItem>
              <SelectItem value="finalizadas" className="text-[12px] tracking-widest focus:bg-[#C9A84C]/10 focus:text-[#C9A84C]">Finalizadas / Canceladas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabla */}
      <div className="border border-[#C9A84C]/20 bg-[#0E0D0B] overflow-hidden">
        <Table>

          {/* Cabecera */}
          <TableHeader>
            <TableRow className="border-b border-[#C9A84C]/20 bg-[#C9A84C]/5 hover:bg-[#C9A84C]/5">
              {["Objeto", "Fecha Inicio", "Fecha Cierre", "Pujas", "Estado", ""].map((h, i) => (
                <TableHead
                  key={i}
                  className={`text-[#C9A84C] text-[11px] font-medium tracking-[0.35em] uppercase py-4 border-b border-[#C9A84C]/20 ${i === 5 ? "text-right" : ""}`}
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>

            {/* Estado: cargando */}
            {loading ? (
              <TableRow className="hover:bg-transparent border-0">
                <TableCell colSpan={6} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-7 h-7 rounded-full border-2 border-[#C9A84C]/20 border-t-[#C9A84C] animate-spin" />
                    <span className="text-[12px] tracking-[0.35em] uppercase text-[#F5F0E8]/40">
                      Cargando subastas…
                    </span>
                  </div>
                </TableCell>
              </TableRow>

            ) : data.length > 0 ? (
<<<<<<< HEAD
              data.map((item, idx) => (
                <TableRow
                  key={item.id}
                  className={`
                    border-b border-[#C9A84C]/[0.07] transition-colors duration-200
                    hover:bg-[#C9A84C]/[0.06]
                    ${idx % 2 !== 0 ? "bg-[#F5F0E8]/[0.03]" : "bg-transparent"}
                  `}
                >
                  {/* Nombre */}
                  <TableCell className="py-3">
                    <span className="text-base font-light italic text-[#F5F0E8]">
                      {item.nombreObjeto}
                    </span>
=======
              data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {/* Imagen*/}
                    <img 
                      src={`http://127.0.0.1:81/proyecto/api/uploads/${item.imagen}`} 
                      alt={item.nombreObjeto}
                      className="h-12 w-12 rounded object-cover border" 
                    />
>>>>>>> 2e014e78a131a6ab8d640e1c8a18a7f245e8af69
                  </TableCell>

                  {/* Fecha Inicio */}
                  <TableCell className="py-3">
                    <span className="text-[13px] font-light tracking-wide text-[#F5F0E8]/50">
                      {item.fechaInicio}
                    </span>
                  </TableCell>

                  {/* Fecha Cierre */}
                  <TableCell className="py-3">
                    <span className="text-[13px] font-light tracking-wide text-[#F5F0E8]/50">
                      {item.fechaCierre}
                    </span>
                  </TableCell>

                  {/* Pujas */}
                  <TableCell className="py-3">
                    <span className="inline-flex items-center justify-center px-2.5 py-0.5 border border-[#C9A84C]/25 bg-[#C9A84C]/[0.07] text-[#C9A84C] text-[12px] font-medium tracking-widest">
                      {item.cantidadPujas}
                    </span>
                  </TableCell>

                  {/* Estado */}
                  <TableCell className="py-3">
                    {filtro === "activas" ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 border border-[#C9A84C]/25 bg-[#C9A84C]/[0.07] text-[#C9A84C] text-[11px] font-medium tracking-[0.3em] uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] shadow-[0_0_6px_#C9A84C] animate-pulse" />
                        Activa
                      </span>
                    ) : (
                      <span className="inline-block px-3 py-1 border border-[#F5F0E8]/10 bg-[#F5F0E8]/[0.04] text-[#F5F0E8]/35 text-[11px] font-medium tracking-[0.3em] uppercase">
                        {item.estadoNombre}
                      </span>
                    )}
                  </TableCell>

                  {/* Acciones */}
                  <TableCell className="py-3 pr-4 text-right">
                    <Button size="icon" variant="ghost" asChild className="w-8 h-8 p-0 rounded-none border border-[#C9A84C]/20 text-[#F5F0E8]/50 hover:border-[#C9A84C] hover:text-[#C9A84C] hover:bg-[#C9A84C]/[0.07] transition-all duration-300">
                      <Link to={`/subasta/detalle/${item.id}`}>
                        <Info className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))

            ) : (
              <TableRow className="hover:bg-transparent border-0">
                <TableCell colSpan={6} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-2 h-2 border border-[#C9A84C]/50 rotate-45" />
                    <span className="text-[12px] tracking-[0.35em] uppercase text-[#F5F0E8]/40">
                      No hay subastas para mostrar
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            )}

          </TableBody>
        </Table>
      </div>

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