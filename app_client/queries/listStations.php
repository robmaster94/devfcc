<?php

    $conn = mysqli_connect("localhost","root","","futurecharge") or die ("Error al conectar");
    mysqli_set_charset($conn,"utf8");

    ob_start("ob_gzhandler");

    $sql = "SELECT * FROM stations";
        
    $result = mysqli_query($conn,$sql);
    
    $outp = "";

    while ($rs = mysqli_fetch_assoc($result)){
        if ($outp != "") {$outp .= ",";}
        $outp .= '{"id":"'  . $rs["id"] . '",';
        $outp .= '"name":"'  . $rs["name"] . '",';
        $outp .= '"city":"'  . $rs["city"] . '",';
        $outp .= '"address":"'. $rs["address"]  . '"}';        
    }

    $outp = '{"Stations":['.$outp.']}';
    echo $outp;
    mysqli_close($conn);

?>