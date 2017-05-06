var $ = require('jquery'),
    template = require('./tpl.html'),
    Tabs = require('./tabsPlugin');


require('./index.less');


$('body').append(
    template
);

var a = new Tabs({
    el: $('.tabs-demo')[0],
    tabs:[
        // {
        //     name:'tabs1',
        //     data:{}, //需要传的数据
        //     url:'/api.json', //获取的url
        //     fetchSuccess:function(resp,panel){
        //         $(panel).html('hello world tabs1');
        //     },//获取成功后的回掉函数
        //     current:true,
        //     _state: STATE.INIT
        // },
        // {
        //     name:'tabs2',
        //     data:{}, 
        //     url:'/api1.json',
        //     fetchSuccess:function(resp,panel){
        //             $(panel).html('hello world tabs2');
        //     },
        //     current:false,
        //     _state: STATE.INIT
        // }
    ],
    fetchTabs:{ //当tabs为空，fetchTabs有值是，先调用fetchTabs的接口
        url:'/api.json',
        data:{},
        parseData:function(resp){
            if(resp.success){
                return resp.data;
            }else{
                return [];
            }
        }
    }
});