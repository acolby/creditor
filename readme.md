# Creditor

##### Minimize writing boilerplate - focus on business logic!

Creditor is used for maintaining and scaffolding boiler plate template code within a repository. Once templates are defined, Creditor makes it easy create, rename, move, analyze, and use items associated with these templates.

## Usage

```
  npm install --save-dev @acolby/creditor
```

## Defining templates

Creditor expects there to be a ./creditor directory in the given project. This directory is where Creditor is configured and where templates are defined.

### ./creditor structure

The "/creditor" directory needs to be structured as follows

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
    "creditor": 'creditor inquire --verbose',
  }
```

Once added, defined templates can be managed by calling:

```
  $: npm run creditor
```

The cli will then prompt for the information needed to scaffold a given template.

templates are outputted to whatever output directory defined in config.js.

## Defining Templates

Templates are simply files. They are generic items that contain keywords known to creditor (Creditor Keywords). The template name is the name of the folder they are defined in.

#### template example

A file corresponding to ./creditor/templates/comps/index.js could look like

```jsx
// ./creditor/templates/comps/index.js
import { React } from "react";

function CREDITOR_UNDERSCORE_NAME(props) {
  return <h1>Hello, i am CREDITOR_PERIOD_NAME</h1>;
}

export default CREDITOR_UNDERSCORE_NAME;
```

Now, running creditor will allow you to create a 'comps' item, where the location of the item will determine what gets swapped out with the Creditor Keyword (CREDITOR_UNDERSCORE_NAME).

It is import to understand that a creditor template directory is allowed to contain multiple files. All of the tiles will be created in the output directory when running creditor. This allows you to scaffold any sort of File Pattern you wish.

For example you may scaffold a 'comps' with the interface file (index.js) a test file and a scss file

```
  /_ creditor
    /_ templates
      /_ comps
        /_ index.js
        /_ styles.scss
        /_ test.js
```

### Creditor Keywords

The following keywords within your template files will be swapped out with the created template.

- CREDITOR*UNDERSCORE_NAME -> name of component delineated by '*'
- CREDITOR_PERIOD_NAME -> name of component delineated by '.'
- CREDITOR_DASH_NAME -> name of component delineated by '-'
- CREDITOR_SLASH_NAME -> name of component delineated by '/'

## Defining Aggregators

It is often desired to take files within a given directory and aggregate them within a top level file of that directory. Examples of this are:

- Creating an interface file
- Combining sub files to create a store
- Merging files for documentation purposes

Creditor provides a mechanism for defining how items within a directory should be merged programmatically. This allows developers to focus on developing the items rather then updating the proper boilerplate aggregator files.

Similarly to templates, aggregators are defined within the creditor directory

For example you may scaffold a 'comps' with the interface file (index.js) a test file and a scss file

```
  /_ creditor
    /_ aggregators
      /_ routes
        /_ index.js
```

When creditor runs and if the comps directory is changed in any way. A corresponding /index.js file will be created at the top of the comps directory. The index.js file defined in /creditor/aggregators/comps is the definition file for how to aggregate the sub-files.

```js
module.exports = ({ paths = [] }) => {
  const filtered = paths
    .filter((item) => item.split(path.sep).length > 1)
    .sort();

  const _exports = filtered.map((item) => {
    return `export { ${item.split("/").join("_")} } from '#src/${item}';`;
  });

  return ["", ..._exports, ""].join("\n");
};
```

The above example takes the directory and exports all items from a top level index file. This is to create an interface file for consumers.

```js
export { comps_login } from "#src/comps/login";
export { comps_profile } from "#src/comps/profile";
export { comps_settings } from "#src/comps/settings";
```

Aggregators will run anytime the path structure of the given directory changes

## Future Features

- Publishable Templates
- Graph analysis
- Consumption graph
- Linting based off of templates
