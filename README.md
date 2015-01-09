jQuery Arrowkeys Plugin
========

Arrowkeys is a jQuery plugin that aims to bind events for the arrow keys.

Demo & Examples 
-----
http://fechin.github.io/jquery-arrowkeys/


Usage
-----

1. **HTML**(don't forget to add `focusable` to element which you want to bind arrow events)

```html
    <div class="focusable"><span>1</span></div>
    <div class="focusable"><span>2</span></div>
    <div class="barrier"><span>3</span></div>
    <div class="focusable"><span>4</span></div>
    <div class="barrier"><span>5</span></div>
    <div class="parent">
       <div class="focusable"><span>6</span></div>
    </div>
```


2. **Include jQuery**

    ```html
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js" type="text/javascript"></script>
```

3. **Include Arrowkeys jQuery Plugin**

    ```html
<script src="path_to_your_js/jquery-arrowkeys.min.js" type="text/javascript"></script>
```

4. **Initialize Arrowkeys!**

   ```html
<script type="text/javascript" charset="utf-8">
    $(document).arrowkeys({
        customKeyEvent: {
            // KeyCode : function
            65 : function(evt){ alert("a" + this + evt.keyCode); },
            66 : function(evt){ alert("b"); } 
        },
        enterFunc : function(obj, evt){ alert("enter:" + obj.text()); },
        backFunc : function(obj, evt){ alert("back"); },
        upFunc : function(obj, evt){ alert("up"); },
        downFunc : function(obj, evt){ alert("down"); },
    });
</script>
```

Changelog
-----

**0.1 (Jan 09 2015)**
* First release.


## License
Released under the [MIT license](http://www.opensource.org/licenses/MIT).
