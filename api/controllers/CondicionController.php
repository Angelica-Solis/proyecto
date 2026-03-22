<?php

class condicion
{

    public function index()
    {
        try {
            $response = new Response();
            $condicioM = new CondicionModel();
            $result = $condicioM->getAll();

            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}