var domainReg = {
    // �Զ����ѯ�� ֧������ǰ׺�ĺ�׺�б�
    customChineseExtSupport: ',.�й�,.�Ұ���,.��˾,.����,.top,.cn,.wang,.com,.net,.cc,.tv,.����,.ren,.����,.biz,.xyz,.tm,.�㶫,.��ɽ,.��Ϣ,.club,.����,.����,.pw,',
    // �Զ��� ��ѯ У��
    submitcheck_custom: function (F) {
        var v_ = $.trim(F.searchedDomainName_custom.value).split("\n");

        for (var i = 0; i < v_.length; i++) {

            if (v_[i].indexOf(".") <= 0 || v_[i].indexOf(".") == (v_[i].length - 1) || (v_[i].split(".").length != 2 && (!/\.cn$/i.test(v_[i])))) {
                layer.alert("��¼����ȷҪ��ѯ����������׺,��֧����������׺����<br>�������Ҫ��ѯ����������׺,��ǰ��������׺ѡ����в�ѯ");
                return false;
            }
            var d_ = v_[i].substring(0, v_[i].indexOf("."));
            var s_ = v_[i].substring(v_[i].indexOf("."), v_[i].length);
            if (s_.length < 3) {
                layer.alert("������׺��������ϸ���");
                return false;
            }
            // �����ѯ����ǰ׺����������
            if (d_.match(/[\u4E00-\u9FA5]/)) {
                if (this.customChineseExtSupport.indexOf("," + s_ + ",") < 0) {
                    layer.alert('��׺' + s_ + '��֧��������������ǰ����������ѡ����в�ѯ��');
                    return false;
                }
            }
        }
        // ������tabҳ��ʹ���Զ����ѯģʽ����һ��
        F.custom_domain.value = v_.join(',');
        var isOk = true;
        $.ajax({
            async: false,
            type: 'GET',
            url: '/main/whois.asp?act=gettok',
            data: null,
            cache: false,
            dataType: 'script',
            error: function (jqXHR, textStatus, errorThrown) {
                isOk = false;
                layer.alert('��ȡ����ʧ��,�����²�ѯһ��');
                return;
            }
        });

        return isOk;
    },
    // ���Զ��� ���ύУ��
    submitchecken: function (F) {
        var arrext = [];
        var arrdom = [];
        var domains = F.searchedDomainName.value;

        if (domains == "" || domains.match(/��������Ҫע�������/)) {
            layer.alert("����дҪ��ѯ��������ÿ��һ�����Ҳ�Ҫ��׺��");
            return false;
        }

        $(F).parents('.wjf-ui-tab-content').find('[name="suffix"]').each(function () {
            if (this.checked) arrext.push(this.value)
        });


        if (F.name != "chineseDomainForm") {
            if (/[\u4e00-\u9fa5]+/.test(domains)) {
                layer.alert("������������к���[�����ַ�]����ǰѡ�ֻ�ܲ�ѯӢ�������� <br>����Ҫ��ѯ�����������뵽��������ѡ��в�ѯ��лл��");
                return false;
            }
        }

        var arrList = domains.split('\n');
        if (F.name == "chineseDomainForm") {
            for (var i = 0; i < arrList.length; i++) {
                if (arrList[i].length > 45) {
                    layer.alert("��������ע�����Ƴ���Ϊ46���ַ����ڣ�");
                    return false;
                }
            }
        }

        var userCustomExt = null;
        // ��������
        var domainNameCount = 0;
        // �Ƿ��������붼���˺�׺
        var extFlag = true;
        // �Ϸ�����
        var domainList = [];
        for (var i = 0; i < arrList.length; i++) {
            var val = arrList[i].replace(/\s/g, '');
            val = val.replace(/^\./, '');
            val = val.replace(/\.$/, '');
            if (val == "") {
                continue;
            }
            // com.cn  net.cn  org.cn ���������´���www�Ŀ�ͷ�����
            // ��������� ˵�������Ϲ��� ֱ��pass
            if (val.match(/^www\.(com.cn)|(net.cn)|(org.cn)$/)) {
                layer.alert('��Ǹ��[ ' + val + ' ] ���ǺϷ���������ȷ�ϣ�');
                return false;
            }

            // �û�ֱ������ĺ�׺
            var inputExt = val.match(/(www\.)?([^\.]+(\..*))/);
            if (inputExt) {
                // ��ȡ�û�����ĺ�׺
                userCustomExt = inputExt[3];
                // ���������www.
                if (inputExt[1]) {
                    val = inputExt[2];
                }
                domainList.push(val);
            } else {
                extFlag = false;
            }
            val = val.replace(/\.[a-z]{2,3}\.cn$/, '.miss');
            if (val.indexOf('.') >= 0) val = val.substr(0, val.lastIndexOf('.'));
            if (val.indexOf('.') >= 0) val = val.substr(0, val.lastIndexOf('.'));
            if (/^[0-9a-z\-\u4e00-\u9fa5]+$/ig.test(val)) arrdom.push(val.toLowerCase());
            domainNameCount++;
        }

        // û�������Զ����׺ ��û�й�ѡ��׺
        if (arrext.length == 0 && !(userCustomExt && domainNameCount == 1)) {
            layer.alert("������ѡ��Ҫ��ѯ��������׺��");
            return false;
        }

        if (arrdom.length > 300 && arrdom.length > 1) {
            if (!confirm("����ǰ��ѯ������̫�࣬���鲻Ҫ��ѡ��׺�������ѯ̫�ർ�½��濨����ȷ�ϼ�����")) return false;
        }

        if (arrdom.length > 500) {
            layer.alert("��Ǹ��ÿ����ѯ�����������ܳ���500������ǰ��" + arrdom.length + "��");
            return false;
        } else if (arrdom.length == 0) {
            layer.alert("����д����������ȷ���޷���ѯ��");
            return false;
        }

        F.searchedDomainName.value = arrdom.join('\n');

        if (F.name != 'customForm') {
            // �����ȫ������׺ʱ ʹ���Զ����ѯ
            if (extFlag) {
                var domainListStr = domainList.join(',');
                var newDomainList=[];
                for(var i=0,len=domainList.length;i<len;i++){
                    var item = domainList[i];
                    newDomainList.push(item);
                    // var result =item.match(/(.+).shop/);
                    // if(result&&domainListStr.indexOf(result[1]+'.store')==-1){
                    //     newDomainList.push(result[1]+'.store');
                    // }
                }
                domainList = newDomainList;
                $('form[name="customForm"]')[0].searchedDomainName_custom.value = domainList.join('\n');
                $('form[name="customForm"]')[0].custom_domain.value = domainList.join(',');
                $('form[name="customForm"]').submit();
                return false;
            } else {
                // ���ڵ�ǰѡ������������� �������һ�β�ѯ
                if ($("#domainsTab a.active").attr('data-target') == "hotDomain") {
                    window.localStorage && window.localStorage.setItem("my_hot_ext", arrext.join(','));
                }
                // wc  ��ʱ���store
                // var arrextStr = arrext.join(',');
                // if(arrextStr.indexOf('.shop')>=0 &&arrextStr.indexOf('.store')==-1){
                //     for(var i=0,len=arrext.length;i<len;i++){
                //         if(arrext[i]==".shop"){
                //             arrext.splice(i+1,0,'.store');
                //             break;
                //         }
                //     }
                // }
                F.suffix.value = arrext;
            }
        }

        // ��ȡ����
        var isOK = true;
        $.ajax({
            async: false,
            type: 'POST',
            url: '/main/whois.asp?act=gettok',
            data: null,
            cache: false,
            dataType: 'script',
            error: function (jqXHR, textStatus, errorThrown) {
                alert('��ȡ����ʧ��,�����²�ѯһ��');
                isOK = false;
                return;
            }
        });
        return isOK;
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

        domainLink.find('div').html(tipInfo);
    },
    initBanner: function () {
        // ����bannner
        $("#J_domainBannerSlider").slide({
            mainCell: ".slide-wrapper ul",
            titCell: '.slide-pagination ul',
            effect: 'fold',
            switchLoad: '_bgimg',
            switchLoadTag: 'a',
            autoPage: true,
            autoPlay: true
        });
        // ����ͼƬ
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
    },
    regEvent: function () {
        var self = this;
        // ������ת��չ����
        $('.banner-right').on('click','a',function (event) {
            var target= $(event.target);
            var priceLink = target.parents('.price-link');
            if(target.hasClass('price-link') || priceLink.length){
                var link = target.attr('data-link') || priceLink.attr('data-link');
                window.location.href= link;
                return false;
            }
        });
        // ����֮����
        $(".common-input").on('keyup', function () {
            var currentCommonInput = $(this);
            var closeIcon = currentCommonInput.siblings('.clear-domain-input');
            if (currentCommonInput.scrollTop() > 0) {
                closeIcon.show();
            } else {
                closeIcon.hide();
            }
        });
        $(".common-input").on('keydown', function (event) {
            if (event.ctrlKey && event.keyCode == 13) {
                $(this).parents('.query-input-container').submit();
                event.preventDefault();
                return false;
            }
        });
        // X ������������
        $(".clear-domain-input").on('click', function () {
            $(this).hide().siblings('.common-input').val('').focus();
        });

        // ����ѡ�����
        $('.select-op').change(function (event) {
            var val = $(this).val();

            var domExtsContainer = $(this).parents('.domext-select-container').next();
            switch (val) {
                // ȫѡ
                case '0':
                    domExtsContainer.find('label').removeClass('checked').addClass('checked');
                    domExtsContainer.find('input').each(function () {
                        $(this).prop('checked', 'checked');
                    });
                    break;
                // ȫ��ѡ
                case '1':
                    domExtsContainer.find('label').removeClass('checked');
                    domExtsContainer.find('input').each(function () {
                        $(this).prop('checked', '');
                    });
                    break;
                // ����
                case '2':
                    domExtsContainer.find('input').each(function () {
                        var currInput = $(this);
                        if (currInput.attr('common-use') == '1') {
                            currInput.prop('checked', 'checked');
                            currInput.parent('label').removeClass('checked').addClass('checked');
                        } else {
                            currInput.prop('checked', '');
                            currInput.parent('label').removeClass('checked');
                        }
                    });
                    break;
            }
        });

        // ����ѡ���� IE6 FOR ��ҪID
        var ie6 = !-[1,] && !window.XMLHttpRequest;
        $('.domext-wrapper').on('click', 'label', function (event) {
            if (event.target.type == 'checkbox' || event.target.type == '') {
                return;
            }
            if ($(this).hasClass('checked')) {
                $(this).removeClass('checked');
                ie6 && $(this).find('input').prop('checked', '');
            } else {
                $(this).addClass('checked');
                ie6 && $(this).find('input').prop('checked', 'checked');
            }
        });


        // ����۸���ʾ
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

        //����鿴����
        // $('.more-domains').on('click', function () {
        //     var status = !$(this).data('expanded');
        //     $(this).data('expanded', status);
        //     if (status == true) {
        //         $(this).html('���ظ���&gt;&gt;');
        //     } else {
        //         $(this).html('�鿴����&gt;&gt;');
        //     }
        //     $(this).siblings('.collapsed-domain').toggle();
        // });
    },
    init: function () {
        this.initBanner();

        // ���placeholder֧��
        WJF.uiTool.placeholder('.common-input');
        var initTextAreaValue = '';
        // ��ʼ��tab
        WJF.uiTool.initTab("domainsTab", {
            // ��ʱʵ�ֶ��textarea����ֵ
            onTabChange: function (tabId, currentLiDom, currentContentID, prevContentId) {
                if (prevContentId != 'customDomain') {
                    initTextAreaValue = $("#" + prevContentId + ' textarea.common-input').val();
                }
                if (currentContentID != 'customDomain') {
                    var currentTextarea = $("#" + currentContentID + ' textarea.common-input');
                    currentTextarea.val(initTextAreaValue);
                    currentTextarea.focus();
                    currentTextarea.blur();
                }
            }
        });
        // ע���¼�
        this.regEvent();

        // �����û����һ�β�ѯ����������ʼ��
        if (window.localStorage) {
            var myHotExtArr = window.localStorage.getItem("my_hot_ext");
            if (myHotExtArr) {
                var domExtsContainer = $("#hot_select_op_2").parents('.domext-select-container').next();
                domExtsContainer.find('label').removeClass('checked');
                domExtsContainer.find('input').each(function () {
                    $(this).prop('checked', '');
                });
                myHotExtArr = myHotExtArr.split(',');
                $.each(myHotExtArr, function () {
                    $('#hotDomain input[value="' + this + '"]').parent().trigger('click');
                });
            }
        }
    }
};

$(function () {
    domainReg.init();
})
