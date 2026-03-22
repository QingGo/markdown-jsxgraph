# JSXGraph in VSCode Markdown Preview

This is a test to verify our JSXGraph extension works properly.

```jsxgraph
var b1 = JXG.JSXGraph.initBoard(containerId, {boundingbox: [-3, 3, 3, -3], axis: true, showCopyright: false});
var t1 = b1.create('slider', [[-2.5, -2.5], [1.5, -2.5], [0, 0, 1]], {name: '变换过程 (t)'});

// 矩阵 A = [[2.5, 0], [0, 0.8]]
var A1 = [[2.5, 0], [0, 0.8]]; 
var applyA = function(pt) {
    var x = pt[0], y = pt[1];
    var nx = x * (1 - t1.Value() + t1.Value() * A1[0][0]) + y * (t1.Value() * A1[0][1]);
    var ny = x * (t1.Value() * A1[1][0]) + y * (1 - t1.Value() + t1.Value() * A1[1][1]);
    return [nx, ny];
};

// 描绘单位圆被变换的曲线
b1.create('curve', [
    function(phi) { return applyA([Math.cos(phi), Math.sin(phi)])[0]; },
    function(phi) { return applyA([Math.cos(phi), Math.sin(phi)])[1]; },
    0, 2 * Math.PI
], {strokeColor: '#3b82f6', strokeWidth: 3});

// 基向量
b1.create('arrow', [[0,0], function() { return applyA([1, 0]); }], {strokeColor: '#ef4444', strokeWidth: 3, name: 'e1', withLabel: true});
b1.create('arrow', [[0,0], function() { return applyA([0, 1]); }], {strokeColor: '#22c55e', strokeWidth: 3, name: 'e2', withLabel: true});

b1.create('text', [-2.8, 2.5, "动图 1：实对称矩阵把单位圆拉成椭圆<br/>(拖动下方滑块或点击播放)"], {fontSize: 16});

b1.create('text', [0.5, 2.0, function() {
    var m11 = (1 - t1.Value() + t1.Value() * A1[0][0]).toFixed(2);
    var m12 = (t1.Value() * A1[0][1]).toFixed(2);
    var m21 = (t1.Value() * A1[1][0]).toFixed(2);
    var m22 = (1 - t1.Value() + t1.Value() * A1[1][1]).toFixed(2);
    return '<div style="font-family:serif; font-size:20px; background:rgba(255,255,255,0.9); padding:4px 12px; border-radius:6px; border:1px solid #e2e8f0; display:flex; align-items:center; box-shadow:0 2px 4px rgba(0,0,0,0.05);">' +
           '<span style="margin-right:8px;">A<sub>t</sub> =</span>' +
           '<span style="font-size:32px; font-family:sans-serif; font-weight:200; transform:scaleY(1.4); margin-right:4px;">[</span>' +
           '<div style="text-align:center; line-height:1.1;">' +
           '<div style="display:flex; gap:12px; justify-content:center;"><span style="width:40px;">' + m11 + '</span><span style="width:40px;">' + m12 + '</span></div>' +
           '<div style="display:flex; gap:12px; justify-content:center;"><span style="width:40px;">' + m21 + '</span><span style="width:40px;">' + m22 + '</span></div>' +
           '</div>' +
           '<span style="font-size:32px; font-family:sans-serif; font-weight:200; transform:scaleY(1.4); margin-left:4px;">]</span>' +
           '</div>';
}], {fixed: true});
```