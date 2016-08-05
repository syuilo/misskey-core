import * as readline from 'readline';
import * as chalk from 'chalk';

export default (q: string, d?: boolean) => new Promise((resolve, reject) => {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});

	rl.question(`${chalk.yellow(q)} (${d ? 'Y' : 'y'}/${d ? 'n' : 'N'}): `, a => {
		a = a.trim().toLowerCase();

		if (a === '') {
			resolve(d);
		} else if (a[0] === 'y') {
			resolve(true);
		} else if (a[0] === 'n') {
			resolve(false);
		} else {
			resolve(d);
		}

		rl.close();
	});
});
