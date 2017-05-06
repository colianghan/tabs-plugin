/**
 * @author hanguoliang 2017/05/05
 * 
 * @description tabs的基类 -- 简单实现了事件点击时的切换
 */

var $ = require('jquery'),
    _ = require('lodash'),
    _index = 1;

function TabsBase(opts){
    opts = this.opts = $.extend(true,{
        el:document.body,
        tabsClass:'g-p-tabs-item',
        curTabClass:'g-p-tabs-cur' //当前tab的样式
    },opts);
    this.$el = $(opts.el);
    this.cid = 'tabs_'+_index++;
    this.init();
}
$.extend(TabsBase.prototype,{
    init:function(){// 
        this.bindEvents();
        this.render(); //需要子类重写
    },
    bindEvents:function(){
        var me = this,
            opts = me.opts;
        this.$el.on('click.'+me.cid,'.'+opts.tabsClass,function(e){
            var $el = $(e.currentTarget),
                curClass = me.opts.curTabClass,
                $curPanel = me.$el.find('.'+curClass).data('panel'),
                $panel = $el.data('panel');

            if($el.hasClass(opts.curTabClass)){
                return;
            }
            $el.addClass(curClass).siblings('.'+curClass).removeClass(curClass);
            $panel.show().siblings().hide();
            me.$el.trigger('tabs:clicked',$panel,$curPanel);
        });
    },
    render:function(){
        return this;
    }
});


module.exports = TabsBase;