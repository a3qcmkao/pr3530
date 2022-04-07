var mail = {
    mailConfigStr: '',
    priceArray: [],
    fetchItemPriceAjax: null,
    /**
     * ��ȡ��������������Ϣ
     * @return {[type]} [description]
     */
    fetchMailConfig: function () {
        var self = this;
        $.ajax({
            url: '/statics/js/webmail/mailsizelist.html',
            type: 'get',
            success: function (data) {
                // like : "1024:50^|^1G,3072:88^|^3G,10240:150^|^10G,1048576:178^|^1T"
                // ����������������Ϣ
                self.mailConfigStr = data.substring(2).split(" ")[0];
                // ��ʼ����ҳ������ѡ��
                var t = self.mailConfigStr.split(",");

                var mailBtnsDomArr = [];
                var priceIndex = 0;
                for (var i = 0, len = t.length; i < len; i++) {

                    var temp = t[i].split("^|^");

                    var templr = temp[0].split(":");
                    if (templr.length > 1) {
                        if (temp[1] != "10M") {
                            mailBtnsDomArr.push('<a href=\"javascript:void(0)\" class=\"link-btn ' + (i == 0 ? 'active' : '') + '\" >' + temp[1] + '<\/a>');
                            self.priceArray[priceIndex++] = temp[0];
                        }
                    }
                }

                // ����ҳ�������Сѡ��ť
                $("#J_mailConfigBtns").html(mailBtnsDomArr.join('')).on('click', 'a.link-btn', function () {
                    $("#J_mailConfigBtns a.link-btn").removeClass('active');
                    $(this).addClass('active');
                    self.fetchMailItemPrice($(this).index());

                });

                // ��ȡ����ĳ�������Ʒ�۸�
                self.fetchMailItemPrice(0);

            },
            error: function () {
                layer.alert('2');
            }
        });
    },
    // У������Ƿ�OK
    checkDIYMail: function (obj) {

        if (obj.MailSize1.value == "" || obj.userNum1.value == "") {
            return false;
        }
        return true;
    },
    bindScroll: function () {
        WJF.uiTool.initTab("J_anchorNavDom");
        var anchorNav = $("#J_anchorNavDom");
        var anchorNavEmpty = $("#J_anchorNavDomEmpty");
        var refContents =$("#J_tabContents");
        var offsetTop = anchorNav.offset().top;
        $(window).scroll(function (event) {
            var scrollHeight = $(window).scrollTop();
            if (scrollHeight > offsetTop) {
                anchorNavEmpty.addClass('active');
                anchorNav.addClass('fixed');
                refContents.addClass('active');
            } else {
                anchorNavEmpty.removeClass('active');
                anchorNav.removeClass('fixed');
                refContents.removeClass('active');
            }
        });
        $(function () {
            $(window).trigger('scroll');
        });
        var timeoutHandle = null;
        $(window).resize(function () {
            clearTimeout(timeoutHandle);
            timeoutHandle = setTimeout(function () {
                $(window).trigger('scroll');
            }, 200);
        });

    },
    init: function () {

        var self = this;
        // ����������
        $("#J_mailBanner").slide({
            mainCell: ".slide-wrapper ul",
            titCell: '.slide-pagination ul',
            effect: 'fold',
            switchLoad: '_bgimg',
            switchLoadTag: 'a',
            autoPage: true,
            autoPlay: true
        });

        WJF.uiTool.initTab("J_mailTabDom", {
            activeCls: 'guide-active',
            onTabChange: function (tabId, currentLiDom, currentContentID, prevContentId) {
                if (currentContentID == 'J_mail_3') {
                    $("#J_mailFaq").addClass('collapse-faq');
                    $("#J_mailLeft").addClass('expand-left');
                } else {
                    $("#J_mailFaq").removeClass('collapse-faq');
                    $("#J_mailLeft").removeClass('expand-left');
                }
            }
        });

        this.bindScroll();
        // ����URL��ַ �л�tab
        var param = window.location.search.match(/[&]?tabindex=(.+)[&]?/);
        if (param) {
            $("#J_mailTabDom li").eq(param[1]).trigger('click');
        }

        // ��ȡ������Ϣ
        this.fetchMailConfig();

    }
}
$(function () {
    mail.init();
})
