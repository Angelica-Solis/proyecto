<?php
class ObjetoImagenModel
{
    public $enlace;
    public $upload_path =  'uploads/';
    private $valid_extensions = ['jpg', 'jpeg', 'png', 'gif'];

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    // listado de objetos (solo una imagen)
    public function getPrimeraImagen($idObjeto)
    {
        $vSql = "SELECT nombreImagen FROM objeto_imagen 
                WHERE idObjeto = $idObjeto LIMIT 1;";
        $vResultado = $this->enlace->ExecuteSQL($vSql);
        return (!empty($vResultado)) ? $vResultado[0]->nombreImagen : null;
    }

    // se usa para el detalle (todas las imágenes)
    public function getImagenesPorObjeto($idObjeto)
    {
        $vSql = "SELECT nombreImagen FROM objeto_imagen WHERE idObjeto = $idObjeto;";
        $vResultado = $this->enlace->ExecuteSQL($vSql);
        return $vResultado;
    }

    public function uploadFile($files, $post)
    {
        $file = $files['file'];
        $objeto_id = $post['objeto_id'];
        //Obtener la información del archivo
        $fileName = $file['name'];
        $tempPath = $file['tmp_name'];
        $fileSize = $file['size'];
        $fileError = $file['error'];

        if (!empty($fileName)) {
            //Crear un nombre único para el archivo
            $fileExt = explode('.', $fileName);
            $fileActExt = strtolower(end($fileExt));
            $fileName = "objeto-" . uniqid() . "." . $fileActExt;
            //Validar el tipo de archivo
            if (in_array($fileActExt, $this->valid_extensions)) {
                //Validar que no exista
                if (!file_exists($this->upload_path . $fileName)) {
                    //Validar que no sobrepase el tamaño
                    if ($fileSize < 2000000 && $fileError == 0) {
                        if (!isset($files['file'])) {
                            die("No viene archivo");
                        }
                        //Moverlo a la carpeta del servidor del API

                        if (move_uploaded_file($tempPath, $this->upload_path . $fileName)) {
                            $sql = "INSERT INTO objeto_imagen (idObjeto,nombreImagen) 
            VALUES ($objeto_id, '$fileName')";
                            $vResultado = $this->enlace->executeSQL_DML($sql);

                            return $vResultado > 0;
                        } else {
                            die("Error moviendo archivo");
                        }
                    }
                }
            }
        }
    }

        //update de la imagen
    public function updateFile($files, $post)
{
    $file = $files['file'];
    $objeto_id = $post['objeto_id'];

    // 1. Obtener imagen actual
    $sql = "SELECT nombreImagen FROM objeto_imagen WHERE idObjeto = $objeto_id LIMIT 1";
    $result = $this->enlace->executeSQL($sql);

    if ($result && count($result) > 0) {
        $oldImage = $result[0]->nombreImagen;

        // 2. Eliminar archivo físico si existe
        if ($oldImage && file_exists($this->upload_path . $oldImage)) {
            unlink($this->upload_path . $oldImage);
        }

        // 3. Eliminar registro en BD
        $sqlDelete = "DELETE FROM objeto_imagen WHERE idObjeto = $objeto_id";
        $this->enlace->executeSQL_DML($sqlDelete);
    }

    // 4. Subir nueva imagen (misma lógica que create)
    $fileName = $file['name'];
    $tempPath = $file['tmp_name'];
    $fileSize = $file['size'];
    $fileError = $file['error'];

    if (!empty($fileName)) {
        $fileExt = explode('.', $fileName);
        $fileActExt = strtolower(end($fileExt));
        $fileName = "objeto-" . uniqid() . "." . $fileActExt;

        if (in_array($fileActExt, $this->valid_extensions)) {
            if (!file_exists($this->upload_path . $fileName)) {
                if ($fileSize < 2000000 && $fileError == 0) {

                    if (move_uploaded_file($tempPath, $this->upload_path . $fileName)) {

                        $sqlInsert = "INSERT INTO objeto_imagen (idObjeto,nombreImagen) 
                        VALUES ($objeto_id, '$fileName')";
                        
                        $vResultado = $this->enlace->executeSQL_DML($sqlInsert);

                        return $vResultado > 0;
                    } else {
                        die("Error moviendo archivo");
                    }
                }
            }
        }
    }
}
}
