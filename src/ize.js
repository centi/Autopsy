var minWordLength = 2,
	keywords = ["break","case","catch","continue","debugger","default","delete","do","else","finally","for","function","if","in","instanceof","new","return","switch","this","throw","try","typeof","var","void","while","with","class","enum","export","extends","import","super","implements","interface","let","package","private","protected","public","static","yield","false","true","null"];
	
exports.decommentize = function( input ) {
	var output = input;
	
	output = output.replace( /\/\/.*(?=[\n\r])*/g, "" );
	output = output.replace( /[\t\r\n]*/g, "" );
	output = output.replace( /\/\*.+?\*\//g, "" );
	
	return output;
};

exports.destringize = function( input ) {
	var output = input;
	
	output = output.replace( /'[^']*'/g, "" );
	output = output.replace( /"[^"]*"/g, "" );
	
	return output;
};

exports.wordize = function( input ) {
	var output = input,
		arr = [];
		
	output = output.replace( /[^(\w+)]/g, "\n" );
	output = output.replace( /[/(/)/+_]/g, "\n" );
	output = output.replace( /\n{2,}/g, "\n" );
	output = output.split( "\n" );
	
	for ( var i = 0; i < output.length; i++ ) {
		if ( isNaN( output[i] ) && output[i].length >= minWordLength ) {
			arr.push( output[i] );
		}
	}
	
	return arr.join( "\n" );
};

exports.dekeywordize = function( words ) {
	var cleaned = [];
	
	for ( var i = 0; i < words.length; i++ ) {
		if ( words[i] !== "" && keywords.indexOf( words[i] ) === -1 ) {
			cleaned.push( words[i] );
		}
	}
	
	return cleaned;
};

exports.demultiplize = function( input ) {
	var distinct = [];
	
	for ( var i = 0; i < input.length; i++ ) {
		if ( distinct.indexOf( input[i] ) === -1 ) {
			distinct.push( input[i] );
		}
	}
	
	return distinct;
};
