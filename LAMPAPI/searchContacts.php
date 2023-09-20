<?php

$inData = getRequestInfo();

$firstName = $inData["FirstName"];
$lastName = $inData["LastName"];
$userID = $inData["UserID"];

$searchResults = "";
$searchCount = 0;

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    $sql = "SELECT * FROM Contacts WHERE UserID = ?";
    $types = "i";
    $params = [$userID];

    if (!empty($firstName)) {
        $sql .= " AND FirstName LIKE ?";
        $types .= "s";
        $params[] = "%" . $firstName . "%";
    }

    if (!empty($lastName)) {
        $sql .= " AND LastName LIKE ?";
        $types .= "s";
        $params[] = "%" . $lastName . "%";
    }

    $stmt = $conn->prepare($sql);
    $stmt->bind_param($types, ...$params);
    $stmt->execute();

    $result = $stmt->get_result();

    while ($row = $result->fetch_assoc()) {
        if ($searchCount > 0) {
            $searchResults .= ",";
        }
        $searchCount++;
        $searchResults .= '{"FirstName" : "' . $row["FirstName"] . '", "LastName" : "' . $row["LastName"] . '", "Phone" : "' . $row["Phone"] . '", "Email" : "' . $row["Email"] . '", "UserID" : "' . $row["UserID"] . '", "ID" : "' . $row["ID"] . '"}';
    }

    $stmt->close();
    $conn->close();

    if ($searchCount == 0) {
        returnWithError("No Contacts Found");
    } else {
        returnWithInfo($searchResults);
    }
}

function getRequestInfo() {
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj) {
    header('Content-type: application/json');
    echo $obj;
}

function returnWithError($err) {
    $retValue = '{"error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

function returnWithInfo($searchResults) {
    $retValue = '{"results":[' . $searchResults . ']}';
    sendResultInfoAsJson($retValue);
}

?>