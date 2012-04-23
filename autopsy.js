var fs = require("fs"),
	path = require("path"),
	util = require("util"),
	args = process.argv.slice(2),
	keywords = ["break","case","catch","continue","debugger","default","delete","do","else","finally","for","function","if","in","instanceof","new","return","switch","this","throw","try","typeof","var","void","while","with","class","enum","export","extends","import","super","implements","interface","let","package","private","protected","public","static","yield","false","true","null"],
	fileWords = {},
	inputDir,
	outputDir,
	inputFiles,
	minWordLength = 2;
	
// INPUT IS REQUIRED
	if ( args.length === 0 ) {
		console.log( "No input specified!" );
		console.log( "------------------------" );
		console.log( "node autopsy.js inputDir" );
		process.exit(1);
	}
	
// PARSE ARGUMENTS
	if ( args[0] === "-o" ) {
		inputDir = args[2] + "/";
		outputDir = args[1] + "/";
	}
	else {
		inputDir = args[0] + "/";
		outputDir = "output/"; // default
	}
	
// CHECK THE DIRECTORIES
	if ( !path.existsSync( inputDir ) ) {
		console.log( "Input directory does not exist!" );
		process.exit(1);
	}
	if ( !path.existsSync( outputDir ) ) {
		fs.mkdirSync( outputDir );
	}
	
// GET AND DOIZE THE FILES
	autopsy( fs.readdirSync( inputDir ) );
	
// ========================================================================================
function autopsy( files ) {
	var everything = {}, file, res, stats, contents = "";
	
	for ( var i = 0; i < files.length; i++ ) {
		file = inputDir + files[i];
		res = autopsyFile( file, "utf8" );
		fileWords[ file ] = res.words;
		contents +=res.contents;
		
		fs.writeFileSync( outputDir + files[i], JSON.stringify( res.words ) );
	}
	
	everything.all = getAllWords( contents );
	everything.allDistinct = getAllWordsDistinct( everything.all );
	everything.user = getUserWords( everything.all );
	everything.userDistinct = getUserWordsDistinct( everything.user );
	stats = calcStats( everything );
	
	fs.writeFileSync( outputDir + "_everything.js", JSON.stringify( everything ) );
	fs.writeFileSync( outputDir + "_everything-all.txt", everything.all.join("\n") );
	fs.writeFileSync( outputDir + "_everything-allDistinct.txt", everything.allDistinct.join("\n") );
	fs.writeFileSync( outputDir + "_everything-user.txt", everything.user.join("\n") );
	fs.writeFileSync( outputDir + "_everything-userDistinct.txt", everything.userDistinct.join("\n") );
	fs.writeFileSync( outputDir + "_stats.js", JSON.stringify( stats ) );
	
	console.log( "All your words are belong to us:" );
	console.log( "- All words             : " + stats.all );
	console.log( "- All words (distinct)  : " + stats.allDistinct );
	console.log( "- User words            : " + stats.user );
	console.log( "- User words (distinct) : " + stats.userDistinct );
}

function autopsyFile( file ) {
	var fileContents = fs.readFileSync( file, "utf8" ),
		all = getAllWords( fileContents ),
		allDistinct = getAllWordsDistinct( all ),
		user = getUserWords( all ),
		userDistinct = getUserWordsDistinct( user ),
		words = {
			all				: all,
			allDistinct		: allDistinct,
			user			: user,
			userDistinct	: userDistinct
		};
		
		return {
			words			: words,
			contents		: fileContents
		};
}

function calcStats( words ) {
	var stats = {
		all				: 0,
		allDistinct		: 0,
		user			: 0,
		userDistinct	: 0
	};
	
	stats.all += words.all.length;
	stats.allDistinct += words.allDistinct.length;
	stats.user += words.user.length;
	stats.userDistinct += words.userDistinct.length;
	
	return stats;
}

// == WORD FUNCTIONS ======================================================================
function getAllWords( str ) {
	var arr, outputArr = [];
	
	str = decommentize( str );
	str = destringize( str );
	str = wordize( str );
	
	arr = str.split( "\n" );
	for ( var i = 0; i < arr.length; i++ ) {
		if ( arr[i] !== "" ) {
			outputArr.push( arr[i] );
		}
	}
	
	return outputArr;
}

function getUserWords( input ) {
	if ( util.isArray(input) ) {
		return dekeywordize( input );
	}
	else {
		return dekeywordize( getAllWords( input ) );
	}
}

function getAllWordsDistinct( input ) {
	if ( util.isArray(input) ) {
		return demultiplize( input );
	}
	else {
		return demultiplize( getAllWords( input ) );
	}
}

function getUserWordsDistinct( input ) {
	if ( util.isArray(input) ) {
		return demultiplize( input );
	}
	else {
		return demultiplize( getUserWords( input ) );
	}
}

// == IZE FUNCTIONS ======================================================================
function decommentize( input ) {
	var output = input;
	
	output = output.replace( /\/\/.*(?=[\n\r])/g, "" );
	output = output.replace( /[\t\r\n]*/g, "" );
	output = output.replace( /\/\*.+?\*\//g, "" );
	
	return output;
}
function destringize( input ) {
	var output = input;
	
	output = output.replace( /'[^']*'/g, "" );
	output = output.replace( /"[^"]*"/g, "" );
	
	return output;
}

function wordize( input ) {
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
}

function dekeywordize( words ) {
	var cleaned = [];
	
	for ( var i = 0; i < words.length; i++ ) {
		if ( words[i] !== "" && keywords.indexOf( words[i] ) === -1 ) {
			cleaned.push( words[i] );
		}
	}
	
	return cleaned;
}

function demultiplize( input ) {
	var distinct = [];
	
	for ( var i = 0; i < input.length; i++ ) {
		if ( distinct.indexOf( input[i] ) === -1 ) {
			distinct.push( input[i] );
		}
	}
	
	return distinct;
}
