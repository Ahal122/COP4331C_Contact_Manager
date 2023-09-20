<?php

	$inData = getRequestInfo();

	$firstName = $inData["FirstName"];
	$lastName = $inData["LastName"];
	$userID = $inData["UserID"];

	$searchResults = "";
	$searchCount = 0;

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		if (empty($firstName) && empty($lastName))
		{
			returnWithError("No Records Found");
		}
		else
		{
			$stmt = $conn->prepare("SELECT * FROM Contacts WHERE (FirstName LIKE ? AND LastName LIKE ?) AND UserID=?");
			$searchPatternFirstName = "%" . $firstName . "%";
			$searchPatternLastName = "%" . $lastName . "%";
			$stmt->bind_param("ssi", $searchPatternFirstName, $searchPatternLastName, $userID);
			$stmt->execute();

			$result = $stmt->get_result();

			while($row = $result->fetch_assoc())
			{
				if( $searchCount > 0 )
				{
					$searchResults .= ",";
				}
				$searchCount++;
				$searchResults .= '{"FirstName" : "' . $row["FirstName"]. '", "LastName" : "' . $row["LastName"]. '", "Phone" : "' . $row["Phone"]. '", "Email" : "' . $row["Email"]. '", "UserID" : "' . $row["UserID"].'", "ID" : "' . $row["ID"]. '"}';
			}
			$stmt->close();
			$conn->close();
			if( $searchCount == 0 )
			{
				$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
				if (empty($lastName))
				{
					$stmt = $conn->prepare("SELECT * FROM Contacts WHERE (FirstName LIKE ?) AND UserID=?");
					$stmt->bind_param("si", $searchPatternFirstName, $userID);
					$stmt->execute();

					$result = $stmt->get_result();

					while($row = $result->fetch_assoc())
					{
						if( $searchCount > 0 )
						{
							$searchResults .= ",";
						}
						$searchCount++;
						$searchResults .= '{"FirstName" : "' . $row["FirstName"]. '", "LastName" : "' . $row["LastName"]. '", "Phone" : "' . $row["Phone"]. '", "Email" : "' . $row["Email"]. '", "UserID" : "' . $row["UserID"].'", "ID" : "' . $row["ID"]. '"}';
					}
					$stmt->close();
					$conn->close();
					if ($searchCount == 0)
					{
						returnWithError( "No Records Found" );
					}
					else 
					{
						returnWithInfo($searchResults);
					}
				}
				else if (empty($firstName))
				{
					$stmt = $conn->prepare("SELECT * FROM Contacts WHERE (LastName LIKE ?) AND UserID=?");
					$stmt->bind_param("si", $searchPatternLastName, $userID);
					$stmt->execute();

					$result = $stmt->get_result();

					while($row = $result->fetch_assoc())
					{
						if( $searchCount > 0 )
						{
							$searchResults .= ",";
						}
						$searchCount++;
						$searchResults .= '{"FirstName" : "' . $row["FirstName"]. '", "LastName" : "' . $row["LastName"]. '", "Phone" : "' . $row["Phone"]. '", "Email" : "' . $row["Email"]. '", "UserID" : "' . $row["UserID"].'", "ID" : "' . $row["ID"]. '"}';
					}
					$stmt->close();
					$conn->close();
					if ($searchCount == 0)
					{
						returnWithError("No Records Found");
					}
					else
					{
						returnWithInfo($searchResults);
					}
				}
				else
				{
					returnWithError("No Records Found");
				}
			}
			else
			{
				returnWithInfo( $searchResults );
			}
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
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . ']}';
		sendResultInfoAsJson( $retValue );
	}

?>