<?php

    include('../conexion.php');

    ob_start("ob_gzhandler");
    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);
    //echo print_r($request);
    $station = $request->station;
    $adminPass = $request->masterpass;
    $hash_adminPass = sha1($adminPass);

    $sql = "SELECT * FROM stations WHERE name = '$station' AND masterpass = '$hash_adminPass'";
    //echo $sql;
    $res = mysqli_query($conn,$sql);
    $outp = "";
    
    if (mysqli_num_rows($res) > 0){
        $row = mysqli_fetch_assoc($res);
        $id_station = $row["id"];       
        $sql2 = "SELECT * FROM stations WHERE id = '$id_station'"; 
        $result = mysqli_query($conn,$sql2);

        while ($rs = mysqli_fetch_assoc($result)){
            $outp .= '{"id":"'  . $rs["id"] . '",';
            $outp .= '"name":"'  . $rs["name"] . '",';
            $outp .= '"city":"'  . $rs["city"] . '",';
            $outp .= '"address":"'. $rs["address"]  . '"}';
        }
        
    } else {
        $outp .= '{"Error" : "Vuelva a introducir la contraseña"}';
    }

    echo $outp;

    mysqli_close($conn);

?>