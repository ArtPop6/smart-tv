<template>
  <div id="wangeditor">
    <div
      ref="editorElem"
      style="text-align:left"
    ></div>
  </div>
</template>

<script>
const E = wangEditor;

export default {
  name: "Editor",

  data() {
    return {
      editor: null,
      editorContent: ""
    };
  },

  props: ["catchData", "content"],

  watch: {
    content() {
      this.editor.txt.html(this.content);
    }
  },

  mounted() {
    const token = localStorage.getItem('access_token');
    this.editor = new E(this.$refs.editorElem);

    this.editor.customConfig.onchange = html => {
      this.editorContent = html;
      this.catchData(this.editorContent); // 把这个html通过catchData的方法传入父组件
    };

    this.editor.customConfig.uploadImgServer = '/api/files'
    this.editor.customConfig.uploadFileName = 'img'
    this.editor.customConfig.uploadImgHeaders = {
       'Accept': '*/*',
       'Authorization':'Bearer ' + token  //头部token
    }

    this.editor.customConfig.menus = [
      // 菜单配置
      "head", // 标题
      "bold", // 粗体
      "fontSize", // 字号
      "fontName", // 字体
      "italic", // 斜体
      "underline", // 下划线
      "strikeThrough", // 删除线
      "foreColor", // 文字颜色
      "backColor", // 背景颜色
      "link", // 插入链接
      "list", // 列表
      "justify", // 对齐方式
      "quote", // 引用
      "emoticon", // 表情
      "image", // 插入图片
      "table", // 表格
      "code", // 插入代码
      "undo", // 撤销
      "redo" // 重复
    ];

    this.editor.customConfig.uploadImgHooks = {
       before: function (xhr, editor, files) {
         console.log('before')
         const formData = new FormData();
         formData.append("img", files[0]);
         return formData
         // 图片上传之前触发
         // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，files 是选择的图片文件
          
         // 如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传
         // return {
         //   prevent: true,
         //   msg: '放弃上传'
         // }
       },
       success: function (xhr, editor, result) {
         console.log('success')
         // 图片上传并返回结果，图片插入成功之后触发
         // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
        // this.imgUrl=Object.values(result.data).toString()
        this.imgUrl= result.uri
       },
       fail: function (xhr, editor, result) {
         console.log('fail')
         // 图片上传并返回结果，但图片插入错误时触发
         // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
       },
       error: function (xhr, editor) {
         console.log('error')
         // 图片上传出错时触发
         // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
       },
       timeout: function (xhr, editor) {
         console.log('timeout')
         // 图片上传超时时触发
         // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
       },
 
       // 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
       // （但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错）
       customInsert: function (insertImg, result, editor) {
         console.log('customInsert')
         // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
         // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果
 
         // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
         let url = result.uri   //result.data就是服务器返回的图片名字和链接
         insertImg(url)
       }
     }

    this.editor.create(); // 创建富文本实例
    if (!this.content) {
      this.editor.txt.html("请编辑内容");
    }
  },

  methods: {
    
  }
};
</script>

<style >
#wangeditor {
  width: 750px;
}
</style>