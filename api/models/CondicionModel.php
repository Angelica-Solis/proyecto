<?php
class CondicionModel
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    public function getAll()
    {
        $sql = "SELECT id, descripcionCondicion FROM condicion";
        return $this->enlace->executeSQL($sql);
    }
}