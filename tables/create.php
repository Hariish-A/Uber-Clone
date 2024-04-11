<?php

$servername = "localhost";
$username = "uberadmin";
$password = "harajay";
$dbname = "uber";

$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// SQL query to create the orders table
$sql = "CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstname VARCHAR(20) NOT NULL,
    surname VARCHAR(20) NOT NULL,
    phone BIGINT NOT NULL,
    email VARCHAR(20) NOT NULL,
)";


// Execute SQL query
if ($conn->query($sql) === TRUE) {
    echo " Table 'users' created successfully!";
} else {
    echo "Error creating table: " . $conn->error;
}

// Close database connection
$conn->close();
?>