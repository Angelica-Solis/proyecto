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
        $sql = "SELECT c.nombreCategoria 
                FROM categoria c, objeto_categoria oc 
                WHERE c.id = oc.idCategoria AND oc.idObjeto = $idObjeto";
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
        FROM objeto; ";

        $vResultado = $this->enlace->executeSQL($vSql);

        if (!empty($vResultado) && is_array(($vResultado))) {
            foreach ($vResultado as $objeto) {
                $objeto->imagenPrincipal = $imgM->getPrimeraImagen($objeto->id);
                //Categorias
                $categorias = $this->getCategoriasPorObjeto($objeto->id);
                $listaCategorias = [];

                if (!empty($categorias)) {
                    foreach ($categorias as $cate) {
                        $listaCategorias[] = $cate->nombreCategoria;
                    }
                }
                //implode une los elementos de un array en una sola cadena de texto, este se separa en ,
                $objeto->categorias = implode(',', $listaCategorias);

                //Condicion
                $objeto->condicion = $this->getCondicion($objeto->idCondicion);
                //Estado
                $objeto->estado = $this->getEstado($objeto->id);
                //Duenno
                $duenno = $usuarioM->get($objeto->id);
                $objeto->duenno = $duenno ? $duenno->nombreUsuario : 'No esta definido';
                            // Unset funciona para que elimine una variable o propiedad de un objeto en tiempo de ejecucion
                            unset($objeto->idCondicion, $objeto->idVendedor, $objeto->idEstadoObjeto, $objeto->id);
            }
        }else{
            $vResultado = [];
        }
        return $vResultado;
    }
 //Estado para el listado de objetos
    public function getEstado($idEstado)
    {
        $vSql = "SELECT descripcionEstado FROM estado_objeto  WHERE id=$idEstado;";
        $res = $this->enlace->executeSQL($vSql);
        return $res;
    }


    //Listado de objetos con detalle 

    public function DetalleObjeto($id){
        $imgM =  new ObjetoImagenModel();
        $usuarioM = new UsuarioModel();

        $vSql= "SELECT * FROM objeto WHERE id=$id;";
        $vResultado = $this->enlace->executeSQL($vSql);

        if(!empty($vResultado) && is_array($vResultado)){
            $objeto = $vResultado[0];

            $objeto->imagenes = $imgM->getImagenesPorObjeto($objeto->id);

            $objeto->categorias = $this->getCategoriasPorObjeto($objeto->id);

            $objeto->condicion = $this->getCondicion($objeto->idCondicion);

            $objeto->estado = $this->getEstadoSubasta($objeto->id);

            $duenno = $usuarioM->get($objeto->idVendedor);
            $objeto->propietario = $duenno ? $duenno->nombreUsuario : "No fue definido";

            $objeto->subastas = $this->getSubastasPorObjeto($objeto->id);

            unset($objeto->idCondicion, $objeto->idEstadoObjeto, $objeto->idVendedor);


            return $objeto;
        }
        return null;
    }
        //Historial de subastas por objeto.
        public function getSubastasPorObjeto($idObjeto){
            $vSql = "SELECT id, fechaInicio, fechaCierre, idEstadoSubasta
            FROM subasta
            WHERE id = $idObjeto;";

            $vResultado = $this->enlace->executeSQL($vSql);

            if(!empty($vResultado) && is_array($vResultado)){
                foreach($vResultado as $subasta){
                    $subasta->estado = $this->getEstado($subasta->idEstadoSubasta);
                    unset($subasta->idEstadoSubasta);
                }
                return $vResultado;
            }
            return [];
        }

        public function getEstadoSubasta($idEstado){
            $vSql= "SELECT descripcionEstado
            FROM estado_subasta
            WHERE id=$idEstado;";

            $res = $this->enlace->executeSQL($vSql);

            return (!empty($res)) ? $res[0]->descripcionEstado : null;
        }
}
