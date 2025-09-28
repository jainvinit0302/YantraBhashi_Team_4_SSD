class YantraBhashiValidator {
  constructor() {
    this.variables = new Map();
    this.errors = [];
    this.reservedWords = [
      // Add your reserved words here if any
    ];
    this.DATA_TYPES = ['ANKHE', 'VARTTAI'];
    this.scopeStack = [new Map()];
    this.bracketStack = [];
  }

  preprocessCode(code) {
    const pipeFormatted = this.jsonToPipeSeparatedString(code);
    return this.tokenize(pipeFormatted, '|')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('#'))
      .map(line => line.replace(/^\d+\.\s*/, ''));
  }

  jsonToPipeSeparatedString(programText) {
    if (typeof programText !== 'string' || programText.length === 0) {
      return "";
    }
    return programText.replace(/\n/g, '|');
  }

  tokenize(input, del) {
    let token = [];
    let left = 0;
    let right = 0;
    while (left < input.length) {
      if (left == right && input[left] == del) {
        left++;
        continue;
      }
      right = left + 1;
      while (right < input.length && input[right] != del) {
        right++;
      }
      token.push(input.substring(left, right));
      left = right;
    }
    return token;
  }

  validate(code) {
    this.variables.clear();
    this.errors = [];
    this.scopeStack = [new Map()];
    this.bracketStack = [];

    const lines = this.preprocessCode(code);
    let flag = true;

    for (let i = 0; i < lines.length; i++) {
      let result = this.ece_cmd(lines[i].trim());
      if (result.status !== "next") {
        this.addError(i + 1, result.error);
        flag = false;
      }
    }

    if (flag && this.bracketStack.length !== 0) {
      this.addError(-1, "Unclosed block. Missing one or more ']' characters.");
      flag = false;
    }

    return {
      isValid: this.errors.length === 0,
      errors: this.errors,
    };
  }

  enterScope() {
    this.scopeStack.push(new Map());
  }

  exitScope() {
    if (this.scopeStack.length > 1) {
      this.scopeStack.pop();
    }
  }

  declare(variableName, info) {
    const currentScope = this.scopeStack[this.scopeStack.length - 1];
    if (currentScope.has(variableName)) {
      return { success: false, error: `Semantic Error: Variable '${variableName}' has already been declared in this scope.` };
    }
    currentScope.set(variableName, info);
    return { success: true };
  }

  lookup(variableName) {
    for (let i = this.scopeStack.length - 1; i >= 0; i--) {
      if (this.scopeStack[i].has(variableName)) {
        return this.scopeStack[i].get(variableName);
      }
    }
    return null;
  }

  hasSemicolon(line) {
    if (typeof line !== 'string') {
      return false;
    }
    return line.trim().endsWith(';');
  }

  getExpressionType(expression) {
    const trimmedExpr = expression.trim();
    if (/^\d+$/.test(trimmedExpr)) return { success: true, type: 'ANKHE' };
    if (/^"[^"]*"?$/.test(trimmedExpr)) return { success: true, type: 'VARTTAI' };
    const variableInfo = this.lookup(trimmedExpr);
    if (variableInfo) return { success: true, type: variableInfo.type };
    return { success: false, error: `Semantic Error: Variable '${trimmedExpr}' was used before it was declared.` };
  }

  validatePadam(line) {
    const trimmedLine = line.trim();
    if (!trimmedLine.startsWith('PADAM ')) {
      return { status: 'NOT_PADAM' };
    }
    const padamRegex = /^\s*PADAM\s+(?<variable>[a-zA-Z_]\w*)\s*:\s*(?<type>ANKHE|VARTTAI)(?:\s*=\s*(?<value>\d+|"[^"]*"))?\s*;\s*$/;
    const match = trimmedLine.match(padamRegex);
    if (!match) {
      if (!this.hasSemicolon(line)) {
        return { status: 'INVALID_SYNTAX', error: "Missing semicolon (;) at the end of the PADAM statement." };
      }
      return { status: 'INVALID_SYNTAX', error: "Syntax error in PADAM declaration." };
    }
    const { variable, type, value } = match.groups;
    if (value !== undefined) {
      const isStringValue = value.startsWith('"');
      if (type === 'ANKHE' && isStringValue) {
        return { status: 'SEMANTIC_ERROR', error: `Type Mismatch: Cannot assign a VARTTAI (string) to an ANKHE (integer) variable '${variable}'.` };
      }
      if (type === 'VARTTAI' && !isStringValue) {
        return { status: 'SEMANTIC_ERROR', error: `Type Mismatch: Cannot assign an ANKHE (integer) to a VARTTAI (string) variable '${variable}'.` };
      }
      return { status: 'VALID', type: 'initialization', data: { variable, type, value } };
    } else {
      return { status: 'VALID', type: 'declaration', data: { variable, type, value: undefined } };
    }
  }

  validateCheppu(line) {
    const trimmedLine = line.trim();
    if (!trimmedLine.startsWith('CHEPPU')) {
      return { status: 'NOT_CHEPPU' };
    }
    const cheppuRegex = /^\s*CHEPPU\s*\(\s*(?<variable>[a-zA-Z_]\w*)\s*\)\s*;\s*$/;
    const match = trimmedLine.match(cheppuRegex);
    if (!match) {
      if (!this.hasSemicolon(line)) {
        return { status: 'INVALID_SYNTAX', error: "Missing semicolon (;) at the end of the CHEPPU statement." };
      }
      return { status: 'INVALID_SYNTAX', error: "Syntax error in CHEPPU statement. Expected format: CHEPPU(variable);" };
    }
    const { variable } = match.groups;
    const variableInfo = this.lookup(variable);
    if (variableInfo === null) {
      return { status: 'SEMANTIC_ERROR', error: `Undeclared Variable: Cannot get input for '${variable}' because it has not been declared.` };
    }
    return { status: 'VALID', data: { command: 'CHEPPU', variable: variable } };
  }

  validateAssignment(line) {
    const trimmedLine = line.trim();
    if (!/(?<![=<>!])=(?![=])/.test(trimmedLine)) {
      return { status: 'NOT_ASSIGNMENT' };
    }
    const assignRegex = /^\s*(?<lhsVar>[a-zA-Z_]\w*)\s*=\s*(?<rhsExpr>.*);\s*$/;
    const match = trimmedLine.match(assignRegex);
    if (!match) {
      if (!this.hasSemicolon(line)) {
        return { status: 'INVALID_SYNTAX', error: "Missing semicolon (;) at the end of the assignment statement." };
      }
      return { status: 'INVALID_SYNTAX', error: "Invalid syntax for assignment statement." };
    }
    const { lhsVar, rhsExpr } = match.groups;
    const lhsInfo = this.lookup(lhsVar);
    if (!lhsInfo) {
      return { status: 'SEMANTIC_ERROR', error: `Undeclared variable '${lhsVar}' used in assignment.` };
    }
    let rhsType;
    const operators = ['+', '-', '*', '/'];
    const foundOperator = operators.find(op => rhsExpr.includes(op));
    if (foundOperator) {
      const parts = rhsExpr.split(foundOperator);
      if (parts.length !== 2) {
        return { status: 'INVALID_SYNTAX', error: 'Malformed expression. Only simple binary operations are supported.' };
      }
      const leftResult = this.getExpressionType(parts[0]);
      const rightResult = this.getExpressionType(parts[1]);
      if (!leftResult.success) return { status: 'SEMANTIC_ERROR', error: leftResult.error };
      if (!rightResult.success) return { status: 'SEMANTIC_ERROR', error: rightResult.error };
      if (leftResult.type === 'ANKHE' && rightResult.type === 'ANKHE') {
        rhsType = 'ANKHE';
      } else {
        return { status: 'SEMANTIC_ERROR', error: `Type Mismatch: Operator '${foundOperator}' can only be used between two ANKHE types.` };
      }
    } else {
      const result = this.getExpressionType(rhsExpr);
      if (!result.success) return { status: 'SEMANTIC_ERROR', error: result.error };
      rhsType = result.type;
    }
    if (lhsInfo.type !== rhsType) {
      return { status: 'SEMANTIC_ERROR', error: `Type Mismatch: Cannot assign a value of type ${rhsType} to variable '${lhsVar}' of type ${lhsInfo.type}.` };
    }
    return { status: 'VALID' };
  }

  validateChatimpu(line) {
    const trimmedLine = line.trim();
    if (!trimmedLine.startsWith('CHATIMPU')) {
      return { status: 'NOT_CHATIMPU' };
    }
    const chatimpuRegex = /^\s*CHATIMPU\s*\(\s*(?<argument>"(?:\\.|[^"\\])*"|[a-zA-Z_]\w*)\s*\)\s*;\s*$/;
    const match = trimmedLine.match(chatimpuRegex);
    if (!match) {
      if (!this.hasSemicolon(line)) {
        return { status: 'INVALID_SYNTAX', error: "Missing semicolon (;) at the end of the CHATIMPU statement." };
      }
      return { status: 'INVALID_SYNTAX', error: "Syntax error in CHATIMPU. Expected format: CHATIMPU(variable_or_literal);" };
    }
    const { argument } = match.groups;
    if (argument.startsWith('"')) {
      return { status: 'VALID', data: { type: 'literal', value: argument } };
    } else {
      if (this.lookup(argument) === null) {
        return { status: 'SEMANTIC_ERROR', error: `Undeclared Variable: Cannot print '${argument}' because it has not been declared.` };
      }
      return { status: 'VALID', data: { type: 'variable', name: argument } };
    }
  }

  validateElaitheHeader(line) {
    const trimmedLine = line.trim();
    if (!trimmedLine.startsWith('ELAITHE')) {
      return { status: 'NOT_ELAITHE' };
    }
    const headerRegex = /^\s*ELAITHE\s*\(\s*(?<operand1>\S+)\s*(?<operator>==|!=|<=|>=|<|>)\s*(?<operand2>\S+)\s*\)\s*\[\s*$/;
    const match = trimmedLine.match(headerRegex);
    if (!match) {
      return { status: 'INVALID_SYNTAX', error: "Syntax error in ELAITHE header. Expected: ELAITHE (value operator value) [" };
    }
    const { operand1, operator, operand2 } = match.groups;
    const op1Result = this.getExpressionType(operand1);
    const op2Result = this.getExpressionType(operand2);
    if (!op1Result.success) return { status: 'SEMANTIC_ERROR', error: op1Result.error };
    if (!op2Result.success) return { status: 'SEMANTIC_ERROR', error: op2Result.error };
    if (op1Result.type !== op2Result.type) {
      return { status: 'SEMANTIC_ERROR', error: `Type Mismatch: Cannot compare type ${op1Result.type} with type ${op2Result.type} in condition.` };
    }
    return { status: 'VALID' };
  }

  validateBlockEnd(line) {
    const trimmedLine = line.trim();
    if (!trimmedLine.startsWith(']')) {
      return { status: 'NOT_A_BLOCK_END' };
    }
    const elseRegex = /^\s*]\s*ALAITHE\s*\[\s*$/;
    if (elseRegex.test(trimmedLine)) {
      return { status: 'VALID', data: { type: 'end_with_else' } };
    }
    const endOnlyRegex = /^\s*]\s*$/;
    if (endOnlyRegex.test(trimmedLine)) {
      return { status: 'VALID', data: { type: 'end_only' } };
    }
    return { status: 'INVALID_SYNTAX', error: "Malformed block-closing statement. Expected ']' or '] ALAITHE ['." };
  }

  validateMalliMalliHeader(line) {
    const trimmedLine = line.trim();
    if (!trimmedLine.startsWith('MALLI-MALLI')) {
      return { status: 'NOT_MALLI_MALLI' };
    }
    const mainRegex = /^\s*MALLI-MALLI\s*\((?<content>.*)\)\s*\[\s*$/;
    const mainMatch = trimmedLine.match(mainRegex);
    if (!mainMatch) {
      return { status: 'INVALID_SYNTAX', error: "Malformed MALLI-MALLI structure. Expected: MALLI-MALLI (...) [" };
    }
    const parts = mainMatch.groups.content.split(';').map(p => p.trim());
    if (parts.length !== 3) {
      return { status: 'INVALID_SYNTAX', error: "MALLI-MALLI loop requires three parts: initialization; condition; update." };
    }
    const initPart = parts[0];
    const padamRegex = /^\s*PADAM\s+(?<variable>[a-zA-Z_]\w*)\s*:\s*(?<type>ANKHE)\s*=\s*(?<value>\d+)\s*$/;
    const initMatch = initPart.match(padamRegex);
    if (!initMatch) {
      return { status: 'SEMANTIC_ERROR', error: "Loop initialization must be a PADAM statement initializing an ANKHE variable (e.g., PADAM i:ANKHE = 0)." };
    }
    const loopVarInfo = initMatch.groups;
    const loopVariableName = loopVarInfo.variable;
    const internalLookup = (varName) => {
      if (varName === loopVariableName) return { type: 'ANKHE' };
      return this.lookup(varName);
    };
    const determineType = (expr) => {
      if (/^\d+$/.test(expr.trim())) return { success: true, type: 'ANKHE' };
      const result = internalLookup(expr.trim());
      if (result) return { success: true, type: result.type };
      return { success: false, error: `Undeclared variable '${expr}' in loop condition.` };
    };
    const condPart = parts[1];
    const condRegex = /^\s*(?<op1>\S+)\s*(?<op>==|!=|<=|>=|<|>)\s*(?<op2>\S+)\s*$/;
    const condMatch = condPart.match(condRegex);
    if (!condMatch) return { status: 'INVALID_SYNTAX', error: `Malformed loop condition: "${condPart}".` };
    const op1Result = determineType(condMatch.groups.op1);
    const op2Result = determineType(condMatch.groups.op2);
    if (!op1Result.success) return { status: 'SEMANTIC_ERROR', error: op1Result.error };
    if (!op2Result.success) return { status: 'SEMANTIC_ERROR', error: op2Result.error };
    if (op1Result.type !== 'ANKHE' || op2Result.type !== 'ANKHE') {
      return { status: 'SEMANTIC_ERROR', error: `Loop condition must compare two ANKHE types.` };
    }
    const updatePart = parts[2];
    const updateRegex = /^\s*(?<lhs>\S+)\s*=\s*(?<rhs>\S+)\s*([+-])\s*1\s*$/;
    const updateMatch = updatePart.match(updateRegex);
    if (!updateMatch || updateMatch.groups.lhs !== loopVariableName || updateMatch.groups.rhs !== loopVariableName) {
      return { status: 'SEMANTIC_ERROR', error: `Loop update must be of the form '${loopVariableName} = ${loopVariableName} + 1'.` };
    }
    return { status: 'VALID', data: { variable: loopVarInfo.variable, type: loopVarInfo.type, value: loopVarInfo.value } };
  }

  ece_cmd(command) {
    const validationOrder = [
      this.validatePadam,
      this.validateCheppu,
      this.validateChatimpu,
      this.validateElaitheHeader,
      this.validateMalliMalliHeader,
      this.validateBlockEnd,
      this.validateAssignment
    ];
    for (const validator of validationOrder) {
      const result = validator.call(this, command);
      if (result.status === "VALID") {
        if (validator === this.validateElaitheHeader) {
          this.enterScope();
          this.bracketStack.push(1);
        } else if (validator === this.validateMalliMalliHeader) {
          this.enterScope();
          const declareResult = this.declare(result.data.variable, { type: result.data.type, value: result.data.value });
          if (!declareResult.success) {
            return { status: 'SEMANTIC_ERROR', error: declareResult.error };
          }
          this.bracketStack.push(3);
        } else if (validator === this.validateBlockEnd) {
          if (this.bracketStack.length === 0) return { status: "Error", error: "Closing bracket ']' has no matching opening block." };
          this.exitScope();
          if (result.data.type === "end_with_else") {
            this.enterScope();
            if (this.bracketStack.length === 0 || this.bracketStack.pop() !== 1) return { status: "Error", error: "'ALAITHE' must follow an 'ELAITHE' block." };
            this.bracketStack.push(2);
          } else {
            this.bracketStack.pop();
          }
        } else if (validator === this.validatePadam) {
          const declareResult = this.declare(result.data.variable, { type: result.data.type, value: result.data.value });
          if (!declareResult.success) {
            return { status: 'SEMANTIC_ERROR', error: declareResult.error };
          }
        }
        return { status: "next" };
      }
      if (result.status === "SEMANTIC_ERROR") {
        if (validator === this.validateElaitheHeader || validator === this.validateMalliMalliHeader) {
          this.enterScope();
          if (validator === this.validateElaitheHeader) {
            this.bracketStack.push(1);
          } else {
            this.bracketStack.push(3);
          }
        }
        return result;
      }
      if (result.status === "INVALID_SYNTAX") {
        return result;
      }
    }
    return { status: "Error", error: "Invalid or unrecognized syntax" };
  }

  addError(lineNum, message) {
    this.errors.push({ line: lineNum, message });
  }
}

export default YantraBhashiValidator;