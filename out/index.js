"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
const vscode = __importStar(require("vscode"));
function activate(context) {
    return {
        extendMarkdownIt(md) {
            return md.use(jsxgraphPlugin);
        }
    };
}
function jsxgraphPlugin(md) {
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
            const customFunctions = config.get('customGlobalFunctions', '');
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
//# sourceMappingURL=index.js.map