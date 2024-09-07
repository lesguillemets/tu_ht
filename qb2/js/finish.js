const responsesSavedName = "responses";


function finish() {
	const partID = sessionStorage.getItem("partID");
	const storedRes = sessionStorage.getItem(responsesSavedName);
	if (storedRes == null) {
		alert("多分質問を始めるページを経由してない");
		return 0;
	}
	const responses = JSON.parse(storedRes);
	const cur = new Date(); // current time
	const timeStamp = datetime_format(cur);
	const tsvLine = [timeStamp, partID, ...responses].join('\t');
	console.log(tsvLine);
	const blob = new Blob([tsvLine], {type: "text/csv;charset=utf-8"})
	const url = URL.createObjectURL(blob);
	let anch = document.createElement('a');
	anch.setAttribute('href', url);
	anch.setAttribute('download', [timeStamp, '-', partID, '.tsv'].join(''));
	anch.style.display = 'none';
	document.body.appendChild(anch);
	anch.click();
	document.body.removeChild(anch);
}

function toTwoDigits(n) {
	// n : integer, returnd 01..99
	const s = String(n).padStart(2,'0');
	return s;
}
function datetime_format(d){
	// hhmmss
	const timestr = [
		toTwoDigits(d.getHours()),
		toTwoDigits(d.getMinutes()),
		toTwoDigits(d.getSeconds())
	].join('');
	// 2024-09-23-103312
	const formatted = [
		d.getFullYear(),
		toTwoDigits(d.getMonth()+1),
		toTwoDigits(d.getDate()),
		timestr
	].join('-');
	return formatted;
}

window.addEventListener(
	'load',
	()=>document.getElementById('finish').addEventListener('click', finish)
);
