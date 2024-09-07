const responsesSavedName = "responses";

class Question{
	constructor(header, pre, post, next){
		// each of them is either string or a node/element
		this.header = header;
		this.pre = pre;
		this.post = post;
		this.next = next;
	}

	render() {
		clearQuestionPage();
		clevAppend(document.getElementById('header'), this.header);
		clevAppend(document.getElementById('pre-bar'), this.pre);
		clevAppend(document.getElementById('post-bar'), this.post);
		clevAppend(document.getElementById('next'), this.next);
	}
}

function clevAppend(node, child) {
	if (typeof child === "object" && child.nodeType===1) {
		// assume child is a node
		return(node.appendChild(child));
	} else if (typeof child ==='string') {
		node.innerHTML = child;
		return node ;
	}
}

function getQuestions() {
	const q1 = new Question (
		"当てはまるところを選んでください",
		"リラックスしている",
		"ひどく緊張している",
		"次へ"
	)
	const imageCont = document.createElement('div')
	imageCont.classList.add("center-image");
	let preImg = document.createElement('img');
	preImg.src = "https://live.staticflickr.com/3852/14566879637_13d5d2a0b1_n.jpg";
	let pre = imageCont.cloneNode();
	pre.appendChild(preImg);
	let postImg = document.createElement('img');
	postImg.src = "https://live.staticflickr.com/3835/14752671885_b9f0b22a82_n.jpg";
	let post = imageCont.cloneNode();
	post.appendChild(postImg);
	const q2 = new Question (
		"どちらかというと",
		pre,
		post,
		"回答を終える"
	);
	return [q1,q2];
}

function clearQuestionPage() {
	const  gridsToBeCleard = ["header", "pre-bar","post-bar"]
	for (const id of gridsToBeCleard) {
		document.getElementById(id).textContent = "";
	}
	resetBar();
}

function resetBar() {
	let bar = document.getElementById('response');
	if (bar !== null) {
		bar.value = 0.5;
	}
}


function switchGridToInitialMode() {
	clearQuestionPage();
	document.getElementById('header').innerText = "よろしくおねがいします";
	// FIXME I know, I don't want it
	document.getElementById('barbox').innerHTML = `
			<label class="weaktext" for="participantID">参加者ID</label>
			<input type="text" size="7" placeholder="IDを入力" spellcheck="false" autocorrect="off" id="participantID">
	`;
	document.getElementById('next').innerText = " 回答を始める ";
}

function switchGridToQuestions() {
	// parepare input[type=range] into #barbox
	let rangeInput = document.createElement('input');
	rangeInput.type = "range";
	rangeInput.id = 'response';
	rangeInput.classList.add('range-bar');
	rangeInput.min = "0";
	rangeInput.max = "1";
	rangeInput.step = "any";
	let cell = document.getElementById('barbox');
	cell.innerText = "";
	cell.appendChild(rangeInput);
}

function switchGridToDownload() {
	clearQuestionPage();
	document.getElementById('header').innerText = "Thanks";
	document.getElementById('barbox').innerHTML = `
			<div class="center-image">
				<img src="https://live.staticflickr.com/778/20640894926_cdd2ccc266_n.jpg" alt="">
			</div>
	`;
	document.getElementById('next').innerText = "Download";
	setButtonClick( downloadResult );
}

function gatherResponse(i) {
	const res = document.getElementById('response').value;
	const storedRes = sessionStorage.getItem(responsesSavedName);
	if (storedRes == null) {
		alert("多分質問を始めるページを経由してない");
		return 0;
	}
	let responses = JSON.parse(storedRes);
	if (responses.length !== i) { console.log("ERROR? maybe wrong number of responses "+ responses);}
	responses.push(res);
	sessionStorage.setItem(responsesSavedName, JSON.stringify(responses));
}

function downloadResult() {
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
	const blob = new Blob([tsvLine], {type: "text/tab-separated-values;charset=utf-8"})
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

function runQuestion(q, n) {
	// n 番目 (n=0, 1, 2..) の質問に対応
	console.log(q[n]);
	// n番目の質問を描画
	q[n].render();
	// ボタンをクリックしたあとの動作を決める
	// 次がまだ質問なら再度個々を通る
	if (q.length > n+1) {
		setButtonClick(() =>  {
			gatherResponse(n);
			runQuestion(q, n+1);
		});
	}
	// これが最後の質問なので，次クリックされたら最後の画面に映る
	else if (q.length === n+1) {
		setButtonClick( () => {
			gatherResponse(n);
			switchGridToDownload();
		});
	}
}


function startQuestions(q) {
	// start receiving question
	console.log("there are " + q.length + " questions");
	const partID = document.getElementById('participantID').value;
	if (partID === '') {
		alert("no id specified: try again");
		return false;
	}
	const responses = [];
	sessionStorage.setItem("partID", partID);
	// Storage only supports storing and retrieving strings.
	// If you want to save other data types, you have to convert them
	// to strings. For plain objects and arrays, you can use JSON.stringify().
	// https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
	sessionStorage.setItem(responsesSavedName, JSON.stringify(responses));
	switchGridToQuestions();
	clearQuestionPage();
	runQuestion(q, 0);
}

function setButtonClick(f) {
	// one button always deals with one function, so
	// I stopped using addEventListener and just overwrite
	document.getElementById('next').onclick = f;
}


function init() {
	switchGridToInitialMode();
	const questions = getQuestions();
	console.log(questions);
	setButtonClick( () => startQuestions(questions) )
	// document.getElementById('next').addEventListener(
	// 	'click',
	// 	() => startQuestions(questions)
	// );
}


window.addEventListener('load', init);
