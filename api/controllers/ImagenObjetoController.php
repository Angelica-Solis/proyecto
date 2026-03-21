<?php

class image
{
    public function create()
    {
        try {
            $response = new Response();

            $imagen = new ObjetoImagenModel();

            // PASAR $_FILES y $_POST directamente
            $result = $imagen->uploadFile($_FILES, $_POST);

            $response->toJSON($result);

        } catch (Exception $e) {
            handleException($e);
        }
    }
}