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

    const peticion =
      filtro === "activas"
        ? subastaService.getActivas()
        : subastaService.getFinalizadas();

    peticion
      .then((response) => {
        setData(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener subastas:", error);
        setLoading(false);
      });

  }, [filtro]);

  const headersActivas = [
    "Objeto",
    "Fecha Inicio",
    "Fecha Cierre",
    "Pujas",
    "Incremento Mínimo",
    ""
  ];

  const headersFinalizadas = [
    "Objeto",
    "Fecha Cierre",
    "Pujas",
    "Estado Final",
    "Incremento Mínimo"
  ];

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
            <em className="text-[#C9A84C] not-italic font-light">
              Subastas
            </em>
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
              <SelectItem
                value="activas"
                className="text-[12px] tracking-widest focus:bg-[#C9A84C]/10 focus:text-[#C9A84C]"
              >
                Subastas Activas
              </SelectItem>

              <SelectItem
                value="finalizadas"
                className="text-[12px] tracking-widest focus:bg-[#C9A84C]/10 focus:text-[#C9A84C]"
              >
                Finalizadas / Canceladas
              </SelectItem>
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

              {(filtro === "activas"
                ? headersActivas
                : headersFinalizadas
              ).map((h, i) => (

                <TableHead key={i} className={`text-[#C9A84C] text-[11px] font-medium tracking-[0.35em] uppercase py-4 border-b border-[#C9A84C]/20`}>
                  {h}
                </TableHead>

              ))}

            </TableRow>
          </TableHeader>

          <TableBody>

            {/* Cargando */}
            {loading ? (

              <TableRow>
                <TableCell colSpan={7} className="py-16 text-center">

                  <div className="flex flex-col items-center gap-3">
                    <div className="w-7 h-7 rounded-full border-2 border-[#C9A84C]/20 border-t-[#C9A84C] animate-spin" />

                    <span className="text-[12px] tracking-[0.35em] uppercase text-[#F5F0E8]/40">
                      Cargando subastas…
                    </span>
                  </div>

                </TableCell>
              </TableRow>

            ) : data.length > 0 ? (

              data.map((item, idx) => (

                <TableRow key={item.id} className={` border-b border-[#C9A84C]/[0.07] hover:bg-[#C9A84C]/[0.06] ${idx % 2 !== 0 ? "bg-[#F5F0E8]/[0.03]" : "bg-transparent"} `}>

                  {filtro === "activas" ? (

                    <>
                      <TableCell className="py-3 italic">
                        {item.nombreObjeto}
                      </TableCell>

                      <TableCell className="py-3 text-[#F5F0E8]/50">
                        {item.fechaInicio}
                      </TableCell>

                      <TableCell className="py-3 text-[#F5F0E8]/50">
                        {item.fechaCierre}
                      </TableCell>

                      <TableCell className="py-3">
                        {item.cantidadPujas}
                      </TableCell>

                      <TableCell className="py-3">
                        ₡{Number(item.incrementoMinimo).toLocaleString()}
                      </TableCell>

                      <TableCell className="text-right">

                        <Button size="icon" variant="ghost" asChild>
                          <Link to={`/subasta/detalle/${item.id}`}>
                            <Info className="h-4 w-4" />
                          </Link>
                        </Button>

                      </TableCell>
                    </>

                  ) : (

                    <>
                      <TableCell className="py-3 italic">
                        {item.nombreObjeto}
                      </TableCell>

                      <TableCell className="py-3">
                        {item.fechaCierre}
                      </TableCell>

                      <TableCell className="py-3">
                        {item.cantidadPujas}
                      </TableCell>

                      <TableCell className="py-3">
                        {item.estadoNombre}
                      </TableCell>

                      <TableCell className="py-3">
                        ₡{Number(item.incrementoMinimo).toLocaleString()}
                      </TableCell>
                      
                        <Button size="icon" variant="ghost" asChild>
                          <Link to={`/subasta/detalle/${item.id}`}>
                            <Info className="h-4 w-4" />
                          </Link>
                        </Button>
                    </>
                  
                  )}
                  
                </TableRow>

              ))

            ) : (

              <TableRow>
                <TableCell colSpan={7} className="py-16 text-center">

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

      {/* Botón regresar */}
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