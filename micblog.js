/**
 * micblog 核心js库
 * 基于jquery lib
 * version 0.0.1
 */

$(function () {
    (function () {
        /**
         * @describe 设置博文图片等比例缩小
         */
        $('div.article img').on('load', function () {
            var imgw = $(this).width(),
                imgh = $(this).height(),
                margin = imgw - $('div.article').width();
            if (margin > 0) {
                //等比例缩小
                var ratio = imgh / imgw;
                $(this).width(imgw - margin);
                $(this).height(imgh - (margin * ratio));
            }
        });

        /**
        * @describe add toc
        */
         $("#toc").tocify({context:'div.article'});
    })();
});
