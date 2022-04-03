const inquirer = require("inquirer");

inquirer.registerPrompt(
  "autocomplete",
  require("#src/utils/inquiererAutoComplete/index.js")
);

async function utils_prompt(toPrompt = "xxxxx", params) {
  const { answers, prompts, analysis } = params;
  const prompter = prompts[toPrompt];

  await inquirer.prompt(prompter(params)).then((_answers) => {
    answers[toPrompt] = _answers[toPrompt];
  });
  const nextToPrompt =
    (prompter(params).nextPrompt && prompter(params).nextPrompt()) || "";
  if (nextToPrompt) {
    await utils_prompt(nextToPrompt, params);
  }
  return;
}

module.exports = utils_prompt;
