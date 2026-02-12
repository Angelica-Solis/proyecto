<?php

require_once "vendor/autoload.php";

use Firebase\JWT\JWT;

class user
{

    public function RolEstadoUsuarios()
    {
        try {
            $response = new Response();
            $usuarioM = new UsuarioModel();
            $result = $usuarioM->RolEstadoUsuarios();

            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    //Detalle de cada usuario
    public function DetalleUsuarios($idUsuario)
    {
        try {
            $response = new Response();
            $usuarioM = new UsuarioModel();
            $result = $usuarioM->DetalleUsuarios($idUsuario);

            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
