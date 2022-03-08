const mergeImages = require('merge-images');
const { Canvas, Image, createCanvas } = require('canvas');
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

let imgs = runFilesNameSync('./images/')
console.log(imgs)
 for(let i = 0, iLen = 4; i < iLen; i = i+2){
   // console.log(i,'aaaa',imgs[i],imgs[i+1])
   let list = [{
     src: `./images/image-${i + 1}.png`,
     x: 0,
     y: 0,
   },{
     src: `./images/image-${i + 2}.png`,
     x: 1200,
     y: 0,
   }]
    mergeImages(list, {
      Canvas: Canvas,
      Image: Image,
      width: 1200,
      height: 1700
    })
      .then(b64 => {
      // writeFileData(`./reStart${i}1.txt`, b64 + '\/n');
      saveImg(b64,i)
    });

 }


function savaImg(src,index){
  const out = fs.createWriteStream(__dirname + `/after/${index}.png`)
  const canvas = createCanvas(1200, 1200)
  const stream = canvas.createPNGStream()
  stream.pipe(out)
  out.on('finish', () =>  console.log('The PNG file was created.'))

}



function writeFileData(file, data) {
  let tips = false;
  fs.writeFile(file, data, {flag:'a',encoding:'utf-8'},function(error) {
    if (error) {
      throw error;
    } else {
      console.log("文件已保存", file);
      tips = true
    }
  });
  return tips;
}
