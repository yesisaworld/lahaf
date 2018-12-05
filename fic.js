<script>
    if (document.getElementById("fic-main")) {
        document.body.classList.add("fic-page");
        var linkElement = document.createElement('link');
        linkElement.setAttribute('rel', 'stylesheet');
        linkElement.setAttribute('type', 'text/css');
        linkElement.setAttribute('href', "https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.1.3/css/bootstrap.min.css");
        document.getElementsByTagName('head')[0].appendChild(linkElement);
        var jquery = document.createElement("script");
        jquery.async = false;
        jquery.onload = function () {
            var bootstrap = document.createElement("script");
            bootstrap.async = false;
            bootstrap.onload = function () {
                //var dynamicScrollspy = new DynamicScrollspy();
                //dynamicScrollspy.init(); 
                var ficFilter = new FicFilter();
                ficFilter.init();
                
            };
            bootstrap.src = "https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.1.3/js/bootstrap.min.js";
            var scriptTag = document.getElementsByTagName('script')[0];
            scriptTag.parentNode.insertBefore(bootstrap, scriptTag);
        };
        jquery.src = "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js";
        var scriptTag = document.getElementsByTagName('script')[0];
        scriptTag.parentNode.insertBefore(jquery, scriptTag);
        var FicFilter = /** @class */ (function () {
            function FicFilter() {
            }
            FicFilter.prototype.init = function () {
                var that = this;
                this.buildSearchUI();
                $(document).on("click", ".category li[data-filter]", this.toggleFilter);
            };
            FicFilter.prototype.toggleFilter = function (e) {
                var tag = $(e.target).parents("li[data-filter]");
                tag.toggleClass("active");
                var hide = function (x) { x.slideUp(); };
                var show = function (x) { x.slideDown(); };
                var isInRange = function (tag, length) {
                    return true;
                };
                var groupTagsByCategory = function (tags) {
                    var map = {};
                    if (tags.length == 0)
                        return null;
                    for (var x = 0; x < tags.length; x++) {
                        var tag = $(tags[x]).data("filter");
                        var parts = tag.split(":");
                        var category = parts[0];
                        var key = parts[1];
                        if (map[category] == null) {
                            map[category] = [];
                        }
                        if (!map[category].includes(key)) {
                            map[category].push(key);
                        }
                    }
                    return map;
                };
                var activeTags = groupTagsByCategory($("li.active", "#search-ui"));
                var visibleFics = $(".fic-entry");
                var series = $(".series");
                if (activeTags == null) {
                    show(visibleFics);
                    show(series);
                    $('html, body').animate({ scrollTop: 0 }, 500);
                    return;
                }
                for (var i = 0; i < visibleFics.length; i++) {
                    var fic = $(visibleFics[i]);
                    var ficTags = groupTagsByCategory($(".badge-pill", fic));
                    var _loop_1 = function (activeCategory) {
                        if (activeTags.hasOwnProperty(activeCategory)) {
                            isMatch = activeCategory != "length" ? ficTags[activeCategory] != null && ficTags[activeCategory].filter(function (a) { return activeTags[activeCategory].some(function (b) { return a === b; }); }).length > 0 : ficTags[activeCategory] != null && ficTags[activeCategory].filter(function (a) { return activeTags[activeCategory].some(function (b) {
                                var parts = b.replace(/ /g, "").replace(/,/g, "").replace(/\+/g, "").split("-");
                                var startLength = Number(parts[0]);
                                var endLength = Number(parts[1]);
                                var length = Number(a);
                                return length >= startLength && (parts.length === 1 || length <= endLength);
                            }); }).length > 0;
                            if (!isMatch) {
                                fic.removeClass("matched");
                                hide(fic);
                                return "break";
                            }
                            else {
                                fic.addClass("matched");
                                show(fic);
                            }
                        }
                    };
                    var isMatch;
                    for (var activeCategory in activeTags) {
                        var state_1 = _loop_1(activeCategory);
                        if (state_1 === "break")
                            break;
                    }
                }
                for (var j = 0; j < series.length; j++) {
                    var s = $(series[j]);
                    var hasMatch = $(".fic-entry.matched", s).length > 0;
                    if (!hasMatch) {
                        hide(s);
                    }
                    else {
                        show(s);
                    }
                }
                
                if ($(".fic-entry.matched").length === 0) {
                   $("#no-fics").show(); 
                }
                else {
                    $("#no-fics").hide();
                }
                $('html, body').animate({ scrollTop: 0 }, 500);
            };
            FicFilter.prototype.buildSearchUI = function () {
                var map = {};
                var tags = $(".badge");
   
                for (var i = 0; i < tags.length; i++) {
                    var tag = $(tags[i]).data("filter");
                    var parts = tag.split(":");
                    var category = parts[0];
                    var key = parts[1];
                    if (map[category] === undefined) {
                        map[category] = [];
                    }
                    if (map[category].find(function (i) { return i === key; }) == null) {
                        map[category].push(key);
                    }
                }
                $("#search-ui").append($("<div class='nav'>").append("<ul>"));
                var ul = $("ul", "#search-ui");
                for (var category_1 in map) {
                    if (map.hasOwnProperty(category_1)) {
                        var categoryContainer = $("<li>", { text: category_1, "class": "category", "data-category": category_1 });
                        var div = $("<ul>");
                        categoryContainer.append(div);
                        var keys = map[category_1].sort();
                        if (category_1 === "length") {
                            keys = ["1 - 100", "101 - 500", "501 - 25,000", "25,001 - 50,000", "50,000+"];
                        }
                        for (var i = 0; i < keys.length; i++) {
                            var item = $("<span>", { "class": "badge badge-pill", text: keys[i] });
                            div.append($("<li>", { "data-filter": category_1 + ":" + keys[i] }).append(item));
                        }
                        ul.append(categoryContainer);
                    }
                }
            };
            return FicFilter;
        }());
        var DynamicScrollspy = /** @class */ (function () {
            function DynamicScrollspy() {
            }
            DynamicScrollspy.prototype.buildLi = function (element) {
                var li = $("<li/>");
                var selector = (element.hasClass("series") ? "h3" : "") + ".card-title";
                var title = element.find(selector).text();
                var a = $("<a>", { text: title, href: "#" + element.prop("id"), target: "_blank" });
                li.append(a);
                return li;
            };
            DynamicScrollspy.prototype.init = function () {
                var that = this;
                var nav = $("<nav>");
                var mainUl = $("<ul>");
                var seriesUl = null;
                $(".fic-entry,.series").each(function (index, item) {
                    var element = $(item);
                    if (element.hasClass("series")) {
                        seriesUl = $("<ul>");
                        var seriesLi = that.buildLi(element);
                        mainUl.append(seriesLi);
                        mainUl.append(seriesUl);
                    }
                    else {
                        var li = that.buildLi(element);
                        if (element.parents(".series").length > 0) {
                            seriesUl.append(li);
                        }
                        else {
                            seriesUl = null;
                            mainUl.append(li);
                        }
                    }
                });
                nav.append(mainUl);
                $("#dynamic-scrollspy").append(nav);
                // wire up
                $("body").scrollspy({ target: "#dynamic-scrollspy nav" });
            };
            return DynamicScrollspy;
        }());
    }
</script>
