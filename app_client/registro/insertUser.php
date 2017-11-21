<?php

include('../conexion.php');

if($_POST['tipo']){
    
    $user = $_POST['user'];
    $passwd = $_POST['pass'];
    $hash_pass = sha1($passwd);
    $name = $_POST['name'];
    $surname = $_POST['surname'];
    $age = $_POST['age'];
    $sex = $_POST['sex'];
    $rol = $_POST['rol'];
    /*$favStation = $_POST['favStation'];
    $brand = $_POST['brand'];
    $model = $_POST['model'];
    $car_model = $brand + " " +$model;
    $conn_type = $_POST['conn_type'];*/ 
    
    
    if (mysqli_error($conn)) {
    
        die("Connection failed: " . mysqli_error($conn));
    
    } else {
    
        $destino = "images/users/";
        $destino = $destino.basename($_FILES['pic']['name']);
        echo $destino;

        if(move_uploaded_file($_FILES['pic']['tmp_name'], $destino)){

            $sql = "INSERT INTO users (usuario,pass,nombre,apellido,edad,sex,rol,pic) VALUES (                                                    '".$user."','".$hash_pass."','".$name."','".$surname."','".$age."','".$sex."','".$rol."','".$destino."')";
                
        } else {

            $sql = "INSERT INTO users (usuario,pass,nombre,apellido,edad,sex,rol,pic) VALUES (                                                   '".$user."','".$hash_pass."','".$name."','".$surname."','".$age."','".$sex."','".$rol."',null)";
                
        }

    } 
            
    if (mysqli_query($conn,$sql)) {
        echo "New user created successfully";
    } else {
        echo "Error: ". mysqli_error($conn);
    }
    
    
} else {
    
    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);
    //echo "Postdata: ".$postdata;
    //echo "Request: ".print_r($request);
    
    $sql = "INSERT INTO users (";
    foreach($request as $key => $value){
        $sql .= "$key,";
    }
    
    $sql = rtrim($sql,',');
    $sql .= ") VALUES  (";
    foreach($request as $key => $value){
        if($key == "pass"){
            $hash_pass = sha1($value);
            $sql .= "'$hash_pass',";
        } else $sql .= "'$value',";
    }
    $sql = rtrim($sql,',');
    $sql .= ")";
    
    //echo $sql;
    
    if (mysqli_query($conn,$sql)){
        echo "{Usuario creado correctamente}";
    } else {
        echo "{Error al crear usuario: ".mysqli_error($conn)."}";
    }
}

mysqli_close($conn);

 
?>
