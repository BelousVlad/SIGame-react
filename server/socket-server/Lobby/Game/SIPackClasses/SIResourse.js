class SIResource
{
	constructor(value, type, params/*optional*/) {
		this.value = value;
		this.type = type;

		// { time /*etc...*/} = params;
		// if (time) this.time = time;
	}
}

module.exports = SIResource;