Archetype = {};
var Arc = Archetype;

Arc.data = {};
Arc.get = function (value, within) {
    if (within) {
        return within.find('[arc-' + value + ']');
    } else {
        return $('[arc-' + value + ']');
    }
}

Arc.attr = function (object, value, newValue) {
    return (newValue == undefined) ? object.attr('arc-' + value + '') : object.attr(
        'arc-' + value + '', newValue);
}

Arc.hasAttr = function (object, value) {
    return object.attr('arc-' + value) != undefined;
}

Archetype.generate = function(containerName){
    container = Arc.data[containerName].container;
    console.log(container[0]);
    console.log(Arc.data[containerName].archetype[0]);
    var newContainer = Arc.listPop(container, Arc.data[
        containerName].data,Arc.data[containerName].archetype.clone(true,true));
    $(container).replaceWith(newContainer[0]);
    Arc.data[containerName].container = newContainer;
}

Archetype.build = function () {
    var containers = Arc.get('container');
    $.each(containers, function (index, container) {
        var name = Arc.attr($(container), 'container');
        var data;
        var type;
        if(Arc.data[name] != undefined){
            console.warn('Don\' attempt to build twice - use generate after build');
            return false;
        }
        if (Arc.hasAttr($(container), 'list')) {
            //list object
            type = 'list';
            data = window[Arc.attr($(container), 'list')];
            Arc.data[name] = {
                data: data,
                type: type,
                archetype: $(container).clone(true, true),
                container: $(container),
            }
            Archetype.generate(name);
            
        } else if (Arc.hasAttr($(container), 'object')) {
            //dict object
        } else {
            console.warn(
                'No arc-list or arc-object varaible provided for this element'
            );
            console.warn(container);
        }
    });
}

Arc.listPop = function (container, data, model) {
    if(model == undefined){
        model = container.clone(true, true);
    }
    container.html('');

    $.each(data, function (index, value) {
        if ($.isPlainObject(value)) {
            object = Arc.objectPop(value, model.children().clone(true, true));
            container.append(object);
        } else if (value instanceof Array) {} else {
            newElem = Arc.valuePop(model.clone(true, true), 'arc-var',
                value);
            container.append(newElem);
        }
    });

    return container;
}

Arc.objectPop = function (data, model) {
    if (Arc.hasAttr(model, 'id')) {
        Arc.attr(model, 'id', (data[Arc.attr(model, 'id')]));
    }
    $.each(data, function (index, value) {
        if ($.isPlainObject(value)) {
            //object
            $.each(model.find('[arc-object="' + index + '"]'), function (i,
                elem) {
                nestedModel = $(elem);
                Arc.objectPop(value, nestedModel);
            });
        } else if (value instanceof Array) {
            //list
            nestedContainer = model.find('[arc-list="' + index + '"]');
            Arc.listPop(nestedContainer, value);
        } else {
            //literal
            Arc.valuePop(model, index, value);
        }
    });
    return model;
}

Arc.valuePop = function (model, index, value) {
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

Archetype.build();
