<?php

class status
{

    public function get($param)
    {
        try {
            $response = new Response();
            $status = new statusModel();
            $result = $status->get($param);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
        }
    }

    public function getstatusUser($idUser)
    {
        try {
            $response = new Response();
            $status = new statusModel();
            $result = $status->getstatusUser($idUser);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
        }
    }
}
