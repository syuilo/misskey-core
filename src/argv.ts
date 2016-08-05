//////////////////////////////////////////////////
// ARGV MANAGER
//////////////////////////////////////////////////

import * as argv from 'argv';

argv.option([{
	name: 'skip-check-dependencies',
	type : 'boolean',
	description: '依存関係のチェックをスキップします',
	example: 'npm start --skip-check-dependencies'
}, {
	name: 'skip-check-for-update',
	type : 'boolean',
	description: 'アップデートのチェックをスキップします',
	example: 'npm start --skip-check-for-update'
}]);

export default argv.run();
