# Creditor

Creditor is used to for maintaining and scaffolding boiler plate templates code within a repository. Once templates are defined, Creditor makes it easy create, rename, moved, analyze and used these templates.

Creditor also uses the structure of the file system for defining how components should be used.

## Usage
```
  npm install --save @pclabs/creditor
```

## Defining templates

Creditor expects there to be a /creditor directory in the given project. This directory is where Creditor is configured and where templates are defined.

### ./creditor structure

The directory /creditor needs to be sturctured as follows
```
  /_ package.json
  /_ creditor
    /_ templates
      /_ [TEMPLATED_TYPE]
        /_ ...
        /_ files that will be scaffolded
    /_ config.js
```

Once a [TEMPLATED_TYPE] is defined you may create this template in your repository by using the creditor cli. It is recommended that you add a line to your package.json file in order to do so.

Add to package.json:
```
  scripts: {
    ...
    "scaffold": 'node creditor',
  }
```

Once added, defined templates can be managed by calling:
```
  $: npm run scaffold
```

The cli will then prompt for the information needed to scaffold a given template.

templates are outputted to whatever output directory defined in config.js.

### /creditor/config.js

/creditor/config.js is used to overwrite Creditor defaults
```
// config.js
module.exports = {
  rel: './temp', // the relative output of the templates
  manifest: '', // relative location of the manifest
};
```

## Using Defined templates

In order to get the full utility out of Creditor you will need to reconsider how you import and use scaffolded templates. Creditor uses the structure of you files to infer the structure of your components.

Within code you wish to use scaffolded components, you'll need to do the following.

```
  require.context = require('@pclabs/creditor/context.js')
  const src = require('@pclabs/creditor/import.js')(require.context(__dirname || './', true, /\.js$/));
  module.exports = src;

  // after this is called once you may call

  const src = require('@pclabs/creditor/import.js')() 
  // without the context to get the src bundle
```


## Example
// TODO

# Backlog
- Document example
- Better analysis tools
- Manifest uploading