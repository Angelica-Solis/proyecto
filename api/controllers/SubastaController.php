<?php
require_once __DIR__ . '/../vendor/autoload.php';

use Pusher\Pusher;

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

    // Listado para mantenimiento (TODAS las subastas)
    public function all()
    {
        try {
            $response = new Response();
            $subastaM = new SubastaModel();
            $result = $subastaM->all();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // CREAR SUBASTA
    public function create()
    {
        try {
            $response = new Response();
            $json = file_get_contents('php://input');
            $objeto = json_decode($json);

            // VARIABLE LÓGICA SIMULADA: Asignamos el vendedor directamente
            $objeto->idVendedor = 1;

            $subastaM = new SubastaModel();
            $result = $subastaM->create($objeto);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // ACTUALIZAR SUBASTA (Borrador)
    public function update()
    {
        try {
            $response = new Response();
            $json = file_get_contents('php://input');
            $objeto = json_decode($json);

            $subastaM = new SubastaModel();
            $result = $subastaM->update($objeto);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // PUBLICAR SUBASTA
    public function publicar($id)
    {
        try {
            $response = new Response();
            $subastaM = new SubastaModel();
            $result = $subastaM->publicar($id);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // CANCELAR SUBASTA
    public function cancelar($id)
    {
        try {
            $response = new Response();
            $subastaM = new SubastaModel();
            $result = $subastaM->cancelar($id);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    //Pusher 
    private function getPusher()
    {
        $options = [
            'cluster' => PUSHER_CLUSTER,
            'useTLS' => true
        ];

        return new Pusher(
            PUSHER_KEY,
            PUSHER_SECRET,
            PUSHER_APP_ID,
            $options
        );
    }
    // Crear puja
    public function createPuja()
    {
        try {
            $request = new Request();
            $response = new Response();
            $inputJSON = $request->getJSON();

            // Leer usuario desde header, default 1
            $usuarioActual = $_SERVER['HTTP_X_USUARIO_ID'] ?? 1;

            $subastaM = new SubastaModel();

            // obtener líder anterior
            $subastaAntes = $subastaM->get($inputJSON->idSubasta);
            $liderAnterior = (!empty($subastaAntes->historialPujas))
                ? $subastaAntes->historialPujas[0]->idUsuario
                : null;

            $pujaModel = new PujaModel();
            $result = $pujaModel->create($inputJSON, $usuarioActual); // pasar usuarioActual

            // Pusher
            $pusher = $this->getPusher();
            $data = [
                "idSubasta" => $inputJSON->idSubasta,
                "monto" => $result["monto"],
                "idUsuario" => $result["idUsuario"],
                "liderAnterior" => $liderAnterior,
                "usuarioActual" => $usuarioActual
            ];
            $pusher->trigger("subasta", "nueva-puja", $data);

            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
