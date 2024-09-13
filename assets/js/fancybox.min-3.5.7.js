// ==================================================
// fancyBox v3.5.7
// Licensed GPLv3 for open source use
// or fancyBox Commercial License for commercial use
// http://fancyapps.com/fancybox/
// Copyright 2019 fancyApps
// ==================================================

!(function (window, document, $) {
    "use strict";

    function initFancyBox(event, options) {
        const e = options || {};
        event.preventDefault();

        let target = $(event.currentTarget).trigger("blur");
        const instance = $.fancybox.getInstance();

        if (instance && instance.$trigger && instance.$trigger.is(target)) return;

        const selector = e.selector ? $(e.selector) : null;
        const items = selector || $('[data-fancybox="' + (target.attr("data-fancybox") || "") + '"]');

        const index = items.index(target) < 0 ? 0 : items.index(target);
        const fancyboxInstance = $.fancybox.open(items, e, index);
        fancyboxInstance.$trigger = target;
    }

    if (console) {
        console.info = console.info || function () {};
    }

    if ($) {
        if ($.fn.fancybox) {
            return console.info("fancyBox already initialized");
        }

        const defaults = {
            closeExisting: false,
            loop: false,
            gutter: 50,
            keyboard: true,
            preventCaptionOverlap: true,
            arrows: true,
            infobar: true,
            smallBtn: "auto",
            toolbar: "auto",
            buttons: ["zoom", "slideShow", "close"],
            idleTime: 3,
            protect: false,
            modal: false,
            image: { preload: false },
            ajax: { settings: { data: { fancybox: true } } },
            iframe: {
                tpl: '<iframe id="fancybox-frame{rnd}" name="fancybox-frame{rnd}" class="fancybox-iframe" allowfullscreen allow="autoplay; fullscreen" src=""></iframe>',
                preload: true,
                css: {},
                attr: { scrolling: "auto" }
            },
            video: {
                tpl: '<video class="fancybox-video" controls controlsList="nodownload" poster="{{poster}}"><source src="{{src}}" type="{{format}}" />Sorry, your browser doesn\'t support embedded videos, <a href="{{src}}">download</a> and watch with your favorite video player!</video>',
                format: "",
                autoStart: true
            },
            defaultType: "image",
            animationEffect: "zoom",
            animationDuration: 366,
            zoomOpacity: "auto",
            transitionEffect: "fade",
            transitionDuration: 366,
            slideClass: "",
            baseClass: "",
            baseTpl: `
                <div class="fancybox-container" role="dialog" tabindex="-1">
                    <div class="fancybox-bg"></div>
                    <div class="fancybox-inner">
                        <div class="fancybox-infobar">
                            <span data-fancybox-index></span>&nbsp;/&nbsp;<span data-fancybox-count></span>
                        </div>
                        <div class="fancybox-toolbar">{{buttons}}</div>
                        <div class="fancybox-navigation">{{arrows}}</div>
                        <div class="fancybox-stage"></div>
                        <div class="fancybox-caption"><div class="fancybox-caption__body"></div></div>
                    </div>
                </div>`,
            spinnerTpl: '<div class="fancybox-loading"></div>',
            errorTpl: '<div class="fancybox-error"><p>{{ERROR}}</p></div>',
            btnTpl: {
                download: '<a download data-fancybox-download class="fancybox-button fancybox-button--download" title="{{DOWNLOAD}}" href="javascript:;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18.62 17.09V19H5.38v-1.91zm-2.97-6.96L17 11.45l-5 4.87-5-4.87 1.36-1.32 2.68 2.64V5h1.92v7.77z"/></svg></a>',
                zoom: '<button data-fancybox-zoom class="fancybox-button fancybox-button--zoom" title="{{ZOOM}}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18.7 17.3l-3-3a5.9 5.9 0 0 0-.6-7.6 5.9 5.9 0 0 0-8.4 0 5.9 5.9 0 0 0 0 8.4 5.9 5.9 0 0 0 7.7.7l3 3a1 1 0 0 0 1.3 0c.4-.5.4-1 0-1.5zM8.1 13.8a4 4 0 0 1 0-5.7 4 4 0 0 1 5.7 0 4 4 0 0 1 0 5.7 4 4 0 0 1-5.7 0z"/></svg></button>',
                close: '<button data-fancybox-close class="fancybox-button fancybox-button--close" title="{{CLOSE}}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 10.6L6.6 5.2 5.2 6.6l5.4 5.4-5.4 5.4 1.4 1.4 5.4-5.4 5.4 5.4 1.4-1.4-5.4-5.4 5.4-5.4-1.4-1.4-5.4 5.4z"/></svg></button>',
                arrowLeft: '<button data-fancybox-prev class="fancybox-button fancybox-button--arrow_left" title="{{PREV}}"><div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M11.28 15.7l-1.34 1.37L5 12l4.94-5.07 1.34 1.38-2.68 2.72H19v1.94H8.6z"/></svg></div></button>',
                arrowRight: '<button data-fancybox-next class="fancybox-button fancybox-button--arrow_right" title="{{NEXT}}"><div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.4 12.97l-2.68 2.72 1.34 1.38L19 12l-4.94-5.07-1.34 1.38 2.68 2.72H5v1.94z"/></svg></div></button>',
                smallBtn: '<button type="button" data-fancybox-close class="fancybox-button fancybox-close-small" title="{{CLOSE}}"><svg xmlns="http://www.w3.org/2000/svg" version="1" viewBox="0 0 24 24"><path d="M13 12l5-5-1-1-5 5-5-5-1 1 5 5-5 5 1 1 5-5 5 5 1-1z"/></svg></button>'
            },
            parentEl: "body",
            hideScrollbar: true,
            autoFocus: true,
            backFocus: true,
            trapFocus: true,
            fullScreen: { autoStart: false },
            touch: { vertical: true, momentum: true },
            hash: null,
            media: {},
            slideShow: { autoStart: false, speed: 3000 },
            thumbs: { autoStart: false, hideOnClose: true, parentEl: ".fancybox-container", axis: "y" },
            wheel: "auto",
            onInit: $.noop,
            beforeLoad: $.noop,
            afterLoad: $.noop,
            beforeShow: $.noop,
            afterShow: $.noop,
            beforeClose: $.noop,
            afterClose: $.noop,
            onActivate: $.noop,
            onDeactivate: $.noop,
            clickContent: function (type, instance) {
                return type === "image" && "zoom";
            },
            clickSlide: "close",
            clickOutside: "close",
            dblclickContent: false,
            dblclickSlide: false,
            dblclickOutside: false,
            mobile: {
                preventCaptionOverlap: false,
                idleTime: false,
                clickContent: function (type, instance) {
                    return type === "image" && "toggleControls";
                },
                clickSlide: function (type, instance) {
                    return type === "image" ? "toggleControls" : "close";
                },
                dblclickContent: function (type, instance) {
                    return type === "image" && "zoom";
                },
                dblclickSlide: function (type, instance) {
                    return type === "image" && "zoom";
                }
            },
            lang: "en",
            i18n: {
                en: {
                    CLOSE: "Close",
                    NEXT: "Next",
                    PREV: "Previous",
                    ERROR: "The requested content cannot be loaded. <br/> Please try again later.",
                    PLAY_START: "Start slideshow",
                    PLAY_STOP: "Pause slideshow",
                    FULL_SCREEN: "Full screen",
                    THUMBS: "Thumbnails",
                    DOWNLOAD: "Download",
                    SHARE: "Share",
                    ZOOM: "Zoom"
                },
                de: {
                    CLOSE: "Schlie&szlig;en",
                    NEXT: "Weiter",
                    PREV: "Zur&uuml;ck",
                    ERROR: "Die angeforderten Daten konnten nicht geladen werden. <br/> Bitte versuchen Sie es sp&auml;ter nochmal.",
                    PLAY_START: "Diaschau starten",
                    PLAY_STOP: "Diaschau beenden",
                    FULL_SCREEN: "Vollbild",
                    THUMBS: "Vorschaubilder",
                    DOWNLOAD: "Herunterladen",
                    SHARE: "Teilen",
                    ZOOM: "Vergr&ouml;&szlig;ern"
                }
            }
        };

        const FancyBox = function (target, options, index) {
            const instance = this;
            instance.opts = $.extend(true, {}, defaults, options);
            instance.id = instance.opts.id || ++c;
            instance.currIndex = parseInt(instance.opts.index, 10) || 0;
            instance.prevIndex = null;
            instance.prevPos = null;
            instance.currPos = 0;
            instance.firstRun = true;
            instance.group = [];
            instance.slides = {};
            instance.addContent(target);
            if (instance.group.length) instance.init();
        };

        $.extend(FancyBox.prototype, {
            init: function () {
                const instance = this;
                const options = instance.group[instance.currIndex].opts;

                if (options.closeExisting) $.fancybox.close(true);
                $("body").addClass("fancybox-active");
                if (!$.fancybox.getInstance() && !options.hideScrollbar && !$.fancybox.isMobile && document.body.scrollHeight > window.innerHeight) {
                    $("head").append('<style id="fancybox-style-noscroll" type="text/css">.compensate-for-scrollbar{margin-right:' + (window.innerWidth - document.documentElement.clientWidth) + "px;}</style>");
                    $("body").addClass("compensate-for-scrollbar");
                }

                let buttons = "";
                $.each(options.buttons, function (index, button) {
                    buttons += options.btnTpl[button] || "";
                });

                const container = $(instance.translate(instance, options.baseTpl.replace("{{buttons}}", buttons).replace("{{arrows}}", options.btnTpl.arrowLeft + options.btnTpl.arrowRight)))
                    .attr("id", "fancybox-container-" + instance.id)
                    .addClass(options.baseClass)
                    .data("FancyBox", instance)
                    .appendTo(options.parentEl);

                instance.$refs = { container: container };

                ["bg", "inner", "infobar", "toolbar", "stage", "caption", "navigation"].forEach(function (ref) {
                    instance.$refs[ref] = container.find(".fancybox-" + ref);
                });

                instance.trigger("onInit");
                instance.activate();
                instance.jumpTo(instance.currIndex);
            },

            translate: function (instance, template) {
                const lang = instance.opts.i18n[instance.opts.lang] || instance.opts.i18n.en;
                return template.replace(/\{\{(\w+)\}\}/g, function (match, key) {
                    return lang[key] === undefined ? match : lang[key];
                });
            },

            addContent: function (content) {
                const instance = this;
                const items = $.makeArray(content);
                $.each(items, function (index, item) {
                    let slide = {};
                    if ($.isPlainObject(item)) {
                        slide = item;
                    } else if ($.isObject(item) && $(item).length) {
                        const $item = $(item);
                        slide = {
                            src: $item.data("fancybox") || $item.attr("href"),
                            type: "inline",
                            opts: $item.data() || {}
                        };
                    } else {
                        slide = { type: "html", src: item + "" };
                    }

                    slide.opts = $.extend(true, {}, instance.opts, slide.opts);
                    instance.group.push(slide);
                });

                if (Object.keys(instance.slides).length) {
                    instance.updateControls();
                }
            },

            updateControls: function () {
                const instance = this;
                const current = instance.current;
                const index = current.index;
                const container = instance.$refs.container;
                const caption = current.opts.caption;

                current.$slide.trigger("refresh");
                if (caption && caption.length) {
                    instance.$caption = container.find(".fancybox-caption");
                    instance.$caption.children().eq(0).html(caption);
                } else {
                    instance.$caption = null;
                }

                container.find("[data-fancybox-count]").html(instance.group.length);
                container.find("[data-fancybox-index]").html(index + 1);
                container.find("[data-fancybox-prev]").prop("disabled", !current.opts.loop && index <= 0);
                container.find("[data-fancybox-next]").prop("disabled", !current.opts.loop && index >= instance.group.length - 1);
            },

            // Additional methods can be added here
        });

        $.extend($.fancybox, {
            version: "3.5.7",
            defaults: defaults,
            getInstance: function (method, ...args) {
                const instance = $(".fancybox-container:not('.fancybox-is-closing'):last").data("FancyBox");
                if (instance) {
                    if (typeof method === "string") {
                        return instance[method](...args);
                    } else if (typeof method === "function") {
                        return method.apply(instance, args);
                    }
                }
            },
            open: function (content, options, index) {
                return new FancyBox(content, options, index);
            },
            close: function () {
                const instance = this.getInstance();
                if (instance) {
                    instance.close();
                }
            },
            destroy: function () {
                this.close(true);
                $("body").off("click.fb-start", "**");
            },
            // Additional static methods can be added here
        });

        $(document).on("click.fb-start", "[data-fancybox]", initFancyBox);
        $(document).on("click.fb-start", "[data-fancybox-trigger]", function (event) {
            $(`[data-fancybox="${$(this).attr("data-fancybox-trigger")}"]`).eq($(this).attr("data-fancybox-index") || 0).trigger("click.fb-start", { $trigger: $(this) });
        });

        // Additional event handlers can be added here
    }
})(window, document, jQuery);
