<?php

include('../conexion.php');
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$usuario = $request->user;

$sql = "SELECT * FROM users WHERE usuario = '".$usuario."'";
$result = mysqli_query($conn,$sql);

$outp = "";

while($rs = mysqli_fetch_assoc($result)) {
    //if ($outp != "") {$outp .= ",";}
    $outp .= '{"id":"'  . $rs["id"] . '",';
    $outp .= '"usuario":"'  . $rs["usuario"] . '",';
    $outp .= '"nombre":"'  . $rs["nombre"] . '",';
    $outp .= '"apellido":"'  . $rs["apellido"] . '",';
    $outp .= '"edad":"'  . $rs["edad"] . '",';
    $outp .= '"sex":"'  . $rs["sex"] . '",';
    $outp .= '"pic":"'  . $rs["pic"] . '",';
    $outp .= '"rol":"'  . $rs["rol"] . '",';
    $outp .= '"id_fav_station":"'. $rs["id_fav_station"]  . '",';
    $outp .= '"car_model":"'. $rs["car_model"]  . '",';
    $outp .= '"conn_type":"'. $rs["conn_type"]  . '"}';
}

echo $outp;
mysqli_close($conn);

?>