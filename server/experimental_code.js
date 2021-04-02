const asyncFunctionConstructor = ( (Object.getPrototypeOf(async ()=>{})).constructor ); // get async construcotr to check if function is async or not

class CallbackObject {
	constructor(fail, success, filter) {
		if (typeof fail !== 'function' || typeof success !== 'function') { // validate if arguments are func or not
			throw new Error('fail or success isnt a function');
		}

		if (fail.constructor === asyncFunctionConstructor || success.constructor === asyncFunctionConstructor) { // validate if func sync of not
			throw new Error('fail or success isnt a sync-function');
		}

		this.fail = fail;
		this.success = success;

		if (filter !== undefined) {
			if (typeof filter === 'function') {
				if (filter.constructor !== asyncFunctionConstructor) { // validate if filter sync or not
					this.filter = filter;
				}
				else {
					throw new Error('filter has been specified, but its async-func');
				}
			}
			else {
				throw new Error('filter has been specified, but its not a function');
			}
		}
	}
}

class Timer {
	constructor(timeout, callbacks) {
		this.leftTime = timeout; // amount of time which function wait for
		this.timeStart = Date.now(); // ofc time when function beggin its invoking
		this.intermediateStartValue = this.timeStart; // intermediate start time value
		this.callbackList = new Array(); // list of callback-objects
		this.state = {
			pause : false,
		};

		if(callbacks !== undefined)
			this.addCallback(callbacks.fail, callbacks.success, callbacks.filter);

		this.timeoutCall = setTimeout(this.timerEnd.bind(this), timeout);
	}

	// FORCE END OF TIMER

	die() {
		clearTimeout(this.timeoutCall);
	}

	forceEnd() {
		this.die();
		return this.timerEnd();
	}

	forceFail() {
		this.die();
		return this.eachCallback(false);
	}

	forceSuccess() {
		this.die();
		return this.eachCallback(true);
	}

	// ---

	// PAUSE - RESUME

	pause(time) {
		clearTimeout(this.timeoutCall);

		this.state.paused = true;
		this.leftTime = this.getLeftTime();

		if (typeof time === 'number')
			this.callAfterPause = setTimeout(this.resume.bind(this), time);
	}

	resume() {
		if (this.callAfterPause)
			clearTimeout(this.callAfterPause);

		this.state.paused = false;
		this.intermediateStartValue = Date.now();
		this.timeoutCall = setTimeout(this.timerEnd.bind(this), this.leftTime);
	}

	// ---

	// GET-SET LEFT TIME

	getLeftTime() {
		return this.leftTime - (Date.now() - this.intermediateStartValue);
	}

	setLeftTime(timeout) {
		if (typeof timeout !== 'number')
			throw new Error('invalid input int "setLeftTime: argument must be an number');

		if (timeout < 0) {
			this.die();
			return;
		}
		if (timeout === 0) {
			setTimeout(() => this.clear(), 0); // setTimeout cause to setLeftime works like regular js setTimeout(0). (TO PUSH IN THE STACK)
			return;
		}

		this.leftTime = timeout;
		clearTimeout(this.timeoutCall);
		this.timeoutCall = setTimeout(this.timerEnd.bind(this), timeout);
	}

	// ---

	eachCallback(condition = true, ...args_) {
		if (typeof condition === 'boolean')
		{
			this.lastInvokeResult = this.callbackList.map(item => {
				condition ? item.success(...args_) : item.fail(...args_); // if-else short checking
			})
		}
		else if (typeof condition === 'function' && condition.constructor !== asyncFunctionConstructor)
		{
			this.lastInvokeResult = this.callbackList.map(item => {
				condition(item) ? item.success(...args_) : item.fail(...args_); // if-else short checking
			})
		}
		else
		{
			throw new Error('invalid input in "eachCallback", argument must be a boolean or a sync-function.');
		}

		return this.lastInvokeResult;
	}

	addCallback(fail /*possible to be instance of CallbackObject */, success, filter /*optionaly */) {

		// if 1-st argument is instance of CallbackObject then just push it to callbackList
		if (fail instanceof CallbackObject) {
			this.callbackList.push(fail);
			return;
		}

		const callback = [
			fail,
			success,
		];
		if (filter !== undefined)
			callback[2] = filter;

		const callbackObj = new CallbackObject(...callback);

		this.callbackList.push(callbackObj);

		return callbackObj;
	}

	removeCallback(callbackObj) {
		this.callbackList = this.callbackList.filter(item => item !== callbackObj);
	}

	timerEnd() {
		this.eachCallback(function(item) {
			if (item && typeof item.filter === 'function') // async validation done in CallbackObject constructor
				return item.filter();
			else
				return true;
		})
		this.timeEnd = Date.now();
	}

}

// tests

// var timer = new Timer(50);

// var callbackObj = new CallbackObject( ()=>{}, ()=>{console.log(123, 'w', Date.now())} );


// timer.addCallback( callbackObj )
// timer.addCallback( () => {}, () => {console.log(321)}, () => false)

// console.log(Date.now());
// timer.pause();

// setTimeout(function() {
// 	console.log(Date.now());
// 	timer.resume();
// 	console.log(timer.getLeftTime());
// 	timer.setLeftTime(2000);
// 	console.log(timer.getLeftTime());
// }, 1000)

module.exports = Timer;