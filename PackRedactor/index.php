<!DOCTYPE html>
<html>
<head>
	<title></title>
</head>
<body>

<input type="file" value="file"/>



<script src="/javscript\Stuk-jszip-25d401e\dist/jszip.js"></script>

<script>


	xmlText = '<test ex="1">teset</test>';
	_xml = (new DOMParser()).parseFromString(xmlText, "application/xml");

	// console.log(_xml.getElementsByTagName("test")[0].getAttribute("ex");

	_xml = (new XMLSerializer()).serializeToString(_xml);

	// console.log(_xml);
// console.log( jsonObj ,'\n');

// xml2json(_xml);


document.querySelector("input").onchange = (e) => {

var zip = new JSZip();

_this = e.target;

file = _this.files[0];

// console.log(file);







zip.loadAsync(file)
.then( (_zip) => {


	for ( const filename in _zip.files){
		// _zip.file(filename).async('string').then( (res) => {console.log(filename) } );
	};




	// main = (new DOMParser()).parseFromString( _zip.file("content.xml").async("string"),  "text/xml" );

	 _zip.file("test.xml").async("string").then( ( res ) => {

	 	main = ( new DOMParser()).parseFromString( res, "text/xml");

	 	// console.log( main );
	 	//
	 	document.body.innerHTML = (new XMLSerializer()).serializeToString(main);



	 		});

	// _zip.file("Images/1532958928_453129.jpg").async('string').then( (res) => {console.log(res)});


	// _zip.file("Texts/authors.xml").async("string").then( (res) => {console.log(res); });

    // you now have every files contained in the loaded zip
    //_zip.file("hello.txt").async("string"); // a promise of "Hello World\n"
    //

    return( _zip );

}).then( (_zip) => {

	// console.log(_zip, "test 123 123 123");



})


;




}







</script>

</body>
</html>