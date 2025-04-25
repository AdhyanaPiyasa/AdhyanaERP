// src/core/MiniReact.js
const MiniReact = {
    createElement(type, props = {}, ...children) {
        return {
            type,
            props: {
                ...props,
                children: children
                    .flat()
                    .map(child =>
                        child === null || child === undefined || child === false
                            ? createTextElement('')
                            : typeof child === 'object'
                                ? child
                                : createTextElement(child)
                    ),
            },
        };
    },

    render(element, container) {
        if (!element || !container) return;

        // Handle text elements
        if (typeof element === 'string' || typeof element === 'number') {
            container.appendChild(document.createTextNode(String(element)));
            return;
        }

        // Skip if no type
        if (!element.type) return;

        // Create DOM element
        const dom = element.type instanceof Function
            ? document.createElement('div')
            : document.createElement(element.type);

        // Apply props
        if (element.props) {
            Object.entries(element.props).forEach(([name, value]) => {
                if (!value && value !== 0) return;

                // Handle event listeners
                if (name.startsWith('on') && typeof value === 'function') {
                    const eventName = name.toLowerCase().substring(2);
                    dom.addEventListener(eventName, value);
                }
                // Handle className
                else if (name === 'className') {
                    dom.setAttribute('class', value);
                }
                // Handle style objects
                else if (name === 'style' && typeof value === 'object') {
                    Object.assign(dom.style, value);
                }
                // Handle other props
                else if (name !== 'children') {
                    // Convert boolean attributes
                    if (typeof value === 'boolean') {
                        if (value) {
                            dom.setAttribute(name, '');
                        } else {
                            dom.removeAttribute(name);
                        }
                    } else {
                        dom.setAttribute(name, value);
                    }
                }
            });
        }

        // Handle functional components
        if (element.type instanceof Function) {
            const componentElement = element.type(element.props || {});
            MiniReact.render(componentElement, dom);
        }
        // Handle children
        else if (element.props && element.props.children) {
            element.props.children.forEach(child => {
                if (child) MiniReact.render(child, dom);
            });
        }

        // Append to container
        container.appendChild(dom);
    },

    useState(initialValue) {
        if (!MiniReact.currentComponent) {
            MiniReact.currentComponent = {
                hooks: [],
                hookIndex: 0,
                element: null,
                container: null
            };
        }

        const hooks = MiniReact.currentComponent.hooks;
        const index = MiniReact.currentComponent.hookIndex++;

        // Initialize hook if needed
        if (hooks[index] === undefined) {
            hooks[index] = typeof initialValue === 'function'
                ? initialValue()
                : initialValue;
        }

        const setState = (newValue) => {
            const nextValue = typeof newValue === 'function'
                ? newValue(hooks[index])
                : newValue;

            if (hooks[index] !== nextValue) {
                hooks[index] = nextValue;
                MiniReact.rerender();
            }
        };

        return [hooks[index], setState];
    },

    useEffect(callback, dependencies) {
        if (!MiniReact.currentComponent) return;

        const hooks = MiniReact.currentComponent.hooks;
        const index = MiniReact.currentComponent.hookIndex++;

        // Check if dependencies changed
        const oldDeps = hooks[index]?.dependencies;
        const hasChanged = !oldDeps ||
            !dependencies ||
            dependencies.some((dep, i) => dep !== oldDeps[i]);

        if (hasChanged) {
            // Cleanup previous effect
            if (hooks[index]?.cleanup) {
                hooks[index].cleanup();
            }

            // Run effect and store cleanup
            hooks[index] = {
                dependencies,
                cleanup: callback()
            };
        }
    },

    useMemo(callback, dependencies) {
        if (!MiniReact.currentComponent) return callback();

        const hooks = MiniReact.currentComponent.hooks;
        const index = MiniReact.currentComponent.hookIndex++;

        // Check if dependencies changed
        const oldDeps = hooks[index]?.dependencies;
        const hasChanged = !oldDeps ||
            !dependencies ||
            dependencies.some((dep, i) => dep !== oldDeps[i]);

        if (hasChanged) {
            hooks[index] = {
                dependencies,
                value: callback()
            };
        }

        return hooks[index].value;
    },

    useCallback(callback, dependencies) {
        return MiniReact.useMemo(() => callback, dependencies);
    },

    useRef(initialValue) {
        return MiniReact.useState({ current: initialValue })[0];
    },

    // Component context
    currentComponent: null,

    // Rerender function
    rerender() {
        if (!MiniReact.currentComponent || !MiniReact.currentComponent.container) return;

        const { element, container } = MiniReact.currentComponent;

        // Clear container
        container.innerHTML = '';

        // Reset hook index
        MiniReact.currentComponent.hookIndex = 0;

        // Rerender component
        const newElement = element();
        MiniReact.render(newElement, container);
    }
};

// Helper function to create text elements
function createTextElement(text) {
    return {
        type: 'TEXT_ELEMENT',
        props: {
            nodeValue: text,
            children: [],
        },
    };
}

// Export to window
window.MiniReact = MiniReact;

