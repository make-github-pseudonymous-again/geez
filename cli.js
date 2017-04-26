#!/usr/bin/env node

const fs = require('fs');
const execa = require('execa');
const Listr = require('listr')

// List all files in a directory in Node.js recursively in a synchronous fashion

function* repos (dir = '.') {

	const files = fs.readdirSync(dir);

	if ( files.includes( '.git' ) ) {
		yield dir;
	}

	else {

		for ( let file of files ) {

			if ( file[0] === '.' ) continue ; // skip hidden

			try {
				const stat = fs.lstatSync(dir + '/' + file);
				if (!stat.isSymbolicLink() && stat.isDirectory()) {
					yield* repos(dir + '/' + file);
				}
			}
			catch (e) {
				console.log(e);
			}
		}

	}

}


const tasks = new Listr([
	{
		title: 'Searching for repos',
		task: ctx => {
			ctx.repos = [...repos()];
		}
	},
	{
		title: 'Pulling repos',
		task: ctx => {

			const pullingtasks = ctx.repos.map(repo => ({
				title: repo,
				task: () => execa('git', ['-C', repo, 'pull'])
			}));

			return new Listr(pullingtasks, {
				concurrent:true,
				exitOnError:false
			});

		}
	}
], {
	collapse: false,
	//showSubtasks: false
});

tasks.run().catch(err => {
	//console.error(err);
});
