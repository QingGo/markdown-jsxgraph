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

            // Read custom global functions from configuration
            const config = vscode.workspace.getConfiguration('markdown-jsxgraph');
            const customFunctions = config.get<string>('customGlobalFunctions', '');
            const base64Config = Buffer.from(customFunctions).toString('base64');

            // Replace standard rendering with our container div and controls
            return `
<div id="jsxgraph-config" style="display:none;" data-config="${base64Config}"></div>
<div class="jsxgraph-outer-wrapper" style="margin: 2em 0; display: flex; flex-direction: column; align-items: center; gap: 8px;">
    <div id="${id}" class="jsxgraph-container" data-code="${base64Code}" style="width: 100%; height: 500px; border: 1px solid #ccc; box-sizing: border-box;"></div>
    <div id="${id}-controls" style="display:none; align-items:center; gap:10px;">
        <button id="${id}-btn" style="padding:4px 16px; border-radius:6px; border:1px solid #cbd5e1; background:#f8fafc; cursor:pointer; font-size:14px; font-family:sans-serif;" onclick="window.__jxgTogglePlay('${id}')">⏸ 暂停</button>
        <span style="font-size:12px; color:#94a3b8;">也可拖动滑块 · 滚轮缩放 · 拖拽平移</span>
    </div>
</div>`;
        }

        if (defaultRender) {
            return defaultRender(tokens, idx, options, env, self);
        }
        return '';
    };
}
