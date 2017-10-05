

const AV = require('leanengine');

const hook = require('./cloudHook')
const func = require('./cloudFunc')

var _ = require('underscore');
// 从 content 中查找 tag 的正则表达式
var tagRe = /#(\w+)/g;

/**
 * Todo 的 beforeSave hook 方法
 * 将 content 中的 #<tag> 标记都提取出来，保存到 tags 属性中
 */
AV.Cloud.beforeSave('Todo', function(req, res) {
    var todo = req.object;
    var tags = todo.get('content').match(tagRe);
    tags = _.uniq(tags);
    todo.set('tags', tags);
    res.success();
});






module.exports = AV.Cloud;
