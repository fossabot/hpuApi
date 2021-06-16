# HPU公共API (HPU PublicApi)
对一些系统的非标准返回数据标准化，封装成API方便调用, 集成了UIA统一登录、树维教务系统、利昂图书馆系统、云班课和一些小工具  

**本项目仅供学习交流使用**

## 安装使用
```
$ git clone https://github.com/hyunsssssssss/hpuApi.git
$ cd hpuApi && npm run serve
```

## 工作模式
> 有两种工作模式，你可以选择程序调用或者搭建API Service

### 程序调用
> 请参考```test```文件夹内的调用示例  
> 更多示例: [Wiki - Usage](../../wiki/Usage)

- 图书馆示例：```npm run libtest```
- 教务示例：```npm run edutest```
- UIA登录示例：```npm run uiatest```
- 云班课示例：```npm run ybktest```

### API Service
> 这是一个**无状态服务端**，不存储任何用户信息，每次请求需同时提供对应系统的凭证  
> 建议使用云函数搭建(自动更换 IP, 可以有效避免请求量过大导致封禁 IP)

即API服务端，使用```npm run serve```即可启动，默认端口```3330```  

## 接口简介

### UIA统一登录
支持登录验证码识别，captcha接口将同时返回验证码图片与识别结果，使用opencv模版匹配，准确率几乎能达到100%  
ticket接口返回的ticket，可用于登录任意接入统一登录的服务  

### 图书馆
对官方提供的REST API 进一步封装，主要解决跨域请求问题，使其更适合项目需求, 目前几乎已支持官方提供的全部接口

### 教务
解析树维教务系统返回的html并将结果以json方式返回, 目前已实现登录、分数查询、信息查询（部分）、课表查询

### 云班课
模拟安卓客户端请求，并对请求进行签名, 目前已支持对所有签到类型的自动签到、班课查询、信息查询

### 小工具
服务于日常学习与生活的一些小工具API。随缘更新, 无接口介绍, 请自行查看源码

## 接口文档 
请到 [Wiki - APIs](../../wiki/apis) 查看

## 已知问题
- [ ] 教务系统偶尔出现验证码错误
- [x] <del>云函数无法正确安装opencv</del>

## 计划添加
- [ ] Typescript types
- [ ] WIP - 完善API文档
- [ ] 云函数搭建 API 教程
