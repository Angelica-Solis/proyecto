<?php

class resultado
{
    public function get($id)
    {
        try {
            $response = new Response();

            $model = new ResultadoSubastaModel();
            $result = $model->get($id);

            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

}