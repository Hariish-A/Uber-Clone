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

    $firstname = $_POST['firstname'];
    $surname = $_POST['surname'];
    $phone = $_POST['phone'];

    $sql = "INSERT INTO users(firstname, surname, phone) VALUES ('$firstname', '$surname', '$phone')";
 
    if ($conn->query($sql) === TRUE) {
        echo "<div class='success'>New record created successfully</div>";
    } else {
        echo "<div class='error'>Error: " . $sql . "<br>" . $conn->error . "</div>";
    }

    $conn->close();
} else {
    die("DIE");
}
echo "</div>";
?>