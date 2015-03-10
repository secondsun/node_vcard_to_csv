var express = require('express');
var multer  = require('multer');
var fs     = require('fs'),
 _ = require('underscore'),
 csv = require('csv'),
 urlencode = require('urlencode'),
 vcardparser = require('vcardparser');;

var app = express();

app.use(multer({ inMemory:true, dest:'.', onFileUploadComplete: function(file, req, res){
   console.log(req.files);
}}));

//var file = fs.readFileSync("neoreader.csv", "utf8");
//var data = (JSON.parse(file));
// console.log(urlencode.decode(file));



 // console.log("SOMEOUTOUT", output)



// Note: route names need not match the file name
 app.get('/hello', function(req, res) {
     res.sendfile('hello.html');
   });

 app.post('/post', function(req, res) {
	res.setHeader('Content-Disposition', 'attachment;filename="report.csv"');
	csv.parse(urlencode.decode(req.files['dasFile'].buffer), {delimiter: ';'}, function(err, output){
        var response = '';
	 _.each(output, function(it) {
	   if (it.length > 2) {
	     //console.log("SOMETHING----->", it[1], "---------")
	       // var card = new vCard();
	       //   card.readData(it[1], function(err, json) {
	       //     // console.log(JSON.parse(json));
	       //     console.log(json);
	       // });
	       // console.log(it[1])
	       vcardparser.parseString(it[1], function(err, json) {
		   if(err)
		       return console.log(err);
		       if (json.n) {
			 // console.log('-----', json.n.first);
			 console.log('-----', json.email[0].value);
                         response +=  [json.email[0].value , json.n.first, json.n.last, "\n"].join(',');
		       }

	       })
	   }
	 });
         res.send(response);	
         res.end();
 });
});
var server = app.listen(8080, function() {
  console.log("App started at: " + new Date() + " on port: " + 8080);
});

