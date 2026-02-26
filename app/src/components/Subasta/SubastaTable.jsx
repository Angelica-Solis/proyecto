import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Info } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import subastaService from "@/services/SubastaService"; 

export function SubastaTable() {
  const [filtro, setFiltro] = useState("activas");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    
    // Llamada al servicio según el filtro seleccionado
    const peticion = filtro === "activas" 
      ? subastaService.getActivas() 
      : subastaService.getFinalizadas();

    peticion
      .then((response) => {
        setData(response.data.data); //
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener subastas:", error);
        setLoading(false);
      });
  }, [filtro]);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Listado de Subastas</h1>
        
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground">Filtrar:</span>
          <Select value={filtro} onValueChange={(value) => setFiltro(value)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Estado de subasta" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="activas">Subastas Activas</SelectItem>
              <SelectItem value="finalizadas">Finalizadas / Canceladas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Imagen</TableHead>
              <TableHead>Objeto</TableHead>
              <TableHead>Fecha Inicio</TableHead>
              <TableHead>Fecha Cierre</TableHead>
              <TableHead>Pujas</TableHead>
              <TableHead>Precio Base</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={8} className="text-center py-10">Cargando...</TableCell></TableRow>
            ) : data.length > 0 ? (
              data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {/* Imagen procesada desde el modelo */}
                    <img 
                      src={`/assets/images/${item.imagen}`} 
                      alt={item.nombreObjeto}
                      className="h-12 w-12 rounded object-cover border" 
                    />
                  </TableCell>
                  <TableCell className="font-semibold">{item.nombreObjeto}</TableCell>
                  <TableCell>{item.fechaInicio}</TableCell>
                  <TableCell>{item.fechaCierre}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{item.cantidadPujas}</Badge>
                  </TableCell>
                  <TableCell>${item.precioBase}</TableCell>
                  <TableCell>
                    <Badge variant={filtro === "activas" ? "default" : "destructive"}>
                      {filtro === "activas" ? "Activa" : item.estadoNombre}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {/* Botón de detalle similar al de objetos */}
                    <Button size="icon" variant="ghost" asChild>
                      <Link to={`/subasta/detalle/${item.id}`}>
                        <Info className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={8} className="text-center py-10">No hay subastas para mostrar</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}