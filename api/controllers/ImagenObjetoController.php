<?php

class image
{
    public function create()
    {
        try {
            $response = new Response();
            $model = new ObjetoImagenModel();

            $result = $model->uploadFile($_FILES, $_POST);

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
