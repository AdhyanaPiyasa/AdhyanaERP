const CalculatorHistory = ({ history, operations }) => {
    if (!history.length) return null;

    return {
        type: 'div',
        props: {
            style: {
                marginTop: theme.spacing.lg,
                padding: theme.spacing.md,
                backgroundColor: '#f5f5f5',
                borderRadius: '4px'
            },
            children: [
                {
                    type: 'h3',
                    props: {
                        style: { marginBottom: theme.spacing.md },
                        children: ['Calculation History']
                    }
                },
                ...history.map(item => ({
                    type: 'div',
                    props: {
                        style: {
                            padding: theme.spacing.sm,
                            borderBottom: '1px solid #eee'
                        },
                        children: [
                            `${item.timestamp}: ${item.num1} ${operations[item.operation].symbol} ${item.num2} = ${item.result}`
                        ]
                    }
                }))
            ]
        }
    };
};

window.CalculatorHistory = CalculatorHistory;