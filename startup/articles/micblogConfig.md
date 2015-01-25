#micblog 配置说明
下载micblog后在目录中找到Config目录，该目录下存放了micblog系统需要的所有配置。  
micblog系统配置采用__严格的JSON格式__。也就说：  
1. 字符串要用__双引号__括起来，而不能用单引号
2. 属性名一定要加__双引号__
3. 最后一个属性后千万不要多加一个逗号  

##site.json 配置说明
site.json主要负责网站基本信息的配置,格式如下：   
```json
{
    "site_title": "micblog博客小站",
    "author": "zachary",
    "city":"上海",
    "gravatar":"/themes/default/image/icon.gif",
    "keywords": ["micblog"],
    "description": "micblog静态博客系统",
    "copyright": {
        "beginYear": 2014,
        "endYear": 2015
    }
}
```
####site_title 属性
网站名称    

####author 属性
网站作者，你可将自己的大名写在此处   
默认对应的html>head标签内的meta author标签，和网页底部copyright的拥有者
```html
<meta name="author" content="作者" />
```


####city 属性
博主所在城市

####gravatar 属性
头像属性

####keywords 属性
网站关键字属性   
默认对应的html>head标签内的meta keywords标签   
```html
<meta name="keywords" content="关键词1,关键词2" />
```

####description 属性
网站描述属性   
默认对应的html>head标签内的meta description标签   
```html
<meta name="description" content="网站描述" />
```

####copyright 属性
网站底部copyright 对应的年份属性   
```html
<footer>
    <p id="copyright">
        Copyright (c) {{copyright.beginYear}}-{{copyright.endYear}} 
    </p>
</footer>
```


##articles.json 配置说明
articles.json主要负责发布文章信息的配置,数组中每个对象代表一篇博文。  
格式如下：   
```json
[
    {
        "id": "micblogIntroduce",
        "title": "micblog 静态博客系统",
        "createTime": "2014-12-26T03:41:37.000Z",
        "enabletoc": true,
        "tags": ["micblog"],
        "top": 1
     }
]
```
####id 属性
每篇博文应该都拥有一个**不重复**的id。   
用于生成html文件的对应文件名。
####title 属性
博文的标题属性
####createTime 属性
博文的创建时间
####enabletoc 属性
是否启用TOC(Table Of Contents)功能   
####tags 属性
博文的分类，可以是多个分类
####top 属性
置顶属性，采用int值用于排序
##plugin.json 配置说明
plugin.json主要负责第三方插件配置。   
格式如下：   
```json
[
    {
        "title":"toc",
        "scope":"article",
        "stylesheet":["/themes/plugin/simpletoc/src/toc.css"],
        "javascript":["/themes/plugin/simpletoc/libs/jqueryui/jquery-ui-1.9.1.custom.min.js","/themes/plugin/simpletoc/libs/underscore-min.js","/themes/plugin/simpletoc/src/jquery.simpletoc.js"]
    }
]
```
####title 属性
插件名称   
默认约定：插件可以在文件夹_/templates/plugin_内建立 __插件名称_plugin.hbs__ 的插件文件
####scope 属性
插件使用的作用域，可用选项["article","page","all"]   
* article   用于文章页面的插件
* page  用于除文章页面以外的页面
* all   用于所有页面   

####stylesheet 属性
插件所需要的层叠样式表文件引用地址
####javascript 属性
插件所需要的javascript脚本文件引用地址