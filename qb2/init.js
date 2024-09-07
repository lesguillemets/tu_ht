function init() {
	const partID = document.getElementById('participantID').value;
	if (partID === '') {
		alert("no id specified");
		return false;
		// this should prevent transition?
		// https://stackoverflow.com/a/7347817
	}
	const responses = [];
	sessionStorage.setItem("partID", partID);
	// Storage only supports storing and retrieving strings.
	// If you want to save other data types, you have to convert them
	// to strings. For plain objects and arrays, you can use JSON.stringify().
	// https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
	sessionStorage.setItem("responses", JSON.stringify(responses));
}

window.addEventListener(
	'load',
	()=>document.getElementById('start').addEventListener('click', init)
);
