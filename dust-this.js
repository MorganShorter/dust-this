//Creates a text file from template files using Dust.js

var dust = require('dustjs-linkedin');
var fs = require('fs');
var templateFile = process.argv[2];
var keyFile = process.argv[3];
var outputFile = process.argv[4];
var c = console.log;

// pain free error catching
var e = function (err) {
  if (err) {
    throw err;
  } else {return false;}
}

// Tells dust to respect whitespace in templates
dust.config.whitespace = true;

/*
 * Takes in the file system paths (relative and absolute) of a dust template 
 * file, a key file containing a JSON object (and nothing else), and an output 
 * file; then processes the template and key files into an output file.
 * 
 * This overwrites any existing data in the output file without warning. BE CAREFUL!
 */
var dustThis = function (templateFile, keyFile, outputFile) {
  //read template file then pass the buffer to the callback for futher processing
  fs.readFile(templateFile, function (err, data) {
    e(err);
    
    // compile the template and give it the name template
    var compiled = dust.compile(data.toString(), "template");
    
    // load the compiled template into the dust template cache
    dust.loadSource(compiled);
    
    //read the keyFile and parse as a JSON object, then pass to dust.render
    fs.readFile(keyFile, function (err, data) {  
      e(err);
      // render the cached template and write it to a file
      dust.render("template", JSON.parse(data), function(err, out) {
	e(err);
	fs.writeFile(outputFile, out);
      });
    });
  });
}

dustThis(templateFile, keyFile, outputFile);

//export for easy looping and inclusion in larger projects
exports = dustThis;