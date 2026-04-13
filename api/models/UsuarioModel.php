<?php

use Firebase\JWT\JWT;

class UsuarioModel
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    public function all()
    {
        //Consulta sql
        $vSql = "SELECT * FROM usuario;";

        //Ejecutar la consulta
        $vResultado = $this->enlace->ExecuteSQL($vSql);

        // Retornar el objeto
        return $vResultado;
    }

    public function get($id)
    {
        // Traemos solo datos públicos por seguridad
        $vSql = "SELECT u.id, u.nombreUsuario, u.emailUsuario, u.IdRol, u.IdEstado, u.fecha_registro, r.nombreRol, e.descripcionEstado
            FROM usuario u 
            INNER JOIN rol r ON r.id = u.IdRol
            INNER JOIN estado_usuario e ON e.id = u.IdEstado
            WHERE u.id=$id;";
        $vResultado = $this->enlace->executeSQL($vSql);

        return (!empty($vResultado)) ? $vResultado[0] : null;
    }
    //Listado de usuarios mostrando solo rol, estado y nombre del usuario
    public function RolEstadoUsuarios()
    {
        $vSql = "
        SELECT u.id, u.nombreUsuario, r.nombreRol AS rol, e.descripcionEstado AS estado
        FROM usuario u
        INNER JOIN rol r ON r.id = u.IdRol
        INNER JOIN estado_usuario e ON e.id = u.IdEstado
        ORDER BY id DESC;";

        return $this->enlace->ExecuteSQL($vSql);
    }

    //Obtener detalle de cada usuario
    public function DetalleUsuarios($id)
    {
        // 1. Información básica (REQUERIDO: Nombre, Rol, Estado, Fecha)
        $vSql = "SELECT u.id, u.nombreUsuario, r.nombreRol, e.descripcionEstado, u.fecha_registro, u.emailUsuario
            FROM usuario u
            INNER JOIN rol r ON r.id = u.IdRol
            INNER JOIN estado_usuario e ON e.id = u.IdEstado
            WHERE u.id = $id;";

        $vResultado = $this->enlace->executeSQL($vSql);

        if (!empty($vResultado)) {
            $usuario = $vResultado[0];

            // 2. Campos Calculados
            // Conteo de Subastas creadas
            $sqlCountSubastas = "SELECT COUNT(*) as total FROM subasta WHERE idVendedor = $id";
            $resSub = $this->enlace->executeSQL($sqlCountSubastas);
            $usuario->cantidadSubastas = $resSub[0]->total;

            // Conteo de Pujas realizadas
            $sqlCountPujas = "SELECT COUNT(*) as total FROM puja WHERE idUsuario = $id";
            $resPuja = $this->enlace->executeSQL($sqlCountPujas);
            $usuario->cantidadPujas = $resPuja[0]->total;

            // 3. Historial detallado
            $usuario->actividad = [];
            if ($usuario->nombreRol == 'Vendedor') {
                $sqlVendedor = "SELECT o.nombreObjeto as titulo, s.precioBase as monto, s.fechaInicio as fecha
                            FROM subasta s
                            INNER JOIN objeto o ON s.idObjeto = o.id
                            WHERE s.idVendedor = $id
                            ORDER BY s.fechaInicio DESC";
                $usuario->actividad = $this->enlace->executeSQL($sqlVendedor) ?: [];
            } else {
                $sqlComprador = "SELECT o.nombreObjeto as titulo, p.monto, p.fechaHora as fecha
                            FROM puja p
                            INNER JOIN subasta s ON p.idSubasta = s.id
                            INNER JOIN objeto o ON s.idObjeto = o.id
                            WHERE p.idUsuario = $id
                            ORDER BY p.fechaHora DESC";
                $usuario->actividad = $this->enlace->executeSQL($sqlComprador) ?: [];
            }

            return $usuario;
        }
        return null;
    }

    // Update al usuario
    public function update($usuario)
    {

        $sql = "UPDATE usuario SET 
            nombreUsuario ='$usuario->nombreUsuario',
            emailUsuario ='$usuario->emailUsuario',
            IdEstado ='$usuario->IdEstado'
        WHERE id = $usuario->id";

        $cResults = $this->enlace->executeSQL_DML($sql);

        //Retornar usuario
        return $this->get($usuario->id);
    }

    // Crear el objeto
    public function create($usuario)
    {
        try {

            // Validaciones
            if (empty($usuario->nombreUsuario)) {
                throw new Exception("El nombre es obligatorio");
            }

            if (empty($usuario->emailUsuario)) {
                throw new Exception("El correo es obligatorio");
            }

            if (!filter_var($usuario->emailUsuario, FILTER_VALIDATE_EMAIL)) {
                throw new Exception("Correo inválido");
            }

            if (empty($usuario->contrasenna)) {
                throw new Exception("La contraseña es obligatoria");
            }

            if (strlen($usuario->contrasenna) < 3) {
                throw new Exception("La contraseña debe tener al menos 3 caracteres");
            }

            if (empty($usuario->IdRol)) {
                throw new Exception("El rol es obligatorio");
            }

            if (empty($usuario->IdEstado)) {
                throw new Exception("El estado es obligatorio");
            }

            // HASH
            $passwordHash = password_hash($usuario->contrasenna, PASSWORD_DEFAULT);

            // SQL
            $sql = "INSERT INTO usuario 
            (nombreUsuario, emailUsuario, contrasenna, IdRol, IdEstado, fecha_registro)
            VALUES 
            ('$usuario->nombreUsuario', '$usuario->emailUsuario', '$passwordHash', '$usuario->IdRol', '$usuario->IdEstado', NOW())";

            $idUsuario = $this->enlace->executeSQL_DML_last($sql);

            // Retornar usuario creado
            return $this->get($idUsuario);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // obtener solo roles
    public function getRoles()
    {
        try {
            $sql = "SELECT id, nombreRol FROM rol ORDER BY nombreRol";
            return $this->enlace->ExecuteSQL($sql);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // LOGIN DEL USUARIO
    public function login($objeto)
    {
        $vSql = "SELECT * from usuario where emailUsuario='$objeto->email'";
        //Ejecutar la consulta
        $vResultado = $this->enlace->ExecuteSQL($vSql);
        if (is_object($vResultado[0])) {
            $user = $vResultado[0];
            if (password_verify($objeto->password, $user->contrasenna)) {
                $usuario = $this->get($user->id);
                if (!empty($usuario)) {
                    // Datos para el token JWT
                    $data = [
                        'id' => $usuario->id,
                        'email' => $usuario->emailUsuario,
                        'rol' => $usuario->nombreRol,
                        'iat' => time(),  // Hora de emisión
                        'exp' => time() + 3600 // Expiración en 1 hora
                    ];

                    // Generar el token JWT
                    $jwt_token = JWT::encode($data, config::get('SECRET_KEY'), 'HS256');

                    // Enviar el token como respuesta
                    return $jwt_token;
                }
            }
        } else {
            return false;
        }
    }
}
