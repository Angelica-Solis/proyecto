<?php
require_once __DIR__ . '/../vendor/autoload.php';

use Pusher\Pusher;

class subasta
{
    public function get($id)
    {
        try {
            $subastaM = new SubastaModel();

            // 1. Verificar si debe cerrarse antes de devolver los datos
            if ($subastaM->verificarYCerrar($id)) {
                // Si se cerró, notificamos a Pusher para que los que están viendo se enteren
                $pusher = $this->getPusher();
                $pusher->trigger("subasta", "subasta-finalizada", ["idSubasta" => $id]);
            }

            $response = new Response();
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
            $subastaM = new SubastaModel();

            // Validar datos básicos
            if (empty($inputJSON->idSubasta) || empty($inputJSON->monto) || empty($inputJSON->idUsuario)) {
                throw new Exception("Datos incompletos para realizar la puja");
            }

            $usuarioActual = $inputJSON->idUsuario;

            // 1. Verificar cierre ANTES de permitir la puja
            if ($subastaM->verificarYCerrar($inputJSON->idSubasta)) {
                $pusher = $this->getPusher();
                $pusher->trigger("subasta", "subasta-finalizada", [
                    "idSubasta" => $inputJSON->idSubasta
                ]);

                throw new Exception("La subasta ha finalizado y ya no acepta pujas.");
            }

            // 2. Obtener líder anterior
            $subastaAntes = $subastaM->get($inputJSON->idSubasta);

            $liderAnterior = (!empty($subastaAntes->historialPujas))
                ? $subastaAntes->historialPujas[0]->idUsuario
                : null;

            // 3. Crear puja
            $pujaModel = new PujaModel();
            $result = $pujaModel->create($inputJSON, $usuarioActual);

            // 4. Notificar con Pusher
            $pusher = $this->getPusher();

            $data = [
                "idSubasta" => $inputJSON->idSubasta,
                "monto" => $result["monto"],
                "idUsuario" => $result["idUsuario"],
                "liderAnterior" => $liderAnterior,
                "usuarioActual" => $usuarioActual
            ];

            $pusher->trigger("subasta", "nueva-puja", $data);

            // 5. Respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    //Obtener unicamente pujadores
    public function obtenerCompradores()
    {
        try {
            $response = new Response();
            $pujaM = new PujaModel();
            $result = $pujaM->obtenerCompradores();

            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
