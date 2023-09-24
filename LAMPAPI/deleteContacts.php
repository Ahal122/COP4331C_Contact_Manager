<?php
    $inData = getRequestInfo();

    $ID = $inData["ID"];

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

    if($conn->connect_error)
    {
        returnWithError( $conn->connect_error );
    }
    else
    {
        $stmt = $conn->prepare("DELETE FROM Contacts WHERE ID = '$ID'");
		    $stmt->execute();		
  	    $stmt->close();
  	    $conn->close();
		    returnWithInfo($firstName, $lastName, $userId);
  	    
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
