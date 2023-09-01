<?php
	$inData = getRequestInfo();
	
	$firstName = $inData["FirstName"];
	$lastName = $inData["LastName"];
	$password = $inData["Password"];
	$username = $inData["Login"];

	$conn = new mysqli("localhost", "root", "COP4331C", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("INSERT into USERS VALUES(?,?,?,?)");
		$stmt->bind_param("ssss", $firstName, $lastName $username, $password);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		returnWithError("");
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
	
?>