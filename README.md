jQuery Arrowkeys Plugin
========

[![Build Status](https://travis-ci.org/Fechin/jquery-arrowkeys.svg)](https://travis-ci.org/Fechin/jquery-arrowkeys)

Arrowkeys is a jQuery plugin that aims to bind events for the arrow keys.


Demo & Examples 
-----
http://fechin.github.io/jquery-arrowkeys/


Usage
-----

1. **HTML**
    （Don't forget to add `focusable-row1`[Endwith `-row` and row number] to element which you want to bind arrow events）
    ```html
    <div class="focusable-row1"></div>
    <div class="focusable-row1"></div>
    <div class="focusable-row2 otherclass"></div>
    <div class="focusable-row1"></div>
    <div class="focusable-row1"></div>
    <br>
    <div class="focusable-row2"></div>
    <div class="focusable-row2 other"></div>
    <div class="focusable-row3"></div>
```

2. **Include jQuery And Arrowkeys Plugin**

    ```html
<script src="../libs/jquery/jquery-1.7.2.min.js" type="text/javascript"></script>
<script src="../dist/arrowkeys.min.js" type="text/javascript"></script>
```

3. **Initialize Arrowkeys!**
   ```html
$(document).arrowkeys();
```
OR
   ```html
<script type="text/javascript" charset="utf-8">
    $(document).arrowkeys({
        focusableClass: "focusable",
        focusedClass: "focused",
        focusedPoint: {x: 2, y: 3},
        tabindex: 1,
        customKeyEvent: {
            // KeyCode : function
            65: function (evt) { alert("a" + this + evt.keyCode); },
            66: function (evt) { alert("b"); }
        },
        enterFunc: function (obj, evt) {
            alert("demo2-enter:\t" + $(obj).attr("class"));
        },
        backFunc: function (obj, evt) {
            alert("demo2-back:\t" + $(obj).attr("class"));
        }
    });
</script>
```

Changelog
-----

**0.1 (Jan 09 2015)**
* First release.
**0.2 (Jan 29 2015)**
* Rewrite this plugin.
* Support up, down, left, and right keys
* Support active custom coordinates


## License
Released under the [MIT license](http://www.opensource.org/licenses/MIT).
