/*
 * HTML5 Sortable jQuery Plugin
 * https://github.com/voidberg/html5sortable
 *
 * Original code copyright 2012 Ali Farhadi.
 * This version is mantained by Alexandru Badiu <andu@ctrlz.ro>
 *
 * Thanks to the following contributors: andyburke, bistoco, daemianmack, drskullster, flying-sheep, OscarGodson, Parikshit N. Samant, rodolfospalenza, ssafejava
 *
 * Released under the MIT license.
 */
(function ($) {
    'use strict';

    var dragging, draggingHeight, placeholders = $();
    $.fn.sortable = function (options) {
        var method = String(options);

        options = $.extend({
            connectWith: false,
            placeholder: null
        }, options);

        return this.each(function () {
            var $this = $(this),
                citems,
                soptions,
                isHandle,
                index,
                items,
                startParent,
                newParent,
                placeholder;

            if (method === 'reload') {
                $this.children(options.items).off('dragstart.h5s dragend.h5s selectstart.h5s dragover.h5s dragenter.h5s drop.h5s');
            }
            if (/^enable|disable|destroy$/.test(method)) {
                citems = $this.children($this.data('items')).attr('draggable', method === 'enable');
                if (method === 'destroy') {
                    $this.off('sortupdate');
                    citems.add(this).removeData('connectWith items')
                        .off('dragstart.h5s dragend.h5s selectstart.h5s dragover.h5s dragenter.h5s drop.h5s').off('sortupdate');
                }
                return;
            }

            soptions = $this.data('opts');

            if (typeof soptions === 'undefined') {
                $this.data('opts', options);
            }
            else {
                options = soptions;
            }

            items = $this.children(options.items);

            placeholder = ( options.placeholder === null ) ? $('<' + (/^ul|ol$/i.test(this.tagName) ? 'li' : 'div') + ' class="sortable-placeholder">') : $(options.placeholder).addClass('sortable-placeholder');
            items.find(options.handle).mousedown(function () {
                isHandle = true;
            }).mouseup(function () {
                isHandle = false;
            });
            $this.data('items', options.items);
            placeholders = placeholders.add(placeholder);
            if (options.connectWith) {
                $(options.connectWith).add(this).data('connectWith', options.connectWith);
            }
            items.attr('draggable', 'true').on('dragstart.h5s', function (e) {
                e.stopImmediatePropagation();
                if (options.handle && !isHandle) {
                    return false;
                }
                isHandle = false;
                var dt = e.originalEvent.dataTransfer;
                dt.effectAllowed = 'move';
                dt.setData('Text', 'dummy');
                index = (dragging = $(this)).addClass('sortable-dragging').index();
                draggingHeight = dragging.outerHeight();
                startParent = dragging.parent();
            }).on('dragend.h5s', function () {
                if (!dragging) {
                    return;
                }
                dragging.removeClass('sortable-dragging').show();
                placeholders.detach();
                newParent = $(this).parent();
                if (index !== dragging.index() || startParent !== newParent) {
                    dragging.parent().triggerHandler('sortupdate', {item: dragging, oldindex: index, startparent: startParent, endparent: newParent});
                }
                dragging = null;
            }).not('a[href], img').on('selectstart.h5s', function () {
                if (options.handle && !isHandle) {
                    return true;
                }

                if (this.dragDrop) {
                    this.dragDrop();
                }
                return false;
            }).end().add([this, placeholder]).on('dragover.h5s dragenter.h5s drop.h5s', function (e) {
                if (!items.is(dragging) && options.connectWith !== dragging.parent().data('connectWith')) {
                    return true;
                }
                if (e.type === 'drop') {
                    e.stopPropagation();
                    placeholders.filter(':visible').after(dragging);
                    dragging.trigger('dragend.h5s');
                    return false;
                }
                e.preventDefault();
                e.originalEvent.dataTransfer.dropEffect = 'move';

                var $thisEl = $(this),
                    thisHeight,
                    thisIndex,
                    placeholderIndex,
                    deadZone,
                    offsetTop;

                if (items.is(this)) {
                    thisHeight = $thisEl.outerHeight();
                    thisIndex = $thisEl.index();
                    placeholderIndex = placeholder.index();

                    if (options.forcePlaceholderSize) {
                        placeholder.height(draggingHeight);
                    }

                    // Check if $(this) is bigger than the draggable. If it is, we have to define a dead zone to prevent flickering
                    if (thisHeight > draggingHeight) {
                        // Dead zone?
                        deadZone = thisHeight - draggingHeight;
                        offsetTop = $thisEl.offset().top;

                        if (placeholderIndex < thisIndex && e.originalEvent.pageY < offsetTop + deadZone) {
                            return false;
                        }
                        else if (placeholderIndex > thisIndex && e.originalEvent.pageY > offsetTop + thisHeight - deadZone) {
                            return false;
                        }
                    }

                    dragging.hide();
                    $thisEl[placeholderIndex < thisIndex ? 'after' : 'before'](placeholder);
                    placeholders.not(placeholder).detach();
                } else if (!placeholders.is(this) && !$thisEl.children(options.items).length) {
                    placeholders.detach();
                    $thisEl.append(placeholder);
                }
                return false;
            });
        });
    };
}(window.jQuery));
