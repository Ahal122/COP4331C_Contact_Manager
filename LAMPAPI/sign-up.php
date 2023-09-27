<?php

	$inData = getRequestInfo();

	$firstName = $inData["FirstName"];
    $lastName = $inData["LastName"];
    $login = $inData["Login"];
    $password = $inData["Password"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$sql = "SELECT * FROM Users WHERE Login=?";
		$stmt = $conn->prepare($sql);
		$stmt->bind_param("s", $login);
		$stmt->execute();
		$result = $stmt->get_result();
		$rows = mysqli_num_rows($result);
		if ($rows == 0)
		{
			$stmt = $conn->prepare("INSERT into Users (FirstName, LastName, Login, Password) VALUES(?,?,?,?)");
			$stmt->bind_param("ssss", $firstName, $lastName, $login, $password);
			$stmt->execute();
			$stmt->close();
			$conn->close();
			$searchResults .= '{'.'"id": "'.$id.''.'"}';
			returnWithInfo($searchResults);
		} else {
			returnWithError("Username taken");
		}
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
	function returnWithInfo( $searchResults )
	{
		$retValue = '{"error":""}';
		sendResultInfoAsJson( $retValue );
	}

?>