<?php

include '../conexion.php';
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$user = $request->username;
$passwd = $request->password;
$hash_pass = sha1($passwd);

$sql = "SELECT * FROM users WHERE usuario = '".$user."'";

$resultado = mysqli_query($conn,$sql);
$rows = mysqli_num_rows($resultado);
if ($rows > 0){
  $row = mysqli_fetch_assoc($resultado);
  if (($user == $row["usuario"]) && ($hash_pass==$row["pass"])){
      session_start();
      $_SESSION['user']=$user;
      $_SESSION['id'] = $row["id"];
      $_SESSION['uid']=uniqid('ang_');
      $_SESSION['rol'] = $row["rol"];
      print $_SESSION['uid'];
  }
}
mysqli_close($conn);

    



 
?>
