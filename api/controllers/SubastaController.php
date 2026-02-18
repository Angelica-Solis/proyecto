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
}