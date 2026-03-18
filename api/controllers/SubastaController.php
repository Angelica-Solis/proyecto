<?php
class subasta
{
    public function get($id)
{
    try {
        $response = new Response();
        $subastaM = new SubastaModel();
        $result = $subastaM->get($id);
        $response->toJSON($result);
    } catch (Exception $e) {
        handleException($e);
    }
}

    public function activas()
    {
        try {
            $response = new Response();
            $subastaM = new SubastaModel();
            
            // Obtenemos los datos del modelo
            $result = $subastaM->getActivas();
            
            // Retornamos JSON
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function finalizadas()
{
    try {
        $response = new Response();
        $subastaM = new SubastaModel();
        
        $result = $subastaM->getFinalizadas();
        
        $response->toJSON($result);
    } catch (Exception $e) {
        handleException($e);
    }
}
public function historial($idSubasta)
{
    try {
        $response = new Response();
        $subastaM = new SubastaModel();
        
        // Obtenemos el historial validando el ID de subasta
        $result = $subastaM->getHistorialPujas($idSubasta);
        
        $response->toJSON($result);
    } catch (Exception $e) {
        handleException($e);
    }
}

// Listado para mantenimiento (TODAS las subastas)
    public function all()
    {
        try {
            $response = new Response();
            $subastaM = new SubastaModel();
            $result = $subastaM->all();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // CREAR SUBASTA
    public function create()
    {
        try {
            $response = new Response();
            $json = file_get_contents('php://input');
            $objeto = json_decode($json);

            // VARIABLE LÓGICA SIMULADA: Asignamos el vendedor directamente
            $objeto->idVendedor = 1; 

            $subastaM = new SubastaModel();
            $result = $subastaM->create($objeto);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // ACTUALIZAR SUBASTA (Borrador)
    public function update()
    {
        try {
            $response = new Response();
            $json = file_get_contents('php://input');
            $objeto = json_decode($json);

            $subastaM = new SubastaModel();
            $result = $subastaM->update($objeto);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // PUBLICAR SUBASTA
    public function publicar($id)
    {
        try {
            $response = new Response();
            $subastaM = new SubastaModel();
            $result = $subastaM->publicar($id);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // CANCELAR SUBASTA
    public function cancelar($id)
    {
        try {
            $response = new Response();
            $subastaM = new SubastaModel();
            $result = $subastaM->cancelar($id);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}