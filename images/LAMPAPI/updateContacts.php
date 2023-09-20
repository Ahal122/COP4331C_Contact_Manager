<?php

	$inData = getRequestInfo();

	$phoneNumber = $inData["Phone"];
	$emailAddress = $inData["Email"];
	$newFirst = $inData["FirstName"];
	$newLast = $inData["LastName"];
	$id = $inData["ID"];


	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
		if ($conn->connect_error)
		{
			returnWithError( $conn->connect_error );
		}
		else
		{
			$stmt = $conn->prepare("UPDATE Contacts SET FirstName = '$newFirst', LastName = '$newLast', Phone = '$phoneNumber', Email = '$emailAddress' WHERE ID = '$id'");
			$stmt->execute();
			returnWithInfo($newFirst, $newLast, $emailAddress, $phoneNumber, $id);
			$stmt->close();
			$conn->close();
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
		$retValue = '{"UserID":0,"FirstName":"","LastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function returnWithInfo($firstName, $lastName, $email, $phone, $id)
	{
		$retValue = '{"id":"' . $id . '","FirstName":"' . $firstName . '","LastName":"' . $lastName . '", "Email":"' . $email .'", "Phone":"' . $phone .'", "error":""}';
		sendResultInfoAsJson( $retValue );
	}

?>
