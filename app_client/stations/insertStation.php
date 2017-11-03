<?php

/*    $name = $_POST['stat_name'];
    $city = $_POST['city'];
    $address = $_POST['address'];
    $masterpass = $_POST['masterpass'];
    $hash_masterpass = sha1($masterpass);*/

    ob_start("ob_gzhandler");

    include('../conexion.php');

    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);

    $sql = "INSERT INTO stations (";

    foreach($request as $key => $value){
        $sql .= "$key,";
    }

    $sql = rtrim($sql,",");

    $sql .= ") VALUES (";

    foreach($request as $key => $value){
        if ($key == "masterpass"){
            $value2 = sha1($value);
            $sql .= "'$value2',";
        } else {
            $sql .= "'$value',";
        }
        
    }

    $sql = rtrim($sql,",");

    $sql .= ")";

    if(mysqli_query($conn,$sql)){
        $sql = "SELECT * from stations";
        $result = mysqli_query($conn,$sql);
        $outp = "";

        while ($rs = mysqli_fetch_assoc($result)){
            if ($outp != "") {$outp .= ",";}
            $outp .= '{"Id":"'  . $rs["id"] . '",';
            $outp .= '"Name":"'  . $rs["name"] . '",';
            $outp .= '"City":"'  . $rs["city"] . '",';
            $outp .= '"Address":"'. $rs["address"]  . '"}';
        }  

        $outp = '{"Stations":['.$outp.']}';
        echo $outp;
        
    } else {
        echo "Error: ".$sql." <br> ".mysqli_error($conn);
    }

    mysqli_close($conn);

?>
