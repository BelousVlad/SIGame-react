function setStatus( val ){
	document.querySelector('.div_1').innerHTML = val;
}

const ws = new WebSocket('ws://localhost:3000');

ws.onopen = () => {
	setStatus('succcesful connection!');
	ws.send('test');
	ws.onmessage = (msg) => {console.log(msg.data)};
};

