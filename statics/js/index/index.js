var newMainIndex = {
    // ������ѯ��Ŀ
    initDomainQuery: function () {
        var self = this;
        // ������׺����
        this.domExtWrapper = $("#domextWrapper");
        // ȫѡ����ѡ�����ð�ť����
        this.domExtSelectOper = $("#domextSelectOper");

        // ���泣��ѡ��
        // this.domExtWrapper.find('input:checked').each(function() {
        //     $(this).attr('common-use', '1');
        // });

        // Ĭ�ϵ�������ѡ�¼�
        this.domExtWrapper.on('click', 'label', function (event) {
            // ���ε����a��ǩ����checkbox����ѡ����
            if (event.target.type == 'checkbox' || event.target.type == '') {
                return;
            }
            $(this).toggleClass('checked');
        });

        // չ��/�۵���ǩ
        $("#expandCollapseIcon").on('click', function () {
            self.domExtSelectOper.toggleClass('hide');
            self.domExtWrapper.toggleClass('collapse');
            var target = $(this);

            if (target.hasClass('collapse-icon')) {
                target.removeClass('collapse-icon');
                target.text('����չ��');
            } else {
                target.addClass('collapse-icon');
                target.text('�����۵�');
            }
        });
        // radio ѡ�����
        this.domExtSelectOper.find('input').change(function (event) {
            var target = $(this);
            var value = $(this).val();
            switch (value) {
                // ȫѡ
                case '0':
                    self.domExtWrapper.find('label').each(function () {
                        var labelDom = $(this);
                        labelDom.removeClass('checked').addClass('checked');
                        labelDom.find('input').prop('checked', 'checked');
                    });
                    break;
                // ȫ��ѡ
                case '1':
                    self.domExtWrapper.find('label').each(function () {
                        var labelDom = $(this);
                        labelDom.removeClass('checked');
                        labelDom.find('input').prop('checked', '');
                    });
                    break;
                // ����
                case '2':
                    self.domExtWrapper.find('label').each(function () {
                        var labelDom = $(this);
                        var currInput = labelDom.find('input');
                        if (currInput.attr('common-use') == '1') {
                            currInput.prop('checked', 'checked');
                            labelDom.removeClass('checked').addClass('checked');
                        } else {
                            currInput.prop('checked', '');
                            labelDom.removeClass('checked');
                        }
                    });
                    break;
            }
        });

        // ������ѯ���ύ
        $("#domainQueryForm").on('submit', function (event) {

            // 1. �ж��Ƿ�����ȷ����������
            var domName = $.trim($("#J_domName").val());
            if (!domName) {
                layer.alert('����дҪ��ѯ������!');
                return false;
            }
            var val = domName.replace(/\s/g, '');
            val = val.replace(/^\./, '');
            val = val.replace(/\.$/, '');
            // �û�ֱ������ĺ�׺
            var inputExt = val.match(/(www\.)?([^\.]+(\..*))/);
            // Ҫ��ѯ������ �������� ����www.
            var domainList = [];
            if (inputExt) {
                // ������www. ʹ�ú��沿������
                if (inputExt[1]) {
                    val = inputExt[2];
                    domainList.push(val);
                }
                inputExt = inputExt[3];
            }
            val = val.replace(/\.[a-z]{2,3}\.cn$/, '.miss');

            if (val.indexOf('.') >= 0) val = val.substr(0, val.lastIndexOf('.'));
            if (val.indexOf('.') >= 0) val = val.substr(0, val.lastIndexOf('.'));
            $("#J_domName").val(val);
            domName = val;
            // var domReg = /^[-0-9a-zA-Z\u4e00-\u9fa5]+$/;
            // ֻ�ܰ��� ��ĸ����_ ,�����ط���������
            var domReg = /[^0-9a-zA-Z-\u4e00-\u9fa5]/;
            // �»��߲����ڿ�ͷ����β���Լ�����
            var repeat_ = /-{2,}|^-|-$/;
            if (domReg.test(domName) || repeat_.test(domName)) {
                layer.alert('��������������������ע�������ȷ�ϡ�');
                event.preventDefault();
                return false;
            }
            // 2. �ж��Ƿ�ѡ��������׺
            var domExts = [];
            self.domExtWrapper.find('input:checked').each(function () {
                domExts.push($(this).val());
            });
            // ���û�й�ѡ��׺ �� �û�û�������׺
            if (domExts.length == 0 && !inputExt) {
                layer.alert('���ȹ�ѡҪ��ѯ�ĺ�׺!');
                event.preventDefault();
                return false;
            }

            // ����׺ ����û������˺�׺  ��ֻʹ���û��Լ��ĺ�׺
            if (inputExt) {
                domExts = [inputExt];
                this.custom_domain.value = domainList.join(',');
            } else {
                window.localStorage && window.localStorage.setItem("my_index_ext", domExts.join(','));
            }
            // wc  ��ʱ���store
            // var domExtsStr = domExts.join(',');
            // if(domExtsStr.indexOf('.shop')>=0 &&domExtsStr.indexOf('.store')==-1){
            //     for(var i=0,len=domExts.length;i<len;i++){
            //         if(domExts[i]==".shop"){
            //             domExts.splice(i+1,0,'.store');
            //             break;
            //         }
            //     }
            // }
            $("#J_querySuffix").val(domExts.join(','));

            var isGetToken = false;
            $.ajax({
                async: false,
                type: 'GET',
                cache: false,
                url: '/main/whois.asp?act=gettok',
                data: null,
                dataType: 'script',
                error: function (jqXHR, textStatus, errorThrown) {
                    alert('��ȡ����ʧ��,�����²�ѯһ��');
                    return;
                },
                success: function () {
                    isGetToken = true;
                }
            });

            if (isGetToken) {
                return true;
            } else {
                event.preventDefault();
                return false;
            }
        });

        if (window.localStorage) {
            var myIndexExt = window.localStorage.getItem("my_index_ext");
            if (myIndexExt) {
                myIndexExt = myIndexExt.split(',');
                self.domExtWrapper.find('label').each(function () {
                    var labelDom = $(this);
                    labelDom.removeClass('checked');
                    labelDom.find('input').prop('checked', '');
                });
                $.each(myIndexExt, function () {
                    self.domExtWrapper.find('input[value="' + this + '"]').parent().trigger('click');
                });
            }
        }
    },
    // �����Ƽ�
    initHotListTab: function () {
        // ��ǰѡ�е�tab ��ǩ
        var currentTabLink = $("#hotListTab a.active");
        // ѡ�еı�ǩ��Ӧ������ id
        var currentHotContentId = currentTabLink.attr('data-target');

        var currentHotContent = $("#" + currentHotContentId);

        // ����
        currentHotContent.removeClass('active').addClass('active');

        // ע��tab����¼�
        var prevColumnFlagItem = $("#J_columnFlag_1");
        $("#hotListTab").on('click', 'a', function (event) {

            // �Ƴ�֮ǰѡ�е�tab����������
            currentTabLink.removeClass('active');
            currentHotContent.removeClass('active-columnList');
            // ��ǰѡ���tab������
            currentTabLink = $(event.target);
            currentHotContent = $("#" + currentTabLink.attr('data-target'));

            // ִ��ѡ��
            currentTabLink.removeClass('active').addClass('active');
            currentHotContent.removeClass('active-columnList').addClass('active-columnList');

            // �л������flag
            var flagIndex = $(this).attr('data-index');
            prevColumnFlagItem.removeClass('active-column-flag');
            prevColumnFlagItem = $("#J_columnFlag_" + flagIndex);
            prevColumnFlagItem.addClass('active-column-flag');

        }).on('mouseover', 'a', function (event) {
            if (!$(this).hasClass('active')) {
                $(this).trigger('click');
            }
        });
        // ע���Ʒչʾtab�������¼�  ������
        $("#hotRecommand").on('click', 'div.column', function () {
            // alert('click recommand div.column');
        });

        // ע���Ʒչʾtab������ hover�¼�
        $(".columnList").each(function (index, el) {
            // Ĭ�ϸ���һ�����Ͼ۽�
            var defaultColumnItem = $(".column:first", $(this)).addClass('hover');
            $(this).on('mouseover', 'div.column', function (event) {
                if (defaultColumnItem.get(0) != this) {
                    defaultColumnItem.removeClass('hover');
                }
                defaultColumnItem = $(this);
                if (!defaultColumnItem.hasClass('hover')) {
                    defaultColumnItem.addClass('hover');
                }
            });
        });

        // ������Ѷ������Ϣ
        // $("#J_lastestNews").slide({
        //     mainCell: ".bd ul",
        //     autoPage: true,
        //     effect: "topLoop",
        //     autoPlay: true,
        //     scroll:2,
        //     vis:4,
        //     easing: "easeOutCirc"
        // });

    },
    // ���ǵ�����
    initOurAdvantage: function () {

        $(".ourAdvantage .adList  li").mouseover(function (event) {
            if (!$(this).hasClass('hover')) {
                $(this).addClass('hover');
            }
        }).mouseout(function (event) {
            $(this).removeClass('hover');
        });

    },
    fetchDomainPriceList: function (callback) {
        var self = this;
        if (!self.fetchDefered) {
            self.fetchDefered = $.Deferred();
        }
        self.fetchDefered.done(callback);
        if (self.fetchXhr) {
            return;
        }
        self.fetchXhr = $.get("/services/domain/getdomainjson.asp?m=" + Math.random(), "", function (data) {
            self.domainJSON = $.parseJSON(data);
            self.fetchDefered.resolve();
        });
    },
    renderDomainTipInfo: function (domainName, domainLink, domainJSON) {
        if (domainName != '.gov.cn') {
            // .cn��β
            if (/\.cn$/.test(domainName)) {
                domainName = '.cn'
            }
        }
        // �Ƿ��ҵ�
        var tipInfo = "";
        var divid = domainLink.parents('.domext-wrapper').attr('data-cn') || "";
        for (var i = 0; i < domainJSON.length; i++) {
            var domainItem = domainJSON[i];
            if (domainItem.suffix == domainName) {
                if (divid == "" && domainItem.iscn == "0") {
                    tipInfo = "<span class='domain-name'>" + domainItem.name + "</span><br>�۸�<span class='domain-price'>" + domainItem.price + "</span>Ԫ<br><span class='domain-info'>" + domainItem.info + "</span>";
                    break;
                }
                if (divid == "china" && domainItem.iscn == "1") {
                    tipInfo = "<span class='domain-name'>" + domainItem.name + "</span><br>�۸�<span class='domain-price'>" + domainItem.price + "</span>Ԫ<br><span  class='domain-info'>" + domainItem.info + "</span>";
                    break;
                }
            }
        }
        // û��ƥ�䵽 ����ʾ...
        if (!tipInfo) {
            tipInfo = "<span class='domain-name'>" + domainName + "</span><br>�۸�<span class='domain-price'>-</span>Ԫ<br><span  class='domain-info'>" + domainName + "</span>";
        }

        // λ��
        var pos = domainLink.position();
        domainLink.find('div').html(tipInfo).css({
            left: pos.left,
            top: pos.top + 20
        });

    },
    init: function () {
        //  �ֻ��汾 ������Ϣ ͨ���ṩ
        $("#J_bannerNews").length && $("#J_bannerNews .scroll-msg").slide({
            mainCell: ".bd ul",
            autoPage: true,
            effect: "topLoop",
            autoPlay: true,
            easing: "easeOutCirc"
        });
        // ����banner��ʼ��
        $("#banner").length && $("#banner").slide({
            mainCell: ".slide-wrapper ul",
            titCell: '.slide-pagination ul',
            interTime: 7000,
            effect: 'fold',
            // ����ͼƬ����
            switchLoad: '_bgimg',
            // ����ͼƬ����
            switchLoadTag: 'a',
            autoPage: true,
            autoPlay: true
        });
        // ���»
        $("#newActSlide").slide({
            mainCell: ".slide-wrapper ul",
            titCell: '.slide-pagination ul',
            autoPage: true,
            autoPlay: true,
            interTime: 4000,
            effect: "leftLoop",
            vis: 4,
            scroll: 4
        });
        // ���placehoder֧��
        WJF.uiTool.placeholder("#J_domName");
        // �������ݼ���
        $("#J_domName").on('keyup', function () {
            if ($(this).val() == '') {
                $("#J_clearInput").hide();
            } else {
                $("#J_clearInput").show();
            }
        });
        $("#J_clearInput").on('click', function () {
            $('#J_domName').val('');
            $(this).hide();
        });
        new CountUp("J_domainRegCount", 0, +($("#J_domainRegCount").attr('data-count')), 0, 1.5, {
            useEasing: true,
            useGrouping: true,
            separator: ',',
            decimal: '.',
            prefix: '',
            suffix: ''
        }).start();
        // ������ѯ����
        this.initDomainQuery();
        // �����Ƽ�
        this.initHotListTab();

        // ���ǵ�����
        this.initOurAdvantage();

        // �������
        // $("#ourPartnerSlider").slide({
        //     mainCell: ".slide-wrapper ul",
        //     titCell: '.slide-pagination ul',
        //     autoPage: true,
        //     autoPlay: true,
        //     effect: "left",
        //     vis: 7,
        //     scroll: 5,
        //     switchLoad:'_src',
        //     interTime: 3000,
        //     delayTime: 500
        // });

        // ����۸���ʾ
        var self = this;
        var allDomainLinks = $('.domext-wrapper label a');
        allDomainLinks.append('<div class="dm-price-tip-container"></div>');
        allDomainLinks.hover(function () {
            var domainName = $(this).siblings('input').val();
            var currentLink = $(this);
            if (!self.domainJSON) {
                // ��ʾΪ...
                self.renderDomainTipInfo(domainName, currentLink, []);
                self.fetchDomainPriceList(function () {
                    self.renderDomainTipInfo(domainName, currentLink, self.domainJSON);
                });
            } else {
                self.renderDomainTipInfo(domainName, currentLink, self.domainJSON);
            }
        }, function () {

        });

    }
};
$(function () {
    newMainIndex.init();
})