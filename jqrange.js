/*
 * Copyright (C) 2011 by Enno Boland <g s01 de>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
(function($, undefined) {
var VERSION = 0.0,
	jQRange;

var neutralNode = $('<span>')
	.data('jQRange inserted', true);

function rangeText(range) {
	return range.text || range.toString();
}

function getNeutral() {
	return neutralNode.clone(true);
}

function nodeToRange(node) {
	var r = document.createRange();
	r.setStartBefore(node)
	r.setEndAfter(node)
	return r;
}
function textNodes(range, overlapping) {
	var ret = []

	var rec = function(element, range) {
		$.each(element.childNodes, function(i, v) {
			if(!isTextNode(v))
				rec(v, range);
			else if(contains(range, v, overlapping))
				ret.push(v);
		})
	}
	if(isTextNode(range.commonAncestorContainer) && overlapping)
		ret = [ range.commonAncestorContainer ]
	else
		rec(range.commonAncestorContainer, range);

	return ret;
}
function textOffset(range, overlapping) {
	var ret = { offset: 0, length: rangeText(range).length };
	if(isTextNode(this.startContainer)) {
		ret.offset = this.startOffset
		if(overlapping)
			ret.offset -= $(this.startContainer).text().length
	}
}

function inRange(range, element, offset) {
	if(range.isPointInRange) {
		return range.isPointInRange(element, offset);
	}
	else {
		/*var tag = Math.random().toString();
		var posMark = getNeutral().text(tag);

		r = nodeToRange(element);
		try {
			r.setStart(element, offset);
			r.collapse(true);
		}
		catch(e) {

			console.log(element.nodeType);
			console.log(offset);
			console.log($(element).text().length);
			console.log(element.childNodes.length);
		}
		r.insertNode(posMark[0]);
		var ret = rangeText(range).match(tag);
		posMark.remove();
		return ret;*/
		return false;
	}
}

function contains(container, contained, overlapping) {
	var start, end, startContained, endContained, startOffset, endOffset;
	container = $.isRange(container) ? container : nodeToRange(container);
	if($.isRange(contained)) {
		startContained = contained.startContainer
		startOffset = contained.startOffset
		endContained = contained.endContainer
		endOffset = contained.endOffset
	}
	else {
		endContained = startContained = contained
		startOffset = 0
		endOffset = Math.max((isTextNode(contained) 
				? $(contained).text()
				: contained.childNodes).length,0);
	}
	start = inRange(container, startContained, startOffset)
	end = inRange(container, endContained, endOffset)
	if(overlapping)
		return start || end;
	else 
		return start && end;
}

function isTextNode(node) {
	return $.inArray(node.nodeType, [ 3, 4, 8 ]) != -1
}

$.isRegexp = function(obj) {
	return typeof obj == 'object' &&
			obj.toString().charAt(0) == '/' &&
			obj.exec && obj.test;
}

$.isRange = function(obj) {
	return obj.commonAncestorContainer != undefined
}

$.fn.range = function(selector) {
	return arguments.length == 0 ? jQRange(this) : jQRange(this).range(selector)
}

$.fn.mark = function() {
	this.range().mark();
}

jQRange = function(selector, context) {
	if(this != window && this._create_jquery) {
		this._create_jquery = false;
		return new jQuery.fn.init(selector, context);
	}
	else
		return new jQRange.fn.init(selector, context);
}

jQRange.prototype = jQRange.fn = {
	constructor: jQRange,
	init: function(selector, context) {
		var ranges = [ ];
		if(selector == undefined || selector == null)
			return this;
		// Convert context to a range
		if(context)
			context = jQRange(context)[0];


		if($.isRange(selector)) {
			ranges = [ selector ];
		}
		else if($.isArray(selector) || selector.jqrange) {
			$.each(selector, function(i,v) {
				ranges.push(v);
			})
		}
		else if(selector.jquery || selector.nodeType) {
			$(selector).each(function() {
				ranges.push(nodeToRange(this == document 
					? document.body 
					: this));
			});
		}
		else if($.isRegexp(selector) || selector == '^' || $.isPlainObject(selector)) {
			ranges = jQRange(context || document).range(selector).toArray()
		}

		if(ranges) {
			var self = this;
			$.each(ranges, function(i,range) {
				if(!context || contains(context, range, false))
					self.push(range);
			})
		}
		return this;
	},

	// Start with an empty selector
	selector: "",

	// The current version of jQRange  being used
	jqrange: "0.0.0",

	// The default length of a jQRange object is 0
	length: 0,

	// Inherit methods from jQuery
	size: $.fn.size,
	toArray: $.fn.toArray,
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
			$.fn.andSelf() : this;
	},

	// Hint for constructor to create a jquery instead of a jqrange object
	_create_jquery: false,

	range: function(selector) {
		var ret = [];

		if(selector == '^') {
			var range, sel = window.document.selection || window.getSelection()
			if(sel.createRange)
				range = sel.createRange()
			else if(sel.rangeCount)
				range = sel.getRangeAt(0)
			this.each(function() {
				if(contains(this, range)) {
					ret = [ range ];
					return 0;
				}
			})
		}
		else if(typeof selector == 'string' || $.isRegexp(selector)) this.each(function() {
			var s = selector
			if($.isRegexp(s)) {
				var regexp = s;
				s = "";
				rangeText(this).replace(regexp, function(match,offset) {
					s += offset+':'+match.length+' ';
				})
			}
			var nodes = textNodes(this, true);
			var globalOffset = isTextNode(this.startContainer) ? this.startOffset : 0;
			var length = rangeText(this).length;

			s.replace(/(^|\s+)([-+]?[0-9]+)(-|:)([-+]?[0-9]+)/g, function() {
				var start = parseInt(RegExp.$2)
				var end = parseInt(RegExp.$4)
				var islength = RegExp.$3 == ':';
				var p = 0, i, r;
				start = parseInt(start);
				if(start < 0)
					start = length - start;
				if(end < 0)
					end = length - end;
				if(islength)
					end += start;
				if(start > length || end > length || end < start)
					return;
				start += globalOffset;
				end += globalOffset;
				for(i = 0; i < nodes.length && start > p + $(nodes[i]).text().length; i++) {
					p += $(nodes[i]).text().length;
				}
				var startNode = nodes[i];
				var startOffset = start - p;

				for(;i < nodes.length && end > p + $(nodes[i]).text().length; i++) {
					p += $(nodes[i]).text().length;
				}
				var endNode = nodes[i];
				var endOffset = end - p;

				r = document.createRange();
				r.setStart(startNode, startOffset)
				r.setEnd(endNode, endOffset)
				ret.push(r);
			})
		})
		return this.pushStack( jQRange(ret), "range", selector.toString());
	},
	snip: function() {
		var ret = [], r;
		if(isTextNode(this[0].startContainer)) {
			if(this.startElement == this.endElement)
				return this;
			r = this[0].cloneRange();
			r.setEndAfter(this.startContainer)
			ret.push(r)
		}
		if(isTextNode(this[0].endContainer)) {
			r = this[0].cloneRange();
			r.setBeginBefore(this.endContainer)
			ret.push(r)
		}

		return this.pushStack( $(ret), "snip", '');
	},
	mark: function() {
		if(this[0].select)
			this[0].select();
		else {
			var sel = window.getSelection();
			sel.removeAllRanges();
			sel.addRange(this[0]);
		}
		return this;
	},
	text: function(text) {
		var r = this[0];
		if(arguments.length == 0) {
			return r ? rangeText(r) : null;
		}
		else if(r) {
			r.deleteContents();
			r.insertNode(document.createTextNode(text));
		}
		return this;
	},
	html: function(html) {
		var dummy = getNeutral();
		if(arguments.length == 0) {
			if(!this[0])
				return "";
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
			if(!dontsplit) {
				var w = wrap.clone(true)
					.append(this.extractContents());
				this.insertNode(w[0]);
			}
			else {
				jQRange(this).contents().each(function() {
					var t = $(this)
					if(isTextNode(this) && t.text().match(/\S/))
						t.wrap(wrap)
				});
				jQRange(this).snip().wrap(wrap, false);
			}
			this.commonAncestorContainer.normalize()
		})
		return this;
	},
	css: function(name, val) {
		var wrapper = getNeutral().css(name, val);
		this.each(function() {
			jQRange(this).contents().each(function() {
				var t = $(this)
				if(!isTextNode(this))
					t.css(name, val);
				else if(t.text().match(/\S/))
					t.wrap(wrapper.clone());
			})
			jQRange(this).snip().wrap(wrapper.clone(), false);
		})     
		return this;
	},
	contents: function(overlapping) {
		var ret = []

		var rec = function(element, range) {
			$.each(element.childNodes, function(i, v) {
				if(contains(range, v, overlapping))
					ret.push(v);
				else
					rec(v, range);
			})
		}
		this.each(function() {
			rec(this.commonAncestorContainer, this);
		})

		return this.pushStack( $(ret), "contents", '');
	},
	
	join: function() {
		var ret = this[0].cloneRange();
		this.slice(1).each(function() {
			if(ret.compareBoundaryPoints(Range.START_TO_START, this) > 0) {
				ret.setStart(this.startContainer, this.startOffset)
			}
			if(ret.compareBoundaryPoints(Range.END_TO_END, this) < 0) {
				ret.setEnd(this.endContainer, this.endOffset)
			}
		})
		return this.pushStack( jQRange(ret), "join", '');
	}
}
$.each(['find','children'], function(i,action) {
	jQRange.fn[action] = function(selector, overlapping) {
		var t = this.contents(overlapping)
			.filter(function() {return !isTextNode(this);})
		if(action == 'find') {
			t = t.find(selector).andSelf();
		}
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
			var measure = getNeutral().text('.');
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

$.range = jQRange;
}(jQuery))
