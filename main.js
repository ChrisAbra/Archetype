(function (window) {
    var Archetype = {};

    Archetype.data = {};
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

    Archetype.generate = function (containerName) {
        var container = Archetype.data[containerName].container;
        switch (Archetype.data[containerName].type) {

            case 'list':
                //complete
                Archetype.listPop(container, Archetype.data[containerName].data);
                break;

            case 'object':
                //complete
                Archetype.objectPop(Archetype.data[containerName].data, Archetype.data[containerName].archetype.cloneNode(true));
                break;

            default:
                console.warn('Type of container (' + containerName + ') set incorrectly as' + Archetype.data[containerName].type);
                break;

        }
    }

    Archetype.build = function () {
        var containers = Archetype.get('container');
        for (var index = 0; index < containers.length; index++) {
            container = containers[index];
            var name = Archetype.attr(container, 'container');
            var data;
            var type;
            if (Archetype.data[name] != undefined) {
                console.warn('Do not attempt to build twice - use Archetype.generate(modelName) after build');
                return false;
            }
            if (Archetype.hasAttr(container, 'list')) {
                //list object
                type = 'list';
                data = window[Archetype.attr(container, 'list')];
                Archetype.data[name] = {
                    type: type,
                    archetype: container.cloneNode(true),
                    container: container
                }
                if (newData instanceof Array) {
                    Archetype.data[name].data = Array.from(data);
                } else {
                    Archetype.data[name].data = Object.assign({}, data);
                }

                Archetype.generate(name);

            } else if (Archetype.hasAttr(container, 'object')) {
                //dict object
                type = 'object';
                data = window[Archetype.attr(container, 'object')];
                Archetype.data[name] = {
                    type: type,
                    archetype: container.cloneNode(true),
                    container: container
                }

                if (newData instanceof Array) {
                    Archetype.data[name].data = Array.from(data);
                } else {
                    Archetype.data[name].data = Object.assign({}, data);
                }

                Archetype.generate(name);
            } else {
                console.warn('No arc-list or arc-object varaible provided for this element');
                console.warn(container);
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

    Archetype.listPop2 = function (container, data, model) {
        if (model == undefined) {

            model = container.cloneNode(true);
        }
        container.innerHTML = '';
        for (index = 0; index < data.length; index++) {
            var value = data[index];
            if (Object.prototype.toString.call(value) === "[object Object]") {
                for (var i = 0; i < model.childNodes.length; i++) {
                    if (model.childNodes[i].nodeType != 3) {
                        var newInstance = model.childNodes[i].cloneNode(true);
                        container.appendChild(newInstance);
                        object = Archetype.objectPop(value, newInstance);

                    }
                }
            } else if (value instanceof Array) {
                console.log(value);
            } else {
                console.log(value);

                //newElem = Archetype.valuePop(model.childNodes[1].cloneNode(true), 'arc-var', value);
                //container.appendChild(newElem);
            }
        }

        return container;
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

    Archetype.update = function (containerName, newData) {
        arcContainer = Arc.data[containerName];
        var differences = DeepDiff(arcContainer.data, newData);
        for (var i = 0; i < differences.length; i++) {

            difference = differences[i];
            switch (difference.kind) {
                
                case 'E':
                    var type = arcContainer.type;
                    if (type == 'list') {
                        Archetype.listEdit(arcContainer.container, difference.path, difference.rhs);
                    }
                    break;
                case 'A':
                    if (arcContainer.type == 'list') {
                        if (difference.path == undefined) {
                            if (difference.item.kind == 'N') {
                                model = arcContainer.archetype.childNodes;
                                for(var j=0;j<model.length;j++){
                                    if(model[j].nodeType != 3){
                                        toAdd = model[j].cloneNode(true);
                                        arcContainer.container.appendChild(toAdd);
                                        Archetype.objectPop(difference.item.rhs, toAdd);
                                    }
                                }
                            }
                        } else {}
                    }
                    break;
                case 'D-':
                    var type = arcContainer.type;
                    if (type == 'list') {
                        console.log(difference);
                    }

                    break;

            }
        }

        if (newData instanceof Array) {
            Arc.data[containerName].data = Array.from(newData);
        } else {
            Arc.data[containerName].data = Object.assign({}, newData);
        }
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

    window.Archetype = Archetype;

})(window);