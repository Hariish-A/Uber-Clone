<!DOCTYPE html>
<html lang="en">

<?php
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

    $ans = $conn->query("Select id from users where phone = $phone");
    $r = $ans->fetch_assoc()['id'];
    $conn->close();
}
echo "</div>";
?>


<head>
    <link rel="stylesheet" href="style.css" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="" />

    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/x-icon" href="../assets/Uber-favicon.svg" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
    <title>Plan your uber journey</title>
</head>

<body>
    <div class="topbar">
        <a id="title" href="../home/home.html">Uber</a>
        <div class="user">
            <p>
                <?php
                if (isset($_POST['firstname'])) {
                    echo $_POST['firstname'];
                } else {
                    echo "Asay";
                }
                ?>
            </p>
            <a href="../home/home.html"><img src="../assets/images/download.jpeg" alt="PFP"></a>
        </div>

    </div>
    <form action="success.php" id="form" name="form" onsubmit="return handleSubmit()" method="POST">
        <input type="text" hidden name="from" id="from">
        <input type="text" hidden name="to" id="to">
        <input type="number" hidden name="fare">
        <input type="text" hidden name="uid" id="uid" value="<?php 
                if(isset($r)){echo $r;}  else {echo "";}?>">
        <!-- <input type="text" name="mode" id="mode" hidden> -->
        <div class="content">
            <div class="book-ride">
                <div class="card">
                    <div class="card-title">Find a ride</div>
                    <div class="form">
                        <div class="from">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" data-baseweb="icon">
                                <title>search</title>
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm5-2a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z" fill="currentColor"></path>
                            </svg>

                            <div class="autocomplete-container" id="autocomplete-container"></div>
                        </div>
                        <div class="to">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" data-baseweb="icon">
                                <title>search</title>
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M14 10h-4v4h4v-4ZM7 7v10h10V7H7Z" fill="currentColor"></path>
                            </svg>
                            <div class="autocomplete-container" id="autocomplete-container1"></div>
                        </div>
                        <button onclick="displayMap(event)" id="route" disabled>
                            Search
                        </button>
                    </div>
                </div>
                <div class="rides hide">
                    <p>Choose a ride</p>
                    <div class="ride">
                        <input type="radio" name="ride" id="auto" value="auto" />
                        <img src="../assets/images/TukTuk_Green.png" alt="Tuk tuk hota hain" />
                        <div class="ride-name">Auto</div>
                        <div id="fare-auto">&#8377;100</div>
                    </div>
                    <div class="ride">
                        <input type="radio" name="ride" id="car" value="car" />
                        <img src="../assets/images/UberGo.png" alt="Vroom vroom" />
                        <div class="ride-name">Car</div>
                        <div id="fare-car"> &#8377;100</div>
                    </div>
                    <button id="book" class="book">Book</button>
                </div>
            </div>
            <div class="map">
                <div id="my-map"></div>
            </div>
        </div>
    </form>
    <!-- <div id="my-map"></div> -->
    <script src="https://unpkg.com/@turf/turf@6/turf.min.js"></script>

    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
    <script src="script1.js"></script>
</body>

</html>