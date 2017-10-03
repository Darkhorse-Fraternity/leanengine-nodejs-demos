
const AV = require('leanengine');
const {iUse,iCard,iDo} = require('./cloudKeys')

AV.Cloud.define('cardList', (req)=> {
    const query = new AV.Query(iCard);
    query.equalTo('state', 1);
    //按人数多少排列。
    //设置每次搜索个数
    
    return query.find().then(results=>results);
});