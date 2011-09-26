$(document).ready(function(){

	module("Basic Functionality");

	test("Getting an empty jQRange object", function() {
		var r;

		ok( r = $.range(),		"Calling $.range()" );
		equal( r.length, 0,		"length should be 0" );
	});

	test("Getting from jQuery object", function() {
		var r;
		var test = $('#simpletext')
		ok( r = test.range(),		"Calling obj.range()" );
		equal( r.length,	1,	"length should be 1" );
		equal( r.text(),	test.text(),
						"right text?" );
		ok( r = $.range(test),		"Calling $.range(obj)" );
		equal( r.length, 1);
		equal( r.text(), test.text(),	"right text?" );
	});

	test("Range matching with context", function() {
		var r;
		var test = $('#simpletext')
		ok( r = test.range("2-7"),	"Extracting Range" );
		equal( r.length, 1 );
		equal( r.text(), "mple ", "Substring is right" );
	});

	test("Multi-Range matching with context", function() {
		var r;
		var test = $('#simpletext')
		ok( r = test.range("0-6 7-11 4-4 7:4 22-23"),
						"Calling obj.range()" );
		equal( r.length, 4);
		equal( r.eq(0).text(), "Simple",	"0:6" );
		equal( r.eq(1).text(), "Text",		"7:11" );
		equal( r.eq(2).text(), "",		"4:4" );
		equal( r.eq(3).text(), "Text",	"0:6" );
		equal( r.eq(4).text(), null );
	});

	test("Pattern matching", function() {
		var r;
		ok( r = $.range(/Another Si[^ ]* Text/), "Calling $.range(/pattern/)" );
		equal( r.length, 1 );
		equal( r.eq(0).text(), "Another Simple Text" );
	});

	test("Pattern matching against no element", function() {
		var r;
		var test = $()
		ok( r = test.range(/FFFFF/), "Calling obj.range()" );
		equal( r.length, 0, "length should be 0" );
		equal( r.text(), null, "no text" );
	});

	test("Pattern matching without match", function() {
		var r;
		var text2 = $('#test2')
		ok( r = text2.range(/FFFFF/), "Calling obj.range()" );
		equal( r.length, 0, "no element found" );
		equal( r.text(), null, "no text" );
	});

	test("Pattern matching for 0-length string", function() {
		var r;
		ok( r = $.range(/$/), "Calling $.range(/$/)" );
		equal( r.length, 1, "length should be 1" );
		equal( r.text(), "", "Right pattern should be matched" );
	});

	test("Pattern with offset", function() {
		var r;
		ok( r = $.range(/Another Simple Text/), "Calling $.range(/pattern/)" );
		equal( r.length, 1, "length should be 1" );
		ok( r = r.range(/[A-Z]/g), "Calling $.range(/subpattern/)" );
		equal( r.length, 3, "length should be 3" );
		equal( r.eq(0).text(), "A", "Right pattern should be matched" );
		equal( r.eq(1).text(), "S", "Right pattern should be matched" );
		equal( r.eq(2).text(), "T", "Right pattern should be matched" );
		equal( r.eq(3).text(), null, "Right pattern should be matched" );
	});

	test("Pattern matching with context", function() {
		var r;
		var text2 = $('#simpletext2')
		ok( r = text2.range(/Text/), "Calling obj.range()" );
		equal( r.length, 1, "length should be 1" );
		equal( r.text(), "Text", "length should be 1" );
	});

	module("Selection");
	test("Set Selection", function() {
		var r;
		var text2 = $('#simpletext')
		ok( r = text2.range(), "Calling obj.range()" );
		ok( r.mark(), "marked?" );
	});

	module("Node extraction")
	test("Grabbing child nodes", function() {
		var r, j;
		ok ( r = $('#qunit-fixture').range(/nother|subnode/gi).join(), "Selecting a range over two nodes" );
		equal( r.text().replace(/\s+/g,' '), "nother Simple Text Text with SubNode")
		ok ( j = r.contents(), "getting inner contents" );
		equals(j.length, 1)
	})

	module("Manipulation");
	test("Changing text", function() {
		var r;
		var text2 = $('#simpletext')
		ok( r = text2.range(/Text/), "Calling obj.range()" );
		ok( r.text('MMMM'), "Setting Text" );
		equal( text2.text(), "Simple MMMM", "Element should be changed accordingly" );
	});

	test("Changing html", function() {
		var r;
		var text2 = $('#simpletext')
		ok( r = text2.range(/Text/), "Calling obj.range()" );
		ok( r.html('<b>Text</b>'), "Inserting HTML" );
		equal( text2.find('b').length, 1, "There should be a <b> tag now" );
	});

	test("Wrapping", function() {
		var r;
		var text2 = $('#simpletext')
		var wrap = $('<span>')
		ok( r = text2.range(/Text/), "Calling obj.range()" );
		ok( r.wrap(wrap), "Wrapping" );
		equal( text2.find('span').length, 1, "There should be a <span> tag now" );
		equal( text2.find('span').text(), "Text", "Text should be the same" );
	});

});
