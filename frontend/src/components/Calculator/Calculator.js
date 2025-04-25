const Calculator = () => {
    const [firstNumber, setFirstNumber] = MiniReact.useState('');
    const [secondNumber, setSecondNumber] = MiniReact.useState('');
    const [operation, setOperation] = MiniReact.useState('ADD');
    const [result, setResult] = MiniReact.useState(null);
    const [error, setError] = MiniReact.useState(null);
    const [history, setHistory] = MiniReact.useState([]);

    const operations = {
        ADD: { symbol: '+', name: 'Add' },
        SUBTRACT: { symbol: '-', name: 'Subtract' },
        MULTIPLY: { symbol: '*', name: 'Multiply' },
        DIVIDE: { symbol: '/', name: 'Divide' }
    };

    const operationOptions = Object.entries(operations).map(([value, { name, symbol }]) => ({
        value,
        label: `${name} (${symbol})`
    }));

    const calculate = async () => {
        try {
            const num1 = parseFloat(firstNumber);
            const num2 = parseFloat(secondNumber);

            if (isNaN(num1) || isNaN(num2)) {
                throw new Error('Please enter valid numbers');
            }

            if (operation === 'DIVIDE' && num2 === 0) {
                throw new Error('Cannot divide by zero');
            }

            const response = await fetch('http://localhost:8085/adhyana-demo/api/math/calculate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstNumber: num1,
                    secondNumber: num2,
                    operation: operation
                })
            });

            if (!response.ok) {
                throw new Error('Calculation failed');
            }

            const data = await response.json();
            
            const newHistoryItem = {
                operation,
                num1,
                num2,
                result: data.result,
                timestamp: new Date().toLocaleTimeString()
            };
            
            setHistory([newHistoryItem, ...history.slice(0, 4)]);
            setResult(data.result);
            setError(null);
        } catch (err) {
            setError(err.message);
            setResult(null);
        }
    };

    return {
        type: Card,
        props: {
            children: [
                {
                    type: 'h1',
                    props: {
                        style: { 
                            fontSize: '2rem',
                            marginBottom: theme.spacing.lg
                        },
                        children: ['Advanced Calculator']
                    }
                },
                {
                    type: Select,
                    props: {
                        label: 'Operation',
                        value: operation,
                        onChange: (e) => setOperation(e.target.value),
                        options: operationOptions
                    }
                },
                {
                    type: TextField,
                    props: {
                        label: 'First Number',
                        type: 'number',
                        value: firstNumber,
                        onChange: (e) => setFirstNumber(e.target.value),
                        placeholder: 'Enter first number'
                    }
                },
                {
                    type: TextField,
                    props: {
                        label: 'Second Number',
                        type: 'number',
                        value: secondNumber,
                        onChange: (e) => setSecondNumber(e.target.value),
                        placeholder: 'Enter second number'
                    }
                },
                {
                    type: Button,
                    props: {
                        onClick: calculate,
                        variant: 'primary',
                        children: 'Calculate'
                    }
                },
                result && {
                    type: 'div',
                    props: {
                        style: {
                            marginTop: theme.spacing.md,
                            padding: theme.spacing.md,
                            backgroundColor: theme.colors.success + '1a',
                            borderRadius: '4px'
                        },
                        children: [`Result: ${result}`]
                    }
                },
                error && {
                    type: 'div',
                    props: {
                        style: {
                            marginTop: theme.spacing.md,
                            padding: theme.spacing.md,
                            backgroundColor: theme.colors.error + '1a',
                            color: theme.colors.error,
                            borderRadius: '4px'
                        },
                        children: [`Error: ${error}`]
                    }
                },
                {
                    type: CalculatorHistory,
                    props: {
                        history,
                        operations
                    }
                }
            ].filter(Boolean)
        }
    };
};

window.Calculator = Calculator;
