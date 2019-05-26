
let positiveNumberRegex = /^\d+\.?\d*$/;
let isPositiveNumber = function(value) {
	return positiveNumberRegex.test(value);
}

let positiveIntRegex = /^\d+$/;
let isPositiveInt = function(value) {
	return positiveIntRegex.test(value);
}

let isString = function(value) {
	return value && value.length > 0;
}

let dateRegex = /^(?:19|20)[0-9][0-9]-(?:(?:0[1-9])|(?:1[0-2]))-(?:(?:[0-2][1-9])|(?:[1-3][0-1]))$/;
let isDate = function(value) {
	return dateRegex.test(value);
}

let dateTimeRegex = /^(?:19|20)[0-9][0-9]-(?:(?:0[1-9])|(?:1[0-2]))-(?:(?:[0-2][1-9])|(?:[1-3][0-1])) (?:(?:[0-2][0-3])|(?:[0-1][0-9])):[0-5][0-9]:[0-5][0-9]$/;
let isDateTime = function(value) {
	return dateTimeRegex.test(value);
}

let phoneNumberRegex = /^1(3|4|5|7|8)\d{9}$/
let isPhoneNumber = function(value) {
	return phoneNumberRegex.test(value);
}

export default {
	isPositiveNumber: isPositiveNumber,
	isPositiveInt: isPositiveInt,
	isString: isString,
	isDate: isDate,
	isDateTime: isDateTime,
	isPhoneNumber: isPhoneNumber
};