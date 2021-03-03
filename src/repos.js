
import fs from 'fs' ;
import path from 'path' ;
import { promise_callback } from './promise' ;

export function repos_callback ( dir , {symlink_depth, hidden_depth}, callback ) {

	  fs.readdir(dir, function(err, files) {

		if (err) return callback( err ) ; // forward error

		let pending = files.length ;

		if (!pending) return callback( null , [ ] ) ; // is empty

		if (files.includes('.git')) return callback( null , [ dir ] ) ; // is repo

		const results = [ ] ;

		for ( const file of files ) {

			const isHidden = file[0] === '.';

			if ( hidden_depth <= 0 && isHidden ) {
				if (!--pending) callback( null , results ) ;
				continue ; // skip hidden
			}

			const filepath = path.join(dir, file);

			fs.lstat(filepath, function(err, stat) {

				if ( err || (symlink_depth <= 0 && stat.isSymbolicLink()) || (!stat.isSymbolicLink() && !stat.isDirectory()) ) {
					if (!--pending) callback( null , results ) ; // skip
				}

				else {

					const options = {
						hidden_depth: isHidden ? hidden_depth - 1 : hidden_depth,
						symlink_depth: stat.isSymbolicLink() ? symlink_depth - 1 : symlink_depth
					};

					repos_callback(filepath, options, function(err, res) {

						if (err) {

							if (!--pending) callback( null , results ) ; // skip

						}

						else {

							for ( const v of res ) results.push( v ) ;

							if (!--pending) callback(null, results);

						}

					});

				}

			});

		}

	});

}

export function repos_executor ( dir, options ) {

	return function ( resolve , reject ) {

		const callback = promise_callback( resolve , reject ) ;
		repos_callback( dir , options, callback );

	}

}

export function repos_promise ( dir, options ) {

	return new Promise( repos_executor(dir, options) ) ;

}
