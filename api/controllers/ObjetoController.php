<?php

class objeto
{


    public function ListadoObjetos()
    {
        try {
            $response = new Response();
            $objetoM = new ObjetoModel();
            $result = $objetoM->ListadoObjetos();

            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function DetalleObjeto($id)
    {
        try {
            $response = new Response();
            $objetoM = new ObjetoModel();
            $result = $objetoM->DetalleObjeto($id);

            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    public function activos()
    {
        try {
            $response = new Response();
            $objetoM = new ObjetoModel();

            // Llamamos al modelo para obtener objetos con idEstadoObjeto = 1 (Activo)
            $result = $objetoM->getActivos();

            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
        //Crear post 
    public function create()
    {
        try {
            $request = new Request();
            $response = new Response();
            //Obtener json enviado
            $inputJSON = $request->getJSON();
            //Instancia del modelo
            $objeto = new ObjetoModel();
            //Acción del modelo a ejecutar
            $result = $objeto->create($inputJSON);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
            
        }
    }
}
