import Resource from '../lib/resource'
import Service from './service'

class CanvasService extends Service {
    constructor() {
        super();
    }

    async getwxImageInfo(src) {
        return new Promise((resolve, reject) => {
            wx.getImageInfo({
                src: src,
                success: async function (res) {
                    resolve(res);
                }
            });
        })
    }

    async getwxSystemInfo() {
        return new Promise((resolve, reject) => {
            resolve(wx.getSystemInfoSync());
        })
    }
    roundRect (context, x, y, w, h, r=0) {
        var min_size = Math.min(w, h);
        if (r > min_size / 2) r = min_size / 2;
        // 开始绘制
        context.beginPath();
        context.moveTo(x + r, y);
        context.arcTo(x + w, y, x + w, y + h, r);
        context.arcTo(x + w, y + h, x, y + h, r);
        context.arcTo(x, y + h, x, y, r);
        context.arcTo(x, y, x + w, y, r);
        context.stroke();
        context.closePath();
    }

    // 绘制多行文本，注意单位是px
    drawText(text, context, textleft, texttop, step, textwidth, fontsize = 30, num = 2) {
        text = text.replace(/\n/g, ' ');
        var chr = text.split("");
        var temp = "";
        var row = [];
        for (var a = 0; a < chr.length; a++) {
            console.log(a);
            if (context.measureText(temp).width < textwidth - textleft) {
                temp += chr[a];
            } else {
                a--;
                row.push(temp);
                temp = "";
            }
        }
        row.push(temp);
        if (row.length > num) {
            var rowCut = row.slice(0, num);
            var rowPart = rowCut[rowCut.length - 1];
            var test = "";
            var empty = [];
            for (var a = 0; a < rowPart.length; a++) {
                if (context.measureText(test).width < textwidth - textleft) {
                    test += rowPart[a];
                }
                else {
                    break;
                }
            }
            empty.push(test);
            var group = empty[0] + "...";
            rowCut.splice(rowCut.length - 1, 1, group);
            row = rowCut;
        }
        console.log("===============");
        console.log(row);
        for (var b = 0; b < row.length; b++) {
            console.log(row[b], textleft, texttop + b * step, textwidth);
            context.fillText(row[b], textleft, texttop + b * step, textwidth);
        }
    }
}

let service = new CanvasService();

export default service;
