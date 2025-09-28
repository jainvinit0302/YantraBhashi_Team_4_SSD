# Native Javascript implementation
- Part 1 of the YantraBhasha problem is to build a single-page validator web application using Native JavaScript. The app takes YantraBhasha code as input, validates it for correct syntax and semantic rules, and displays clear feedback for errors and warnings in a friendly UI interface. The implementation includes HTML, CSS, and JavaScript code for the validator engine, interpreter, and front-end behavior.
## Features and Requirements

### YantraBhasha Language Support:

- Supports only variable declarations with PADAM and ANKHE, conditionals using ELAITHE and ALAITHE, and loops with MALLI-MALLI, all using the proper square bracket structure.

- Enforces strict variable declaration before use and checks for integer-only operations (no strings, floats, or booleans except those explicitly allowed).

- Handles input (CHEPPU) and output (CHATIMPU) statements.

### Validation Logic:

- Detects missing semicolons, undeclared/mistyped variables, type mismatches, malformed loops or conditionals, bracket errors, and unrecognized syntax.

- Syntactic and semantic errors are shown with line numbers and descriptive messages for student self-correction.

- Automated test suite runs six validation cases to check for common issues.

### Interface and UX:
- Code editor, run button, output/validation display with stats (errors, warnings, line count), and sample code dropdown (examples for Hello World, Addition, Loop, Conditional).
- Output panel with tabs for validation messages, variable states, and console outputs from interpreted code.

- Responsive design and syntax highlighting for code readability.

### Source Files

- index.html: Main structure for editor and output panel.

- style.css: Styles for layout, panels, error/highlighting, stats bar, drodown.

- app.js: Manages UI events, runs validation and interpreter on button click, displays stats, errors, and handles sample dropdown.

- validator.js: Implements YantraBhasha syntax/semantic checks, bracket matching, error messaging, and code validation pipeline.

- interpretor.js: Executes YantraBhasha code for console output using declared variables and logic, supporting input/output operations.

### Run:
- Open the index.html