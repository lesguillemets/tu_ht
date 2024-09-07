const responsesSavedName = "responses";
function respond() {
	const res = document.getElementById('response').value;
	const storedRes = sessionStorage.getItem(responsesSavedName);
	if (storedRes == null) {
		alert("多分質問を始めるページを経由してない");
		return 0;
	}
	let responses = JSON.parse(storedRes);
	responses.push(res);
	sessionStorage.setItem(responsesSavedName, JSON.stringify(responses));
}

window.addEventListener(
	'load',
	()=>document.getElementById('next').addEventListener('click', respond)
);
