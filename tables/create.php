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
    email VARCHAR(20) NOT NULL
)";

$sql2 = "CREATE TABLE ride (
    id INT AUTO_INCREMENT PRIMARY KEY,
    source VARCHAR(100),
    destination VARCHAR(100),
    price FLOAT NOT NULL CHECK(price > 0),
    ordertime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";


// Execute SQL query
if ($conn->query($sql) === TRUE) {
    echo " Table 'users' created successfully!";
} else {
    echo "Error creating table: " . $conn->error;
}

if ($conn->query($sql2) === TRUE) {
    echo " Table 'ride' created successfully!";
} else {
    echo "Error creating table: " . $conn->error;
}

// Close database connection
$conn->close();
?>