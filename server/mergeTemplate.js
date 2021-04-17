function mergeTemplate(template, defaultValue, input, doDeepCloneOfDefaultValue = false) {
	//default value must match template
	// BE AWARE! doesnt work with nested objects

	let baseObject = new Object();

	(function doRecursive(template, defaultValue, input, baseObject) { // recursive and IIFE with params
		Object.keys(template).forEach(key => {

			if (typeof template[key] === 'function') {

				baseObject[key] = template[key](input[key]) ? input[key] : defaultValue[key];

			} else if (template[key] instanceof Object) {

				if (input[key] instanceof Object) {

					baseObject[key] = new Object();
					doRecursive(template[key], defaultValue[key], input[key], baseObject[key])

				} else {

					baseObject[key] = doDeepCloneOfDefaultValue ? __deepClone(defaultValue[key]) : defaultValue[key]; // short if-else checking

				}
			} else {

				throw new Error('invalid template')

			}
		})
	})(template, defaultValue, input, baseObject)

	return baseObject;

	//
	// additional function
	//
	function __deepClone(obj) {
		// BE AWARE! doesnt work with nested objects

		let resultObject = new Object();

		(function doRecursive(obj, resultObject) { // recursive and IIFE with params
			Object.keys(obj).forEach(key => {

				if (obj[key] instanceof Object) {

					resultObject[key] = new Object();
					doRecursive(obj[key], resultObject[key]);

				} else {

					resultObject[key] = obj[key];

				}
			})
		})(obj, resultObject)

		return resultObject;
	}
}

// TESTS

// const template = {
// 	prop1 : function(input) {
// 		return (typeof input === 'number') && input > 15;
// 	},
// 	prop2 : {
// 		prop3 : function(input) {
// 			return !!input;
// 		}
// 	}
// }

// const defaultValue = {
// 	prop1 : 3,
// 	prop2 : {
// 		prop3 : 'hi'
// 	}
// }

// const obj = {
// 	prop1 : 16,
// 	prop2 : {
// 		// prop3 : 'bye2',
// 		prop4 : 'bye'
// 	}
// }

// const result = mergeTemplate(template, defaultValue, obj, true);
// console.log(result);

module.exports = mergeTemplate;