﻿CKEDITOR.dialog.add("html5video",function(t){return{title:t.lang.html5video.title,minWidth:500,minHeight:100,contents:[{id:"info",label:t.lang.html5video.infoLabel,elements:[{type:"vbox",padding:0,children:[{type:"hbox",widths:["365px","110px"],align:"right",children:[{type:"text",id:"url",label:t.lang.html5video.allowed,required:!0,validate:CKEDITOR.dialog.validate.notEmpty(t.lang.html5video.urlMissing),setup:function(t){this.setValue(t.data.src)},commit:function(t){t.setData("src",this.getValue())}},{type:"button",id:"browse",style:"display:inline-block;margin-top:20px;",align:"center",label:t.lang.common.browseServer,hidden:!0,filebrowser:"info:url"}]}]},{type:"hbox",id:"res360",children:[{type:"checkbox",id:"responsive",label:t.lang.html5video.responsive,setup:function(t){t.data.responsive?this.setValue(t.data.responsive):this.setValue("true")},commit:function(t){t.setData("responsive",this.getValue()?"true":"")}},{type:"checkbox",id:"video360",label:t.lang.html5video.video360,setup:function(t){t.data.video360&&this.setValue(t.data.video360)},commit:function(t){t.setData("video360",this.getValue()?"true":"")}}]},{type:"hbox",id:"size",children:[{type:"text",id:"width",label:t.lang.common.width,setup:function(t){t.data.width&&this.setValue(t.data.width)},commit:function(t){t.setData("width",this.getValue())}},{type:"text",id:"height",label:t.lang.common.height,setup:function(t){t.data.height&&this.setValue(t.data.height)},commit:function(t){t.setData("height",this.getValue())}}]},{type:"hbox",id:"alignment",children:[{type:"radio",id:"align",label:t.lang.common.align,items:[[t.lang.common.alignCenter,"center"],[t.lang.common.alignLeft,"left"],[t.lang.common.alignRight,"right"],[t.lang.common.alignNone,"none"]],default:"center",setup:function(t){t.data.align&&this.setValue(t.data.align)},commit:function(t){t.setData("align",this.getValue())}}]}]},{id:"Upload",hidden:!0,filebrowser:"uploadButton",label:t.lang.html5video.upload,elements:[{type:"file",id:"upload",label:t.lang.html5video.btnUpload,style:"height:40px",size:38},{type:"fileButton",id:"uploadButton",filebrowser:"info:url",label:t.lang.html5video.btnUpload,for:["Upload","upload"]}]},{id:"advanced",label:t.lang.html5video.advanced,elements:[{type:"vbox",padding:0,children:[{type:"hbox",children:[{type:"radio",id:"autoplay",label:t.lang.html5video.autoplay,items:[[t.lang.html5video.yes,"yes"],[t.lang.html5video.no,"no"]],default:"no",setup:function(t){t.data.autoplay&&this.setValue(t.data.autoplay)},commit:function(t){t.setData("autoplay",this.getValue())}}]}]}]}]}});