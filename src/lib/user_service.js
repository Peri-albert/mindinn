import Resource from './resource';

let getUser = async function() {
	let user = await Resource.get({
		service: 'skep',
		resource: 'account.user',
		data: {}
	})

	return user;
}

export default {
	getUser: getUser
};