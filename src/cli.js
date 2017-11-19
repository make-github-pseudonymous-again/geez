#!/usr/bin/env node

import execa from 'execa' ;
import Listr from 'listr' ;
import { repos_promise } from  './repos' ;
import renderer from '@aureooms/listr-aggregate-renderer' ;

const cwd = '.' ;

const args = process.argv.slice(2);

if ( args.length !== 1 ) {
	console.error('usage: geez {pull|push}');
	process.exit(2);
}
const available_commands = [ 'pull' , 'push' ] ;

const cmd = args[0] ;

if ( ! available_commands.includes(cmd) ) {
	console.error(`Unknown command '${cmd}'.`);
	process.exit(2);
}

const tasks = new Listr([
	{
		title: 'Searching for repos',
		task: ctx => repos_promise(cwd).then( repos => { ctx.repos = repos ; } )
	},
	{
		title: `${cmd[0].toUpperCase()}${cmd.substring(1)}ing repos`,
		task: ctx => {

			const pullingtasks = ctx.repos.map(repo => ({
				title: repo,
				task: () => execa('git', ['-C', repo, cmd])
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
