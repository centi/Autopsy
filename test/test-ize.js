var ize = require("../src/ize.js");

describe( 'decommentize', function() {
	it( 'should remove JS inline comments', function() {
		var strIn = "var num = 5;// this is a number",
			strOut = "var num = 5;";
			
		ize.decommentize( strIn ).should.equal( strOut );
	} );
	it( 'should remove JS block comments', function() {
		var strIn = "var num = 5;/* this is a number */var str = \"string\"",
			strOut = "var num = 5;var str = \"string\"";
			
		ize.decommentize( strIn ).should.equal( strOut );
	} );
	it( 'should remove whitespace \n \r \t', function() {
		var strIn = "var num = 5;\r\n\tvar a = 5;",
			strOut = "var num = 5;var a = 5;";
			
		ize.decommentize( strIn ).should.equal( strOut );
	} );
} );
