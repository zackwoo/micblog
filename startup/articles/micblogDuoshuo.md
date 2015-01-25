#如何让micblog支持评论功能 
静态博客没有自己本身的评论交互功能，所以我们选择采用第三方插件的方式来实现评论功能。  
本文以介绍“多说”为例，演示如何在micblog中安装评论插件。   
用户也可根据自身需要换成其他同类插件。   

##先决条件
注册“多说”账号并开通站点获取代码，如下图  
![代码](http://7tebg3.com1.z0.glb.clouddn.com/duoshuo.png)  


##配置micblog
1. 修改插件配置config/plugin.json添加多说配置   
```json
{
    "title":"duoshuo",
    "scope":"article"
}
```
2. 添加插件模板 templates/plugin/duoshuo_plugin.hbs  
将“多说”代码黏贴进去同时修改如下  
![设置修改](http://7tebg3.com1.z0.glb.clouddn.com/多说2.png)  

3. 修改templates/article.hbs文章模板，在需要加入评论框的位置引入插件模板   
```hbs
{{> duoshuo_plugin article}}
```

4. 重新build网站，大功完成。

你的micblog的所有文章页底部都会出现评论框了，你也可以通过多说后台对评论进行管理。  
有不明白的地方可以通过下面的评论框告诉我噢^_^  