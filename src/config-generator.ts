import * as inquirer from 'inquirer';

export default async () => {
	const as = await inquirer.prompt([
		{
			type: 'input',
			name: 'maintainer',
			message: 'What\'s maintainer name'
		},
		{
			type: 'input',
			name: 'port',
			message: 'Port'
		},
		{
			type: 'input',
			name: 'port',
			message: 'Port'
		},
		{
			type: 'input',
			name: 'mongo_uri',
			message: 'MongoDB\'s URI'
		},
		{
			type: 'input',
			name: 'mongo_user',
			message: 'MongoDB\'s user'
		},
		{
			type: 'password',
			name: 'mongo_pass',
			message: 'MongoDB\'s password'
		},
		{
			type: 'input',
			name: 'redis_host',
			message: 'Redis\'s host'
		},
		{
			type: 'input',
			name: 'redis_port',
			message: 'Redis\'s port'
		}
	]);
};
