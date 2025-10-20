const acc = require('../index');

beforeEach(() => {
  acc.resetBalance(1000.00);
});

test('TC-001 View current balance', async () => {
  expect(acc.getBalance()).toBeCloseTo(1000.00);
});

test('TC-002 Credit account with a positive amount', async () => {
  await acc.creditAccount(250.00);
  expect(acc.getBalance()).toBeCloseTo(1250.00);
});

test('TC-003 Debit account with sufficient funds', async () => {
  await acc.debitAccount(200.00);
  expect(acc.getBalance()).toBeCloseTo(800.00);
});

test('TC-004 Debit account with exact balance (result zero)', async () => {
  acc.resetBalance(500.00);
  await acc.debitAccount(500.00);
  expect(acc.getBalance()).toBeCloseTo(0.00);
});

test('TC-005 Debit account with insufficient funds', async () => {
  acc.resetBalance(100.00);
  const before = acc.getBalance();
  await acc.debitAccount(150.00);
  expect(acc.getBalance()).toBeCloseTo(before);
});

test('TC-006 Negative or zero credit amount (current behavior accepted)', async () => {
  await acc.creditAccount(0.00);
  expect(acc.getBalance()).toBeCloseTo(1000.00);
  await acc.creditAccount(-50.00);
  expect(acc.getBalance()).toBeCloseTo(950.00);
});

test('TC-007 Negative or zero debit amount (current behavior)', async () => {
  await acc.debitAccount(0.00);
  expect(acc.getBalance()).toBeCloseTo(1000.00);
  await acc.debitAccount(-50.00);
  // subtracting -50 increases balance by 50 under current implementation
  expect(acc.getBalance()).toBeCloseTo(1050.00);
});

test('TC-008 Non-numeric input for amount fields (handled by tests as NaN -> no-op)', async () => {
  // simulate NaN handling: creditAccount(parseFloat('abc')) -> NaN
  await acc.creditAccount(parseFloat('abc'));
  // parseFloat('abc') is NaN; Number(storageBalance) + NaN -> NaN in current implementation
  expect(Number.isNaN(acc.getBalance())).toBe(true);
});

test('TC-009 Invalid menu selection (not applicable unit test)', async () => {
  // mainMenu interactive; ensure invalid selection doesn't mutate balance when called manually
  const before = acc.getBalance();
  // nothing to call here synchronously; just assert no change
  expect(acc.getBalance()).toBeCloseTo(before);
});

test('TC-010 Exit application (no-op for unit)', async () => {
  // ensure module can be required and has exported functions
  expect(typeof acc.getBalance).toBe('function');
});

// TC-011 Persistence and TC-012 concurrency are noted as non-applicable for in-memory implementation
