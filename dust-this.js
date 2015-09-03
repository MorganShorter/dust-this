//Creates a text file from template files using Dust.js

var dust = require('dustjs-linkedin');
var fs = require('fs');
var keyFile = process.argv[2];

// Pain free error catching.
var e = function (err) {
  if (err) {
    throw err;
  } else {return false;}
}

// Tells dust to respect whitespace in templates
dust.config.whitespace = true;

/*
 * Takes in a key file containing a JSON object (and nothing else), 
 * then processes the key file and template(s) into an output file.
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
      var compiled;
      if (keys.partials) {
	for (var i = 0; i < keys.partials.length; i++) {
	  compiled = dust.compile(fs.readFileSync(keys.partials[i]).toString(), keys.partials[i]);
	  dust.loadSource(compiled);
	}
      }
      // Compile and load the main template
      compiled = dust.compile(fs.readFileSync(keys.template).toString(), keys.template);
      dust.loadSource(compiled);
      // Render the main template and write it to a file
      dust.render(keys.template, keys, function(err, out) {
	  e(err);
	  fs.writeFile(keys.output_file, out);	
      });   
  });
}

dustThis(keyFile);

//export for easy looping and inclusion in larger projects
exports = dustThis;
