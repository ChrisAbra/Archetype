(function (window) {
	
var Archetype = {};

Archetype.containers = {};

Archetype.get = function (value, within) {
	if (within) {
		//complete
		return within.querySelectorAll('[arc-' + value + ']');
	} else {
		//complete
		return document.querySelectorAll('[arc-' + value + ']');
	}
}

Archetype.attr = function (object, value, newValue) {
	return (newValue == undefined)
		//complete
		?
		object.getAttribute('arc-' + value + '')
		//complete
		:
		object.setAttribute('arc-' + value + '', newValue);
}

Archetype.hasAttr = function (object, value) {
	//complete
	return object.getAttribute('arc-' + value) != undefined;
}

Archetype.getClosest = function (elem, selector) {

	// Element.matches() polyfill
	if (!Element.prototype.matches) {
		Element.prototype.matches =
			Element.prototype.matchesSelector ||
			Element.prototype.mozMatchesSelector ||
			Element.prototype.msMatchesSelector ||
			Element.prototype.oMatchesSelector ||
			Element.prototype.webkitMatchesSelector ||
			function (s) {
				var matches = (this.document || this.ownerDocument).querySelectorAll(s),
					i = matches.length;
				while (--i >= 0 && matches.item(i) !== this) {}
				return i > -1;
			};
	}

	// Get closest match
	for (; elem && elem !== document; elem = elem.parentNode) {
		if (elem.matches(selector)) return elem;
	}

	return null;

};


Archetype.build = function () {
	var containers = Archetype.get('container');
	for (var index = 0; index < containers.length; index++) {
		element = containers[index];
		var name = Archetype.attr(element, 'container');
		var data;
		var type;
		if (Archetype.containers[name] != undefined) {
			console.warn('Do not attempt to build twice - use Archetype.generate(containersName) after build');
			return;
		}
		if (Archetype.hasAttr(element, 'list')) {
			Archetype.containers[name] = {
				type: 'list',
				parent: element,
			}
			var container = Archetype.containers[name];
			var data = window[Archetype.attr(element, 'list')];
			var archetype = element.cloneNode(true);
			if (data instanceof Array) {
				container.data = [];
				container.structure = {};
				element.innerHTML = '';
				Archetype.listStore(data[0], archetype, container.structure);
			} else {
				container.data = {};
			}
		}
	}
}

Archetype.listStore = function (data, container, structure) {
	if (data instanceof Array) {
		//list of lists
	} else if (Object.prototype.toString.call(data) === "[object Object]") {
		//list of objects
		var objectModel = container.querySelectorAll('[arc-object="arc-var"]')[0].cloneNode(true);
		structure.archetype = objectModel;
		structure.within = {};
		Archetype.objectStore(data, objectModel, structure.within);
	} else {
		//list of prims
		var childNodes = container.childNodes;
		for (var i = 0; i < childNodes.length; i++) {
			if (childNodes[i].nodeType == 1) {
				structure.archetype = childNodes[i].cloneNode(true);
			}
		}
	}
}

Archetype.listPop = function (container, data, model) {
	if (model == undefined) {
		model = container.cloneNode(true);
	}
	var arcObjectsToAdd = [];
	var arcVarsToAdd = [];

	for (index = 0; index < data.length; index++) {
		var value = data[index];
		if (Object.prototype.toString.call(value) === "[object Object]") {
			arcObjects = container.querySelectorAll('[arc-object]');
			for (var i = 0; i < arcObjects.length; i++) {
				arcObject = arcObjects[i];
				parentNode = arcObject.parentNode;
				if (parentNode == container) {
					arcObjectsToAdd.push(arcObject.cloneNode(true));
				}
			}
		} else if (value instanceof Array) {
			console.log(value);
		} else {
			arcObjects = container.querySelectorAll('[arc-out="arc-var"]');
			for (var i = 0; i < arcObjects.length; i++) {
				arcObject = arcObjects[i];
				arcVarsToAdd.push(arcObject.cloneNode(true));
			}
		}
	}
	container.innerHTML = '';

	for (i = 0; i < arcObjectsToAdd.length; i++) {
		arcObject = arcObjectsToAdd[i];
		container.appendChild(arcObject);
		Archetype.objectPop(data[i], arcObject);
	}
	for (i = 0; i < arcVarsToAdd.length; i++) {
		arcVar = arcVarsToAdd[i];
		container.appendChild(arcVar);
		Archetype.valuePop(arcVar, 'arc-var', data[i]);
	}

}



Archetype.objectPop = function (data, model) {

	if (Archetype.hasAttr(model, 'id')) {
		Archetype.attr(model, 'id', (data[Archetype.attr(model, 'id')]));
	}
	for (index in data) {
		var value = data[index];
		if (Object.prototype.toString.call(value) === "[object Object]") {
			//object
			var elements = model.querySelectorAll('[arc-object="' + index + '"]');
			for (i = 0; i < elements.length; i++) {
				var elem = elements[i];
				Archetype.objectPop(value, elem);
			}
		} else if (value instanceof Array) {
			//list
			nestedContainer = model.querySelectorAll('[arc-list="' + index + '"]');
			Archetype.listPop(nestedContainer[0], value, );
		} else {
			//literal
			Archetype.valuePop(model, index, value);
		}
	}
	return model;
}



Archetype.objectStore = function (data, archetype, structure) {
	for (index in data) {
		value = data[index];
		if (value instanceof Array) {
			var container = archetype.querySelectorAll('[arc-list="' + index + '"]')[0].cloneNode(true);
			structure[index] = {}
			Archetype.listStore(value[0], container, structure[index]);

		} else if (Object.prototype.toString.call(value) === "[object Object]") {
			var objectDef = archetype.querySelectorAll('[arc-object="' + index + '"]')[0].cloneNode(true);
			structure[index] = {};
			Archetype.objectStore(value, objectDef, structure[index]);
		}
	}
}

Archetype.valuePop = function (model, index, value) {
	if (index == 'arc-var') {
		model.innerHTML = value;
		return model;
	}
	var elements = model.querySelectorAll('[arc-out="' + index + '"]');
	for (i = 0; i < elements.length; i++) {
		var elem = elements[i];
		//prevents entering nested objects
		if (Archetype.getClosest(elem, '[arc-object]') == model) {
			elem.innerHTML = value;
		}
	}
	return model;
}

Archetype.listEdit = function (container, path, value) {
	if (path.length > 1) {
		container = container.childNodes[path[0]];

		if (typeof path[1] == 'string') {
			path.shift();
			//setTimeout(function () {
			Archetype.propertyEdit(container, path, value);
			//}, 0);
		}
	} else if (path.length == 1) {

		container.querySelectorAll('[arc-out="arc-var"]')[path[0]].innerHTML = value;
	}
}

Archetype.propertyEdit = function (container, path, value) {
	if (path.length == 1) {
		Archetype.valuePop(container, path[0], value);
	} else if (typeof path[1] == 'number') {
		container = container.querySelectorAll('[arc-list="' + path[0] + '"]')[0];
		path.shift();
		Archetype.listEdit(container, path, value);
	} else if (typeof path[1] == 'string') {
		container = container.querySelectorAll('[arc-object="' + path[0] + '"]')[0];
		path.shift();
		Archetype.propertyEdit(container, path, value);
	}
}



Archetype.update = function (containerName, newData) {
	var container = Arc.containers[containerName];
	var type = container.type;
	var differences = DeepDiff(container.data, newData);
	container.data = newData;
	for (var i = 0; i < differences.length; i++) {
		difference = differences[i];
		switch (difference.kind) {

			case 'E':
				if (type == 'list') {
					Archetype.listEdit(container.parent, difference.path, difference.rhs);						
				}

				break;
			case 'A':
				if (type == 'list') {
					if (difference.path == undefined) {
						if (difference.item.kind == 'N') {
							var toAdd = container.structure.archetype.cloneNode(true);
							container.parent.appendChild(toAdd);
							Archetype.objectPop(difference.item.rhs, toAdd);
						}
					} else {

					}
				}
				break;
		}
	}
}
window.Archetype = Archetype;

})(window);