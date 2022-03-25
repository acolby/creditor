# Creditor

##### Minimize writing boilerplate - focus on business logic!

Creditor is used to for maintaining and scaffolding boiler plate templates code within a repository. Once templates are defined, Creditor makes it easy create, rename, moved, analyze and use items associated with these templates.

## Usage
```
  npm install --save-dev @acolby/creditor
```

## Defining templates

Creditor expects there to be a ./creditor directory in the given project. This directory is where Creditor is configured and where templates are defined.

### ./creditor structure

The directory /creditor needs to be sturctured as follows
```
  /_ package.json
  /_ creditor
    /_ templates
      /_ [TEMPLATE_TYPE]
        /_ ... // location where template files are defined
    /_ aggregators
      /_ [TEMPLATE_TYPE]
        /_ ... // location where aggregators are defined
    /_ config.js
```

Once a [TEMPLATED_TYPE] is defined you may create this template in your repository by using the creditor cli. It is recommended that you add a line to your package.json file in order to do so.

Add to package.json:
```
  scripts: {
    ...
    "scaffold": 'node creditor inquire',
  }
```

Once added, defined templates can be managed by calling:
```
  $: npm run scaffold
```

The cli will then prompt for the information needed to scaffold a given template.

templates are outputted to whatever output directory defined in config.js.

## Defining Templates

Templates are simply files. They are generic items that contain keywords known to creditor (Creditor Keywords). The template name is the name of the folder nthey are defined in.

#### template  example
A file corresponding to ./creditor/templates/comps/index.js could look like

```jsx
  // ./creditor/templates/comps/index.js
  import {React} from 'react';
  
  function CREDITOR_UNDERSCORE_NAME(props) {
    return <h1>Hello, i am CREDITOR_PERIOD_NAME</h1>;
  }
  
  export default CREDITOR_UNDERSCORE_NAME;
  
```

Now, runing creditor will allow you to create a 'comps' item, where the location of the item will deterine what gets swaped out with the Creditor Keyword (CREDITOR_UNDERSOCRE_NAME).

It is import to understand that a creditor template is allowed to contain mulitiple files. All of the tiles will be created in the output directory when runing creditor. This allows you to scafold any sort of FilePatter you wish.

For example you may scafold a 'comps' with the interface file (index.js) a test file and a scss file

```
  /_ creditor
    /_ templates
      /_ comps
        /_ index.js
        /_ styles.scss
        /_ test.js
```

### Creditor Keywords
The folloing keywords within your template files will be swaped out with the created template.

 - CREDITOR_UNDERSCORE_NAME -> name of component deniniated by '_'
 - CREDITOR_PERIOD_NAME -> name of component deniniated by '.'
 - CREDITOR_DASH_NAME -> name of component deniniated by '-'
 - CREDITOR_SLASH_NAME -> name of component deniniated by '/'

