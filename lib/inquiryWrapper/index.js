const inquirer = require('inquirer');
const readline = require('readline');

module.exports = async (questions, answers = {}, questionRenderer, stateRenderer, size, toAsk = []) => {

  let cancelQuestion = () => {};
  process.stdin.on('keypress', (str, key) => {
    if (key.ctrl && key.name === 'b') {
      cancelQuestion();
    }
  });

  const renderState = await renderPadding(size, answers, toAsk, stateRenderer);

  async function ask() {
    const nextQuestion = questionRenderer(answers);
    if (nextQuestion) toAsk.push(nextQuestion);
    if (!nextQuestion) return;

    const answer = await askSingle(questions[toAsk[toAsk.length - 1]]());

    if (!answer) {
      toAsk.pop();
      const popped = toAsk.pop();
      answers[popped] = null;
    }

    return ask();
  }


  async function askSingle(question) {

    await renderState();

    await _colorBug(question, renderState);
   
    const obj = await new Promise((resolve) => {
      const prompt = inquirer.prompt([question]);

      prompt.then((val) => {
        cancelQuestion = () => {};
        resolve(val);
      });

      cancelQuestion = () => {
        prompt.ui.close();
        cancelQuestion = () => {};
        resolve(null);
      };
    });


    if (obj) {
      const answer = (question.transformer || (item => item))(obj[question.name]);
      answers[question.name] = (question.transformer || (item => item))(obj[question.name]);
      await renderState();
      return answer;
    }

    return false;
  }
    
  let colorBug = false;
  async function _colorBug(question, renderState) {
    // Anoying bug where the state renders imporperly on first render so this simply renders a question and the removes it
    if (!colorBug) {
      await new Promise((resolve) => {
        const prompt = inquirer.prompt([question]);
        prompt.then(() => {});
        setTimeout(() => {
          prompt.ui.close();
          resolve();
        });
        colorBug = true;
      });
      await renderState();
    }
  }

  return ask;
};

async function renderPadding(size, data, questions, stateRenderer) {

  let padding = '';
  while (padding.length < size) padding += '\n';
  console.log(padding);
  readline.moveCursor(process.stdout, 0, -size);
  await new Promise(resolve => setTimeout(resolve));

  const position = { y: 0, x: 0 };

  return () => {
    readline.cursorTo(process.stdout, 0, position.y);
    readline.clearLine();
    readline.clearScreenDown(process.stdout, () => {});
    readline.cursorTo(process.stdout, 0, position.y);
    process.stdout.write(stateRenderer(data, questions));
  };

}
