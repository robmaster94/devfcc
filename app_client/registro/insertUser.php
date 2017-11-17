<?php

$user = $_POST['user'];
$passwd = $_POST['pass'];
$hash_pass = sha1($passwd);
$rep_pass = $_POST['reppass'];
$hash_rep_pass = sha1($rep_pass);
$name = $_POST['name'];
$surname = $_POST['surname'];
$age = $_POST['age'];
$sex = $_POST['sex'];
$rol = $_POST['rol'];
$favStation = $_POST['favStation'];
$brand = $_POST['brand'];
$model = $_POST['model'];
$car_model = $brand + " " +$model;
$conn_type = $_POST['conn_type'];
               
$servername = "localhost";
$username = "root";
$password = ""; //Your User Password
$dbname = "futurecharge"; //Your Database Name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
mysqli_set_charset($conn, "utf8");

if ($hash_pass != $hash_rep_pass){
    echo "Las contraseñas no coinciden. Revíselas.";
} else {
    // Check connection
    if ($conn->connect_error) {
    
        die("Connection failed: " . $conn->connect_error);
        
    } else {
    
        $destino = "images/users/";
        $destino = $destino.basename($_FILES['picUser']['name']); 

        if(move_uploaded_file($_FILES['picUser']['tmp_name'], $destino)){
            
            if ($favStation == null){

                $sql = "INSERT INTO users (usuario,pass,nombre,apellido,edad,sex,pic,rol,id_fav_station,car_model) VALUES (
                                                '".$user."','".$hash_pass."','".$name."','".$surname."','".$age."','".$sex."','".$destino."','".$rol."',null, '"$car_model"')";
            } else {
                
                $sql = "INSERT INTO users (usuario,pass,nombre,apellido,edad,sex,pic,rol,id_fav_station) VALUES (
                                                '".$user."','".$hash_pass."','".$name."','".$surname."','".$age."','".$sex."','".$destino."','".$rol."','".$favStation."','"$car_model"')";
            }

        } else {
            if ($favStation == null){

                $sql = "INSERT INTO users (usuario,pass,nombre,apellido,edad,sex,pic,rol,id_fav_station) VALUES (
                                                '".$user."','".$hash_pass."','".$name."','".$surname."','".$age."','".$sex."',null,'".$rol."',null, '"$car_model"')";
            } else {
                
                $sql = "INSERT INTO users (usuario,pass,nombre,apellido,edad,sex,pic,,rol,id_fav_station) VALUES (
                                                '".$user."','".$hash_pass."','".$name."','".$surname."','".$age."','".$sex."',null,'".$rol."','".$favStation."', '"$car_model"')";
            }
        }
        if ($conn->query($sql) === TRUE) {
            echo "New user created successfully";
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }

        $conn->close();    

    }
}




 
?>
