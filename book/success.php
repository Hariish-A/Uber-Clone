<?php
echo "<link rel='stylesheet' type='text/css' href='styles.css'>";
echo "<div class='code-container'>";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $servername = "localhost";
    $username = "uberadmin";
    $password = "harajay";
    $dbname = "uber";

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $from = $_POST['from'];
    $to = $_POST['to'];
    $uid = $_POST['uid'];
    $ride = $_POST['ride'];
    $fare = $_POST['fare'];
    

    if ($conn->query("Insert into ride(source, destination, price, mode, user_id) values ('$from','$to',$fare,'$ride','$uid')")) {
        echo "<div class='success'>New record created successfully</div>";
    } else {
        echo "<div class='error'>Error: " . $sql . "<br>" . $conn->error . "</div>";
    }
    

    $conn->close();
} else {
    die("DIE");
}
echo "</div>";
