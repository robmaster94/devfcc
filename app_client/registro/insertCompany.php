<?php

$compname = $_POST['compname'];
$compcif = $_POST['compcif'];
$comppass = $_POST['comppass'];
$hash_comppass = sha1($comppass);
$rep_comppass = $_POST['repeatedpass'];
$hash_rep_comppass = sha1($rep_comppass);
$members = $_POST['members'];
               
$servername = "localhost";
$username = "root";
$password = ""; //Your User Password
$dbname = "futurecharge"; //Your Database Name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
mysqli_set_charset($conn, "utf8");

if ($hash_comppass != $hash_rep_comppass){
    echo "Las contraseñas no coinciden. Revíselas.";
    break;
} else{
    // Check connection
    if ($conn->connect_error) {

        die("Connection failed: " . $conn->connect_error);

    } else {

        $destino = "images/companies/";
        $destino = $destino.basename($_FILES['picOrg']['name']); 

        if ($members == null){

            if(move_uploaded_file($_FILES['picOrg']['tmp_name'], $destino)){

                $sql = "INSERT INTO organizations (name,cif,pass,members,pic) VALUES (                                            '".$compname."','".$compcif."','".$hash_comppass."',null,'".$destino."')";

            } else {
                $sql = "INSERT INTO organizations (name,cif,pass,members,pic) VALUES (                                            '".$compname."','".$compcif."','".$hash_comppass."',null,null)";
            }
        } else {
            if(move_uploaded_file($_FILES['picOrg']['tmp_name'], $destino)){

                $sql = "INSERT INTO organizations (name,cif,pass,members,pic) VALUES (                                            '".$compname."','".$compcif."','".$hash_comppass."','".$members."','".$destino."')";

            } else {
                $sql = "INSERT INTO organizations (name,cif,pass,members,pic) VALUES (                                            '".$compname."','".$compcif."','".$hash_comppass."','".$members."',null)";
            }
        }

        if ($conn->query($sql) === TRUE) {
            echo "New organization created successfully";
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }

        $conn->close();    

    }
}




 
?>
