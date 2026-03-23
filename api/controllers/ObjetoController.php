<?php

class objeto
{



    public function get($id)
    {
        try {
            $response = new Response();

            $model = new ObjetoModel();
            $result = $model->get($id);

            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }


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
            handleException($e);
        }
    }

    public function delete($id)
    {
        try {
            $response = new Response();
            $objetoM = new ObjetoModel();

            // El modelo debe retornar el resultado del UPDATE
            $result = $objetoM->delete($id);

            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // Restaurar objeto
    public function restore($id)
    {
        try {
            $response = new Response();
            $objetoM = new ObjetoModel();

            $result = $objetoM->restore($id);

            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function eliminados()
    {
        try {
            $response = new Response();
            $objetoM = new ObjetoModel();

            $result = $objetoM->getEliminados();

            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    //Update de objeto put
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
            $model = new ObjetoModel();

            // Ejecutar update
            $result = $model->update($inputJSON);

            // Respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
