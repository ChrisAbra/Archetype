Archetype 
=========
+ obviously do not use this

This javascript library is designed to easily facilitate the binding of data variables to HTML structures, updating when data changes. 
By declaring the HTML structures inside of the page itself (rather than JSX definitions of React-js)

## Examples
The model (Archetype) example of the structures to generate.
```html
<div arc-container="exampleData" arc-list="data">
	<div arc-object="arc-var" arc-id="id">
		<span arc-out="id"></span>
		<span arc-out="name"></span>
	</div>
</div>
```
The Javascript object to construct from and functions to run
```javascript
var data = [{
	id:'object1-id',
	name:'Object One'
},{
	id:'object2-id',
	name:'Object Two'
}];

Archetype.build();

```
Output HTML 
```html
<div arc-container="exampleData" arc-list="data">
	<div arc-object="arc-var" arc-id="object1-id">
		<span arc-out="id">object1-id</span>
		<span arc-out="name">Object One</span>
	</div>
	<div arc-object="arc-var" arc-id="object2-id">
		<span arc-out="id">object2-id</span>
		<span arc-out="name">Object Two</span>
	</div>
</div>
```
For more complex examples please open and inspect the example.html file in this repo

## Attributes and Use
### arc-container 
>The parent attribute of any containing Archetype structure, used on either an object of a list of objects. The value of this attribute is the name of the container that is used to refer back to it when needed. 

### arc-list
>The parent attribute for the start of a list and denotes the container that the contents contained will be repeated inside of. When accompanying an arc-container attribute, its value should be the Javascript Array. When within an existing container, the value is the name of the relevant property within the containing Javascript object.

### arc-var
> Within the arc-list element, 'arc-var' is a reference to the item within the list, and can be used as the value for an arc-out attribute for primative values, or arc-object attribtute when the arc-list refers to a list of objects.

### arc-object
>The parent attribute for the start of an object and denotes the container that the contents will be output to. When accompanying an arc-container attribute, its value should be the Javascript Object. When within an existing container, the value is the name of the relevant property within the containing Javascript object.

### arc-out
> Denotes the output of primative typed data in an object. Nested inside arc-object elements, the value is the name of the property to output. Nested inside an arc-list element, the value is 'arc-var'. Data is output within the element that has this attribute. 
>
>__N.B__ The arc-out's are only populated to the depth of the containing object. This facilitates the potential for re-use of property names within nested objects without interference (such as 'id'). The ability to include data from futher outside an object is a planned addition.

### arc-id 
> Provides an id to the element (for Archetype's purposes only), to facilitate the simplification/minimisation of DOM changes.
