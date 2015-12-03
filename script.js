! function($) {
    var playing = false;

    $('svg').click(function() {
        playing = !playing;
        var animation = playing ? 'stop' : 'play';
        $('#animate_to_' + animation).get(0).beginElement();
    });
}($);

! function($) {
    var isPlaying = true;
    $('#btn').click(function() {
        console.log('hi');
        if (isPlaying == false) {
            document.getElementById('song').play();
            isPlaying = true;
        } else {
            document.getElementById('song').pause();
            isPlaying = false;
        }
    });
}($);

! function($) {
    "use strict";
    var Typed = function(el, options) {
        this.el = $(el);
        this.options = $.extend({}, $.fn.typed.defaults, options);
        this.isInput = this.el.is('input');
        this.attr = this.options.attr;

        this.showCursor = this.isInput ? false : this.options.showCursor;
        this.elContent = this.attr ? this.el.attr(this.attr) : this.el.text()
        this.contentType = this.options.contentType;
        this.typeSpeed = this.options.typeSpeed;
        this.startDelay = this.options.startDelay;
        this.backSpeed = this.options.backSpeed;
        this.backDelay = this.options.backDelay;
        this.strings = this.options.strings;
        this.strPos = 0;
        this.arrayPos = 0;
        this.stopNum = 0;
        this.loop = this.options.loop;
        this.loopCount = this.options.loopCount;
        this.curLoop = 0;
        this.stop = false;
        this.cursorChar = this.options.cursorChar;
        this.build();
    };

    Typed.prototype = {
        constructor: Typed,
        init: function() {
            var self = this;
            self.timeout = setTimeout(function() {
                self.typewrite(self.strings[self.arrayPos], self.strPos);
            }, self.startDelay);
        },
        build: function() {
            if (this.showCursor === true) {
                this.cursor = $("<span class=\"typed-cursor\">" + this.cursorChar + "</span>");
                this.el.after(this.cursor);
            }
            this.init();
        },
        typewrite: function(curString, curStrPos) {
            if (this.stop === true) {
                return;
            }
            var humanize = Math.round(Math.random() * (100 + 20)) + this.typeSpeed;
            var self = this;
            self.timeout = setTimeout(function() {
                var charPause = 0;
                var substr = curString.substr(curStrPos);
                if (substr.charAt(0) === '^') {
                    var skip = 1; // skip atleast 1
                    if (/^\^\d+/.test(substr)) {
                        substr = /\d+/.exec(substr)[0];
                        skip += substr.length;
                        charPause = parseInt(substr);
                    }
                    curString = curString.substring(0, curStrPos) + curString.substring(curStrPos + skip);
                }

                if (self.contentType === 'html') {
                    if (curString.substr(curStrPos).charAt(0) === '<') {
                        var tag = '';
                        while (curString.substr(curStrPos).charAt(0) !== '>') {
                            tag += curString.substr(curStrPos).charAt(0);
                            curStrPos++;
                        }
                        curStrPos++;
                        tag += '>';
                    }
                }

                self.timeout = setTimeout(function() {
                    if (curStrPos === curString.length) {
                        self.options.onStringTyped(self.arrayPos);
                        if (self.arrayPos === self.strings.length - 1) {
                            self.options.callback();
                            self.curLoop++;
                            if (self.loop === false || self.curLoop === self.loopCount)
                                return;
                        }

                        self.timeout = setTimeout(function() {
                            self.backspace(curString, curStrPos);
                        }, self.backDelay);
                    } else {
                        if (curStrPos === 0)
                            self.options.preStringTyped(self.arrayPos);
                        var nextString = self.elContent + curString.substr(0, curStrPos + 1);
                        if (self.attr) {
                            self.el.attr(self.attr, nextString);
                        } else {
                            if (self.contentType === 'html') {
                                self.el.html(nextString);
                            } else {
                                self.el.text(nextString);
                            }
                        }
                        curStrPos++;
                        self.typewrite(curString, curStrPos);
                    }
                }, charPause);
            }, humanize);

        },
        backspace: function(curString, curStrPos) {
            if (this.stop === true) {
                return;
            }
            var humanize = Math.round(Math.random() * (100 - 30)) + this.backSpeed;
            var self = this;

            self.timeout = setTimeout(function() {
                if (self.contentType === 'html') {
                    if (curString.substr(curStrPos).charAt(0) === '>') {
                        var tag = '';
                        while (curString.substr(curStrPos).charAt(0) !== '<') {
                            tag -= curString.substr(curStrPos).charAt(0);
                            curStrPos--;
                        }
                        curStrPos--;
                        tag += '<';
                    }
                }
                var nextString = self.elContent + curString.substr(0, curStrPos);
                if (self.attr) {
                    self.el.attr(self.attr, nextString);
                } else {
                    if (self.contentType === 'html') {
                        self.el.html(nextString);
                    } else {
                        self.el.text(nextString);
                    }
                }
                if (curStrPos > self.stopNum) {
                    curStrPos--;
                    self.backspace(curString, curStrPos);
                } else if (curStrPos <= self.stopNum) {
                    self.arrayPos++;

                    if (self.arrayPos === self.strings.length) {
                        self.arrayPos = 0;
                        self.init();
                    } else
                        self.typewrite(self.strings[self.arrayPos], curStrPos);
                }
            }, humanize);

        },
        reset: function() {
            var self = this;
            clearInterval(self.timeout);
            var id = this.el.attr('id');
            this.el.after('<span id="' + id + '"/>')
            this.el.remove();
            this.cursor.remove();
            // Send the callback
            self.options.resetCallback();
        }
    };
    $.fn.typed = function(option) {
        return this.each(function() {
            var $this = $(this),
                data = $this.data('typed'),
                options = typeof option == 'object' && option;
            if (!data) $this.data('typed', (data = new Typed(this, options)));
            if (typeof option == 'string') data[option]();
        });
    };
    $.fn.typed.defaults = {
        strings: ["These are the default values...", "You know what you should do?", "Use your own!", "Have a great day!"],
        typeSpeed: 0,
        startDelay: 0,
        backDelay: 500,
        loop: false,
        loopCount: false,
        contentType: 'html',
        callback: function() {},
        preStringTyped: function() {},
        onStringTyped: function() {},
        resetCallback: function() {}
    };
    $(".element").typed({
        strings: ["Whenever I get gloomy with the state of the world, I think about the arrivals gate at Heathrow Airport.",
            "^4000 General opinion's starting to make out that we live in a world of hatred and greed, but I don't see that.",
            "It seems to me that love is everywhere.",
            "Often it's not particularly dignified or newsworthy, but it's always there - fathers and sons, mothers and daughters, husbands and wives, boyfriends, girlfriends, old friends.",
            "When the planes hit the Twin Towers, as far as I know none of the phone calls from the people on board were messages of hate or revenge - they were all messages of love.",
            "If you look for it, I've got a sneaky feeling you'll find that love actually is... ^1000 <strong>all around.</strong>",
            "^2000 <h1><span class='red'>Happy</span>Christmas</h1>"
        ],
        contentType: 'html',
        backDelay: 1000,
        backSpeed: -10000,
        typeSpeed: 0
    });
}($);

! function($) {
    var COUNT = 420;
    var masthead = document.querySelector('.snow');
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var width = masthead.clientWidth;
    var height = masthead.clientHeight;
    var i = 1;
    var active = false;

    function onResize() {
        width = masthead.clientWidth;
        height = masthead.clientHeight;
        canvas.width = width;
        canvas.height = height;
        ctx.fillStyle = '#FFF';

        var wasActive = active;
        active = width > 600;

        if (!wasActive && active)
            requestAnimFrame(update);
    }

    var Snowflake = function() {
        this.x = 0;
        this.y = 0;
        this.vy = 0;
        this.vx = 0;
        this.r = 0;

        this.reset();
    }

    Snowflake.prototype.reset = function() {
        this.x = Math.random() * width;
        this.y = Math.random() * -height;
        this.vy = 1 + Math.random() * 3;
        this.vx = 0.5 - Math.random();
        this.r = 1 + Math.random() * 2;
        this.o = 0.5 + Math.random() * 0.5;
    }

    canvas.style.position = 'absolute';
    canvas.style.left = canvas.style.top = '0';

    var snowflakes = [],
        snowflake;
    for (i = 0; i < COUNT; i++) {
        snowflake = new Snowflake();
        snowflake.reset();
        snowflakes.push(snowflake);
    }

    function update() {

        ctx.clearRect(0, 0, width, height);

        if (!active)
            return;

        for (i = 0; i < COUNT; i++) {
            snowflake = snowflakes[i];
            snowflake.y += snowflake.vy;
            snowflake.x += snowflake.vx;

            ctx.globalAlpha = snowflake.o;
            ctx.beginPath();
            ctx.arc(snowflake.x, snowflake.y, snowflake.r, 0, Math.PI * 3, false);
            ctx.closePath();
            ctx.fill();

            if (snowflake.y > height) {
                snowflake.reset();
            }
        }

        requestAnimFrame(update);
    }

    // shim layer with setTimeout fallback
    window.requestAnimFrame = (function() {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            function(callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    onResize();
    window.addEventListener('resize', onResize, false);

    masthead.appendChild(canvas);
}($);
