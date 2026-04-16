<?php
class pago
{
    public function get($id)
    {
        try {
            $response = new Response();

            $model = new PagoModel();
            $result = $model->get($id);

            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function create()
    {
        try {
            $request = new Request();
            $response = new Response();
            //Obtener json enviado
            $inputJSON = $request->getJSON();
            //Instancia del modelo
            $pago = new PagoModel();
            //Acción del modelo a ejecutar
            $result = $pago->create($inputJSON);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
  // buscar pago por subasta
    public function getBySubasta($idSubasta)
{
    try {
        $response = new Response();
        $model = new PagoModel();

        $result = $model->getPagoBySubasta($idSubasta);

        $response->toJSON([
            "success" => true,
            "data" => $result
        ]);
    } catch (Exception $e) {
        handleException($e);
    }
}
}
