下载micblog后在目录中找到Config目录，该目录下存放了micblog系统需要的所有配置。  
micblog系统配置采用__严格的JSON格式__。也就说：  
1. 字符串要用__双引号__括起来，而不能用单引号
2. 属性名一定要加__双引号__
3. 最后一个属性后千万不要多加一个逗号  

##site.json 配置说明
site.json主要负责网站基本信息的配置,格式如下：   
```json
{
    "title": "网站标题",
    "author": "zachary",
    "keywords": ["关键词1","关键词2"],
    "description": "网站描述",
    "copyright": {
        "beginYear": 2014,
        "endYear": 2015
    }
}
```
####title 属性
网站标题，对应html>head标签内的title标签   
```html
<title>网站标题</title>
```

####author 属性
网站作者，你可将自己的大名写在此处   
默认对应的html>head标签内的meta author标签，和网页底部copyright的拥有者
```html
<meta name="author" content="作者" />
```

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


##navigation.json 配置说明
navigation.json主要负责头部导航菜单信息的配置,数组中每个对象代表一个导航菜单。  
格式如下：   
```json
[
    {
        "title": "主页",
        "href": "/"
    },
    {
        "title": "标签",
        "href": "/tags.html"
    },
    {
        "title": "关于我",
        "href": "/about.html"
    }
]
```
####title 属性
导航菜单显示的内容  
####href属性
导航地址  
##articles.json 配置说明
articles.json主要负责发布文章信息的配置,数组中每个对象代表一篇博文。  
格式如下：   
```json
[
    {
        "id": "micblogIntroduce",
        "title": "micblog 静态博客系统",
        "createTime": "2014-12-26 11:41:37",
        "tags": ["micblog"]
    },
    {
        "id": "micblogConfig",
        "title": "micblog 配置说明",
        "createTime": "2014-12-27 19:41:41",
        "tags": ["micblog"]
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
####tags 属性
博文的分类，可以是多个分类