
import fs from 'fs' ;
import path from 'path' ;
import { promise_callback } from './promise' ;

export function repos_callback ( dir , callback ) {

	  fs.readdir(dir, function(err, files) {

		if (err) return callback( err ) ; // forward error

		let pending = files.length ;

		if (!pending) return callback( null , [ ] ) ; // is empty

		if (files.includes('.git')) return callback( null , [ dir ] ) ; // is repo

		const results = [ ] ;

		for ( const file of files ) {

			if ( file[0] === '.' ) {
				if (!--pending) callback( null , results ) ;
				continue ; // skip hidden
			}

			const filepath = path.join(dir, file);

			fs.lstat(filepath, function(err, stat) {

				if ( err || stat.isSymbolicLink() || !stat.isDirectory() ) {
					if (!--pending) callback( null , results ) ; // skip
				}

				else {

					repos_callback(filepath, function(err, res) {

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

export function repos_executor ( dir ) {

	return function ( resolve , reject ) {

		const callback = promise_callback( resolve , reject ) ;
		repos_callback( dir , callback );

	}

}

export function repos_promise ( dir ) {

	return new Promise( repos_executor(dir) ) ;

}
