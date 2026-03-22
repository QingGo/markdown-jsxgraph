(function () {
    const initJSXGraphs = () => {
        // VSCode injects previewScripts asynchronously.
        // Wait until JSXGraph is loaded and available globally.
        if (typeof window.JXG === 'undefined') {
            setTimeout(initJSXGraphs, 50);
            return;
        }

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

                            // Wrap initBoard to inject sensible defaults for pan and zoom
                            var _origInitBoard = JXG.JSXGraph.initBoard;
                            JXG.JSXGraph.initBoard = function(id, opts) {
                                opts = opts || {};
                                if (opts.pan === undefined) opts.pan = { enabled: true, needShift: false };
                                if (opts.zoom === undefined) opts.zoom = { enabled: true, wheel: true, needShift: false, factorX: 1.05, factorY: 1.05 };
                                else {
                                    if (opts.zoom.factorX === undefined) opts.zoom.factorX = 1.05;
                                    if (opts.zoom.factorY === undefined) opts.zoom.factorY = 1.05;
                                }
                                return _origInitBoard.call(JXG.JSXGraph, id, opts);
                            };
                            
                            ${code}

                            // After user code runs, auto-fit the board to show all elements
                            var _board = JXG.JSXGraph.boards && JXG.JSXGraph.boards[containerId];
                            if (_board && typeof _board.zoomFit === 'function') {
                                _board.zoomFit(0.1); // 0.1 = 10% margin around elements
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

    // Since Markdown preview updates the DOM dynamically without reloading the webview
    // when the user types, we use a MutationObserver to watch for new containers being added.
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                initJSXGraphs();
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
