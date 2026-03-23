(function () {
    let customFunctionsInitialized = false;

    const initJSXGraphs = () => {
        // VSCode injects previewScripts asynchronously.
        // Wait until JSXGraph is loaded and available globally.
        if (typeof window.JXG === 'undefined') {
            setTimeout(initJSXGraphs, 50);
            return;
        }

        // 1. Initialize custom global functions once
        if (!customFunctionsInitialized) {
            const configEl = document.getElementById('jsxgraph-config');
            if (configEl) {
                const configBase64 = configEl.getAttribute('data-config');
                if (configBase64) {
                    try {
                        const customCode = decodeURIComponent(escape(window.atob(configBase64)));
                        const script = document.createElement('script');
                        // Find nonce to bypass CSP
                        let nonce = '';
                        const scripts = document.querySelectorAll('script[nonce]');
                        if (scripts.length > 0) {
                            nonce = scripts[0].nonce || scripts[0].getAttribute('nonce');
                        }
                        if (nonce) {
                            script.setAttribute('nonce', nonce);
                        }
                        script.textContent = customCode;
                        document.body.appendChild(script);
                        customFunctionsInitialized = true;
                    } catch (e) {
                        console.error('Error initializing custom JSXGraph functions:', e);
                    }
                }
            } else {
                // If no config element found yet, we might be in a partial render. 
                // We'll try again on the next mutation.
            }
        }

        // 2. Initialize each container
        const containers = document.querySelectorAll('.jsxgraph-container:not(.initialized)');
        containers.forEach(container => {
            container.classList.add('initialized');
            const codeBase64 = container.getAttribute('data-code');

            if (codeBase64) {
                try {
                    // Decode the base64 code (supports UTF-8 text)
                    const code = decodeURIComponent(escape(window.atob(codeBase64)));

                    // Extract nonce to bypass CSP unsafe-eval restrictions
                    let nonce = '';
                    const scripts = document.querySelectorAll('script[nonce]');
                    if (scripts.length > 0) {
                        nonce = scripts[0].nonce || scripts[0].getAttribute('nonce');
                    }
                    if (!nonce) {
                        const meta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
                        if (meta) {
                            const match = meta.content.match(/'nonce-([^']+)'/);
                            if (match) nonce = match[1];
                        }
                    }

                    // Execute the code by injecting a script tag with the inherited nonce
                    const script = document.createElement('script');
                    if (nonce) {
                        script.setAttribute('nonce', nonce);
                    }
                    script.textContent = `
                    (function(containerId) {
                        try {
                            if (!window.JXG) throw new Error('JSXGraph core is not loaded.');
                            
                            // Make sure JXG and containerId are available to the evaled code
                            var JXG = window.JXG;

                            ${code}

                            // After user code runs, auto-fit the board to show all elements
                            // Only if not already managed by __jxgEngine
                            if (!window.__jxgEngine || !window.__jxgEngine[containerId]) {
                                var _board = JXG.JSXGraph.boards && JXG.JSXGraph.boards[containerId];
                                if (_board && typeof _board.zoomFit === 'function') {
                                    _board.zoomFit(0.1); // 0.1 = 10% margin around elements
                                }
                            }
                        } catch (err) {
                            console.error('JSXGraph user code error:', err);
                            const container = document.getElementById(containerId);
                            if (container) {
                                container.innerText = "Error in user code: " + err.message;
                                container.style.color = "red";
                                container.style.border = "1px solid red";
                                container.style.padding = "10px";
                            }
                        }
                    })("${container.id}");
                    `;
                    document.body.appendChild(script);
                } catch (e) {
                    console.error('Error rendering JSXGraph block:', e);
                    container.innerText = "Error initializing JSXGraph: " + e.message;
                    container.style.color = "red";
                    container.style.border = "1px solid red";
                    container.style.padding = "10px";
                }
            }
        });
    };

    // Run initialization
    initJSXGraphs();

    // Watch for new containers being added
    const observer = new MutationObserver((mutations) => {
        initJSXGraphs();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
