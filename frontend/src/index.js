document.addEventListener('DOMContentLoaded', () => {
    const root = document.getElementById('root');
    if (root) {
        MiniReact.currentComponent = {
            hooks: [],
            hookIndex: 0,
            element: Calculator,
            container: root
        };
        MiniReact.render(Calculator(), root);
    }
});