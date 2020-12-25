const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

// Ref: https://developer.mozilla.org/zh-CN/docs/Web/API/MediaDevices/getUserMedia
function getVideo() {
  navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false
    })
    .then(MediaStream => {
      console.log(MediaStream);
      video.srcObject = MediaStream;
      video.play();
      return video
    })
    .catch(function (err) {
      console.log(err.name + ": " + err.message);
    });
}

function paintToCanvas() {
  const width = video.videoWidth;
  const height = video.videoHeight;
  console.log(width, height);
  canvas.width = width;
  canvas.height = height;

  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);
    // 从画布获取一个图像数据对象 ImageData
    // 该对象的属性 data 是一个数组，每 4 个元素表示图像一个像素点的 rgba 值
    let pixels = ctx.getImageData(0, 0, width, height);
    // console.log(pixels);
    pixels = redEffect(pixels);
    ctx.putImageData(pixels, 0, 0); // 将修改后的数据重绘回画布
    debugger;
  }, 16)
}

function takePhoto() {
  // 播放声效
  snap.currentTime = 0;
  snap.play();

  // 抽帧，以 base64 格式（字符串）存储帧图像
  const data = canvas.toDataURL();
  const link = document.createElement('a');
  link.href = data; // 将图片数据作为链接参数值，「存储」在链接里
  link.setAttribute('download', 'snapshot'); // 为链接设置 download 属性，文件名为 snapshot
  link.innerHTML = `<img src="${data}" alt="snapshot"/>`;
  strip.insertBefore(link, strip.firstChild)
}

function redEffect(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 100; // red
    pixels.data[i + 1] = pixels.data[i + 1] - 50; // green
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // blue
  }

  return pixels
}

getVideo();

video.addEventListener('canplay', paintToCanvas)