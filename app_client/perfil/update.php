<?php

include('../conexion.php');
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
//echo print_r($request);
$id_user = $request->id;
//echo "ID: ".$id_user;
$tipo = $request->tipo;

$outp = "";
// Check connection
if (mysqli_connect_error($conn)) {
    
    die("Connection failed: " . $conn->connect_error);
    
} else {
    
    $sql = "SELECT * FROM users WHERE id = ".$id_user;
    $result = mysqli_query($conn,$sql);

    $row = mysqli_fetch_assoc($result);
    $usuario_actual = $row["usuario"];
    $hashpass_actual = $row["pass"];
    $nombre_actual = $row["nombre"];
    $edad_actual = $row["edad"];
    $sex_actual = $row["sex"];
    $pic_actual = $row["pic"];
    $car_actual = $row["car_model"];
    $conn_type_actual = $row["conn_type"];

    switch($tipo){

        case "password":
            $passwd = $request->pass;
            $hash_pass = sha1($passwd);
            if ($hashpass_actual != $hash_pass){
                $result_2 = mysqli_query($conn,"UPDATE users SET pass = '".$hash_pass."' WHERE id = '".$id_user."'");
            }
            
            $resultado = mysqli_query($conn,"SELECT * FROM users WHERE id = '".$id_user."'");
            $rs = mysqli_fetch_assoc($resultado);

            if ($outp != "") {$outp .= ",";}
                $outp .= '{"Usuario":"'  . $rs["usuario"] . '",';
                $outp .= '"Nombre":"'  . $rs["nombre"] . '",';
                $outp .= '"Edad":"'  . $rs["edad"] . '",';
                $outp .= '"Sexo":"'  . $rs["sex"] . '",';
                $outp .= '"Foto":"'. $rs["pic"]     . '",'; 
                $outp .= '"Car":"'. $rs["car_model"]     . '",';
                $outp .= '"Connector":"'. $rs["conn_type"]     . '"}'; 

            echo $outp;            
            
        break;

        case "nombre":
            $nombre = $request->name;
            if ($nombre_actual != $nombre){
                $result_2 = mysqli_query($conn,"UPDATE users SET nombre = '".$nombre."' WHERE id = '".$id_user."'");
            }
            
            $resultado = mysqli_query($conn,"SELECT * FROM users WHERE id = '".$id_user."'");
            $rs = mysqli_fetch_assoc($resultado);

            if ($outp != "") {$outp .= ",";}
                $outp .= '{"Usuario":"'  . $rs["usuario"] . '",';
                $outp .= '"Nombre":"'  . $rs["nombre"] . '",';
                $outp .= '"Edad":"'  . $rs["edad"] . '",';
                $outp .= '"Sexo":"'  . $rs["sex"] . '",';
                $outp .= '"Foto":"'. $rs["pic"]     . '",';
                $outp .= '"Rol":"'. $rs["rol"]     . '",';
                $outp .= '"Car":"'. $rs["car_model"]     . '",';
                $outp .= '"Connector":"'. $rs["conn_type"]     . '"}';
                
                echo $outp;
        break;

        case "age":
            $edad = $request->age;
            if ($edad_actual != $edad){
                $result_2 = mysqli_query($conn,"UPDATE users SET edad = '".$edad."' WHERE id = '".$id_user."'");
            }
            
            $resultado = mysqli_query($conn,"SELECT * FROM users WHERE id = '".$id_user."'");
            $rs = mysqli_fetch_assoc($resultado);

            if ($outp != "") {$outp .= ",";}
                $outp .= '{"Usuario":"'  . $rs["usuario"] . '",';
                $outp .= '"Nombre":"'  . $rs["nombre"] . '",';
                $outp .= '"Edad":"'  . $rs["edad"] . '",';
                $outp .= '"Sexo":"'  . $rs["sex"] . '",';
                $outp .= '"Foto":"'. $rs["pic"]     . '",';
                $outp .= '"Rol":"'. $rs["rol"]     . '",';
                $outp .= '"Car":"'. $rs["car_model"]     . '",';
                $outp .= '"Connector":"'. $rs["conn_type"]     . '"}';
                
                echo $outp;
            
        break;

        case "sex":
            $sex = $request->sex;
            if ($sex_actual != $sex){
                $result_2 = mysqli_query($conn,"UPDATE users SET sex = '".$sex."' WHERE id = '".$id_user."'");
            }

            $resultado = mysqli_query($conn,"SELECT * FROM users WHERE id = '".$id_user."'");
            $rs = mysqli_fetch_assoc($resultado);

            if ($outp != "") {$outp .= ",";}
                $outp .= '{"Usuario":"'  . $rs["usuario"] . '",';
                $outp .= '"Nombre":"'  . $rs["nombre"] . '",';
                $outp .= '"Edad":"'  . $rs["edad"] . '",';
                $outp .= '"Sexo":"'  . $rs["sex"] . '",';
                $outp .= '"Foto":"'. $rs["pic"]     . '",';
                $outp .= '"Rol":"'. $rs["rol"]     . '",';
                $outp .= '"Car":"'. $rs["car_model"]     . '",';
                $outp .= '"Connector":"'. $rs["conn_type"]     . '"}';
                
            echo $outp;
            
        break;

        case "pic":
            $destino = "../registro/images/";
            $destino = $destino.basename($_FILES['pic']['name']);
            if(move_uploaded_file($_FILES['pic']['tmp_name'], $destino)){
                $result_2 = mysqli_query($conn,"UPDATE users SET pic = '".$destino."' WHERE id = '".$id_user."'");
            }

            $resultado = mysqli_query($conn,"SELECT * FROM users WHERE id = '".$id_user."'");
            $rs = mysqli_fetch_assoc($resultado);

            if ($outp != "") {$outp .= ",";}
                $outp .= '{"Usuario":"'  . $rs["usuario"] . '",';
                $outp .= '"Nombre":"'  . $rs["nombre"] . '",';
                $outp .= '"Edad":"'  . $rs["edad"] . '",';
                $outp .= '"Sexo":"'  . $rs["sex"] . '",';
                $outp .= '"Foto":"'. $rs["pic"]     . '",';
                $outp .= '"Rol":"'. $rs["rol"]     . '",';
                $outp .= '"Car":"'. $rs["car_model"]     . '",';
                $outp .= '"Connector":"'. $rs["conn_type"]     . '"}';
                
            echo $outp;
                       
        break;
        
        case "car":
            $car = $request->car_model;
            if ($car_actual != $car){
                $result_2 = mysqli_query($conn,"UPDATE users SET car_model = '".$car."' WHERE id = '".$id_user."'");
            } else {
                echo "Error: mismo coche";
            }

            $resultado = mysqli_query($conn,"SELECT * FROM users WHERE id = '".$id_user."'");
            $rs = mysqli_fetch_assoc($resultado);

            if ($outp != "") {$outp .= ",";}
                $outp .= '{"Usuario":"'  . $rs["usuario"] . '",';
                $outp .= '"Nombre":"'  . $rs["nombre"] . '",';
                $outp .= '"Edad":"'  . $rs["edad"] . '",';
                $outp .= '"Sexo":"'  . $rs["sex"] . '",';
                $outp .= '"Foto":"'. $rs["pic"]     . '",';
                $outp .= '"Rol":"'. $rs["rol"]     . '",';
                $outp .= '"Car":"'. $rs["car_model"]     . '",';
                $outp .= '"Connector":"'. $rs["conn_type"]     . '"}';
                
            echo $outp;
            
        break;
        
        case "connector":
            $conn_type = $request->connector;
            if ($conn_type_actual != $conn_type){
                $result_2 = mysqli_query($conn,"UPDATE users SET conn_type = '".$conn_type."' WHERE id = '".$id_user."'");
            } else {
                echo "Error: mismo conector";
            }

            $resultado = mysqli_query($conn,"SELECT * FROM users WHERE id = '".$id_user."'");
            $rs = mysqli_fetch_assoc($resultado);

            if ($outp != "") {$outp .= ",";}
                $outp .= '{"Usuario":"'  . $rs["usuario"] . '",';
                $outp .= '"Nombre":"'  . $rs["nombre"] . '",';
                $outp .= '"Edad":"'  . $rs["edad"] . '",';
                $outp .= '"Sexo":"'  . $rs["sex"] . '",';
                $outp .= '"Foto":"'. $rs["pic"]     . '",';
                $outp .= '"Rol":"'. $rs["rol"]     . '",';
                $outp .= '"Car":"'. $rs["car_model"]     . '",';
                $outp .= '"Connector":"'. $rs["conn_type"]     . '"}';
                
            echo $outp;
            
        break;
    }

    $conn->close();    
    
} 


 
?>
