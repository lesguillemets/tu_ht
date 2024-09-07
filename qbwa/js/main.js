

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
	if (typeof child === "object" && object.nodeType===1) {
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
	let pre = imageCont;
	pre.appendChild(preImg);
	let postImg = document.createElement('img');
	postImg.src = "https://live.staticflickr.com/3835/14752671885_b9f0b22a82_n.jpg";
	let post = imageCont;
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

function runQuestion(q, n) {
	console.log(q[n]);
	q[n].render();
	if (q.length > n) {
		// still more to go!
		setButtonClick(() => runQuestion(q, n+1));
	}
	if (q.length === n) {
		// this is the last question!
	}
}


function startQuestions(q) {
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
	sessionStorage.setItem("responses", JSON.stringify(responses));
	clearQuestionPage();
	switchGridToQuestions();
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
