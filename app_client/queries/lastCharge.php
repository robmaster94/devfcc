<?php

    $conn = mysqli_connect("localhost","root","","futurecharge") or die("Error al conectar");
    mysqli_set_charset($conn,"utf8");
    ob_start("ob_gzhandler");

    $sql = "SELECT * FROM station_telemetry ORDER BY id DESC LIMIT 1";
    $res = mysqli_query($conn,$sql) or die (mysqli_error($conn));
    $station_id = "";

    $outp = "";
    while ($rs = mysqli_fetch_assoc($res)){
        $station_id = $rs["station_id"];
        if ($outp != "") {$outp .= ",";}
//      $outp .= '{"Id":"'  . $rs["id"] . '",';
        $outp .= '{"voltage":"'  . $rs["voltage"] . '",';
        $outp .= '"intensity":"'  . $rs["intensity"] . '",';
        $outp .= '"current_Power":"'  . $rs["curr_power"] . '",';
        $outp .= '"imp_ae":"'  . $rs["imp_ae"] . '",';
        $outp .= '"exp_ae":"'  . $rs["exp_ae"] . '",';
        $outp .= '"imp_re":"'  . $rs["imp_re"] . '",';
        $outp .= '"exp_re":"'  . $rs["exp_re"] . '",';
        $outp .= '"power_factor":"'  . $rs["power_factor"] . '",';
        $outp .= '"earth_wire_status":"'  . $rs["earth_wire_status"] . '",';
        $outp .= '"station_status":"'  . $rs["station_status"] . '",';
        $outp .= '"ev_battery_start_value":"'  . $rs["ev_battery_start_value"] . '",';
        $outp .= '"ev_battery_final_value":"'  . $rs["ev_battery_final_value"] . '",';
        $outp .= '"connector_id":"'. $rs["connector_id"]  . '",';
        $outp .= '"date_and_time":"'  . $rs["current_time_date"] . '",';            
    }

    $sql3 = "SELECT * FROM stations WHERE id = ".$station_id;
    $res3 = mysqli_query($conn,$sql3);
    $rs3= mysqli_fetch_assoc($res3);
    $station_name = $rs3["name"];

    $outp .= '"station_name":"'  . $station_name . '"}';            

    $outp = '{"Telemetry":['.$outp.']}';
    echo $outp;

    mysqli_close($conn);

?>