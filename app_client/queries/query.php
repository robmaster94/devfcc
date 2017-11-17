<?php
    include('../conexion.php');
    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata);
    ob_start("ob_gzhandler");
    //echo print_r($request);
    $query_type = $request->type;
    $query = $request->query;
    $start = $request->start;
    $end = $request->endDate;
    if($request->station_id) $value = $request->station_id;

    $station_id = "";

    $sql = "SELECT * FROM station_telemetry WHERE station_id = '".$value."' AND current_time_date BETWEEN '".$start."' AND '".$end."'";
    $result = mysqli_query($conn,$sql);

    switch($query_type){
        case "telemetry":
            if ($query != "all"){
                $outp = "";
                while ($rs = mysqli_fetch_assoc($result)){
                    if ($outp != "") {$outp .= ",";}
                    //$outp .= '{"Id":"'  . $rs["id"] . '",';
                    $outp .= '{"Valor":"'. $rs[$query]  . '"}';
                }
                $outp = '{"Valores":['.$outp.']}';
                echo $outp;
                
            } else {
                $outp = "";
                while ($rs2 = mysqli_fetch_assoc($result)){
                    $station_id = $rs2["station_id"];
                    $sql3 = "SELECT * FROM stations WHERE id = ".$station_id;
                    $res3 = mysqli_query($conn,$sql3);
                    $rs3= mysqli_fetch_assoc($res3);
                    $station_name = $rs3["name"];
                    
                    if ($outp != "") {$outp .= ",";}
            //      $outp .= '{"Id":"'  . $rs["id"] . '",';
                    $outp .= '{"voltage":"'  . $rs2["voltage"] . '",';
                    $outp .= '"intensity":"'  . $rs2["intensity"] . '",';
                    $outp .= '"curr_power":"'  . $rs2["curr_power"] . '",';
                    $outp .= '"imp_ae":"'  . $rs2["imp_ae"] . '",';
                    $outp .= '"exp_ae":"'  . $rs2["exp_ae"] . '",';
                    $outp .= '"imp_re":"'  . $rs2["imp_re"] . '",';
                    $outp .= '"exp_re":"'  . $rs2["exp_re"] . '",';
                    $outp .= '"power_factor":"'  . $rs2["power_factor"] . '",';
                    $outp .= '"earth_wire_status":"'  . $rs2["earth_wire_status"] . '",';
                    $outp .= '"station_status":"'  . $rs2["station_status"] . '",';
                    $outp .= '"ev_battery_start_value":"'  . $rs2["ev_battery_start_value"] . '",';
                    $outp .= '"ev_battery_final_value":"'  . $rs2["ev_battery_final_value"] . '",';
                    $outp .= '"connector_id":"'. $rs2["connector_id"]  . '",';
                    $outp .= '"date_and_time":"'  . $rs2["current_time_date"] . '",';            
                    $outp .= '"station_name":"'  . $station_name . '"}';
                }

                $outp = '{"Telemetry":['.$outp.']}';
                echo $outp;
            }
           
        break;
        
        case "stations":
            
        break;
            
        case "chargePoints":
            echo "Consulta ".$query." fecha inicio ".$start." fecha final ".$end;
        break;
    }

    mysqli_close($conn);

?>