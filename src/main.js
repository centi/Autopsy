var fs = require("fs"),
	path = require("path"),
	autopsy = require("./autopsy.js" ),
	args = process.argv.slice(2),
	inputDir,
	outputDir;
	
// INPUT IS REQUIRED
	if ( args.length === 0 ) {
		console.log( "No input specified!" );
		console.log( "------------------------" );
		console.log( "node src/main.js inputDir" );
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
	autopsy.doAll( inputDir, outputDir );
