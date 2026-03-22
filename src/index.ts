import * as vscode from 'vscode';
import type MarkdownIt = require('markdown-it');

export function activate(context: vscode.ExtensionContext) {
    return {
        extendMarkdownIt(md: MarkdownIt) {
            return md.use(jsxgraphPlugin);
        }
    };
}

function jsxgraphPlugin(md: MarkdownIt) {
    const defaultRender = md.renderer.rules.fence;

    md.renderer.rules.fence = function (tokens, idx, options, env, self) {
        const token = tokens[idx];
        if (token.info === 'jsxgraph') {
            const content = token.content;
            const id = 'jsxgraph-' + Math.random().toString(36).substring(2, 9);
            // We need to use base64 encoding to avoid breaking HTML attributes
            const base64Code = Buffer.from(content).toString('base64');

            // Replace standard rendering with our container div
            return `<div id="${id}" class="jsxgraph-container" data-code="${base64Code}" style="width: 100%; height: 500px; margin: 16px 0; border: 1px solid #ccc; box-sizing: border-box;"></div>`;
        }

        if (defaultRender) {
            return defaultRender(tokens, idx, options, env, self);
        }
        return '';
    };
}
