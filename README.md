#Micblog 静态博客系统
[![NPM Version](http://img.shields.io/npm/v/micblog.svg?style=flat)](https://www.npmjs.org/package/micblog)
[![NPM Downloads](https://img.shields.io/npm/dm/micblog.svg?style=flat)](https://www.npmjs.org/package/micblog)


micblog项目Blog地址：<http://micblog.coding.io/>  

##目录
* [介绍](#介绍)
* [如何安装](#如何安装)
* [如何创建网站](#如何创建网站)
* [如何写作](#如何写作)
* [如何生成网站](#如何生成网站)
* [如何预览网站](#如何预览网站)
* [如何免费部署个人站点](#如何免费部署个人站点)
* [如何安装插件](#如何安装插件)
* [如何更新版本](#如何更新版本)


###介绍
micblog是基于Node.js的静态博客系统。  
模板采用Handlebars，同时支持Markdown语法进行写作。  
micblog的目标是去除一切不必要的功能，让用户可以专注于写作而非复杂的配置与生成动作。  


###如何安装
1. 安装[node.js](http://nodejs.org/)    
确认是否安装完成   
```
node -v
```   
显示版本系信息   
2. 安装[npm](https://www.npmjs.com/) (新版node已经集成npm无需独立安装)   
确认是否安装完成   
```
npm -v
```   
显示版本系信息  
3. 安装[Micblog](http://micblog.coding.io/)   
```
npm install -g micblog
```   
```
micblog -v
```   
显示版本系信息  

_版本信息显示正确即安装完成_

###如何创建网站  
```
micblog create
```
或者   
```
micblog init
```   
init与create拥有相同功能，从1.2.0版本开始加入，并且在生成完后自动执行build命令   

在当前路径生成一个blog文件夹并包含必要的默认配置信息   

###如何写作  
1. articles下新建Markdown格式的文件以Markdown语法写作
2. Markdown文件第一行默认约定为以#开头的一级标题
3. 在config/articles.json中可手动修改文章基本信息

###如何生成网站  
```
micblog build
```   
在当前路径blog文件夹中生网站，所有生成结果保存在blog/release文件夹中   

###如何预览网站  
```
micblog test
```   
启动浏览器打开 http://localhost:8001/ 可浏览网站效果   

###如何免费部署个人站点  
请参考[micblog 部署到coding.net](http://micblog.coding.io/articles/micblogDeploy.html)   

###如何安装插件
请参考[项目博客#插件](http://micblog.coding.io/tags.html#%E6%8F%92%E4%BB%B6)   

###如何更新版本     
```
micblog update
```  
将micblog更新至最新版本   