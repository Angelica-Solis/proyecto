<?php

class objeto{


    public function ListadoObjetos(){
        try {
            $response = new Response();
            $objetoM = new ObjetoModel();
            $result = $objetoM->ListadoObjetos();

            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function DetalleObjeto($id){
            try {
            $response = new Response();
            $objetoM = new ObjetoModel();
            $result = $objetoM->DetalleObjeto($id);

            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}