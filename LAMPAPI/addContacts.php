<?php
	$inData = getRequestInfo();
		
	$firstName = $inData["FirstName"];
	$lastName = $inData["LastName"];
	$phoneNumber = $inData["Phone"];
	$emailAddress = $inData["Email"];
	$userId = $inData["UserID"];
	

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error)
	{
			returnWithError( $conn->connect_error );
	}
	else
	{
			$stmt = $conn->prepare("INSERT into Contacts (FirstName, LastName, Phone, Email, UserID) VALUES('$firstName','$lastName','$phoneNumber','$emailAddress','$userId')");
			$stmt->execute();
			$stmt->close();
			$conn->close();
			returnWithInfo($firstName, $lastName, $phoneNumber, $emailAddress, $userId);
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}

	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function returnWithInfo($firstName, $lastName, $phoneNumber, $emailAddress, $userId)
	{
		$retValue = '{"FirstAdded":"' . $firstName . '", "LastAdded":"' . $lastName . '", "PhoneAdded":"' . $phoneNumber . '", "EmailAdded":"' . $emailAddress . '", "IdAdded":' . $userId . ', "error":""}';
		sendResultInfoAsJson( $retValue );
	}
?>
