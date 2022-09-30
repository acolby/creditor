#!/usr/bin/env node
const { Command } = require("commander");
const fuzzy = require("fuzzy-filter");

const package = require("./package.json");
const creditor = require("./src");
const utils_prompt = require("./src/utils/prompt");
const path = require("path");

const program = new Command();

program
  .name("creditor")
  .description("CLI for scaffolding code")
  .version(package.version);

program
  .command("inquire")
  .description("Have the command prop walk you through the running creditor")
  .option("--src <src>", 'location of of your source code (default: "./src")')
  .option("--verbose", "show additional information")
  .option(
    "--repeat",
    "relaunch Creditor after completion (for multiple operations)",
    false
  )
  .action(async (options) => {
    const prompts = _prompts(); // where the answers will be stored
    const answers = {};
    answers["repeat"] = options.repeat;

    do {
      const credInfo = await initCred(options);
      const instance = credInfo[0];
      const analysis = credInfo[1];
      await utils_prompt("action", { prompts, answers, analysis });
      if (answers.action === "create") {
        await instance.create({
          template: answers.template,
          name: answers.mkLoc,
        });
      } else if (answers.action === "move") {
        await instance.move({
          template: answers.template,
          name: answers.mvSrc,
          name_to: answers.mvDest,
        });
      } else if (answers.action === "aggregate") {
        await instance.aggregate({
          template: answers.template,
        });
      } else if (answers.action === "remove") {
        await instance.remove({
          template: answers.template,
          name: answers.delLoc,
        });
      } else if (answers.action === "analyse") {
        await instance.analyse({
          rel_output: answers.anLoc,
        });
      }
      if (answers.repeat)
        console.log("Action complete. Press CTRL + C to exit script");
    } while (options.repeat);
  });

program
  .command("create <destination>")
  .description("Create a template defined in your templates directory")
  .option("--src <src>", 'location of of your source code (default: "./src")')
  .option("--verbose", "show additional information")
  .action(async (location, options) => {
    const instance = creditor({
      rel_src: options.src,
      verbose: options.verbose,
    });
    try {
      await instance.init();
      await instance.create({
        template: location.split(path.sep).filter((item) => item)[0],
        name: location
          .split(path.sep)
          .filter((item) => item)
          .slice(1)
          .join(path.sep),
      });
    } catch (e) {
      console.log("ERROR::", e.message, "--", e.stack.split("\n")[0]);
    }
  });

program
  .command("remove <source>")
  .description("remove a template in your templates directory")
  .option("--src <src>", 'location of of your source code (default: "./src")')
  .option("--verbose", "show additional information")
  .action(async (location, options) => {
    const instance = creditor({
      rel_src: options.src,
      verbose: options.verbose,
    });
    try {
      await instance.init();
      await instance.remove({
        template: location.split(path.sep).filter((item) => item)[0],
        name: location
          .split(path.sep)
          .filter((item) => item)
          .slice(1)
          .join(path.sep),
      });
    } catch (e) {
      console.log("ERROR::", e.message, "--", e.stack.split("\n")[0]);
    }
  });

program
  .command("move <source> <destination>")
  .description(
    "Move (recursively) an template defined in your templates directory"
  )
  .option("--src <src>", 'location of of your source code (default: "./src")')
  .option("--verbose", "show additional information")
  .action(async (source, dest, options) => {
    const instance = creditor({
      rel_src: options.src,
      verbose: options.verbose,
    });
    const template_source = source.split(path.sep).filter((item) => item)[0];
    const template_dest = dest.split(path.sep).filter((item) => item)[0];
    if (template_source !== template_dest) {
      throw new Error(
        `the source template (${template_source}) is different than the destination template (${template_dest})`
      );
    }
    try {
      await instance.init();
      const files = await instance.move({
        template: template_source,
        name: source
          .split(path.sep)
          .filter((item) => item)
          .slice(1)
          .join(path.sep),
        name_to: dest
          .split(path.sep)
          .filter((item) => item)
          .slice(1)
          .join(path.sep),
      });
    } catch (e) {
      console.log("ERROR::", e.message, "--", e.stack.split("\n")[0]);
    }
  });

program
  .command("aggregate <template>")
  .description(
    "Aggregate the items of the given template according the the given aggregators"
  )
  .option("--src <src>", 'location of of your source code (default: "./src")')
  .option("--verbose", "show additional information")
  .action(async (template, options) => {
    const instance = creditor({
      rel_src: options.src,
      verbose: options.verbose,
    });
    try {
      await instance.init();
      const files = await instance.aggregate({
        template,
      });
    } catch (e) {
      console.log("ERROR::", e.message, "--", e.stack.split("\n")[0]);
    }
  });

program
  .command("analyse")
  .description(
    "Create an output object containing an analysis of the pattern usage"
  )
  .option("--src <src>", 'location of of your source code (default: "./src")')
  .option("--verbose", "show additional information")
  .option(
    "--output <output>",
    "location the anaysis will be written to (default: './creditorAnalysis.json'"
  )
  .action(async (options) => {
    const instance = creditor({
      rel_src: options.src,
      verbose: options.verbose,
    });
    try {
      await instance.init();
      const package = instance.analyse({
        rel_output: options.output || false,
      });
      return package;
    } catch (e) {
      console.log("ERROR::", e.message, "--", e.stack.split("\n")[0]);
    }
  });

program.parse();

function _prompts() {
  return {
    action: (params) => {
      const { answers, promps, analysis } = params;
      return {
        type: "list",
        name: "action",
        message: "What action would you like to perform?",
        choices: ["create", "move", "aggregate", "analyse", "remove", "leave"],
        nextPrompt() {
          if (
            answers.action === "create" ||
            answers.action === "move" ||
            answers.action === "aggregate" ||
            answers.action === "remove"
          )
            return "template";
          if (answers.action === "analyse") return "anLoc";
        },
      };
    },
    template: (params) => {
      const { answers, promps, analysis } = params;
      return {
        type: "list",
        name: "template",
        message: `What template would you like to ${answers.action}?`,
        choices: Object.keys(analysis.templates),
        nextPrompt() {
          if (answers.action === "create") return "mkLoc";
          if (answers.action === "move") return "mvSrc";
          if (answers.action === "remove") return "delLoc";
        },
      };
    },
    mkLoc: (params) => {
      const { answers, promps, analysis } = params;
      return {
        type: "autocomplete",
        name: "mkLoc",
        suggestOnly: true,
        message: `Where would you like to put the new "${
          answers.template
        }" within ${path.sep + answers.template + path.sep}?`,
        source: async (_, input) => {
          return Promise.resolve(
            _fuzzySearchPath(input, answers.template, analysis)
          );
        },
        validate: (input) => {
          if (!input) return "This question is required";
          input = path.normalize(input);
          if (_isValidDir(input))
            return `${input} is not a valid directory of form some${path.sep}nested${path.sep}directory`;
          if (input === path.sep)
            return `Template can not be created at the top of the ${
              path.sep + answers.template
            } directory`;
          if (
            analysis.package.uses[
              path.normalize(answers.template + path.sep + input)
            ]
          )
            return `${path.normalize(input)} already exists within ${
              path.sep + answers.template + path.sep
            }`;
          return true;
        },
        nextPrompt() {},
      };
    },
    anLoc: (params) => {
      const { answers, promps, analysis } = params;
      return {
        type: "input",
        name: "anLoc",
        message: `Where would you like to output the analysis? (default: ./graph.json)`,
        source: async (_, input) => {
          return input || "";
        },
        validate: (input) => {
          if (!_isValidRel(input))
            return `${input} is not a valid directory of form .${path.sep}filename.json`;

          return true;
        },
        nextPrompt() {},
      };
    },
    delLoc: (params) => {
      const { answers, promps, analysis } = params;
      return {
        type: "autocomplete",
        name: "delLoc",
        suggestOnly: true,
        message: `What ${answers.template} would you like to remove within ${
          path.sep + answers.template + path.sep
        }?`,
        source: async (_, input) => {
          return Promise.resolve(
            _fuzzySearchPath(input, answers.template, analysis)
          );
        },
        validate: (input) => {
          if (!input) return "This question is required";
          input = path.normalize(input);
          const loc = path.normalize(answers.template + path.sep + input);
          if (_isValidDir(input))
            return `${input} is not a valid directory of form some${path.sep}nested${path.sep}directory`;

          if (!analysis.package.uses[loc]) {
            return `${path.normalize(
              answers.template + path.sep + input
            )} does not exist in ${answers.template}`;
          }
          if (_isValidDir(input))
            return `${input} is not a valid directory of form some${path.sep}nested${path.sep}directory`;
          if (input === path.sep)
            return `Cannot remove the root of ${
              path.sep + answers.template
            } directory`;
          if (Object.keys(analysis.package.usedBy[loc] || {}).length > 0)
            return `${path.normalize(input)} is being used by ${Object.keys(
              analysis.package.usedBy[loc]
            )}`;
          return true;
        },
        nextPrompt() {},
      };
    },
    mvSrc: (params) => {
      const { answers, promps, analysis } = params;
      return {
        type: "autocomplete",
        name: "mvSrc",
        suggestOnly: true,
        message: `What directory would you like to move?`,
        source: async (_, input) => {
          return Promise.resolve(
            _fuzzySearchPath(input, answers.template, analysis)
          );
        },
        validate: (input) => {
          if (!input) return "This question is required";
          input = path.normalize(input);
          if (_isValidDir(input))
            return `${input} is not a valid directory of form some${path.sep}nested${path.sep}directory`;
          if (input === path.sep)
            return `You may not not move the root ${
              path.sep + answers.template
            } directory`;
          if (
            !_itemExistsIn(
              analysis.package.usesObj[answers.template],
              input.split(path.sep)
            )
          )
            if (typeof match === "undefined")
              return `${path.normalize(input)} is not an existing directory`;
          return true;
        },
        nextPrompt() {
          return "mvDest";
        },
      };
    },
    mvDest: (params) => {
      const { answers, promps, analysis } = params;
      return {
        type: "autocomplete",
        name: "mvDest",
        suggestOnly: true,
        message: `Where would you like to move this directory?`,
        source: async (_, input) => {
          return Promise.resolve(
            _fuzzySearchPath(input, answers.template, analysis)
          );
        },
        validate: (input) => {
          if (!input) return "This question is required";
          if (_isValidDir(input))
            return `${input} is not a valid directory of form some${path.sep}nested${path.sep}directory`;
          return true;
        },
        nextPrompt() {},
      };
    },
  };
}

async function initCred(options) {
  const instance = creditor({
    rel_src: options.src,
    verbose: options.verbose,
  });
  await instance.init();
  const analysis = {
    templates: instance.options.templates,
    package: instance.options.package,
  };
  return [instance, analysis];
}

// TODO _fuzzySearchPath for empty path
function _fuzzySearchPath(input, template, analysis) {
  const sanitized = `${input || ""}`
    .replace(/[^(a-zA-Z)/|\\]/g, "")
    .replace(/\/{2,}|\\{3,}/g, path.sep);
  // default uses by is template
  let usesBy = analysis.package.usesObj[template] || {};

  const segments = path.normalize(sanitized).split(path.sep).slice(0, -1);
  segments.forEach((item) => {
    usesBy = usesBy[item] || {};
  });

  const prefix = segments.join(path.sep);
  const suggestions = Object.keys(usesBy || {}).map(
    (item) => `${prefix}${(prefix && path.sep) || ""}${item + path.sep}`
  );

  const results = (
    (sanitized && fuzzy(path.normalize(sanitized) || "", suggestions || [])) ||
    suggestions ||
    []
  ).sort((a, b) => {
    return a.length - b.length;
  });
  return [sanitized, ...results];
}

function _itemExistsIn(structure = {}, items = []) {
  const first = items[0];
  const substructure = structure[first];
  if (items.length <= 1) {
    return !!substructure;
  }
  if (!substructure) return false;
  return _itemExistsIn(substructure, items.slice(1));
}

function _isValidDir(input) {
  return (
    input !==
    `${input || ""}`
      .replace(/[^(a-zA-Z)/|\\]/g, "")
      .replace(/\/{2,}|\\{3,}/g, path.sep)
      .split(path.sep)
      .filter((item) => item)
      .join(path.sep)
  );
}

function _isValidRel(input = "") {
  const extn = input.split(".").slice(-1) && input.split(".").slice(-1)[0];
  return input.indexOf(`.${path.sep}`) === 0 && extn === "json";
}
