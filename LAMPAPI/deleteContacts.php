<?php
    $inData = getRequestInfo();

    $userId = $inData["UserID"];
    $firstName = $inData["FirstName"];
    $lastName = $inData["LastName"];

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

    if($conn->connect_error)
    {
        returnWithError( $conn->connect_error );
    }
    else
    {
        $stmt = $conn->prepare("DELETE FROM Contacts WHERE FirstName = '$firstName' AND LastName = '$lastName' AND UserID = '$userId'");
		$stmt->execute();
		returnWithInfo($firstName, $lastName, $userId);
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
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function returnWithInfo($delFirst, $delLast, $delID)
	{
		$retValue = '{"DeletedFirst":"' . $delFirst . '","DeletedLast":"' . $delLast . '", "DeletedID":' . $delID . ', "error":""}';
		sendResultInfoAsJson( $retValue );
	}

?>
