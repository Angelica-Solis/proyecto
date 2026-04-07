<?php
class PagoModel
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    public function create($pago)
    {
        $sql = "INSERT INTO pago (idResultado, montoPagado, fechaPago, idEstadoPago) 
            VALUES ('$pago->idResultado', '$pago->montoPagado', NOW(), '$pago->idEstadoPago')";

        // Obtener ultimo insert
        $id = $this->enlace->executeSQL_DML_last($sql);

        // Retornar objeto
        return $this->get($id);
    }

    public function get($id)
    {
        $sql = "SELECT * FROM pago WHERE id=$id";
        $res = $this->enlace->executeSQL($sql);
        return $res;
    }

    // Consultar estado de pago
    public function getEstado($id)
    {
        $vSql = "SELECT id, descripcionPago 
            FROM estado_pago  
            WHERE id=$id;";
        $res = $this->enlace->executeSQL($vSql);

        return $res;
    }
}
