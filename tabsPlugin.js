/**
 * @author hanguoliang 2017/05/05
 * 
 * @description tabs的插件类
 * 
 */

var $ = require('jquery'),
    _ = require('lodash'),
    TabsBase = require('./TabsBase.js');


STATE = {
    INIT:0, // 组件初始化状态
    LOADINGDATA:1, //拉取数据状态
    RENDERED:2 //拉取完，渲染完dom状态
}

function Tabs(opts){
    opts = $.extend(true,{
        fetchTabs:null,//当tabs为空，fetchTabs有值是，先调用fetchTabs的接口
        tabs:[],
        el:document.body,
        tabsClass:'g-p-tabs-item',
        curTabClass:'g-p-tabs-cur',
        tabsContainer:$('.tabs-container'), //tab存放的位置
        panelContainer:$('.tabs-panels-container'), //panel存放的位置
        tabItem:_.template('<li class="<%= className %>"><%= item.name %></li>'),//
        loading:_.template('<div class="loading">&nbsp;</div>'),
        netError:_.template(' <div class="net-error">网络异常，请稍候重试 <a href="javascript:;" class="j-reload">重试</a></div>')
    },opts);
    var data = this._parseTabs(opts.tabs);
    this.tabs = data.tabs;
    this._curTab = data.curTab; //当前的tab
    TabsBase.apply(this,arguments);
    this._listening();
    return this;
}

$.extend(Tabs.prototype,TabsBase.prototype,{
    init:function(){
        var me = this,
            opts = me.opts,
            fetchTabs = opts.fetchTabs,
            tabs = me.tabs;

        this.bindEvents();
        if(!tabs || (tabs && !tabs.length) && fetchTabs){
            me._fetchTabs(fetchTabs);
        }else{
            me.render();
        }
        return this;
    },
    showLoading:function(){
        this.$('.loading').show(); //显示转圈
    },
    hideLoading:function(){
        this.$('.loading').hide(); //隐藏转圈
    },
    render:function(){ //根据数据结构来渲染dom
        var me = this,
            opts = me.opts,
            tabs = me.tabs,
            tabsContainer = opts.tabsContainer,
            panelContainer = opts.panelContainer,
            _curTab = me._curTab;

        if(!tabs || (tabs && !tabs.length)){
            return this;
        }
        
        $.each(tabs,function(index,item){
            var div = $('<div>',{
                className:'tabs-panel'+item.id
            })
            .toggle(item.id === _curTab.id)
            .appendTo(panelContainer)
            .data('tabsdata',item);

            if(item.id == _curTab.id){
                me._curPanel = div;
            }

            $(opts.tabItem({
                item:item,
                curTab:_curTab,
                className: item.id === _curTab.id 
                            ? opts.tabsClass + ' ' + opts.curTabClass
                            : opts.tabsClass
            }))
            .appendTo(tabsContainer)
            .data('panel',div);
        });

        console.log(this.$el);
        this.$el.append(opts.loading());
        this.$el.append(opts.netError());
        this._fetchData();
    },
    _parseTabs:function(tabs){
        var _tabs = [],cur;
        $.each(tabs,function(index,item){
            if(item.current){
                cur = item;
            }
            return _tabs.push($.extend(item,{
                _state:STATE.INIT,
                id: index
            }))
        });
        if(!cur){
            cur = _tabs[0]
        }
        return {
            tabs:_tabs,
            curTab:cur
        };
    },
    $:function(el){
        return this.$el.find(el);
    },
    destroy:function(){
        this.$el.off('.'+this.cid); //去除绑定的事件
        this._curTab = null;
        this.tabs = [];
        this._curPanel = null;
    },
    _listening:function(){
        this.$el.on('tabs:clicked',$.proxy(this._TabClick,this));
    },
    _TabClick:function(e,panel,oldPanel){ //拉取数据
        var data = $(panel).data('tabsdata');
        this._curTab = data;
        this._curPanel = panel;

        this._fetchData();
    },
    _fetchData:function(){ //拉取每个panel的数据
        var me = this,
            _curTab = me._curTab;

        function success(resp){
            me.hideLoading();
            _curTab.fetchSuccess && _curTab.fetchSuccess(resp,me._curPanel);
            _curTab._state = STATE.RENDERED;
        }

        if(_curTab._state < STATE.LOADINGDATA){
            if(me.ajax){
                me.ajax.abort();
            }
            me._hideError();
            me.showLoading();
            me.ajax = $.ajax({
                url:_curTab.url,
                data:_curTab.data,
                beforeSend:function(){
                    _curTab._state = STATE.LOADINGDATA;
                },
                success:function(resp){
                    setTimeout(function(){
                        success(resp);
                    },1000);
                },
                error:function(){
                    setTimeout(function(){ //模拟的效果
                        _curTab._state = STATE.INIT;
                        me._showError();
                        me.hideLoading();
                    },1000);
                }
            });
        }else{
            me._hideError();
            success({success:true});
        }
    },
    _showError:function(){
        this.$('.net-error').show();
    },
    _hideError:function(){
        this.$('.net-error').hide();
    },
    bindEvents:function(){
        TabsBase.prototype.bindEvents.apply(this,arguments);
        var me = this;
        me.$el.on('click.'+me.cid,'.j-reload',function(){
            me._fetchData();
        });
    },
    // 获取tabs的接口
    _fetchTabs:function(fetchOpts){
        var me = this;
        return $.ajax({
            url:fetchOpts.url,
            data:fetchOpts.data,
            success:function(resp){
                var tabs = fetchOpts.parseData(resp),
                    data = me._parseTabs(tabs);

                me.tabs = data.tabs;
                me._curTab = data.curTab; //当前的tab
                me.render();
            },
            error:function(){
                alert('网络异常，请稍候重试');
            }
        })
    }
});


module.exports = Tabs;