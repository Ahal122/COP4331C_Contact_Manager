const urlBase = 'http://143.198.101.213/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";

	let login = document.getElementById("Login").value;
	let password = document.getElementById("Password").value;
//	var hash = md5( password );

	document.getElementById("loginResult").innerHTML = "";

	let tmp = {Login:login,Password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;

				if( userId < 1 )
				{
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}

				firstName = jsonObject.FirstName;
				lastName = jsonObject.LastName;

				saveCookie();

				// used to be color.html
				window.location.href = "contacts.html";
        loadContacts();
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));
	document.cookie = "FirstName=" + firstName + ",LastName=" + lastName + ",UserId=" + userId + ";expires=" + date.toGMTString();

	console.log("Hello world");
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++)
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "FirstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "LastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "Login" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}

	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "FirstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function addUser()
{
	firstName = document.getElementById("FirstName").value;
	lastName = document.getElementById("LastName").value;
	let userName = document.getElementById("Login").value;
	let password = document.getElementById("Password").value;

	document.getElementById("userAddResult").innerHTML = "";

	let tmp = {
		FirstName:firstName, 
		LastName:lastName, 
		Login: userName, 
		Password: password
	};

	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/sign-up.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{

			if (this.readyState == 4 && this.status == 200)
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;				
				document.getElementById("userAddResult").innerHTML = "user has been added";
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("userAddResult").innerHTML = err.message;
	}

}

function searchUser()
{
	let srch = document.getElementById("searchText").value;
	document.getElementById("userSearchResult").innerHTML = "";

	let userList = "";

	let tmp = {search:srch,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/SearchUsers.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById("userSearchResult").innerHTML = "user(s) has been retrieved";
				let jsonObject = JSON.parse( xhr.responseText );

				for( let i=0; i<jsonObject.results.length; i++ )
				{
					userList += jsonObject.results[i];
					if( i < jsonObject.results.length - 1 )
					{
						userList += "<br />\r\n";
					}
				}

				document.getElementsByTagName("p")[0].innerHTML = userList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("userSearchResult").innerHTML = err.message;
	}

}

function openForm()
{
	var addForm = document.getElementById("myForm");
	var contactTableDisplay = document.getElementById("contactTable");

	addForm.style.display = "block";
	contactTableDisplay.style.display = "none"; 
}

function closeForm()
{
	var addForm = document.getElementById("myForm");
	var contactTableDisplay = document.getElementById("contactTable");

	addForm.style.display = "none";
	contactTableDisplay.style.display = "block";
}

function showTable()
{
	var contactTableDisplay = document.getElementById("contactTable");
	contactTableDisplay.style.display = "block";
}

function loadContacts()
{
  let tmp = 
  {
    FirstName: "",
    LastName: "",
    UserID: 1
  };
  
  let jsonPayload = JSON.stringify(tmp);
  
  let url = urlBase + '/searchContacts.' + extension;
  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  
  try 
  {
    xhr.onreadystatechange = function () 
    {
      if (this.readyState == 4 && this.status == 200) 
      {
        let jsonObject = JSON.parse(xhr.responseText);
        console.log(xhr.responseText);
        if (jsonObject.error) 
        {
          console.log(jsonObject.error);
          return;
        }
        
        //let text = "<table border='1'>"
        
        for (let i = 0; i < jsonObject.results.length; i++) 
        {
          ids[i] = jsonObject.results[i].ID
          text += "<tr id='row" + i + "'>"
          text += "<td id='first_Name" + i + "'><span>" + jsonObject.results[i].FirstName + "</span></td>";
          text += "<td id='last_Name" + i + "'><span>" + jsonObject.results[i].LastName + "</span></td>";
          text += "<td id='email" + i + "'><span>" + jsonObject.results[i].EmailAddress + "</span></td>";
          text += "<td id='phone" + i + "'><span>" + jsonObject.results[i].PhoneNumber + "</span></td>";
          text += "<td>" +
            "<button type='button' id='edit_button" + i + "' onclick='edit_row(" + i + ")'>" + "<span></span>" + "</button>" +
            //"<button type='button' id='save_button" + i + "' onclick='save_row(" + i + ")' style='display: none'>" + "<span></span>" + "</button>" +
            "<button type='button' id='delete_button" + i + "' onclick='delete_row(" + i + ")' >" + "<span></span> " + "</button>" + "</td>";
            
            text += "<tr/>"
        }
        
        text += "</table>"
        document.getElementById("tbody").innerHTML = text;
      }
    };
    
    xhr.send(jsonPayload);
    
  } 
  catch (err) 
  {
    console.log(err.message);
  }
}

function addContact()
{
	let firstName = document.getElementById("contactFirstName").value;
	let lastName = document.getElementById("contactLastName").value;
	let phoneNumber = document.getElementById("contactPhone").value;
	let emailAddress = document.getElementById("contactEmail").value;
	let userId = userId;

	let tmp =
	{
		FirstName: firstName,
		LastName: lastName,
		Phone: phoneNumber,
		Email: emailAddress,
        UserID: userId
	};
 

	let contactTableNew = document.getElementById("contactTable");
	let newRow = document.createElement("tr");

	let fn = document.createElement("td");
	let ln = document.createElement("td");
	let phoneNum = document.createElement("td");
	let email = document.createElement("td");

	fn.innerText = firstName;
	ln.innerText = lastName;
	phoneNum.innerText = phoneNumber;
	email.innerText = emailAddress;

	newRow.appendChild(fn);
	newRow.appendChild(ln);
	newRow.appendChild(phoneNum);
	newRow.appendChild(email);

	contactTableNew.appendChild(newRow);
    //closeForm();
    //document.getElementById("myForm").reset();

    let jsonPayload = JSON.stringify(tmp);
	let url = urlBase + '/addContacts.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
 
	try
	{
		xhr.onreadystatechange = function ()
		{
     console.log(this.readyState);
     console.log(this.status);
			if (this.readyState == 4 && this.status == 200)
			{
				console.log("Contact Added!");
				showTable();
				//document.getElementById("myForm").reset();
			}
		};
		xhr.send(jsonPayload);
	}

	catch (err)
	{
		console.log(err.message);
    }
}

function searchContacts()
{
	const searchBar = document.getElementById("searchText");
	const selections = searchBar.value.toUpperCase().split(' ');
	const contactTable = document.getElementById("contactTable");
	const tableRow = table.getElementsByTagName("tr");

	for (let i = 0; i < tableRow.length; i++) {
		const firstNameSearch = tableRow[i].getElementsByTagName("td")[0];
		const lastNameSearch = tableRow[i].getElementsByTagName("td")[1];

		if (firstNameSearch && lastNameSearch) {
			const firstNameText = firstNameSearch.textContent || firstNameSearch.innerText;
			const lastNameText = lastNameSearch.textContent || lastNameSearch.innerText;
			tableRow[i].style.display = "none";

			for (selection of selections) {
				if (firstNameText.toUpperCase().indexOf(selection) > -1) {
					tableRow[i].style.display = "";
				}
				if (lastNameText.toUpperCase().indexOf(selection) > -1) {
					tableRow[i].style.display = "";
				}
			}
		}
	}
	
}