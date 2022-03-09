const { Canvas, Image, createCanvas, loadImage } = require('canvas');
let  fs = require('fs');
let  join = require('path').join;
let  path = require('path');


// 获取文件夹下面所有文件，返回文件名数组
function runFilesNameSync(startPath) {
  let result = [];
  function finder(path) {
    let files = fs.readdirSync(path);
    files.forEach( val => {
      let fPath = join(path, val);
      let stats = fs.statSync(fPath);
      if (stats.isDirectory()) finder(fPath);
      if (stats.isFile()) result.push(fPath);
    })
  }
  finder(startPath)
  return result
}


async function forMatImg(dir){
  let imgs = runFilesNameSync(dir)
 for(let i = 0, iLen = imgs.length; i < iLen; i++){
  await savaImg(`./${imgs[i]}`,i)
 }
}

  forMatImg('./images/')

 async function savaImg(srcs,index){

  const W = 1190, H = 1683, PADDING = 10
  const canvas = createCanvas(W, H)
  const ctx = canvas.getContext('2d')
  ctx.fillStyle="#fff";
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
  // 翻转
  // ctx.translate(0, 1190)
  // ctx.rotate(-Math.PI / 2);
  let maxW = W / 2 - (PADDING * 2), maxH = H / 2 - (PADDING * 2)
  await loadImage(srcs).then((image) => {
    let mw = image.width, mh = image.height, dw = parseInt(mw >= maxW ? maxW : mw), dh = parseInt(dw * mh/ mw )
    for(let i = 0, iLen = 4; i < iLen; i++){
      let dx = (i%2 == 0 ? 0 : W/2) + PADDING , dy = (i > 1 ? H / 2 : 0) + ( PADDING * Math.floor(i/2)) 
      dx = dw < maxW ? dx + ( W / 2 / 2 - dw / 2 ) : dx
      dy = dh < maxH ? dy + ( H / 2 / 2 - dh / 2 ) : dy
      ctx.drawImage(image, 0, 0, mw, mh, dx , dy, dw, dh)
    }
  })

  // ctx.translate(-0, -1190)
  const out = fs.createWriteStream(__dirname + `/after/A-${index}.png`)
  const stream = canvas.createPNGStream()
  stream.pipe(out)
  out.on('finish', () =>  console.log('The PNG file was created.',index))
}


