<?php
    session_start();
    $outp = "";
    if( isset($_SESSION['uid']) && isset($_SESSION['user'])){   
        $outp .= '{"user":"'  . $_SESSION['user'] . '",';
        $outp .= '"rol":"'. $_SESSION['rol']  . '"}';
    }
    echo $outp;
?>