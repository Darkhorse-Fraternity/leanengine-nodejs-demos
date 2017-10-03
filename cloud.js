var AV = require('leanengine');
var _ = require('underscore');

// 声明 Task



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


const iUse = 'iUse'
const iCard = 'iCard'
const iDo = 'iDo'
const useMasterKey = {useMasterKey: true }


AV.Cloud.afterSave(iUse,req => {
  const query = new AV.Query(iCard);
  return query.get(req.object.get(iCard).id).then(function(card) {
    card.increment('useNum');
    return card.save(null,useMasterKey);
  });
})

AV.Cloud.afterDelete(iUse,req => {
  const query = new AV.Query(iCard);
  return query.get(req.object.get(iCard).id).then(function(card) {
    card.increment('useNum',-1);
    return card.save(null,useMasterKey);
  });
})


const normalACL = (currentUser)=>{
  const acl = new AV.ACL()
  acl.setPublicReadAccess(true);
  //说明
  // acl.setRoleWriteAccess('Administrator',true);
  acl.setWriteAccess(currentUser, true);
  return acl
}

const classNames = [iCard,iUse,iDo]
const ACLSet = (classNames)=>{
  classNames.forEach(className =>{
    setNormalACL(className)
  })
}

const setNormalACL = (className)=>{
  AV.Cloud.beforeSave(className,req => new Promise((solve, reject)=>{
    const {object,currentUser} = req
    if(object){
      object.setACL(normalACL(currentUser));
      solve()
    }else {
      reject('未发现有效的'+className+'对象')
    }
  }))
}

ACLSet(classNames)



module.exports = AV.Cloud;
