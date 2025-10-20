#!/usr/bin/env node
// Node.js port of the COBOL Account Management System

// Prompt will be initialized lazily to avoid loading ESM-only inquirer at module
// require time (which breaks Jest). We'll dynamically import inquirer inside
// mainMenu when running the interactive CLI.
let prompt = null;

// In-memory storage to mirror COBOL WORKING-STORAGE STORAGE-BALANCE
let storageBalance = 1000.00;

// Exported helpers for testing
function getBalance() {
  return Number(storageBalance);
}

function resetBalance(v = 1000.00) {
  storageBalance = Number(v);
}

function formatAmount(n) {
  return Number(n).toFixed(2);
}

async function viewBalance() {
  console.log(`Current balance: ${formatAmount(storageBalance)}`);
}

async function creditAccount(amount) {
  storageBalance = Number(storageBalance) + Number(amount);
  console.log(`Amount credited. New balance: ${formatAmount(storageBalance)}`);
}

async function debitAccount(amount) {
  if (Number(storageBalance) >= Number(amount)) {
    storageBalance = Number(storageBalance) - Number(amount);
    console.log(`Amount debited. New balance: ${formatAmount(storageBalance)}`);
  } else {
    console.log('Insufficient funds for this debit.');
  }
}

async function mainMenu(ciActions) {
  let continueFlag = true;

  while (continueFlag) {
    console.log('--------------------------------');
    console.log('Account Management System');
    console.log('1. View Balance');
    console.log('2. Credit Account');
    console.log('3. Debit Account');
    console.log('4. Exit');
    console.log('--------------------------------');

    let choice;

    if (ciActions && ciActions.length) {
      choice = ciActions.shift();
      console.log(`(CI) Selected: ${choice}`);
      } else {
      if (!prompt) {
        // load inquirer dynamically
        const inquirer = await import('inquirer');
        if (typeof inquirer.prompt === 'function') {
          prompt = inquirer.prompt.bind(inquirer);
        } else if (typeof inquirer.createPromptModule === 'function') {
          prompt = inquirer.createPromptModule();
        } else {
          throw new Error('inquirer prompt API not found.');
        }
      }

      const ans = await prompt({
        type: 'input',
        name: 'choice',
        message: 'Enter your choice (1-4): '
      });
      choice = ans.choice;
    }

    switch (String(choice)) {
      case '1':
        await viewBalance();
        break;
      case '2': {
        let amount;
        if (ciActions && ciActions.length) {
          amount = ciActions.shift();
          console.log(`(CI) Enter credit amount: ${amount}`);
          } else {
            if (!prompt) {
              const inquirer = await import('inquirer');
              if (typeof inquirer.prompt === 'function') {
                prompt = inquirer.prompt.bind(inquirer);
              } else if (typeof inquirer.createPromptModule === 'function') {
                prompt = inquirer.createPromptModule();
              } else {
                throw new Error('inquirer prompt API not found.');
              }
            }
            const a = await prompt({ type: 'input', name: 'amt', message: 'Enter credit amount: ' });
            amount = a.amt;
          }
        await creditAccount(parseFloat(amount));
        break;
      }
      case '3': {
        let amount;
        if (ciActions && ciActions.length) {
          amount = ciActions.shift();
          console.log(`(CI) Enter debit amount: ${amount}`);
          } else {
            if (!prompt) {
              const inquirer = await import('inquirer');
              if (typeof inquirer.prompt === 'function') {
                prompt = inquirer.prompt.bind(inquirer);
              } else if (typeof inquirer.createPromptModule === 'function') {
                prompt = inquirer.createPromptModule();
              } else {
                throw new Error('inquirer prompt API not found.');
              }
            }
            const a = await prompt({ type: 'input', name: 'amt', message: 'Enter debit amount: ' });
            amount = a.amt;
          }
        await debitAccount(parseFloat(amount));
        break;
      }
      case '4':
        continueFlag = false;
        break;
      default:
        console.log('Invalid choice, please select 1-4.');
    }
  }

  console.log('Exiting the program. Goodbye!');
}

// CI helper: parse args --ci-test followed by sequence like: 1 2 100 3 50 4
async function run() {
  const args = process.argv.slice(2);
  if (args[0] === '--ci-test') {
    const ciActions = args.slice(1);
    await mainMenu(ciActions);
    return;
  }

  await mainMenu();
}

if (require.main === module) {
  run();
}

module.exports = {
  viewBalance,
  creditAccount,
  debitAccount,
  getBalance,
  resetBalance,
  // expose mainMenu for integration-style tests
  mainMenu,
};
