#!/usr/bin/env node

import execa from 'execa' ;
import Listr from 'listr' ;
import { repos_promise } from  './repos' ;
import renderer from '@aureooms/listr-aggregate-renderer' ;

const cwd = '.' ;

const args = process.argv.slice(2);

if ( args.length < 1 ) {
	console.error('usage: geez <git command> [<git command argument>, ...]');
	process.exit(2);
}

let available_commands = [ ] ;

let result = execa.sync('git', ['config', '-l']);
let lines = result.stdout.split('\n');
lines = lines.filter( line => line.startsWith('alias.') );
lines = lines.map( line => line.split('=')[0] );
lines = lines.map( line => line.split('.')[1] );
available_commands = available_commands.concat(lines);

result = execa.sync('git', ['help', '-a']);
lines = result.stdout.split('\n');
lines = lines.filter( line => line.match(/^  [a-z]/) );
lines = lines.map( line => line.split(' ') );
for ( const line of lines ) {
	available_commands = available_commands.concat(line.filter(line => line));
}

available_commands.sort();

const cmd = args[0] ;

if ( ! available_commands.includes(cmd) ) {
	console.error(`Unknown command '${cmd}'.`);
	console.error(`Available commands are: ${available_commands.join(', ')}.`);
	process.exit(2);
}

const tasks = new Listr([
	{
		title: 'Searching for repos',
		task: ctx => repos_promise(cwd).then( repos => { ctx.repos = repos ; } )
	},
	{
		title: `Applying 'git ${args.join(' ')}' to all repos`,
		task: ctx => {

			const pullingtasks = ctx.repos.map(repo => ({
				title: repo,
				task: () => execa('git', ['-C', repo].concat(args))
			}));

			return new Listr(pullingtasks, {
				concurrent:true,
				exitOnError:false
			});

		}
	}
], {
	renderer,
	collapse: false,
	aggregate: true,
	maxsubtasks: 10,
	//showSubtasks: false
});

tasks.run().catch(err => {
	//console.error(err);
});
