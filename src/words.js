var util = require("util"),
	ize = require("./ize.js" );
	
exports.getAll = function( str ) {
	var arr, outputArr = [];
	
	str = ize.decommentize( str );
	str = ize.destringize( str );
	str = ize.wordize( str );
	
	arr = str.split( "\n" );
	for ( var i = 0; i < arr.length; i++ ) {
		if ( arr[i] !== "" ) {
			outputArr.push( arr[i] );
		}
	}
	
	return outputArr;
};

exports.getUser = function( input ) {
	if ( util.isArray(input) ) {
		return ize.dekeywordize( input );
	}
	else {
		return ize.dekeywordize( getAllWords( input ) );
	}
};

exports.getAllDistinct = function( input ) {
	if ( util.isArray(input) ) {
		return ize.demultiplize( input );
	}
	else {
		return demultiplize( getAllWords( input ) );
	}
};

exports.getUserDistinct = function( input ) {
	if ( util.isArray(input) ) {
		return ize.demultiplize( input );
	}
	else {
		return ize.demultiplize( getUserWords( input ) );
	}
};
