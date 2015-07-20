jqJigsawPuzzle
==============

**jqJigsawPuzzle** is a JavaScript library that lets you create jigsaw puzzles in your web pages.

It requires _jQuery_ and _jQuery UI_, and, by the moment, it only works in webkit browsers, since it uses the CSS property `-webkit-mask-image`.

Usage
-----

In order to use _jqJigsawPuzzle_, first you must include the JavaScript and CSS files of _jqJigsawPuzzle_, _jQuery_ and _jQuery UI_ into your page's `<head>` tag:

```javascript
<link type="text/css" rel="stylesheet" href="jquery-ui.custom.css"/>
<link type="text/css" rel="stylesheet" href="jqJigsawPuzzle.css"/>
    
<script type="text/javascript" src="jquery.min.js"></script>
<script type="text/javascript" src="jquery-ui.custom.min.js"></script>
<script type="text/javascript" src="jqJigsawPuzzle.js"></script>
```

And then you must call one of the _jqJigsawPuzzle_ methods:

  * _jqJigsawPuzzle.createPuzzleFromImage_: transform a `<img>` element into a puzzle.
  * _jqJigsawPuzzle.createPuzzleFromURL_: adds a puzzle into a `<div>` element, using an image defined by a URL.

For example:

```html
<div>
    <img id="my_puzzle" src="img/alaska-cliffs.jpg" alt=""/>
</div>
<script type="text/javascript">
    jQuery(document).ready(function() {
        jqJigsawPuzzle.createPuzzleFromImage("#my_puzzle");
    });
</script>
```

Methods description
-------------------

### jqJigsawPuzzle.createPuzzleFromImage

Creates a puzzle from a `<img>` element.

```javascript
jqJigsawPuzzle.createPuzzleFromImage = function(imageSelector, options);
```

**Parameters**

Parameter | Description
--------- | -----------
`imageSelector` | A CSS selector or a jQuery's object for select the `<img>` element.
`options` | _(optional)_ An associative array with the properties (all of them optionals): `piecesSize` (which defines the size of the pieces, it can take the values 'normal', 'big' or 'small'), `borderWidth` (an integer which defines the width of the border around the puzzle) and `shuffle` (an associative array with the values `rightLimit`, `leftLimit`, `topLimit` and `bottomLimit`, which allow to extends the limits in with the pieces are moved when they are shuffled, since normally they are restricted to the puzzles frame).

### jqJigsawPuzzle.createPuzzleFromURL

Creates a puzzle inside a `<div>` element, using an image defined by a URL.

```javascript
jqJigsawPuzzle.createPuzzleFromURL = function(containerSelector, imageUrl, options)
```

**Parameters**

Parameter | Description
--------- | -----------
`containerSelector` | A CSS selector or a jQuery's object inside which create the puzzle.
`imageUrl` | An string with the image's URL.
`options` | _(optional)_ An associative array with the properties (all of them optionals): `piecesSize` (which defines the size of the pieces, it can take the values 'normal', 'big' or 'small'), `borderWidth` (an integer which defines the width of the border around the puzzle) and `shuffle` (an associative array with the values `rightLimit`, `leftLimit`, `topLimit` and `bottomLimit`, which allow to extends the limits in with the pieces are moved when they are shuffled, since normally they are restricted to the puzzles frame).

License
-------

This library is free software; you can redistribute it and/or
modify it under the terms of the GNU Lesser General Public
License as published by the Free Software Foundation; either
version 3 of the License, or (at your option) any later version.

This library is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public
License along with this library; If not, see <http://www.gnu.org/licenses/>.