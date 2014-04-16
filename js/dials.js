(function ($) {
    $.fn.dial = function (options) {

        var index = 0,
                    data = [],
                    percentageDegrees,
                    dialLabel,
                    oldPercentAt = -1;

        function injectDial(dial, txt) {
            var ul = "<li class='q{0} slice'><div class='circle' /></li>",
                        html = "<ul class='circle'>" +
                               ul.replace('{0}', '1') +
                               ul.replace('{0}', '2') +
                               ul.replace('{0}', '3') +
                               ul.replace('{0}', '4') +
                               "</ul><div class=\"dialText\"><p class=\"dialTitle\" /><p class=\"dialDesc\">" +
                               txt +
                               "</p></div>";

            dial.html(html).addClass('dial');
        }

        function segment(quadrant, inner) {
            this.quadrant = quadrant;
            this.inner = inner;
            this.hidden = true;
            this.rot = '';
        }

        function setup(dialId) {
            for (var i = 0; i < 4; i++) {
                var cssSelector = dialId + ' .q' + (i + 1);

                data.push(new segment(
                            $(cssSelector),
                            $(cssSelector + ' div')
                        ));
            }

            data[0].rot = 'rotate(90deg)';
            data[1].rot = 'rotate(180deg)';
            data[2].rot = 'rotate(270deg)';

            dialLabel = $(dialId + ' .dialText p:first');
        }

        function animate(angle) {
            var n = 90 - angle;

            if (data[index].hidden) {
                data[index].quadrant.css('visibility', 'visible');
                data[index].hidden = false;
            }

            data[index].quadrant.css('transform', data[index].rot + ' skew(' + n + 'deg)');
            data[index].inner.css('transform', 'skew(-' + n + 'deg)');

            angle += settings.step;
            if (angle > 90) {
                ++index;
                angle -= 90;
            }

            var degreesAt = index * 90 + angle,
                        percentAt = Math.floor(degreesAt / 360 * 100);

            if (percentAt != oldPercentAt) {
                oldPercentAt = percentAt;
                dialLabel.text(percentAt + '%');
            }

            if (degreesAt <= percentageDegrees)
                setTimeout(animate, 20, angle);
        }

        var settings = $.extend({
            step: 3,
            percentage: 85,
            text: ''
        }, options);

        percentageDegrees = Math.floor(360 * settings.percentage / 100);

        injectDial(this, settings.text);
        setup('#' + this.attr('id'));
        animate(0);

        return this;
    };

} (jQuery));