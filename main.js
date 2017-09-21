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

    Archetype.listAdd = function (value, toAdd, container) {
        if (Object.prototype.toString.call(value) === "[object Object]") {
            container.appendChild(toAdd);
            Archetype.objectPop(value, toAdd);
        } else if (value instanceof Array) {
            console.log('array', value)
        } else {
            container.appendChild(toAdd);
            Archetype.valuePop(toAdd, 'arc-var', value);
        }
    }

    Archetype.listPop = function (container, data, model) {
        if (model == undefined) {
            model = container.cloneNode(true);
        }
        var arcObjectsToAdd = [];
        var arcVarsToAdd = [];
        container.innerHTML = '';
        var childNodes = model.childNodes;
        var toAdd;
        for (var i = 0; i < childNodes.length; i++) {
            if (childNodes[i].nodeType == 1) {
                toAdd = childNodes[i].cloneNode(true);
            }
        }
        for (var index = 0; index < data.length; index++) {
            Archetype.listAdd(data[index], toAdd.cloneNode(true), container);
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
        var elements = model.querySelectorAll('[arc-out="' + index + '"]');
        if (index == 'arc-var') {
            for (i = 0; i < elements.length; i++) {
                var elem = elements[i];
                elem.innerHTML = value;
            }
            if (Archetype.hasAttr(model, 'out')) {
                if (model.getAttribute('arc-out') == 'arc-var') {
                    model.innerHTML = value;
                }
            }
            return model;
        }
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

        if (differences != undefined) {
            var indexesToRemove = [];
            if (newData instanceof Array) {
                container.data = Array.from(newData);
            } else {
                container.data = Object.assign({}, newData);
            }
            for (var i = 0; i < differences.length; i++) {
                difference = differences[i];
                switch (difference.kind) {

                    case 'E':
                        if (type == 'list') {
                            Archetype.listEdit(container.parent, difference.path, difference.rhs);
                        }

                        break;
                        //chagnes inside and array
                    case 'A':
                        if (type == 'list') {
                            if (difference.item.kind == 'N') {

                                if (difference.path == undefined) {
                                    //new top-level item
                                    var toAdd = container.structure.archetype.cloneNode(true);
                                    container.parent.appendChild(toAdd);
                                    Archetype.objectPop(difference.item.rhs, toAdd);
                                } else {
                                    var path = Array.from(difference.path);
                                    //new items beneath existing object
                                    var model = container.parent.childNodes[path[0]];
                                    var structure = container.structure.within;
                                    path.shift();
                                    //dives to correct place in archetype and model
                                    for (var j = 0; j < path.length; j++) {

                                        subModel = model.querySelectorAll('[arc-object="' + path[j] + '"]');
                                        structure = structure[path[j]];
                                        if (subModel.length == 0) {
                                            subModel = model.querySelectorAll('[arc-list="' + path[j] + '"]');
                                        }
                                        model = subModel[0];
                                    }
                                    setTimeout(function (difference, structure, model) {
                                        Archetype.listAdd(difference, structure, model);
                                    }, 0, difference.item.rhs, structure.archetype.cloneNode(true), model);
                                    //Archetype.listAdd(difference.item.rhs, structure.archetype.cloneNode(true), model);

                                }
                            } else if (difference.item.kind == 'D') {
                                if (difference.path == undefined) {
                                    indexesToRemove.push(difference.index);
                                } else {
                                    console.log(difference.path);
                                }
                            }
                        }
                        break;
                }
            }
            if (indexesToRemove.length > 0) {
                for (var i = indexesToRemove.length - 1; i >= 0; i--) {
                        container.parent.childNodes[indexesToRemove[i]].remove();                    
                }
            }
        }
    }

    window.Archetype = Archetype;

})(window);