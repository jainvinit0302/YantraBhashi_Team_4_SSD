import React, { useState } from 'react';
import Header from '../common/Header';
import CodeEditor from './CodeEditor';
import OutputPanel from './OutputPanel';
import YantraBhashiValidator from '../../services/validator';
import mockAPI from '../../services/mockAPI';
import '../../styles/components.css';

const CompilerInterface = ({ user, onLogout }) => {
  const [code, setCode] = useState(`PADAM message:VARTTAI = "Hello World";
CHATIMPU(message);`);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const runCode = async () => {
    setIsRunning(true);

    const validator = new YantraBhashiValidator();
    const result = validator.validate(code);

    let outputText = '';
    let status = 'success';
    let errors = [];

    const variables = {};

    if (!result.isValid) {
      status = 'error';
      errors = result.errors;
      outputText = 'Compilation Errors:\n' + result.errors.map(err => `Line ${err.line}: ${err.message}`).join('\n');
    } else {
      // Parse declared VARTTAI variables with string values
      const lines = code.split('\n');
      for (const line of lines) {
        const varDeclMatch = line.match(/^PADAM\s+([a-zA-Z][a-zA-Z0-9_]*):VARTTAI\s*=\s*"(.*)"\s*;?$/);
        if (varDeclMatch) {
          variables[varDeclMatch[1]] = varDeclMatch[2];
        }
      }

      // Process CHATIMPU print statements with variable substitution
      for (const line of lines) {
        const printMatch = line.match(/^CHATIMPU\((.+)\);?$/);
        if (printMatch) {
          let toPrint = printMatch[1].trim();
          if (toPrint.startsWith('"') && toPrint.endsWith('"')) {
            toPrint = toPrint.slice(1, -1);
          } else if (variables[toPrint] !== undefined) {
            toPrint = variables[toPrint];
          } else {
            toPrint = `[Undefined variable: ${toPrint}]`;
          }
          outputText += toPrint + '\n';
        }
      }
    }

    setOutput(outputText.trim());

    try {
      await fetch('http://localhost:4000/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.userId,
          code,
          status,
          output: status === 'success' ? outputText : '',
          errors,
        }),
      });
    } catch (error) {
      console.error('Error submitting code:', error);
    }

    setIsRunning(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header 
        title="YantraBhashi Compiler" 
        user={user} 
        onLogout={onLogout} 
      />
      
      <div className="flex h-screen">
        <CodeEditor 
          code={code}
          setCode={setCode}
          onRun={runCode}
          isRunning={isRunning}
        />
        <OutputPanel output={output} />
      </div>
    </div>
  );
};

export default CompilerInterface;
