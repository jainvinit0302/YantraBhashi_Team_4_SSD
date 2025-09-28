class YantraBhashiInterpreter {
    constructor() {
        this.scopeStack = [new Map()];
        this.output = [];
    }

    // Scope management
    enterScope() {
        this.scopeStack.push(new Map());
    }

    exitScope() {
        if (this.scopeStack.length > 1) {
            this.scopeStack.pop();
        }
    }

    declare(name, info) {
        const scope = this.scopeStack[this.scopeStack.length - 1];
        if (scope.has(name)) {
            return { success: false, error: `Variable '${name}' already declared.` };
        }
        scope.set(name, info);
        return { success: true };
    }

    lookup(name) {
        for (let i = this.scopeStack.length - 1; i >= 0; i--) {
            if (this.scopeStack[i].has(name)) {
                return this.scopeStack[i].get(name);
            }
        }
        return null;
    }

    update(name, value) {
        for (let i = this.scopeStack.length - 1; i >= 0; i--) {
            if (this.scopeStack[i].has(name)) {
                const info = this.scopeStack[i].get(name);
                info.value = value;
                return { success: true };
            }
        }
        return { success: false, error: `Variable '${name}' not found.` };
    }

    // Validation functions
    validatePadam(line) {
        const match = line.trim().match(/^\s*PADAM\s+(?<variable>[a-zA-Z_]\w*)\s*:\s*(?<type>ANKHE|VARTTAI)(?:\s*=\s*(?<value>.+))?\s*;\s*$/);
        if (!match) return { status: 'INVALID_SYNTAX' };
        return { status: 'VALID', data: match.groups };
    }

    validateChatimpu(line) {
        const match = line.trim().match(/^\s*CHATIMPU\s*\(\s*(?<argument>.*)\s*\)\s*;\s*$/);
        if (!match) return { status: 'INVALID_SYNTAX' };
        const arg = match.groups.argument.trim();
        return { status: 'VALID', data: arg.startsWith('"') ? { value: arg } : { name: arg } };
    }

    validateCheppu(line) {
        const match = line.trim().match(/^\s*CHEPPU\s*\(\s*(?<variable>[a-zA-Z_]\w*)\s*\)\s*;\s*$/);
        if (!match) return { status: 'INVALID_SYNTAX' };
        return { status: 'VALID', data: match.groups };
    }

    // Block structure analysis
    analyzeBlockStructure(lines) {
        const blockInfoList = [];
        const blockStack = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const entry = {
                lineNumber: i,
                lineText: line,
                elseBodyStartLine: null
            };

            if (line.startsWith('ELAITHE')) {
                entry.type = 'ELAITHE';
                blockInfoList.push(entry);
                blockStack.push(entry);
            } else if (line.startsWith('MALLI-MALLI')) {
                entry.type = 'MALLI_MALLI';
                blockInfoList.push(entry);
                blockStack.push(entry);
            } else if (line.startsWith('] ALAITHE [')) {
                entry.type = 'ELSE';
                blockInfoList.push(entry);
                const currentBlock = blockStack[blockStack.length - 1];
                if (currentBlock && currentBlock.type === 'ELAITHE') {
                    currentBlock.elseBodyStartLine = i;
                }
            } else if (line === ']') {
                entry.type = 'BLOCK_END';
                blockInfoList.push(entry);
                if (blockStack.length > 0) {
                    const finishedBlock = blockStack.pop();
                    finishedBlock.constructEndLine = i;
                }
            } else {
                entry.type = 'STATEMENT';
                blockInfoList.push(entry);
            }
        }
        return blockInfoList;
    }

    // Expression evaluation
    evaluateExpression(expression) {
        expression = String(expression).trim();
        const getValue = (part) => {
            part = part.trim();
            if (part === '') return { success: false, error: "Malformed expression led to empty part." };
            if (/^\d+$/.test(part)) return { success: true, value: Number(part) };
            if (part.startsWith('"') && part.endsWith('"')) return { success: true, value: part.slice(1, -1) };
            const varInfo = this.lookup(part);
            if (varInfo === null) return { success: false, error: `Variable '${part}' not found` };
            if (varInfo.value === undefined) return { success: false, error: `Variable '${part}' was used before a value was assigned.` };
            return { success: true, value: varInfo.value };
        };

        if (expression.startsWith('"') && expression.endsWith('"')) return getValue(expression);

        const expressionRegex = /^\s*(?<operand1>.+?)\s*(?<operator>==|!=|<=|>=|<|>|\+|-|\*|\/)\s*(?<operand2>.+?)\s*$/;
        const match = expression.match(expressionRegex);
        if (!match) return getValue(expression);

        const { operand1, operator, operand2 } = match.groups;
        const leftResult = getValue(operand1);
        if (!leftResult.success) return leftResult;
        const rightResult = getValue(operand2);
        if (!rightResult.success) return rightResult;

        const leftVal = leftResult.value;
        const rightVal = rightResult.value;
        let resultValue;

        switch (operator) {
            case '+': resultValue = leftVal + rightVal; break;
            case '-': resultValue = leftVal - rightVal; break;
            case '*': resultValue = leftVal * rightVal; break;
            case '/':
                if (rightVal === 0) return { success: false, error: "Division by zero" };
                resultValue = Math.floor(leftVal / rightVal);
                break;
            case '==': resultValue = leftVal == rightVal; break;
            case '!=': resultValue = leftVal != rightVal; break;
            case '>': resultValue = leftVal > rightVal; break;
            case '<': resultValue = leftVal < rightVal; break;
            case '>=': resultValue = leftVal >= rightVal; break;
            case '<=': resultValue = leftVal <= rightVal; break;
            default: return { success: false, error: `Unknown operator '${operator}'` };
        }
        return { success: true, value: resultValue };
    }

    // Statement execution
    executeStatement(line, inputList, inputIndexRef) {
        let result = { success: true };

        if (line.startsWith('PADAM')) {
            const res = this.validatePadam(line);
            if (res.status !== 'VALID') return { success: false, error: res.error };
            let finalValue = res.data.value;
            if (finalValue !== undefined) {
                const evalResult = this.evaluateExpression(finalValue);
                if (!evalResult.success) return evalResult;
                finalValue = evalResult.value;
            }
            result = this.declare(res.data.variable, { type: res.data.type, value: finalValue });
        } else if (line.startsWith('CHATIMPU')) {
            const res = this.validateChatimpu(line);
            if (res.status !== 'VALID') return { success: false, error: res.error };
            const arg = res.data.value || res.data.name;
            const evalResult = this.evaluateExpression(arg);
            if (!evalResult.success) return evalResult;
            this.output.push(String(evalResult.value));
        } else if (line.startsWith('CHEPPU')) {
            const res = this.validateCheppu(line);
            if (res.status !== 'VALID') return { success: false, error: res.error };
            const varName = res.data.variable;
            if (inputIndexRef.value >= inputList.length) return { success: false, error: "Not enough inputs provided" };
            const inputVal = inputList[inputIndexRef.value++];
            const varInfo = this.lookup(varName);
            result = this.update(varName, varInfo.type === 'ANKHE' ? Number(inputVal) : String(inputVal));
        } else if (line.includes('=')) {
            const varName = line.split('=')[0].trim();
            const expression = line.split('=')[1].replace(';', '').trim();
            const evalResult = this.evaluateExpression(expression);
            if (!evalResult.success) return evalResult;
            result = this.update(varName, evalResult.value);
        }
        return result;
    }

    // Main execution engine
    execute(blueprint, inputList, inputIndexRef, startIndex = 0, endIndex = blueprint.length) {
        let pc = startIndex;
        while (pc < endIndex) {
            const command = blueprint[pc];
            if (!command) { pc++; continue; }

            const line = command.lineText;
            let result = { success: true };

            if (command.type === 'ELAITHE') {
                this.enterScope();
                const condition = line.substring(line.indexOf('(') + 1, line.lastIndexOf(')'));
                const evalResult = this.evaluateExpression(condition);
                if (!evalResult.success) return evalResult;

                const ifBodyEnd = command.elseBodyStartLine !== null ? command.elseBodyStartLine : command.constructEndLine;

                if (evalResult.value) {
                    result = this.execute(blueprint, inputList, inputIndexRef, pc + 1, ifBodyEnd);
                    if (!result.success) return result;
                } else {
                    if (command.elseBodyStartLine !== null) {
                        result = this.execute(blueprint, inputList, inputIndexRef, command.elseBodyStartLine + 1, command.constructEndLine);
                        if (!result.success) return result;
                    }
                }
                this.exitScope();
                pc = command.constructEndLine;
            } else if (command.type === 'MALLI_MALLI') {
                this.enterScope();
                const header = line.substring(line.indexOf('(') + 1, line.lastIndexOf(')'));
                const parts = header.split(';').map(p => p.trim());
                const initRes = this.validatePadam(parts[0] + ';');
                if (initRes.status !== 'VALID') return { success: false, error: `Invalid loop initialization` };
                this.declare(initRes.data.variable, { type: initRes.data.type, value: Number(initRes.data.value) });

                while (true) {
                    const condResult = this.evaluateExpression(parts[1]);
                    if (!condResult.success) return condResult;
                    if (!condResult.value) break;

                    result = this.execute(blueprint, inputList, inputIndexRef, pc + 1, command.constructEndLine);
                    if (!result.success) return result;

                    const updateResult = this.evaluateExpression(parts[2].split('=')[1].trim());
                    if (!updateResult.success) return updateResult;
                    this.update(parts[2].split('=')[0].trim(), updateResult.value);
                }
                this.exitScope();
                pc = command.constructEndLine;
            } else if (command.type !== 'ELSE' && command.type !== 'BLOCK_END') {
                result = this.executeStatement(line, inputList, inputIndexRef);
                if (!result.success) return { ...result, error: `${result.error} on line ${pc + 1}` };
            }

            pc++;
        }
        return { success: true };
    }

    // Main interpreter function
    run(programString, inputs = []) {
        // Reset state
        this.scopeStack = [new Map()];
        this.output = [];

        const lines = programString.replace(/\n/g, "|").split('|').map(line => line.trim()).filter(Boolean);
        const blueprint = this.analyzeBlockStructure(lines);
        const inputIndexRef = { value: 0 };

        const result = this.execute(blueprint, inputs, inputIndexRef);

        if (result.success) {
            return {
                success: true,
                output: this.output.join('\n')
            };
        } else {
            return {
                success: false,
                error: result.error,
                output: this.output.join('\n')
            };
        }
    }
}

export default YantraBhashiInterpreter;