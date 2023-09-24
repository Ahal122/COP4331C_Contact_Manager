const urlBase = 'http://143.198.101.213/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
const ids = [];

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
		else if( tokens[0] == "UserId" )
		{
			userId = parseInt( tokens[1].trim() );
			return userId;
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


function loadContacts()
{
  let userId = readCookie();
  let tmp = 
  {
    FirstName: "",
    LastName: "",
    UserID: userId
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
        //console.log(xhr.responseText);
        if (jsonObject.error) 
        {
          console.log(jsonObject.error);
          return;
        }
        
        let text = ""
        
        for (let i = 0; i < jsonObject.results.length; i++) 
        {
          ids[i] = jsonObject.results[i].ID
  		  //console.log(ids);
		  text += edit(ids[i] , jsonObject.results[i].FirstName, jsonObject.results[i].LastName, jsonObject.results[i].Phone, jsonObject.results[i].Email);
          text += "<tr id='row" + ids[i] + "'>"
          text += "<td id='first_Name" + ids[i] + "'>" + jsonObject.results[i].FirstName + "</td>";
          text += "<td id='last_Name" + ids[i] + "'>" + jsonObject.results[i].LastName + "</td>";
          text += "<td id='email" + ids[i] + "'>" + jsonObject.results[i].Phone + "</td>";
          text += "<td id='phone" + ids[i] + "'>" + jsonObject.results[i].Email + "</td>";
          text += "<td>" +
            "<button type='button' class='btn btn-primary float-right' data-bs-toggle='modal' data-bs-target='#editContact" + ids[i] + "' id='btn" + i + "' onclick='edit(" + ids[i] + ")'>Edit</button>" +
            "<button type='button' class='btn btn-danger float-right' id='btn" + i + "' onclick='deleteContact(" +  ids[i] + ")'>Delete</button>" + "</td>";
            
            text += "<tr/>"
        }
        
        text += "</table>"
        document.getElementById("tbody").innerHTML = text;

		var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
		var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
			const popover = new bootstrap.Popover(popoverTriggerEl, {
				trigger: 'manual' // Set the trigger to manual
			});
	
			// Event listener for input changes
			popoverTriggerEl.addEventListener('input', function() {
				// If the input has a value, hide the popover
				if (popoverTriggerEl.value.trim()) {
					popover.hide();
				}
			});
	
			return popover;
		});

      }
    };
    xhr.send(jsonPayload);
    
  } 
  catch (err) 
  {
    console.log(err.message);
  }
}


function edit(ID, firstName, lastName, phone, email) {
	form = "";

	form += "<div class='modal fade' id='editContact"+ ID + "' tabindex='-1' role='dialog' aria-labelledby='exampleModalCenterTitle' aria-hidden='true'>" +
	"    <div class='modal-dialog' role='document'>" +                                                                                            
	"      <div class='modal-content'>" +                                                                                                         
	"        <div class='modal-header text-center'>" +                                                                                            
	"          <h5 class='header' id='exampleModalLongTitle'>Update Contact</h5>" +                                                              
	"          <button type='button' class='close' data-bs-dismiss='modal' aria-label='Close'>" +                                                 
	"            <span aria-hidden='true'>&times;</span>" +                                                                                       
	"          </button>" +                                                                                                                       
	"        </div>" +                                                                                                                            
	"        <div class='modal-body'>" +                                                                                                          
	"            <form id='clearForm-" + ID + "' class='form' method='post'>" +                                                                             
	"                <div>" +                                                                                                                     
	"                    <label class='floating-label'>First Name</label>" +                                                                      
	"                    <input class='inputText' type='text' id='contactFirstName"+ ID + "' placeholder='Enter First Name' value='" + firstName + "' name='firstName' data-bs-container='body' data-bs-toggle='popover' data-bs-placement='right' data-bs-content='Please enter in a first name.'>" +  
	"                </div>" +                                                                                                                    
	"                <div>" +                                                                                                                     
	"                    <label class='floating-label'>Last Name</label>" +                                                                       
	"                    <input class='inputText' type='text' id='contactLastName"+ ID + "' placeholder='Enter Last Name' value='" + lastName + "' name='lastName' data-bs-container='body' data-bs-toggle='popover' data-bs-placement='right' data-bs-content='Please enter in a Last name.'>" +     
	"                </div>" +                                                                                                                    
	"                <div>" +                                                                                                                     
	"                    <label class='floating-label'>Phone Number</label>" +                                                                    
	"                    <input class='inputText' type='text' id='contactPhone"+ ID + "' placeholder='Enter Phone' value='" + phone + "' name='phoneNumber' data-bs-container='body' data-bs-toggle='popover' data-bs-placement='right' data-bs-content='Please enter in a Phone Number.'>" +         
	"                </div>" +                                                                                                                    
	"                <div>" +                                                                                                                     
	"                    <label class='floating-label'>Email Address</label>" +                                                                   
	"                    <input class='inputText' type='text' id='contactEmail"+ ID + "' placeholder='Enter Email' value='" + email + "' name='emailAddress' data-bs-container='body' data-bs-toggle='popover' data-bs-placement='right' data-bs-content='Please enter an Email.'>" +        
	"                </div>" +                                                                                                                    
	"            </form>" +                                                                                                                       
	"        </div>" +                                                                                                                            
	"        <div class='modal-footer'>" +                                                                                                        
	"          <button type='submit' class='btn btn-secondary' onclick='clearEditForm(" + ID + ")'>Cancel</button>" +                                      
	"          <button type='submit' class='btn btn-primary' onclick='updateContact(" + ID + ")'>Save changes</button>" +                                      
	"        </div>" +                                                                                                                            
	"      </div>" +                                                                                                                              
	"    </div>" +
	"   </div>";    
	
	return form;
}
		

function deleteContact(contactID)
 {
	var firstNameVal = document.getElementById("first_Name" + contactID).innerText;
    var lastNameVal = document.getElementById("last_Name" + contactID).innerText;

	nameOne = firstNameVal.substring(0, firstNameVal.length);
    nameTwo = lastNameVal.substring(0, lastNameVal.length);
    let check = confirm('Confirm deletion of contact: ' + nameOne + ' ' + nameTwo);

	if(check === true) {
		document.getElementById("row" + contactID + "").innerHTML = "";
		let tmp = {
			ID: contactID
		};

		let jsonPayload = JSON.stringify(tmp);

		let url = urlBase + '/deleteContacts.' + extension;

		let xhr = new XMLHttpRequest();
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
		try {
			xhr.onreadystatechange = function () {
				if (this.readyState == 4 && this.status == 200) {
					loadContacts();
				}
			};
			xhr.send(jsonPayload);
		} catch (err) {
			console.log(err.message);

		};

	}

}

function clearForm(formID, modalClearID){
	var myModalEl = document.getElementById(modalClearID);
	var modal = bootstrap.Modal.getInstance(myModalEl)
	modal.hide();
}

function clearEditForm(id){
	loadContacts();
	var myModalEl = document.getElementById("editContact" + id);
	var modal = bootstrap.Modal.getInstance(myModalEl)
	modal.hide();
}

function addContact()
{
	let allValid = true;
	fieldsToValidate = ['contactFirstName', 'contactLastName', 'contactPhone', 'contactEmail'];

    // Validate each field
    fieldsToValidate.forEach(function (fieldId) {
        const field = document.getElementById(fieldId);
        const popoverInstance = bootstrap.Popover.getInstance(field);

        if (!field.value.trim()) {
            // If the popover is not visible, show it
            if (!popoverInstance._popper) {
                popoverInstance.show();
            }
			allValid = false;
        } else {
            // If the popover is visible, hide it
            if (popoverInstance._popper) {
                popoverInstance.hide();
            }
        }
    });

	
	if(allValid){
		var myModalEl = document.getElementById('addContact');
		var modal = bootstrap.Modal.getInstance(myModalEl)
		modal.hide();

		let firstName = document.getElementById("contactFirstName").value;
		let lastName = document.getElementById("contactLastName").value;
		let phoneNumber = document.getElementById("contactPhone").value;
		let emailAddress = document.getElementById("contactEmail").value;
		let userId = readCookie();
		
		let tmp =
		{
			FirstName: firstName,
			LastName: lastName,
			Phone: phoneNumber,
			Email: emailAddress,
			UserID: userId
		};

		let jsonPayload = JSON.stringify(tmp);
		let url = urlBase + '/addContacts.' + extension;

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
					console.log("Contact Added!");
					loadContacts();
					document.getElementById("clearForm").reset();
				}
			};
			xhr.send(jsonPayload);
		}

		catch (err)
		{
			console.log(err.message);
		}
	}
}

function searchContacts()
{
	const searchBar = document.getElementById("searchKey");
	const selections = searchBar.value.toUpperCase().split(' ');
	const contactTable = document.getElementById("contactTable");
  const tableRow = contactTable.getElementsByTagName("tr");


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


function updateContact(contactID) {

	let allValid = true;
	fieldsToValidate = ['contactFirstName' + contactID, 'contactLastName' + contactID, 'contactPhone' + contactID, 'contactEmail' + contactID];

    // Validate each field
    fieldsToValidate.forEach(function (fieldId) {
        const field = document.getElementById(fieldId);
        const popoverInstance = bootstrap.Popover.getInstance(field);

        if (!field.value.trim()) {
            // If the popover is not visible, show it
            if (!popoverInstance._popper) {
                popoverInstance.show();
            }
			allValid = false;
        } else {
            // If the popover is visible, hide it
            if (popoverInstance._popper) {
                popoverInstance.hide();
            }
        }
    });

	if(allValid){
		let firstName = document.getElementById("contactFirstName" + contactID).value;
		let lastName = document.getElementById("contactLastName" + contactID).value;
		let phoneNumber = document.getElementById("contactPhone" + contactID).value;
		let emailAddress = document.getElementById("contactEmail" + contactID).value;
		
		let updatePayload =
		{
			ID: contactID,
			FirstName: firstName,
			LastName: lastName,
			Phone: phoneNumber,
			Email: emailAddress,
		};
		
		let jsonPayload = JSON.stringify(updatePayload);
		let url = urlBase + '/updateContacts.' + extension;
		
		let xhr = new XMLHttpRequest();
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
		try {
			xhr.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200)
				{
					let jsonObject = JSON.parse(xhr.responseText);
					console.log("Contact Updated!");
					loadContacts();
					clearForm("clearForm-" + contactID, "editContact" + contactID);
				}
			};

			xhr.send(jsonPayload);
		} catch (err) {
			console.log(err.msg);
		}
	}
}

function validateForm(event, formType) {

    event.preventDefault();

	let allValid = true;

	let fieldsToValidate = formType === "login" ? ['Login', 'Password'] : ['FirstName', 'LastName', 'Login', 'Password'];

    // Validate each field
    fieldsToValidate.forEach(function (fieldId) {
        const field = document.getElementById(fieldId);
        const popoverInstance = bootstrap.Popover.getInstance(field);

        if (!field.value.trim()) {
            // If the popover is not visible, show it
            if (!popoverInstance._popper) {
                popoverInstance.show();
            }
			allValid = false;
        } else {
            // If the popover is visible, hide it
            if (popoverInstance._popper) {
                popoverInstance.hide();
            }
        }
    });

	if(allValid) {
		if(formType === "login") {
			doLogin();
		} else {
			addUser();
		}

	}

    // If all fields are valid, you can call the addUser function or other actions.
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize popovers
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        const popover = new bootstrap.Popover(popoverTriggerEl, {
            trigger: 'manual' // Set the trigger to manual
        });

        // Event listener for input changes
        popoverTriggerEl.addEventListener('input', function() {
            // If the input has a value, hide the popover
            if (popoverTriggerEl.value.trim()) {
                popover.hide();
            }
        });

        return popover;
    });
});