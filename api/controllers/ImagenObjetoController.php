<?php

class image
{
    public function create()
    {
        try {

        var_dump($_FILES);
var_dump($_POST);
die();
            $response = new Response();

            $imagen = new ObjetoImagenModel();

            // PASAR $_FILES y $_POST directamente
            $result = $imagen->uploadFile($_FILES, $_POST);

            $response->toJSON($result);

        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function update()
{
    try {
        $response = new Response();

        $imagen = new ObjetoImagenModel();

        $result = $imagen->updateFile($_FILES, $_POST);

        $response->toJSON($result);

    } catch (Exception $e) {
        handleException($e);
    }
}
}