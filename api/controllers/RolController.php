<?php
class  rol
{

    public function get($param)
    {
        try {
            $response = new Response();
            $rol = new RolModel();
            $result = $rol->get($param);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
        }
    }

    public function getRolUser($idUser)
    {
        try {
            $response = new Response();
            $rol = new RolModel();
            $result = $rol->getRolUser($idUser);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
        }
    }
}
