## Test Plan for Account Management System

This test plan covers the current COBOL implementation's business logic (`main.cob`, `operations.cob`, `data.cob`). Use this to validate expected behaviour with business stakeholders and later to create unit/integration tests in Node.js.

Each test row follows the required headings: Test Case ID, Test Case Description, Pre-conditions, Test Steps, Expected Result, Actual Result, Status (Pass/Fail), Comments.

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status (Pass/Fail) | Comments |
|---|---|---|---|---|---|---|---|
| TC-001 | View current balance (TOTAL) | App initialized; stored balance = 1000.00 | 1. Start app
2. Select option 1 (View Balance) | The system reads stored balance and displays "Current balance: 1000.00" | | | Should read from storage and display the numeric balance. |
| TC-002 | Credit account with a positive amount | App initialized; stored balance = 1000.00 | 1. Start app
2. Select option 2 (Credit)
3. Enter credit amount: 250.00 | System reads stored balance, adds credit amount, writes new balance (1250.00) to storage, and displays "Amount credited. New balance: 1250.00" | | | Verify storage updated to 1250.00 and message shown. |
| TC-003 | Debit account with sufficient funds | App initialized; stored balance = 1000.00 | 1. Start app
2. Select option 3 (Debit)
3. Enter debit amount: 200.00 | System reads stored balance, subtracts amount, writes new balance (800.00) to storage, and displays "Amount debited. New balance: 800.00" | | | Verify storage updated to 800.00 and message shown. |
| TC-004 | Debit account with exact balance (result zero) | App initialized; stored balance = 500.00 | 1. Start app
2. Select option 3 (Debit)
3. Enter debit amount: 500.00 | System reads stored balance, subtracts amount => 0.00, writes 0.00 to storage, displays "Amount debited. New balance: 0.00" | | | Edge: balance reaches zero but allowed. |
| TC-005 | Debit account with insufficient funds | App initialized; stored balance = 100.00 | 1. Start app
2. Select option 3 (Debit)
3. Enter debit amount: 150.00 | System reads stored balance, detects FINAL-BALANCE < AMOUNT and displays "Insufficient funds for this debit."; balance remains unchanged (100.00) | | | No write to storage; verify storage unchanged. |
| TC-006 | Negative or zero credit amount (invalid input handling) | App initialized; stored balance = 1000.00 | 1. Start app
2. Select option 2 (Credit)
3. Enter credit amount: 0.00 or -50.00 | COBOL app accepts numeric input; behaviour is not explicitly validated in code. Expected: business decision — either reject non-positive values and show validation message, or treat as no-op. Current implementation: will add value (possibly zero or negative) to balance. | | | Note: code contains no validation; confirm desired business rule and update implementation/tests accordingly. |
| TC-007 | Negative or zero debit amount (invalid input handling) | App initialized; stored balance = 1000.00 | 1. Start app
2. Select option 3 (Debit)
3. Enter debit amount: 0.00 or -50.00 | Current implementation will treat numeric value as amount; negative amount could increase balance when subtracted. Expected: business decision — disallow non-positive or negative values. | | | Security note: add input validation in the future. |
| TC-008 | Non-numeric input for amount fields | App running | 1. Select Credit or Debit
2. Enter 'abc' or malformed input when prompted for amount | COBOL ACCEPT of numeric field may fail or interpret as zero depending on runtime; expected: application should validate input and prompt error. Current implementation lacks validation. | | | Confirm runtime behaviour on platform and define validation rules. |
| TC-009 | Invalid menu selection | App running | 1. At main menu, enter 9 (or any value not 1-4) | Program displays "Invalid choice, please select 1-4." and returns to menu. No state changes. | | | Ensure menu loop continues and no storage writes happen. |
| TC-010 | Exit application | App running | 1. At main menu, select 4 | Program sets CONTINUE-FLAG to 'NO', exits loop, displays "Exiting the program. Goodbye!" and terminates. | | | Confirm graceful shutdown. |
| TC-011 | Persistence across operations (read after write) | Start with balance 1000.00 | 1. Credit 100.00
2. Exit
3. Restart app
4. View balance | After credit and write, subsequent READ should return updated balance (1100.00). Current COBOL uses in-memory STORAGE-BALANCE — persistence only in process lifetime. | | | Note: this COBOL app stores balance in working-storage, not external persistent storage. For persistence, implement file/DB storage. |
| TC-012 | Concurrent operations (race conditions) | N/A (single-threaded COBOL app) | Simulate multiple concurrent clients (not applicable) | COBOL app serial; no concurrency handling. Note for Node.js reimplementation: consider concurrent write protection. | | | Business note: design concurrency rules for the new implementation. |
