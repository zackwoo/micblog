/**
 * micblog 核心js库
 * 基于jquery lib
 * version 0.0.1
 */

(function (window, document, $) {
    $(function () {
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
         * @describe 左侧功能区事件
         */
        $('div.web-fun').on('click','a',function(e){
            var self = $(this);
            if(self.is('.fa-search')){
                $('div#Category').animate({left:160});
                $('div#Search').animate({left:0});
                $('#search-ctrl').focus();
            }
            if(self.is('.fa-tag')){
                $('div#Category').animate({left:0});
                $('div#Search').animate({left:-162});
            }
        });

         /**
         * @describe 查询
         */
        $('#search-btn').click(function(){
            var searchTxt = $('#search-ctrl').val();
            if($.trim(searchTxt).length){
                window.open("http://www.gfsoso.com/?q="+encodeURIComponent(searchTxt+' site:'+$('#search-ctrl').data('domain')));
            }
        });


    });
})(window, document, window.jQuery);
