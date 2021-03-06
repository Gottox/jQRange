[![Flattr this git repo](http://api.flattr.com/button/flattr-badge-large.png)](https://flattr.com/submit/auto?user_id=Gottox&url=https://github.com/Gottox/jQRange&title=jQRange&language=&tags=github&category=software)

jQRange jQuery Extension
========================
jQRange is a jQuery extension which aims to make W3C/InternetExplorer Ranges
usable in a jQuery style.

jQRange inherits some functionality from jQuery directly. Furthermore it tries
to imitate the behavior of jQuery whenever possible to provide a consistent
integration to jQuery.

Nevertheless, jQRange lives in its own namespace with it's own extensions.

**jQRange is at alpha stadium at the moment** This means, that we don't support
a stable API and some behavior will be changed.

At the moment, jQRange works on Opera, Firefox (tested on &gt;3.6) and Webkit
(tested on Chrome and Safari). Internet Explorer does not work yet.

XKCD
----

I just noticed todays xkcd-comic: <http://xkcd.com/1031>

jQRange is great for that:

```
	$.range(/keyboard/gi).text("Leopard");
```

Basic usage
-----------

Use

	$(foobar).range()

to span a range around ```$(foobar)```

	$.range()

is basically the same as

	$('body').range()

Selectors
---------
jQRange uses a different seperator theme as jQuery:

### User Selection
To retrieve the current selection if it's inside an element use:

	$(foobar).range('^')

It will return an empty jQRange object if there is no selection, the selection
is outside of foobar or if the selection is only overlapping.

	If you're trying to get the selection from a global scope use

	$.range('^')

### Offset Selector
There are two different formats supportet:

	$(foobar).range("2:4")

Gives us the **four** characters beginning at **third** (we start counting at
0, you remember?) position. So ```$(foobar).range("2:4").text().length``` will
return 4.

	$(foobar).range("2-4")

Gives us the range from the **third** charactor to the **fifth**. So
```$(foobar).range("2:4").text().length``` will return 2.

If the range cannot be spanned, it'll result in an empty jQRange object
(```$(foobar).range( ... ).length == 0```)

You can use more than on range at a time:

	$(foobar).range("2:4 6:8 15-16")

If you span a range at the size of 0 (e.g. ```... .range("2:0")```) it will
return a 0-sized range, if the range is spannable. This means
```... .range("2:0").length == 1``` and ```... .range(2:0).text().length == 0```

### Regular Expression

One of the greatest features is the *Regular Expression Selector*.
You can use jQRange to span ranges by pattern matching.

So if you try to find the word "foo" in an element simply use:

	$(foobar).range(/foo/)

If no match is found, an empty jQRange object will be returned.

Fields
------
### ```selector```
Contains current selector chain

### ```jqrange```
Contains Version of jqrange

### ```length```
The number of ranges currently matched. The .size() method will return the same value

### ```_create_jquery```
*Internal only*

Functions
---------

### ```constructor()```
*Internal only*

### ```init()```
*Internal only*

### ```size()```
Inherit from jQuery. See http://api.jquery.com/size/

### ```toArray()```
Inherit from jQuery. See http://api.jquery.com/toArray/

### ```get()```
Inherit from jQuery. See http://api.jquery.com/get/

### ```pushStack()```
Inherit from jQuery. See http://api.jquery.com/pushStack/

### ```each()```
Inherit from jQuery. See http://api.jquery.com/each/

### ```eq()```
Inherit from jQuery. See http://api.jquery.com/eq/

### ```first()```
Inherit from jQuery. See http://api.jquery.com/first/

### ```last()```
Inherit from jQuery. See http://api.jquery.com/last/

### ```slice()```
Inherit from jQuery. See http://api.jquery.com/slice/

### ```map()```
Inherit from jQuery. See http://api.jquery.com/map/

### ```end()```
Inherit from jQuery. See http://api.jquery.com/end/

### ```push()```
Inherit from jQuery. See http://api.jquery.com/push/

### ```sort()```
Inherit from jQuery. See http://api.jquery.com/sort/

### ```splice()```
Inherit from jQuery. See http://api.jquery.com/splice/

### ```andSelf()```
Inherit from jQuery. See http://api.jquery.com/andSelf/

Note: This will only work if the last object was a jQRange object

### ```range( selector )```
Will return a jQRange object containing all occurrence of ```selector```
inside the current range.

### ```snip()```
Returns the subranges which do not cover a whole DOM-Element.

e.g.

	$('<div>foo<strong>bar</strong>baz').range('2-8').snip()

will result in

	['o','ba']

Note that this Array does not contain Strings but Range Objects.

### ```mark()```
Sets user selection to the Range.

### ```text()```
Gets/Sets text-content of current Range

### ```html()```
Gets/Sets html-content of current Range

### ```wrap()```
Wrap an HTML structure around each range in the set of matched ranges.

*Note:* This may change the DOM tree and therefor invalidate the input range.
The range returned by wrap is updated
### ```css()```
Get/Set the value of a style property for the first element in the set of matched elements.

*Note:* This may change the DOM tree and therefor invalidate the input range.
The range returned by css is updated
### ```contents()```
**TODO**

### ```join()```
Joins all ranges contained it this jQRange object.

e.g.

	$('<div>See: foo bar foo foo</div>').range(/foo/)

will result in 

	['foo','foo','foo']

whereas

	$('<div>See: foo bar foo foo</div>').range(/foo/).join()

will result in 

	['foo bar foo foo']

### ```normalize()```
This function may disappear in future releases.

### ```disassemble()```
This function may disappear in future releases.

### ```find(selector, overlapping)```
Returns jQuery object. Basicly the same as [.find in jQuery](http://api.jquery.com/find/)

Supports a second parameter to decide wheather overlapping elements should be
matched too.

### ```children(selector, overlapping)```
Returns jQuery object. Basicly the same as [.children in jQuery](http://api.jquery.com/children/)

Supports a second parameter to decide wheather overlapping elements should be
matched too.

### ```position()```
Get the current coordinates of the first range in the set of matched ranges,
relative to the offset parent.

### ```startPosition()```
Get the current coordinates of the end cursor of the first range in the set of
matched ranges, relative to the offset parent.


### ```endPosition()```
Get the current coordinates of the end cursor of the first range in the set of
matched ranges, relative to the offset parent.

### ```offset()```
Get the current coordinates of the first range in the set of matched ranges,
relative to the document.

### ```startOffset()```
Get the current coordinates of the start cursor of the first range in the set of
matched ranges, relative to the document.

### ```endOffset()```
Get the current coordinates of the end cursor of the first range in the set of
matched ranges, relative to the document.

### ```height()```
Get the current computed height for the first element in the set of matched ranges.

### ```width()```
Get the current computed width for the first element in the set of matched ranges.

Contributing
------------

jQRange lives on [github](https://github.com/Gottox/jQRange) and
[bitbucket](https://bitbucket.org/Gottox/jqrange). Feel free to fork or clone it
on your prefered platform.
