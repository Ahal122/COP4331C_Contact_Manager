<?php
    $inData = getRequestInfo();

    $firstName = $inData["FirstName"];
    $lastName = $inData["LastName"];
    $phoneNumber = $inData["Phone"];
    $emailAddress = $inData["Email"];
    $userId = $inData["UserID"];
    $ID = 0;

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
    if ($conn->connect_error) {
        returnWithError($conn->connect_error);
    } else {
        $stmt = $conn->prepare("INSERT into Contacts (FirstName, LastName, Phone, Email, UserID) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssi", $firstName, $lastName, $phoneNumber, $emailAddress, $userId);
        
        if ($stmt->execute()) {
            $ID = $conn->insert_id;
            returnWithInfo($ID, $firstName, $lastName, $phoneNumber, $emailAddress, $userId);
        } else {
            returnWithError($stmt->error);
        }
        
        $stmt->close();
        $conn->close();
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

    function returnWithInfo($ID, $firstName, $lastName, $phoneNumber, $emailAddress, $userId) {
        $retValue = '{"ID":"' . $ID . '", "FirstAdded":"' . $firstName . '", "LastAdded":"' . $lastName . '", "PhoneAdded":"' . $phoneNumber . '", "EmailAdded":"' . $emailAddress . '", "IdAdded":' . $userId . ', "error":""}';
        sendResultInfoAsJson($retValue);
    }
?>