<?php

class categoria
{

    public function getCategorias()
    {
        try {
            $response = new Response();
            $categoriaM = new CategoriaModel();
            $result = $categoriaM->getCategorias();

            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
