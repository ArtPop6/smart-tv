<template>
  <div>
    <div class="group clearfix">
      <video id="video" class="w380 pull-left mr-10"></video>

      <!--描绘video截图-->
      <canvas
        id="canvas"
        width="640"
        height="480"
        class="w380 pull-left"
      ></canvas>
    </div>

    <!--拍照按钮-->
    <div class="p10">
      <a-button
        type="primary"
        @click="fetchCapture"
      >
        拍照并保存图片到本地
      </a-button>
    </div>
    
    <!-- 声明一个按钮  用来触发下载图片到本地 -->
    <div class="p10" v-if="false">
      <a-button
        type="primary"
        @click="handleDownload"
      >
        保存图片到本地
      </a-button>
    </div>
    
  </div>
</template>

<script>
export default {
  data: () => ({}),
  methods: {
    initPage() {
      function initCapture() {
        // 老的浏览器可能根本没有实现 mediaDevices，所以我们可以先设置一个空的对象
        if (navigator.mediaDevices === undefined) {
          navigator.mediaDevices = {};
        }
        if (navigator.mediaDevices.getUserMedia === undefined) {
          navigator.mediaDevices.getUserMedia = (constraints) => {
            // 首先，如果有getUserMedia的话，就获得它
            const getUserMedia =
              navigator.webkitGetUserMedia ||
              navigator.mozGetUserMedia ||
              navigator.msGetUserMedia;

            // 一些浏览器根本没实现它 - 那么就返回一个error到promise的reject来保持一个统一的接口
            if (!getUserMedia) {
              return Promise.reject(
                new Error('getUserMedia is not implemented in this browser')
              );
            }

            // 否则，为老的navigator.getUserMedia方法包裹一个Promise
            return new Promise((resolve, reject) => {
              getUserMedia.call(navigator, constraints, resolve, reject);
            });
          };
        }
        const constraints = {
          video: true,
          audio: false,
        };
        const promise = navigator.mediaDevices.getUserMedia(constraints);
        promise
          .then((stream) => {
            const video2 = document.getElementById('video');
            // 旧的浏览器可能没有srcObject
            if ('srcObject' in video2) {
              video2.srcObject = stream;
            } else {
              // 防止再新的浏览器里使用它，应为它已经不再支持了
              video2.src = window.URL.createObjectURL(stream);
            }
            video2.onloadedmetadata = () => {
              video2.play();
            };
          })
          .catch((err) => {
            console.error(`${err.name}:${err.message}`);
          });
      }

      initCapture();
    },

    fetchCapture() {
      const video = document.getElementById('video');
      const canvas = document.getElementById('canvas');
      const context = canvas.getContext('2d');
      // 将video画面描绘在canvas画布上
      context.drawImage(video, 0, 0, 640, 480);

      const self = this;
      setTimeout(() => {
        self.handleDownload();
      }, 0);
    },

    handleDownload() {
      const canvas = document.getElementById('canvas');

      // cavas 保存图片到本地  js 实现
      //------------------------------------------------------------------------
      // 1.确定图片的类型  获取到的图片格式 data:image/Png;base64,......
      const type = 'jpg'; // 你想要什么图片格式 就选什么吧
      let imgdata = canvas.toDataURL(type);
      // 2.0 将mime-type改为image/octet-stream,强制让浏览器下载
      const fixtype = (t) => {
        t = t.toLocaleLowerCase().replace(/jpg/i, 'jpeg');
        const r = t.match(/png|jpeg|bmp|gif/)[0];
        return `image/${r}`;
      };
      imgdata = imgdata.replace(fixtype(type), 'image/octet-stream');
      // 3.0 将图片保存到本地
      const savaFile = (data, filename) => {
        const saveLink = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
        saveLink.href = data;
        saveLink.download = filename;
        const event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        saveLink.dispatchEvent(event);
      };
      const timestamp = (new Date()).valueOf();
      const filename = `图像_${timestamp}.${type}`;
      // 我想用当前秒是可以解决重名的问题了 不行你就换成毫秒
      savaFile(imgdata, filename);
    },
  },
  mounted() {
    this.initPage();
  },
};
</script>

<style lang="stylus">
.p10 {
  padding: 10px 0;
}

.mr-10 {
  margin-right: 10px;
}

.w380 {
  width: 380px;
}

.group {
}
</style>
