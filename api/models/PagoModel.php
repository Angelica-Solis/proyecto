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
    public function confirmarPago($idPago)
    {
        $sql = "UPDATE pago 
                SET idEstadoPago = 2, fechaPago = NOW() 
                WHERE id = $idPago";

        return $this->enlace->executeSQL_DML($sql);
    }
    public function getPagoBySubasta($idSubasta)
    {
        $sql = "SELECT p.*, ep.descripcion as estado
                FROM pago p
                INNER JOIN resultado_subasta r ON p.idResultado = r.id
                INNER JOIN estado_pago ep ON p.idEstadoPago = ep.id
                WHERE r.idSubasta = $idSubasta";

        $res = $this->enlace->executeSQL($sql);
        return !empty($res) ? $res[0] : null;
    }
}
