//Dust-this. Copyright (c) 2015, Morgan Shorter-McFarlane
//Creates a text file from template files using Dust.js

var dust = require('dustjs-linkedin');
var fs = require('fs');
var keyFile = process.argv[2];


// Tells dust to respect whitespace in templates
dust.config.whitespace = true;

/*
 * Takes in a key file containing a JSON object (and nothing else), 
 * then processes the key file and template(s) into an output file.
 * 
 * This overwrites any existing data in the output file without warning. BE CAREFUL!
 */
var dustThis = function (keyFile) {
  console.log("\nDust-this\nCopyright (c) 2015, Morgan Shorter-McFarlane\n");
  // Read the keyFile and parse as a JSON object
  fs.readFile(keyFile, function (err, data) {  
      if(err){throw err;}
      var keys = JSON.parse(data);

      /* If there are partials, compile and load each of them iteratively first
       * NOTE: There is no exception handling. These templates MUST compile for 
       * things to work
       */
      if (keys.partials) {
	console.log("Loading partials...");
	keys.partials.forEach(function(partial){
	  dust.loadSource(dust.compile(fs.readFileSync(partial).toString(), partial));
	  console.log(partial+" loaded.");
	});
      }
      
      // Compile and load the main template
      console.log("Loading template...");
      dust.loadSource(dust.compile(fs.readFileSync(keys.template).toString(), keys.template));

      // Render the main template and write it to a file
      console.log("Rendering...");
      dust.render(keys.template, keys, function(err, out) {
	  if(err){throw err;}
	  fs.writeFile(keys.output_file, out);
  	  console.log("Done!");	  
      });   
  });
}

dustThis(keyFile);

//export for easy looping and inclusion in larger projects
exports = dustThis;
