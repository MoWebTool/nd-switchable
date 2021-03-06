/**
 * @module Switchable
 * @author crossjs <liwenfu@crossjs.com>
 */

'use strict';

var Switchable = require('./switchable');
var $ = require('nd-jquery');

// 旋转木马组件
module.exports = Switchable.extend({

  attrs: {
    circular: true,

    prevBtn: {
      getter: function(val) {
        return $(val).eq(0);
      }
    },

    nextBtn: {
      getter: function(val) {
        return $(val).eq(0);
      }
    },
    disabledBtnClass: {
      getter: function(val) {
        return val ? val : this.get('classPrefix') + '-disabled-btn';
      }
    }
  },

  _initTriggers: function(role) {
    Switchable.prototype._initTriggers.call(this, role);

    // attr 里没找到时，才根据 data-role 来解析
    var prevBtn = this.get('prevBtn');
    var nextBtn = this.get('nextBtn');

    if (!prevBtn[0] && role.prev) {
      prevBtn = role.prev;
      this.set('prevBtn', prevBtn);
    }

    if (!nextBtn[0] && role.next) {
      nextBtn = role.next;
      this.set('nextBtn', nextBtn);
    }

    prevBtn.addClass(this.CONST.PREV_BTN_CLASS);
    nextBtn.addClass(this.CONST.NEXT_BTN_CLASS);
  },

  _getDatasetRole: function() {
    var role = Switchable.prototype._getDatasetRole.call(this);

    var self = this;
    var roles = ['next', 'prev'];
    $.each(roles, function(index, key) {
      var elems = self.$('[data-role=' + key + ']');
      if (elems.length) {
        role[key] = elems;
      }
    });
    return role;
  },

  _bindTriggers: function() {
    Switchable.prototype._bindTriggers.call(this);

    var that = this;
    var circular = this.get('circular');

    this.get('prevBtn').click(function(ev) {
      ev.preventDefault();
      if (circular || that.get('activeIndex') > 0) {
        that.prev();
      }
    });

    this.get('nextBtn').click(function(ev) {
      ev.preventDefault();
      var len = that.get('length') - 1;
      if (circular || that.get('activeIndex') < len) {
        that.next();
      }
    });

    // 注册 switch 事件，处理 prevBtn/nextBtn 的 disable 状态
    // circular = true 时，无需处理
    if (!circular) {
      this.on('switch', function(toIndex) {
        that._updateButtonStatus(toIndex);
      });
    }
  },

  _updateButtonStatus: function(toIndex) {
    var prevBtn = this.get('prevBtn');
    var nextBtn = this.get('nextBtn');
    var disabledBtnClass = this.get('disabledBtnClass');

    prevBtn.removeClass(disabledBtnClass);
    nextBtn.removeClass(disabledBtnClass);

    if (toIndex === 0) {
      prevBtn.addClass(disabledBtnClass);
    } else if (toIndex === this.get('length') - 1) {
      nextBtn.addClass(disabledBtnClass);
    }
  }

});
