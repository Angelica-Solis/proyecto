<?php

class PujaModel
{

    public $enlace;
    public function __construct()
    {

        $this->enlace = new MySqlConnect();
    }


    public function get($id)
    {
        //Consulta sql
        $vSql = "SELECT * FROM puja where id=$id;";

        //Ejecutar la consulta
        $vResultado = $this->enlace->ExecuteSQL($vSql);
        // Retornar el objeto
        return $vResultado[0];
    }

    //Obtener pujas por usuario
    public function UsuariosPujadores($idUsuario)
    {
        $vSql = "SELECT p.id
            FROM puja p, usuario u
            WHERE u.id=p.idUsuario and u.id=$idUsuario;";

        $vResultado = $this->enlace->ExecuteSQL($vSql);

        return (!empty($vResultado) && is_array($vResultado)) ? $vResultado : [];
    }


    //Crear puja
    public function create($data, $usuarioActual)
    {
        $idUsuario = $usuarioActual; // usar usuario del header

        $subastaM = new SubastaModel();
        $subasta = $subastaM->get($data->idSubasta);

        if (!$subasta) {
            throw new Exception("La subasta no existe");
        }

        if ($subasta->idEstadoSubasta != 1) {
            throw new Exception("La subasta no está activa");
        }

        if ($subasta->idVendedor == $idUsuario) {
            throw new Exception("No puedes pujar en tu propia subasta");
        }

        $pujaActual = (!empty($subasta->historialPujas))
            ? $subasta->historialPujas[0]->monto
            : $subasta->precioBase;

        if ($data->monto <= $pujaActual) {
            throw new Exception("El monto debe ser mayor a la puja actual");
        }

        if (($data->monto - $pujaActual) < $subasta->incrementoMinimo) {
            throw new Exception("No cumple el incremento mínimo");
        }

        $sql = "INSERT INTO puja (idSubasta, idUsuario, monto, fechaHora)
        VALUES ($data->idSubasta, $idUsuario, $data->monto, NOW())";

        $this->enlace->executeSQL_DML($sql);

        return [
            "idSubasta" => $data->idSubasta,
            "monto" => $data->monto,
            "idUsuario" => $idUsuario
        ];
    }
    // obetener unicamente pujadores
    public function obtenerCompradores()
    {
        $sql = "SELECT id, nombreUsuario
            FROM usuario 
            WHERE IdRol = 3";

        $vRes = $this->enlace->executeSQL($sql);
        return $vRes;
    }
}
