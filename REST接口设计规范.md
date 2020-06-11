# REST接口设计规范

### 简介

> Representational State Transfer 简称 REST 描述了一个架构样式的网络系统。REST 指的是一组架构约束条件和原则。满足这些约束条件和原则的应用程序或设计就是 RESTful。

### 概念

> - 资源（Resources） REST是”表现层状态转化”，其实它省略了主语。”表现层”其实指的是”资源”的”表现层”。那么什么是资源呢？就是我们平常上网访问的一张图片、一个文档、一个视频等。这些资源我们通过URI来定位，也就是一个URI表示一个资源。
> - 表现层（Representation）
>   资源是做一个具体的实体信息，他可以有多种的展现方式。而把实体展现出来就是表现层，例如一个txt文本信息，他可以输出成html、json、xml等格式，一个图片他可以jpg、png等方式展现，这个就是表现层的意思。
>   URI确定一个资源，但是如何确定它的具体表现形式呢？应该在HTTP请求的头信息中用Accept和Content-Type字段指定，这两个字段才是对”表现层”的描述。
> - 状态转化（State Transfer）访问一个网站，就代表了客户端和服务器的一个互动过程。在这个过程中，肯定涉及到数据和状态的变化。而HTTP协议是无状态的，那么这些状态肯定保存在服务器端，所以如果客户端想要通知服务器端改变数据和状态的变化，肯定要通过某种方式来通知它。

### URI格式规范

> - URI中尽量使用连字符”-“代替下划线””的使用
> - URI中统一使用小写字母
>
> - URI中不要包含文件(脚本)的扩展名
> - URI中尽量使用连字符”-“代替下划线””的使用
> - URI中统一使用小写字母
> - URI中不要包含文件(脚本)的扩展名

### 资源的原型

- ##### 文档(Document)

```html
文档是资源的单一表现形式，可以理解为一个对象，或者数据库中的一条记录。在请求文档时，
要么返回文档对应的数据，要么会返回一个指向另外一个资源(文档)的链接。
以下是几个基于文档定义的URI例子：
https://api.ebiz.com/users/will
https://api.ebiz.com/posts/1
https://api.ebiz.com/posts/1/comments/1
```

- ##### 集合(Collection)

```html
集合可以理解为是资源的一个容器(目录)，我们可以向里面添加资源(文档)。例如：
https://api.ebiz.com/users
https://api.ebiz.com/posts
https://api.ebiz.com/posts/1/comments
```

- ##### 仓库(Store)

```html
仓库是客户端来管理的一个资源库，客户端可以向仓库中新增资源或者删除资源。
客户端也可以批量获取到某个仓库下的所有资源。仓库中的资源对外的访问不会提供单独URI的，
客户端在创建资源时候的URI除外。例如：
PUT /users/1234/favorites/posts/1  
上面的例子我们可以理解为，我们向一个id是1234的用户的仓库(收藏夹)中，
添加了一个id为1的post资源。通俗点儿说：就是用户收藏了一个自己喜爱的id为1的文章。
```

- ##### 控制器(Controller)

```html
控制器资源模型，可以执行一个方法，支持参数输入，结果返回。 是为了除了标准操作:
增删改查(CRUD)以外的一些逻辑操作。控制器(方法)一般定义子URI中末尾，
并且不会有子资源(控制器)。例如：
向用户重发ID为245743的消息
POST /alerts/245743/resend  

发布ID为1的文章
POST /posts/1/publish
```

### URI命名规范

> - 文档(Document)类型的资源用名词(短语)单数命名
> - 集合(Collection)类型的资源用名词(短语)复数命名
> - 仓库(Store)类型的资源用名词(短语)复数命名
> - 控制器(Controller)类型的资源用动词(短语)命名
> - URI中有些字段可以是变量，在实际使用中可以按需替换

  

```
例如一个资源URI可以这样定义：
https://api.ebiz.com/posts/{postId}/comments/{commentId}
postId,commentId 是变量(数字，字符串都类型都可以)。
```

- CRUD的操作不要体现在URI中，HTTP协议中的操作符已经对CRUD做了映射。

```
CRUD是创建，读取，更新，删除这四个经典操作的简称  
例如删除的操作用REST规范执行的话，应该是这个样子：
DELETE /users/1234

以下是几个错误的示例：
GET /deleteUser?id=1234  
GET /deleteUser/1234  
DELETE /deleteUser/1234  
POST /users/1234/delete
```

### HTTP请求方法的使用

> - GET方法用来获取资源
> - PUT方法可用来新增/更新Store类型的资源
> - PUT方法可用来更新一个资源的全部属性，使用时传递所有属性的值，即使有的值没有改变
> - PATCH方法更新资源的部分属性。因为 PATCH 比较新，而且规范比较复杂，所以真正实现的比较少，
>   一般都是用 POST 替代
> - POST方法可用来创建一个资源
> - POST方法可用来触发执行一个Controller类型资源
> - DELETE方法用于删除资源

### HTTP响应状态码的使用

> - 200 (“OK”) 用于一般性的成功返回
> - 200 (“OK”) 不可用于请求错误返回
> - 201 (“Created”) 资源被创建
> - 202 (“Accepted”) 用于Controller控制类资源异步处理的返回，仅表示请求已经收到。
>   对于耗时比较久的处理，一般用异步处理来完成
> - 204 (“No Content”) 此状态可能会出现在PUT、POST、DELETE的请求中，一般表示资源存在，
>   但消息体中不会返回任何资源相关的状态或信息。
> - 301 (“Moved Permanently”) 资源的URI被转移，需要使用新的URI访问
> - 302 (“Found”) 不推荐使用，此代码在HTTP1.1协议中被303/307替代。
>   我们目前对302的使用和最初HTTP1.0定义的语意是有出入的，应该只有在GET/HEAD方法下，
>   客户端才能根据Location执行自动跳转，而我们目前的客户端基本上是不会判断原请求方法的，
>   无条件的执行临时重定向
> - 303 (“See Other”) 返回一个资源地址URI的引用，但不强制要求客户端获取该地址的状态(访问该地址)
> - 304 (“Not Modified”) 有一些类似于204状态，服务器端的资源与客户端最近访问的资源版本一致，
>   并无修改，不返回资源消息体。可以用来降低服务端的压力
> - 307 (“Temporary Redirect”) 目前URI不能提供当前请求的服务，临时性重定向到另外一个URI。
>   在HTTP1.1中307是用来替代早期HTTP1.0中使用不当的302
> - 400 (“Bad Request”) 用于客户端一般性错误返回, 在其它4xx错误以外的错误，也可以使用400，
>   具体错误信息可以放在body中
> - 401 (“Unauthorized”) 在访问一个需要验证的资源时，验证错误
> - 403 (“Forbidden”) 一般用于非验证性资源访问被禁止，例如对于某些客户端只开放部分API的访问权限，
>   而另外一些API可能无法访问时，可以给予403状态
> - 404 (“Not Found”) 找不到URI对应的资源
> - 405 (“Method Not Allowed”) HTTP的方法不支持，例如某些只读资源，可能不支持POST/DELETE。
>   但405的响应header中必须声明该URI所支持的方法
> - 406 (“Not Acceptable”) 客户端所请求的资源数据格式类型不被支持，
>   例如客户端请求数据格式为application/xml，但服务器端只支持application/json
> - 409 (“Conflict”) 资源状态冲突，例如客户端尝试删除一个非空的Store资源
> - 412 (“Precondition Failed”) 用于有条件的操作不被满足时
> - 415 (“Unsupported Media Type”) 客户所支持的数据类型，服务端无法满足
> - 429 (“Too Many Requests”) 客户端在规定的时间里发送了太多请求，在进行限流的时候会用到
> - 500 (“Internal Server Error”) 服务器端的接口错误，此错误于客户端无关

### 参考文档

- [cizixs.com/2016/12/12/…](https://link.juejin.im/?target=http%3A%2F%2Fcizixs.com%2F2016%2F12%2F12%2Frestful-api-design-guide)
- [wangwei.info/about-rest-…](https://link.juejin.im/?target=http%3A%2F%2Fwangwei.info%2Fabout-rest-api%2F)
- [www.ruanyifeng.com/blog/2011/0…](https://link.juejin.im/?target=http%3A%2F%2Fwww.ruanyifeng.com%2Fblog%2F2011%2F09%2Frestful.html)
- [www.ruanyifeng.com/blog/2014/0…](https://link.juejin.im/?target=http%3A%2F%2Fwww.ruanyifeng.com%2Fblog%2F2014%2F05%2Frestful_api.html)
- [zh.wikipedia.org/wiki/REST](https://link.juejin.im/?target=https%3A%2F%2Fzh.wikipedia.org%2Fwiki%2FREST)
- [developer.github.com/v3](https://link.juejin.im/?target=https%3A%2F%2Fdeveloper.github.com%2Fv3)
- [novoland.github.io/%E8%AE%BE%E…](https://link.juejin.im/?target=http%3A%2F%2Fnovoland.github.io%2F%25E8%25AE%25BE%25E8%25AE%25A1%2F2015%2F08%2F17%2FRestful%2520API%2520%25E7%259A%2584%25E8%25AE%25BE%25E8%25AE%25A1%25E8%25A7%2584%25E8%258C%2583.html)