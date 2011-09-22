(function($, undefined) {
var VERSION = 0.0,
	jQRange, R,
	rootjQRange;

function getSelection(){
	return window.document.selection || window.getSelection();
}
function getSelectionRange() {
	var sel = getSelection();
	return sel.rangeCount
	    ? sel.getRangeAt(0)
	    : (sel.createRange ? sel.createRange() :  null);
}
function DEBUG(o) {
	console.log(o)
	for(var key in o) {
		console.log(key)
		console.log(o[key])
	}
}
function n(n) {
	if(n.nodeName.toLowerCase() == '#text')
		n = n.parentNode;
	return n;
}

function contains(container, contained) {
	var c = container.childNodes;
	for(var i = 0; i < c.length; i++) {
		if(c[i] == contained)
			return true;
		else
			return arguments.callee(c[i], contained);
	}
	return false;
}

function rangeText(range) {
	return range.text || range.toString();
}

function inRange(range, element, offset) {
	if(range.endOffset == 0 && range.endContainer == element)
		return false;
	if(offset < 0)
		return arguments.callee(range, element, $(element).text().length-offset)

	if(range.isPointInRange) {
		var inrange;
		try {
			inrange = range.isPointInRange(element, offset);
		} catch(e) {
			if(offset == 0)
				return false;
			else
				return arguments.callee(range, element, offset - 1);
		}
		if(inrange)
			return true;
		else if(range.startOffset == 0 && element.firstChild)
			return arguments.callee(range, element.firstChild, offset);
		else
			return false;
	}
	else {
		var tag = Math.random().toString();
		var posMark = $('<span>').text(tag);

		// document.createRange is not supported on all platforms!
		r = document.createRange();
		r.setStart(element, offset);
		r.setEnd(element, offset);
		r.insertNode(posMark[0]);
		var ret = rangeText(range).match(tag)
		posMark.remove();
		return ret;
	}
}

function covers(range) {
	var clone = range.cloneRange();
	if(range.endOffset == 0)
		clone.setEndBefore(range.endContainer);
	else
		clone.setEndAfter(range.endContainer);
	return range.startOffset == 0 && range.endOffset == clone.endOffset;
}

$.isRegexp = function(obj) {
	return typeof obj == 'object' &&
			obj.toString().charAt(0) == '/' &&
			obj.exec && obj.test;
}

$.isRange = function(obj) {
	return obj.cloneContents && obj.cloneContents
}

$.isJQRange = function(obj) {
	return obj.jqrange && obj.jqrange == VERSION
}

$.fn.range = function(selector) {
	return $.range(selector, this);
}

jQRange = function(selector, context) {
	if(this != window && this._create_jquery) {
		this._create_jquery = false;
		return new jQuery.fn.init(selector, context, rootjQRange);
	}
	else
		return new jQRange.fn.init(selector, context, rootjQRange);
}

jQRange.prototype = jQRange.fn = {
	constructor: jQRange,
	init: function(selector, context, rootjQRange) {
		if(selector == undefined || selector == null)
			return this;
		if(selector == '^') {
			var sel = getSelectionRange()
			if(sel &&
					(!context || (
						contains(sel.startContainer, context) &&
						contains(sel.endContainer, context)
					))
				)
				this.push(sel);
		}
		else if(typeof selector == 'string' && selector.match(/(0-9+):([0-9]+)/)) {
			// TODO
		}
		else if($.isRange(selector)) {
			this.push(selector);
		}
		else if($.isArray(selector)) {
			this.push.apply(this, selector);
		}
	},

	// Start with an empty selector
	selector: "",

	// The current version of jQRange  being used
	jqrange: "0.0.0",

	// The default length of a jQuery object is 0
	length: 0,

	// Inherit methods from jQuery
	size: $.fn.size,
	toArray: $.fn.size,
	get: $.fn.get,
	pushStack: function(elems, name, selector) {
		this._create_jquery = !!elems.jquery;
		return $.fn.pushStack.apply(this, arguments)
	},
	each: $.fn.each,
	eq: $.fn.eq,
	first: $.fn.first,
	last: $.fn.last,
	slice: $.fn.slice,
	map: $.fn.map,
	end: $.fn.end,
	push: $.fn.push,
	sort: $.fn.sort,
	splice: $.fn.splice,
	each: $.fn.each,
	andSelf: function() {
		return this.prevObject.jqrange ?
			this : $.fn.andSelf();
	},

	// Hint for constructor to create a jquery instead of a jqrange object
	_create_jquery: false,

	range: function() {

	},
	snip: function() {
		if(this[0].startContainer == this[0].endContainer) {
			return this
		}
		else {
			var r = [ this[0].cloneRange(),this[0].cloneRange() ];
			r[0].setEndAfter(this[0].startContainer)
			r[1].setStartBefore(this[0].endContainer)
			return this.pushStack( r, 'snip', '');
		}
	},
	mark: function() {
		if(this[0].select)
			this[0].select();
		else {
			var sel = getSelection();
			sel.removeAllRanges();
			sel.addRange(this[0]);
		}
		return this;
	},
	html: function(html) {
		var dummy = $('<div>');
		if(arguments.length == 0) {
			if(!this[0])
				return undefined;
			// IE
			if(this[0].htmlText)
				return this[0].htmlText;
			// W3C
			dummy.append(this[0].cloneContents());
			return dummy.html();
		}
		else if(this[0]) {
			dummy.html(html);
			this[0].deleteContents();
			var d = dummy[0];
			while(d.lastChild)
				this[0].insertNode(d.removeChild(d.lastChild))
		}
		return this;
	},
	wrap: function(wrap, dontsplit) {
		wrap = $(wrap);
		this.each(function() {
			this.commonAncestorContainer.normalize()
			if(!dontsplit || n(this.startContainer) == n(this.endContainer)) {
				var w = wrap.clone(true)
					.append(this.extractContents());
				this.insertNode(w[0]);
			}
			else {
				R(this).contents().each(function() {
					var t = $(this)
					if(t.text().match(/\S/) && this.nodeType == 3)
						t.wrap(wrap)
				});
				if(!covers(this))
					R(this).snip().wrap(wrap, false);
			}
			this.commonAncestorContainer.normalize()
		})
		return this;
	},
	covers: function() {
		covers(this[0]);
	},
	css: function(name, val) {
		var wrapper = $("<span>").css(name, val);
		this.each(function() {
			R(this).contents().each(function() {
				var t = $(this)
				if(this.nodeType == 1)
					t.css(name, val);
				else if(t.text().match(/\S/) && this.nodeType == 3)
					t.wrap(wrapper.clone());
			})
			if(!covers(this))
				R(this).snip().wrap(wrapper.clone(), false);
		})     
		return this;
	},
	contents: function(overlapping) {
		var ret = []

		var rec = function(element, range) {
			$.each(element.childNodes, function(i, v) {
				if(inRange(range, v, 0) && inRange(range, v, -1))
					ret.push(v);
				else if(overlapping && (inRange(range, v, 0) || inRange(range, v, -1)))
					ret.push(v);
				else
					rec(v, range);
			})
		}
		this.each(function() {
			rec(this.commonAncestorContainer, this);
		})

		return this.pushStack( $(ret), "contents", '');
	}
}
$.each(['find','children'], function(i,action) {
	jQRange.fn[action] = function(selector, overlapping) {
		var t = this.contents(overlapping)
			.filter(function() {return this.nodeType == 1})
		if(action == 'find')
			t = t.find(selector).andSelf();
		return t.filter(selector)
	}
})
$.extend(jQRange.fn, {
})
$.each({'position':'Position','offset':'Offset'}, function(action,caction) {
	jQRange.fn[action] = function() {
		if(!this[0])
			return null;
		var c = $('body');
		var rect = this[0].getBoundingClientRect()

		var ret = {left:rect.left + c.scrollLeft(), top:rect.top + c.scrollTop()};
		return ret;
	}
	$.each(['start','end'], function(i,pos) {
		jQRange.fn[pos+caction] = function() {
			if(!this[0])
				return null;
			var range = this[0].cloneRange();
			var ret;
			var measure = $('<span>a</span>');
			range.collapse(pos == 'start');
			range.insertNode(measure[0]);
			ret = measure[action]();
			if(pos == 'end') {
				ret.top += measure.height();
			}
			measure.remove();
			return ret;
		}
	})
})
$.each(['height','width'], function(i, action) {
	jQRange.fn[action] = function() {
		if(!this[0])
			return null;
		return  this[0].getBoundingClientRect()[action]
	}
})


jQRange.fn.init.prototype = jQRange.fn;

rootjQRange = jQRange(document);
R = $.range = jQRange;
}(jQuery))
