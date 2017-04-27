#!/usr/bin/env node

import execa from 'execa' ;
import Listr from 'listr' ;
import { repos_promise } from  './repos' ;

const cwd = '.' ;

const tasks = new Listr([
	{
		title: 'Searching for repos',
		task: ctx => repos_promise(cwd).then( repos => { ctx.repos = repos ; } )
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
