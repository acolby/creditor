const path = require("path");
const utils_slash = require("#src/utils/slash/index.js");

const utils_loadTemplates = require("#src/utils/loadTemplates/index.js");
const utils_loadAggregators = require("#src/utils/loadAggregators/index.js");
const utils_analyzeSrc = require("#src/utils/analyzeSrc/index.js");

const actions_create = require("#src/actions/create/index.js");
const actions_move = require("#src/actions/move/index.js");
const actions_aggregate = require("#src/actions/aggregate/index.js");
const actions_analyse = require("#src/actions/analyse/index.js");

const fs_commitFileObject = require("#src/fs/commitFileObject/index.js");

const defaults = {
  path_base: utils_slash(process.cwd()), // location of package json

  // OPTIONAL
  rel_templates: "/creditor/templates", // default
  rel_aggregators: "/creditor/aggregators", // default
  rel_src: "/src",
};

function creditor(given = {}) {
  const options = { ...defaults };

  // apply overrides
  options.path_base = given.path_base || options.path_base;
  options.rel_src = given.rel_src || options.rel_src;
  options.rel_templates = given.rel_templates || options.rel_templates;
  options.rel_aggregators = given.rel_aggregators || options.rel_aggregators;
  options.verbose = given.verbose || options.verbose;

  let isInit = false;

  async function init() {
    // load templates
    options.path_src = utils_slash(
      path.join(options.path_base, options.rel_src)
    );
    options.path_templates = utils_slash(
      path.join(options.path_base, options.rel_templates)
    );
    options.path_aggregators = utils_slash(
      path.join(options.path_base, options.rel_aggregators)
    );
    options.templates = utils_loadTemplates(options);
    options.aggregators = utils_loadAggregators(options);
    options.package = await utils_analyzeSrc(options);

    isInit = true;
    return options;
  }
  async function analyse({ rel_output }) {
    const { files, analyse } = await actions_analyse(options, { rel_output });
    await fs_commitFileObject({
      toCreate: files,
      path_base: process.cwd(),
      rel_base: "",
      verbose: options.verbose,
    });
    return { files, analyse };
  }
  async function aggregate({ template }) {
    if (!template) {
      throw new Error("a template name was not specified");
    }
    if (!options.aggregators[template]) {
      throw new Error(
        `the template "${template}" is not defined in the aggregators dir`
      );
    }
    const { files } = await actions_aggregate(options, { template });

    await fs_commitFileObject({
      toCreate: files,
      path_base: options.path_src,
      rel_base: options.rel_src,
      verbose: options.verbose,
    });
    return { files };
  }
  async function create({ template, name }) {
    if (!template) {
      throw new Error("a template name was not specificed");
    }
    if (!options.templates[template]) {
      throw new Error(
        `the template "${template}" is not defined in the templates dir`
      );
    }
    if (!name) {
      throw new Error("the location was not specified");
    }
    if (options.package.uses[`${template}/${name}`]) {
      throw new Error(
        `the item (${template}/${name}) you are trying to render already exists `
      );
    }
    const { files } = await actions_create(options, { template, name });
    await fs_commitFileObject({
      toCreate: files,
      path_base: options.path_src,
      rel_base: options.rel_src,
      verbose: options.verbose,
    });

    options.package = await utils_analyzeSrc(options);
    const aggregated = await actions_aggregate(options, { template });
    await fs_commitFileObject({
      toUpdate: aggregated.files,
      path_base: options.path_src,
      rel_base: options.rel_src,
      verbose: options.verbose,
    });

    return { files };
  }
  async function move({ template, name, name_to }) {
    if (!template) {
      throw new Error("a template name was not specified");
    }
    if (!options.templates[template]) {
      throw new Error(
        `the template "${template}" is not defined in the templates dir`
      );
    }
    if (!name) {
      throw new Error("the source location was not specified");
    }
    if (!name_to) {
      throw new Error("the destination location was not specified");
    }
    const { files, templates } = await actions_move(options, {
      template,
      name,
      name_to,
    });

    // check if any of the files being created already correspond to an existing file pattern
    Object.keys(files.toCreate || {}).forEach((filePath) => {
      const usage = filePath.split("/").slice(0, -1).join("/");
      if (options.package.uses[usage]) {
        throw new Error(`creating ${filePath} results in a collision`);
      }
    });
    await fs_commitFileObject({
      ...templates,
      path_base: options.path_templates,
      rel_base: options.rel_templates,
      verbose: options.verbose,
    });
    await fs_commitFileObject({
      ...files,
      path_base: options.path_src,
      rel_base: options.rel_src,
      verbose: options.verbose,
    });

    options.package = await utils_analyzeSrc(options);
    const aggregated = await actions_aggregate(options, { template });
    await fs_commitFileObject({
      toUpdate: aggregated.files,
      path_base: options.path_src,
      rel_base: options.rel_src,
      verbose: options.verbose,
    });

    return { files, templates };
  }

  return {
    init,
    move,
    create,
    aggregate,
    analyse,
    options: options,
  };
}

module.exports = creditor;
