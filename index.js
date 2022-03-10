const { Canvas, Image, createCanvas, loadImage } = require('canvas');
let fs = require('fs');
let join = require('path').join;
let path = require('path');


// 获取文件夹下面所有文件，返回文件名数组
function runFilesNameSync(startPath) {
    let result = [];

    function finder(path) {
        let files = fs.readdirSync(path);
        files.forEach(val => {
            let fPath = join(path, val);
            let stats = fs.statSync(fPath);
            if (stats.isDirectory()) finder(fPath);
            if (stats.isFile()) result.push(fPath);
        })
    }
    finder(startPath)
    return result
}


async function forMatImg(dir, rdir) {
    let imgs = runFilesNameSync(dir)
    rdir && await createDir(rdir)
    for (let i = 0, iLen = imgs.length; i < iLen; i++) {
        await savaImg(`./${imgs[i]}`, i, rdir)
    }
}

forMatImg('./images/', './wu/')

async function savaImg(srcs, index, rdir) {

    const W = 1190,
        H = 1683,
        PADDING = 10
    const canvas = createCanvas(W, H)
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = "#fff";
    // 参考线
    // ctx.beginPath();
    // ctx.strokeStyle = 'orange';
    // ctx.moveTo(W / 2,0);
    // ctx.lineTo(W / 2,H);
    // ctx.stroke();
    // ctx.closePath();
    // ctx.moveTo(0,H/2);
    // ctx.lineTo(W ,H/2);
    // ctx.stroke();
    // ctx.closePath();
    // end参考线
    // 翻转
    // ctx.translate(W / 2, H / 2)
    // ctx.rotate(Math.PI * 180 / 180);
    // ctx.translate(-W / 2, -H / 2)
    // 翻转end
    let maxW = W / 2 - (PADDING * 2),
        maxH = H / 2 - (PADDING * 2)
    await loadImage(srcs).then((image) => {
        let mw = image.width,
            mh = image.height,
            dw = parseInt(mw >= maxW ? maxW : mw),
            dh = parseInt(dw * mh / mw)
        for (let i = 0, iLen = 4; i < iLen; i++) {
            let dx = (i % 2 == 0 ? 0 : W / 2) + PADDING,
                dy = (i > 1 ? H / 2 : 0) + (PADDING * Math.floor(i / 2))
            dx = dw < maxW ? dx + (W / 2 / 2 - dw / 2) : dx
            dy = dh < maxH ? dy + (H / 2 / 2 - dh / 2) : dy
            ctx.drawImage(image, 0, 0, mw, mh, dx, dy, dw, dh)
        }
    })
    const out = fs.createWriteStream(rdir ? rdir + `/A-${index}.png` : __dirname + `/A-${index}.png`)
    const stream = canvas.createPNGStream()
    stream.pipe(out)
    out.on('finish', () => console.log('The PNG file was created.', index))
}


function createDir(dir) {
    return new Promise((resolve) => {
        if (!dir) throw '请传入一个文件夹名称';
        if (!path.isAbsolute(dir)) {
            dir = path.resolve(__dirname, dir);
        };
        fs.stat(dir, (err, stat) => {
            if (err) {
                fs.mkdirSync(dir);
            } else {
                console.log('该文件夹已经存在', dir);
            };
            resolve();
        });
    });
};