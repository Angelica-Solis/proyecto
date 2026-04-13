<?php

require_once "vendor/autoload.php";

use Firebase\JWT\JWT;

class user
{

    public function get($id)
    {
        try {
            $response = new Response();

            $model = new UsuarioModel();
            $result = $model->get($id);

            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
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

    //Update de usuario put
    public function update($id)
    {
        try {
            $request = new Request();
            $response = new Response();

            // Obtener JSON
            $inputJSON = $request->getJSON();

            // Agregar id
            $inputJSON->id = $id;

            // Instancia del modelo
            $model = new UsuarioModel();

            // Ejecutar update
            $result = $model->update($inputJSON);

            // Respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function create()
    {
        try {
            $request = new Request();
            $response = new Response();
            //Obtener json enviado
            $inputJSON = $request->getJSON();
            //Instancia del modelo
            $objeto = new UsuarioModel();
            //Acción del modelo a ejecutar
            $result = $objeto->create($inputJSON);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function getRoles()
    {
        try {
            $response = new Response();
            $usuarioM = new UsuarioModel();
            $result = $usuarioM->getRoles();

            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // LOGIN
    public function login()
    {
        $response = new Response();
        $request = new Request();
        //Obtener json enviado
        $inputJSON = $request->getJSON();
        $usuario = new UsuarioModel();
        $result = $usuario->login($inputJSON);
        if (isset($result) && !empty($result) && $result != false) {
            $response->toJSON($result);
        } else {
            $response->toJSON($response, "Usuario no valido");
        }
    }
}
