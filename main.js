(function (window, $) {
    var Archetype = {};

    Archetype.data = {};
    Archetype.get = function (value, within) {
        if (within) {
            return within.find('[arc-' + value + ']');
        } else {
            return $('[arc-' + value + ']');
        }
    }

    Archetype.attr = function (object, value, newValue) {
        return (newValue == undefined) ? object.attr('arc-' + value + '') : object.attr(
            'arc-' + value + '', newValue);
    }

    Archetype.hasAttr = function (object, value) {
        return object.attr('arc-' + value) != undefined;
    }

    Archetype.generate = function (containerName) {
        var container = Archetype.data[containerName].container;
        var newContainer;
        switch (Archetype.data[containerName].type) {

            case 'list':
                newContainer = Archetype.listPop(container, Archetype.data[
                    containerName].data, Archetype.data[containerName].archetype.clone(true, true));
                break;

            case 'object':
                newContainer = Archetype.objectPop(Archetype.data[containerName].data, Archetype.data[containerName].archetype.clone(true, true));
                break;

            default:
                console.warn('Type of container (' + containerName + ') set incorrectly as' + Archetype.data[containerName].type);
                break;

        }

        $(container).replaceWith(newContainer[0]);
        Archetype.data[containerName].container = newContainer;
    }

    Archetype.build = function () {
        var containers = Archetype.get('container');
        $.each(containers, function (index, container) {
            var name = Archetype.attr($(container), 'container');
            var data;
            var type;
            if (Archetype.data[name] != undefined) {
                console.warn('Do not attempt to build twice - use Archetype.generate(modelName) after build');
                return false;
            }
            if (Archetype.hasAttr($(container), 'list')) {
                //list object
                type = 'list';
                data = window[Archetype.attr($(container), 'list')];
                Archetype.data[name] = {
                    type: type,
                    archetype: $(container).clone(true, true),
                    container: $(container),
                }
                if(newData instanceof Array){
                    Archetype.data[name].data = Array.from(data);
                }
                else{
                    Archetype.data[name].data = Object.assign({},data);
                }
        
                Archetype.generate(name);

            } else if (Archetype.hasAttr($(container), 'object')) {
                //dict object
                type = 'object';
                data = window[Archetype.attr($(container), 'object')];
                Archetype.data[name] = {
                    type: type,
                    archetype: $(container).clone(true, true),
                    container: $(container),
                }
                if(newData instanceof Array){
                    Archetype.data[name].data = Array.from(data);
                }
                else{
                    Archetype.data[name].data = Object.assign({},data);
                }
        
                Archetype.generate(name);
            } else {
                console.warn(
                    'No arc-list or arc-object varaible provided for this element'
                );
                console.warn(container);
            }
        });
    }

    Archetype.listPop = function (container, data, model) {
        if (model == undefined) {
            model = container.clone(true, true);
        }
        container.html('');
        $.each(data, function (index, value) {
            if ($.isPlainObject(value)) {
                object = Archetype.objectPop(value, model.children().clone(true, true));
                container.append(object);
            } else if (value instanceof Array) {} else {
                newElem = Archetype.valuePop(model.clone(true, true), 'arc-var',
                    value);
                container.append(newElem);
            }
        });

        return container;
    }

    Archetype.objectPop = function (data, model) {
        if (Archetype.hasAttr(model, 'id')) {
            Archetype.attr(model, 'id', (data[Archetype.attr(model, 'id')]));
        }
        $.each(data, function (index, value) {
            if ($.isPlainObject(value)) {
                //object
                $.each(model.find('[arc-object="' + index + '"]'), function (i,
                    elem) {
                    nestedModel = $(elem);
                    Archetype.objectPop(value, nestedModel);
                });
            } else if (value instanceof Array) {
                //list
                nestedContainer = model.find('[arc-list="' + index + '"]');
                Archetype.listPop(nestedContainer, value);
            } else {
                //literal
                Archetype.valuePop(model, index, value);
            }
        });
        return model;
    }

    Archetype.valuePop = function (model, index, value) {
        $.each(model.find('[arc-out="' + index + '"]'), function (i, elem) {
            //prevents entering nested objects
            if (index == 'arc-var') {
                if ($(elem).closest('[arc-list]')[0] == model[0]) {
                    $(elem).html(value);
                }
            }
            if ($(elem).closest('[arc-object]')[0] == model[0]) {
                $(elem).html(value);
            }
        })

        return model.find('[arc-out="' + index + '"]');

    }

    window.Archetype = Archetype;

})(window, $);