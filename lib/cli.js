#!/usr/bin/env node
'use strict';

var _execa = require('execa');

var _execa2 = _interopRequireDefault(_execa);

var _listr = require('listr');

var _listr2 = _interopRequireDefault(_listr);

var _repos = require('./repos');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const cwd = '.';

const tasks = new _listr2.default([{
	title: 'Searching for repos',
	task: ctx => (0, _repos.repos_promise)(cwd).then(repos => {
		ctx.repos = repos;
	})
}, {
	title: 'Pulling repos',
	task: ctx => {

		const pullingtasks = ctx.repos.map(repo => ({
			title: repo,
			task: () => (0, _execa2.default)('git', ['-C', repo, 'pull'])
		}));

		return new _listr2.default(pullingtasks, {
			concurrent: true,
			exitOnError: false
		});
	}
}], {
	collapse: false
});

tasks.run().catch(err => {
	//console.error(err);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jbGkuanMiXSwibmFtZXMiOlsiY3dkIiwidGFza3MiLCJ0aXRsZSIsInRhc2siLCJjdHgiLCJ0aGVuIiwicmVwb3MiLCJwdWxsaW5ndGFza3MiLCJtYXAiLCJyZXBvIiwiY29uY3VycmVudCIsImV4aXRPbkVycm9yIiwiY29sbGFwc2UiLCJydW4iLCJjYXRjaCIsImVyciJdLCJtYXBwaW5ncyI6Ijs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQSxNQUFNQSxNQUFNLEdBQVo7O0FBRUEsTUFBTUMsUUFBUSxvQkFBVSxDQUN2QjtBQUNDQyxRQUFPLHFCQURSO0FBRUNDLE9BQU1DLE9BQU8sMEJBQWNKLEdBQWQsRUFBbUJLLElBQW5CLENBQXlCQyxTQUFTO0FBQUVGLE1BQUlFLEtBQUosR0FBWUEsS0FBWjtBQUFxQixFQUF6RDtBQUZkLENBRHVCLEVBS3ZCO0FBQ0NKLFFBQU8sZUFEUjtBQUVDQyxPQUFNQyxPQUFPOztBQUVaLFFBQU1HLGVBQWVILElBQUlFLEtBQUosQ0FBVUUsR0FBVixDQUFjQyxTQUFTO0FBQzNDUCxVQUFPTyxJQURvQztBQUUzQ04sU0FBTSxNQUFNLHFCQUFNLEtBQU4sRUFBYSxDQUFDLElBQUQsRUFBT00sSUFBUCxFQUFhLE1BQWIsQ0FBYjtBQUYrQixHQUFULENBQWQsQ0FBckI7O0FBS0EsU0FBTyxvQkFBVUYsWUFBVixFQUF3QjtBQUM5QkcsZUFBVyxJQURtQjtBQUU5QkMsZ0JBQVk7QUFGa0IsR0FBeEIsQ0FBUDtBQUtBO0FBZEYsQ0FMdUIsQ0FBVixFQXFCWDtBQUNGQyxXQUFVO0FBRFIsQ0FyQlcsQ0FBZDs7QUEwQkFYLE1BQU1ZLEdBQU4sR0FBWUMsS0FBWixDQUFrQkMsT0FBTztBQUN4QjtBQUNBLENBRkQiLCJmaWxlIjoiY2xpLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG5cbmltcG9ydCBleGVjYSBmcm9tICdleGVjYScgO1xuaW1wb3J0IExpc3RyIGZyb20gJ2xpc3RyJyA7XG5pbXBvcnQgeyByZXBvc19wcm9taXNlIH0gZnJvbSAgJy4vcmVwb3MnIDtcblxuY29uc3QgY3dkID0gJy4nIDtcblxuY29uc3QgdGFza3MgPSBuZXcgTGlzdHIoW1xuXHR7XG5cdFx0dGl0bGU6ICdTZWFyY2hpbmcgZm9yIHJlcG9zJyxcblx0XHR0YXNrOiBjdHggPT4gcmVwb3NfcHJvbWlzZShjd2QpLnRoZW4oIHJlcG9zID0+IHsgY3R4LnJlcG9zID0gcmVwb3MgOyB9IClcblx0fSxcblx0e1xuXHRcdHRpdGxlOiAnUHVsbGluZyByZXBvcycsXG5cdFx0dGFzazogY3R4ID0+IHtcblxuXHRcdFx0Y29uc3QgcHVsbGluZ3Rhc2tzID0gY3R4LnJlcG9zLm1hcChyZXBvID0+ICh7XG5cdFx0XHRcdHRpdGxlOiByZXBvLFxuXHRcdFx0XHR0YXNrOiAoKSA9PiBleGVjYSgnZ2l0JywgWyctQycsIHJlcG8sICdwdWxsJ10pXG5cdFx0XHR9KSk7XG5cblx0XHRcdHJldHVybiBuZXcgTGlzdHIocHVsbGluZ3Rhc2tzLCB7XG5cdFx0XHRcdGNvbmN1cnJlbnQ6dHJ1ZSxcblx0XHRcdFx0ZXhpdE9uRXJyb3I6ZmFsc2Vcblx0XHRcdH0pO1xuXG5cdFx0fVxuXHR9XG5dLCB7XG5cdGNvbGxhcHNlOiBmYWxzZSxcblx0Ly9zaG93U3VidGFza3M6IGZhbHNlXG59KTtcblxudGFza3MucnVuKCkuY2F0Y2goZXJyID0+IHtcblx0Ly9jb25zb2xlLmVycm9yKGVycik7XG59KTtcbiJdfQ==