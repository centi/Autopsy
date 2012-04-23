var fs = require("fs" ),
	words = require("./words.js" ),
	wordsStack = {};
	
function doAll( inputDir, outputDir ) {
	var files = fs.readdirSync( inputDir ),
		everything = {}, file, res, stats, contents = "";
		
	for ( var i = 0; i < files.length; i++ ) {
		file = inputDir + files[i];
		res = doFile( file );
		wordsStack[ file ] = res.words;
		contents +=res.contents;
		
		fs.writeFileSync( outputDir + files[i], JSON.stringify( res.words ) );
	}
	
	everything.all = words.getAll( contents );
	everything.allDistinct = words.getAllDistinct( everything.all );
	everything.user = words.getUser( everything.all );
	everything.userDistinct = words.getUserDistinct( everything.user );
	stats = doStats( everything );
	
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

function doFile( file ) {
	var fileContents = fs.readFileSync( file, "utf8" ),
		all = words.getAll( fileContents ),
		allDistinct = words.getAllDistinct( all ),
		user = words.getUser( all ),
		userDistinct = words.getUserDistinct( user );
		
		return {
			words : {
				all				: all,
				allDistinct		: allDistinct,
				user			: user,
				userDistinct	: userDistinct
			},
			contents : fileContents
		};
}

function doStats( words ) {
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

exports.doAll = doAll;
exports.doFile = doFile;
exports.doStats = doStats;
