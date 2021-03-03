#!/usr/bin/env node

import execa from 'execa' ;
import Listr from 'listr' ;
import { repos_promise } from  './repos' ;
import renderer from '@aureooms/listr-aggregate-renderer' ;

const args = process.argv.slice(2);

if ( args.length < 1 ) {
	console.error('usage: geez <git command> [<git command argument>, ...]');
	process.exit(2);
}

const result = execa.sync('git', ['help', '-a']);
let lines = result.stdout.split('\n');
lines = lines.filter( line => line.match(/^\s+[a-z]/) );
lines = lines.map( line => line.trim().split(/\s+/)[0] );
const available_commands = lines.sort();

const cmd = args[0] ;

if ( ! available_commands.includes(cmd) ) {
	console.error(`Unknown command '${cmd}'.`);
	console.error(`Available commands are: ${available_commands.join(', ')}.`);
	process.exit(2);
}

const cwd = process.env.GEEZ_CWD || '.' ;
const symlink_depth = Number.parseInt(process.env.GEEZ_SYMLINK_DEPTH, 10) || 0;
const hidden_depth = Number.parseInt(process.env.GEEZ_HIDDEN_DEPTH, 10) || 0;
const concurrent = Number.parseInt(process.env.GEEZ_CONCURRENT, 10) || 10; // true is too slow when there are a lot of repos

const repos_options = {
	symlink_depth,
	hidden_depth
};

const tasks = new Listr([
	{
		title: 'Searching for repos',
		task: ctx => repos_promise(cwd, repos_options).then( repos => { ctx.repos = repos ; } )
	},
	{
		title: `Applying 'git ${args.join(' ')}' to all repos`,
		task: ctx => {

			const pullingtasks = ctx.repos.map(repo => ({
				title: repo,
				task: () => execa('git', ['-C', repo].concat(args))
			}));

			return new Listr(pullingtasks, {
				concurrent,
				exitOnError: false
			});

		}
	}
], {
	renderer,
	collapse: false,
	aggregate: true,
	maxsubtasks: concurrent,
	//showSubtasks: false
});

tasks.run().then(
	() => {
		process.exitCode = 0;
	},
	() => {
		process.exitCode = 1;
	},
);
