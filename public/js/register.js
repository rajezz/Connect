window.onload = function () {
    initializeEventHandlers()
};

function validateForm() {
	
}

function validateAndSubmitForm() {
	
}

function initializeEventHandlers() {
    
}

document.getElementById("profile-pic").addEventListener("change", (e) => {
	if (event.currentTarget.files[0]) {
		document.getElementById("image-name").innerHTML = event.currentTarget.files[0].name;
	} else {
		document.getElementById("image-name").innerHTML = "Choose file";
	}
});
function hideErrorMessages() {
	document.getElementById("register-form-invalid").style.display = "none";
	document.getElementById("register-failed").style.display = "none";
	document.getElementById("register-success").style.display = "none";
}
