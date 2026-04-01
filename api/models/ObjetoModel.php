<?php
class ObjetoModel
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    public function get($id)
    {
        // 1. Consulta a la tabla objeto
        $vSql = "SELECT * FROM objeto WHERE id=$id;";
        $vResultado = $this->enlace->executeSQL($vSql);

        if (!empty($vResultado)) {
            $vResultado = $vResultado[0];

            // composición: Obtener descripción de la condición
            $vResultado->condicion = $this->getCondicion($vResultado->idCondicion);

            // composición: Obtener todas las imágenes usando el modelo de imágenes
            $imgM = new ObjetoImagenModel();
            $vResultado->imagenes = $imgM->getImagenesPorObjeto($vResultado->id);

            //  composición: Obtener nombres de categorías
            $vResultado->categorias = $this->getCategoriasPorObjeto($id);
        }
        return $vResultado;
    }

    private function getCondicion($idCondicion)
    {
        $sql = "SELECT descripcionCondicion FROM condicion WHERE id=$idCondicion";
        $res = $this->enlace->executeSQL($sql);
        return (!empty($res)) ? $res[0]->descripcionCondicion : null;
    }

    private function getCategoriasPorObjeto($idObjeto)
    {
        $sql = "SELECT c.id, c.nombreCategoria 
            FROM categoria c
            INNER JOIN objeto_categoria oc ON c.id = oc.idCategoria
            WHERE oc.idObjeto = $idObjeto";

        $res = $this->enlace->executeSQL($sql);
        return (!empty($res) && is_array($res)) ? $res : [];
    }


    //Listado de objetos 

    public function ListadoObjetos()
    {
        $imgM = new ObjetoImagenModel();
        $usuarioM = new UsuarioModel();

        $vSql = "SELECT 
        id, nombreObjeto, idVendedor, idCondicion, idEstadoObjeto
        FROM objeto WHERE idEstadoObjeto != 4; ";

        $vResultado = $this->enlace->executeSQL($vSql);

        if (!empty($vResultado) && is_array(($vResultado))) {
            foreach ($vResultado as $objeto) {
                $objeto->imagenPrincipal = $imgM->getPrimeraImagen($objeto->id);

                $categorias = $this->getCategoriasPorObjeto($objeto->id);
                $listaCategorias = [];

                if (!empty($categorias)) {
                    foreach ($categorias as $cate) {
                        $listaCategorias[] = $cate->nombreCategoria;
                    }
                }
                $objeto->categorias = implode(',', $listaCategorias);
                $objeto->condicion = $this->getCondicion($objeto->idCondicion);
                $objeto->estado = $this->getEstado($objeto->idEstadoObjeto);

                $duenno = $usuarioM->get($objeto->idVendedor);
                $objeto->duenno = $duenno ? $duenno->nombreUsuario : 'No esta definido';

                // Elimina SOLO estas propiedades, NO idEstadoObjeto
                unset($objeto->idCondicion, $objeto->idVendedor);
            }
        } else {
            $vResultado = [];
        }
        return $vResultado;
    }
    //Estado para el listado de objetos
    public function getEstado($idEstado)
    {
        $vSql = "SELECT descripcionEstado 
            FROM estado_objeto  
            WHERE id=$idEstado;";
        $res = $this->enlace->executeSQL($vSql);

        return (!empty($res)) ? $res[0]->descripcionEstado : null;
    }


    //Listado de objetos con detalle 

    public function DetalleObjeto($id)
    {
        $imgM =  new ObjetoImagenModel();
        $usuarioM = new UsuarioModel();

        $vSql = "SELECT * FROM objeto WHERE id=$id;";
        $vResultado = $this->enlace->executeSQL($vSql);

        if (!empty($vResultado) && is_array($vResultado)) {
            $objeto = $vResultado[0];

            $objeto->imagenes = $imgM->getImagenesPorObjeto($objeto->id);

            $objeto->categorias = $this->getCategoriasPorObjeto($objeto->id);

            $objeto->condicion = $this->getCondicion($objeto->idCondicion);

            $objeto->estado = $this->getEstado($objeto->idEstadoObjeto);

            $duenno = $usuarioM->get($objeto->idVendedor);
            $objeto->propietario = $duenno ? $duenno->nombreUsuario : "No fue definido";

            $objeto->subastas = $this->getSubastasPorObjeto($objeto->id);

            unset($objeto->idCondicion, $objeto->idEstadoObjeto);


            return $objeto;
        }
        return null;
    }
    //Historial de subastas por objeto.
    public function getSubastasPorObjeto($idObjeto)
    {
        $vSql = "SELECT  id, idObjeto, fechaInicio, fechaCierre, idEstadoSubasta
            FROM subasta
            WHERE idObjeto = $idObjeto;";

        $vResultado = $this->enlace->executeSQL($vSql);

        if (!empty($vResultado) && is_array($vResultado)) {
            foreach ($vResultado as $subasta) {
                $subasta->estado = $this->getEstadoSubasta($subasta->idEstadoSubasta);
                unset($subasta->idEstadoSubasta);
            }
            return $vResultado;
        }
        return [];
    }

    public function getEstadoSubasta($idEstado)
    {
        $vSql = "SELECT descripcionEstado
            FROM estado_subasta
            WHERE id=$idEstado;";

        $res = $this->enlace->executeSQL($vSql);

        return (!empty($res)) ? $res[0]->descripcionEstado : null;
    }

    public function getActivos()
    {
        $vSQL = "SELECT id, nombreObjeto FROM objeto WHERE idEstadoObjeto = 1 ORDER BY nombreObjeto DESC;";
        $vResultado = $this->enlace->ExecuteSQL($vSQL);
        return $vResultado;
    }

    // Crea el objeto
    public function create($objeto)
    {

        if (empty($objeto->nombreObjeto)) throw new Exception("Nombre obligatorio");
        // string lenght = strlen
        if (strlen($objeto->descripcionObjeto) < 20) throw new Exception("Descripción mínima 20 caracteres");
        //Consulta sql
        $sql = "INSERT INTO objeto (nombreObjeto, descripcionObjeto, idCondicion, idEstadoObjeto, idVendedor, fechaRegistro)" .
            " VALUES ('$objeto->nombreObjeto','$objeto->descripcionObjeto',
                    '$objeto->idCondicion','$objeto->idEstadoObjeto','$objeto->idVendedor', NOW())";

        //Obtener ultimo insert
        $idObjeto = $this->enlace->executeSQL_DML_last($sql);
        // categorias 
        //Crear elementos a insertar en categorias
        if (empty($objeto->categorias)) throw new Exception("Debe tener al menos una categoría");
        foreach ($objeto->categorias as $value) {
            $sql = "INSERT INTO objeto_categoria(idObjeto,idCategoria)" .
                "VALUES($idObjeto,$value)";
            $vResultadoCat = $this->enlace->executeSQL_DML($sql);
        }
        //Retornar objeto
        return $this->get($idObjeto);
    }

    public function delete($id)
    {
        try {
            // 1. Validar si el objeto pertenece a alguna subasta
            // Estados de subasta: 1=Activa, 2=Finalizada, 3=Cancelada, 4=Borrador
            $sqlCheck = "SELECT COUNT(*) as conteo FROM subasta 
                    WHERE idObjeto = $id 
                    AND idEstadoSubasta IN (1, 2)"; // Activa o Finalizada (ya subastado)

            $check = $this->enlace->executeSQL($sqlCheck);

            if ($check[0]->conteo > 0) {
                throw new Exception("No se puede eliminar: el objeto ya fue subastado o está en una subasta activa.");
            }

            // 2. Borrado Lógico: Cambiamos el estado a 'Eliminado' (ID 4)
            $sql = "UPDATE objeto SET idEstadoObjeto = 4 WHERE id = $id";
            return $this->enlace->executeSQL_DML($sql);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function restore($id)
    {
        // Restaurar lo devuelve a estado 'Disponible' (ID 1)
        $sql = "UPDATE objeto SET idEstadoObjeto = 1 WHERE id = $id";
        return $this->enlace->executeSQL_DML($sql);
    }
    public function getEliminados()
    {
        $imgM = new ObjetoImagenModel();
        $usuarioM = new UsuarioModel();

        $vSql = "SELECT id, nombreObjeto, idVendedor, idCondicion, idEstadoObjeto 
             FROM objeto 
             WHERE idEstadoObjeto = 4 
             ORDER BY fechaRegistro DESC;";

        $vResultado = $this->enlace->executeSQL($vSql);

        if (!empty($vResultado) && is_array($vResultado)) {
            foreach ($vResultado as $objeto) {
                // Agregar imagen principal
                $imagenPrincipal = $imgM->getPrimeraImagen($objeto->id);
                $objeto->imagenPrincipal = $imagenPrincipal ? $imagenPrincipal : null;

                // Agregar categorías
                $categorias = $this->getCategoriasPorObjeto($objeto->id);
                $listaCategorias = [];
                if (!empty($categorias)) {
                    foreach ($categorias as $cate) {
                        $listaCategorias[] = $cate->nombreCategoria;
                    }
                }
                $objeto->categorias = implode(',', $listaCategorias);

                // Agregar condición
                $objeto->condicion = $this->getCondicion($objeto->idCondicion);

                // Agregar estado
                $objeto->estado = $this->getEstado($objeto->idEstadoObjeto);

                // Agregar dueño
                $duenno = $usuarioM->get($objeto->idVendedor);
                $objeto->duenno = $duenno ? $duenno->nombreUsuario : 'No esta definido';

                // Limpiar propiedades innecesarias pero mantener idEstadoObjeto
                unset($objeto->idCondicion, $objeto->idVendedor);
            }
        } else {
            $vResultado = [];
        }
        return $vResultado;
    }


    // obtener el nombre de la imagen actual del objeto
    public function getImagenActual($idObjeto)
    {
        $sql = "SELECT nombreImagen FROM objeto_imagen WHERE idObjeto = $idObjeto LIMIT 1";
        $result = $this->enlace->executeSQL($sql);
        if (!empty($result)) {
            return $result[0]['nombreImagen'];
        }
        return null;
    }
    //Update

    public function update($objeto)
    {
        //Consulta sql
        $sql = "UPDATE objeto SET  
        nombreObjeto ='$objeto->nombreObjeto',
        descripcionObjeto ='$objeto->descripcionObjeto',
        idCondicion ='$objeto->idCondicion',
        idEstadoObjeto ='$objeto->idEstadoObjeto',
        idVendedor=$objeto->idVendedor
        WHERE id=$objeto->id";
        
        $cResults = $this->enlace->executeSQL_DML($sql);
        //categorias
        $sql = "Delete from objeto_categoria where idObjeto=$objeto->id";
        $vResultadoD = $this->enlace->executeSQL_DML($sql);
        //Insertar categorias
        foreach ($objeto->categorias as $item) {
            $sql = "INSERT INTO objeto_categoria(idObjeto,idCategoria)" .
                " Values($objeto->id,$item)";
            $vResultadoG = $this->enlace->executeSQL_DML($sql);
        }
        //Retornar objeto
        return $this->get($objeto->id);
    }
}
