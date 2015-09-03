//Creates a text file from template files using Dust.js

var dust = require('dustjs-linkedin');
var fs = require('fs');
//var templateFile = process.argv[2];
var keyFile = process.argv[2];
//var outputFile = process.argv[4];
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
var dustThis = function (keyFile) {
  // Read the keyFile and parse as a JSON object
  fs.readFile(keyFile, function (err, data) {  
      e(err);
      var keys = JSON.parse(data);
      /* If there are partials, compile and load each of them iteratively first
       * NOTE: There is no exception handling. These templates MUST compile for 
       * things to work
       */
      if (keys.partials) {
	for (var i = 0; i < keys.partials.length; i++) {
	  var compiled = dust.compile(fs.readFileSync(keys.partials[i]).toString(), keys.partials[i]);
	  dust.loadSource(compiled);
	}
      }
      // Compile and load the main template
      var compiled = dust.compile(fs.readFileSync(keys.template).toString(), keys.template);
      dust.loadSource(compiled);
      // Render the main template and write it to a file
      dust.render(keys.template, keys, function(err, out) {
	  e(err);
	  fs.writeFile(keys.output_file, out);	
	  //c(out);
      });   
  });
}

dustThis(keyFile);

//export for easy looping and inclusion in larger projects
exports = dustThis;