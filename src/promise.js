
export function promise_callback ( resolve , reject ) {

	return function ( err , data ) {

		if (err) return reject(err) ;
		resolve(data) ;

	}

}
