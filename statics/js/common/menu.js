/**
 * ҳ�涥�����Ҳ��������˵�
 */

// ȫ���������˵�ѡ�е�ID
var globalDefaultMainNavMenuId = null;
if (typeof(CURRENT_MENU_ID) != 'undefined') {
    globalDefaultMainNavMenuId = CURRENT_MENU_ID;
}

function checkLoginForm(formObj) {
    if (formObj.u_name.value == "") {
        layer.alert("�û�������Ϊ�գ�");
        formObj.u_name.focus();
        return false;
    }
    if (formObj.u_password.value == "") {
        layer.alert("���벻��Ϊ�գ�");
        formObj.u_password.focus();
        return false;
    }
}
/**
 * ѡ���������˵�
 * @param  {[type]} menuId [description]
 * @return {[type]}        [description]
 */
function selectNavMenu(menuId) {
    globalDefaultMainNavMenuId && $("#J_mainMenu_" + globalDefaultMainNavMenuId).removeClass('current');
    globalDefaultMainNavMenuId = menuId;
    $("#J_mainMenu_" + globalDefaultMainNavMenuId).addClass('current');
}
// ɾ�����ﳵ
function del_shopcart_one(id_) {
    $.post("/bagshow/", "act=del&checkitem=" + id_, function(data) {
        if (data == "200 ok") {
            load_myshopcart()
        }

    })
}


// ���¹��� ��������߼�  ��ʼ

if (!localStorage.Noticeliststa) {
    localStorage.Noticeliststa = [0, 0, 0, 0]
}
if (localStorage.Noticelistcon) {
    localStorage.removeItem("Noticelistcon")
}
var datasta = localStorage.Noticeliststa.split(",");

function add_notice_style() {
    if (!localStorage.Noticelistconm||localStorage.Noticelistconm=="[]") {
        var newarr = JSON.stringify(nav_top_json).split("");
        for (i = 0; i < newarr.length; i++) {
            if (newarr[i] == "," && newarr[i - 1] == "}") {
                newarr[i] = "_";
            }
        }
        localStorage.Noticelistconm = newarr.join("");
        //��һ����������
        for (i = 0; i < nav_top_json.length; i++) {
            if (nav_top_json[i].day <= 10) {
                $("#topnav-notice").children("ol").children("li").eq(i).children("em").css("background-color", "red");
                $("#topnav-notice").children("ol").children("li").eq(i).attr("onclick", "notice_click(this)");
            } else {
                datasta[i] = "1";
                localStorage.Noticeliststa = datasta;
            }
        }
    } else {
        var datacon = localStorage.Noticelistconm;
        if(datacon[0]=="["){
            datacon = datacon.substr(1, datacon.length - 2);
        }
        datacon = datacon.split("_");
        for (i = 0; i < datacon.length; i++) {
            var old_notice = eval('(' + datacon[i] + ')');
            if (old_notice.id != nav_top_json[i].id) {
                if (nav_top_json[i].day <= 10) {
                    $("#topnav-notice").children("ol").children("li").eq(i).children("em").css("background-color", "red");
                    $("#topnav-notice").children("ol").children("li").eq(i).attr("onclick", "notice_click(this)");
                    datasta[i]='0';
                } else {
                    datasta[i] = "1";
                    //���±��ش洢
                    localStorage.Noticeliststa = datasta;
                }
                old_notice.id=nav_top_json[i].id;
                old_notice.day=nav_top_json[i].day;
                datacon[i]=JSON.stringify(old_notice);
            } else {
                if (datasta[i] == "0" && nav_top_json[i].day <= 10) {
                    $("#topnav-notice").children("ol").children("li").eq(i).children("em").css("background-color", "red");
                    $("#topnav-notice").children("ol").children("li").eq(i).attr("onclick", "notice_click(this)");
                }
                   else{datasta[i] = "1";
                    //���±��ش洢
                    localStorage.Noticeliststa = datasta;
                }
            }
        }
        localStorage.Noticelistconm = datacon.join("_");
    }
    count_message();
}

//�ж�δ����Ϣ���������
function count_message() {
    var num = 0;
    for (i = 0; i < datasta.length; i++) {
        if (datasta[i] == "0") {
            num = num + 1;
        }
    }
    if (num == 0) {
        $(".notice_all_bg").hide()
        $("#noread_notice_all").remove();
        $("#noread_countbox").children(".count_noread_all").hide();
        $("#noread_countbox").show();
        $(".allread_notice").text("��");
        return false;
    } else {
        $(".notice_all_bg").show()
        $("#noread_notice_all").remove();
        $(".news-notice").children("span").eq(0).after("<span style='color:#fe7402;font-size:14px;vertical-align:middle;' id='noread_notice_all'>" + num + "</span>");
        $("#noread_countbox").children(".count_noread_all").text(num + "��δ��").attr("onclick", "ignore_notice()");
        $(".allread_notice").text("");
        $("#noread_countbox").show();
    }
}

function notice_click(obj) {
    var num = $(obj).index();
    datasta[num] = "1";
    localStorage.Noticeliststa = datasta;
    //��������ת����Ҫ�Ƴ��¼��Ƴ���ʽ��
    $(obj).children("em").css("background-color", "#a0a0a0");
    $(obj).removeAttr("onclick");
    count_message();
}

function ignore_notice() {
    datasta = [1, 1, 1, 1]
    localStorage.Noticeliststa = [1, 1, 1, 1];
    $("#topnav-notice").children("ol").children("li").children("em").css("background-color", "#a0a0a0");
    $("#topnav-notice").children("ol").children("li").removeAttr("onclick", "notice_click(this)");
    count_message();
}
try{
    add_notice_style();
}catch(e){
    console&&console.error&&console.error(e.message);
}
// ���¹��� ��������߼�  ����
// ������������ʼ��
$(function() {

    // ������в˵��Ĺ�����Ϣ
    $("#J_mainNavWrapper .scroll-msg-container").html($("#J_scrollMsgContent").html());
    // ��ǰ���������й�����Ϣ ��������
    $("#J_mainNavWrapper .scroll-msg").slide({
        mainCell: ".bd ul",
        autoPage: true,
        effect: "topLoop",
        autoPlay: true,
        easing: "easeOutCirc"
    });

    $(".westdialogopen").click(function() {
        // httpsֱ���¿�����
        if(window.location.protocol=="https:"){
            window.open('http://vip8.53kf.com/webCompany.php?arg=west263&style=1');
            return false;
        }
        var me = $(this);
        var link_ = me.attr("href");
        var title = me.attr("title");
        var diaid = "westdialogopen_me";
        if (link_.substr(1, 1) != "/") {
            diaid += "qq";
        }
        $.dialog({
            title: title,
            width: 800,
            height: 500,
            content: "url:" + link_,
            zIndex: 9999999,
            id: diaid
        })
        return false;
    });

    // �����¼�ע��
    $(".common-dropdown-container").hover(function() {
        var target = $(this);
        clearTimeout(target.attr('data-timehandler'));
        var timeoutHandler = setTimeout(function() {
            target.find('.menu').addClass('hover');
            target.find('.common-dropdown').stop().slideDown(300);
        }, 100);
        target.attr('data-timehandler', timeoutHandler);
    }, function(event) {
        // ���ε�firefox �������Ϊ�û��� autocomplete ѡ��ʱ����ʧȥ���� �Ӷ������۵���bug
        if (event.target.name == "u_name") {
            return;
        }
        var target = $(this);
        clearTimeout(target.attr('data-timehandler'));
        if (typeof(WJF_DEBUG) != 'undefined') {
            return;
        }
        target.find('.menu').removeClass('hover');
        target.find('.common-dropdown').stop().slideUp(200);
    });

    var browser = {
        versions: function() {
            var u = navigator.userAgent,
                app = navigator.appVersion;
            return { //�ƶ��ն�������汾��Ϣ
                trident: u.indexOf('Trident') > -1, //IE�ں�
                presto: u.indexOf('Presto') > -1, //opera�ں�
                webKit: u.indexOf('AppleWebKit') > -1, //ƻ�����ȸ��ں�
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //����ں�
                mobile: !!u.match(/AppleWebKit.*Mobile.*/), //�Ƿ�Ϊ�ƶ��ն�
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios�ն�
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android�ն˻���uc�����
                iPhone: u.indexOf('iPhone') > -1, //�Ƿ�ΪiPhone����QQHD�����
                iPad: u.indexOf('iPad') > -1, //�Ƿ�iPad
                webApp: u.indexOf('Safari') == -1 //�Ƿ�webӦ�ó���û��ͷ����ײ�
            };
        }(),
        language: (navigator.browserLanguage || navigator.language).toLowerCase()
    };
    // �ƶ���
    if (browser.versions.iPad || browser.versions.iPhone || browser.versions.android || browser.versions.mobile) {
        // �����������˵�������ת
        var currActiveNavMenu = null;
        $("#J_mainNavWrapper").on('click', 'a.nav-menu', function(event) {
            // ��ǰչ�������˵�
            if (currActiveNavMenu && currActiveNavMenu != this) {
                $(currActiveNavMenu).removeClass('hover').siblings('.nav-content').removeClass('active').stop().slideUp(200);
            }
            // ��ҳֱ��ת
            if (this.id == 'J_mainMenu_sy') {
                currActiveNavMenu = null;
                return;
            }
            // �����Ӧ�Ĳ˵����� ��ʾ��  ֱ����תҳ��
            var navContent = $(this).siblings('.nav-content');
            if (navContent.hasClass('active')) {
                return;
            } else {
                navContent.addClass('active').stop().slideDown(300);
                $(this).addClass('hover');
            }
            currActiveNavMenu = this;
            event.preventDefault();
        });
    } else {
        // ������
        var mainNavInTimeoutHandle;
        var mainNavOutTimeoutHandle;
        $("#J_mainNavWrapper >li").hover(function() {
            var currentLink = $(this).find('a.nav-menu');
            var targetNavContent = $(this).find('.nav-content');
            clearTimeout(mainNavInTimeoutHandle);
            mainNavInTimeoutHandle = setTimeout(function() {
                currentLink.addClass('hover');
                // ���ÿ���޸�ie7�� ��������չ������
                targetNavContent.addClass('active').css('width', $('body').width() + 'px').stop().slideDown(300);
            }, 150);
        }, function() {
            if (typeof(WJF_DEBUG) != 'undefined') {
                return
            }
            clearTimeout(mainNavInTimeoutHandle);
            var currentLink = $(this).find('a.nav-menu');
            var targetNavContent = $(this).find('.nav-content');
            mainNavOutTimeoutHandle = setTimeout(function() {
                currentLink.removeClass('hover');
                targetNavContent.removeClass('active').stop().slideUp(200);
            }, 150);
            targetNavContent.attr('data-timehandler', mainNavOutTimeoutHandle);
        });
        $("#J_mainNavWrapper .nav-content").hover(function() {
            clearTimeout($(this).attr('data-timehandler'));
            $(this).show();
        });
    }
    // ie6 ֧��
    if (typeof(DD_belatedPNG) != 'undefined') {
        // ���placehoder֧��
        // WJF.uiTool.placeholder("#J_u_name");
        // WJF.uiTool.placeholder("#J_u_password");
    }
    // ָ����ȫ���������˵�ID
    if (globalDefaultMainNavMenuId) {
        selectNavMenu(globalDefaultMainNavMenuId);
    } else {
        // ���ݵ�ǰҳ��URLƥ��
        var pageUrl = document.URL.toLowerCase();
        var dftMenu = '';
        if (pageUrl.indexOf("/domain") >= 0) {
            dftMenu = 'domain';
        } else if (pageUrl.indexOf("/webhosting") >= 0) {
            dftMenu = 'webhosting';
        } else if (pageUrl.indexOf("/cloudhost") >= 0) {
            dftMenu = 'cloudhost';
        } else if (pageUrl.indexOf("/vpsserver") >= 0) {
            dftMenu = 'vpsserver';
        } else if (pageUrl.indexOf("/webssl") >= 0) {
            dftMenu = 'webssl';
        } else if (pageUrl.indexOf("/server") >= 0) {
            dftMenu = 'server';
        } else if (pageUrl.indexOf("/websites") >= 0) {
            dftMenu = 'websites';
        } else if (pageUrl.indexOf("/webmail") >= 0) {
            dftMenu = 'webmail';
        } else if (pageUrl.indexOf("/ddos") >= 0) {
            dftMenu = 'ddos';
        } else if (pageUrl.indexOf("/websem") >= 0) {
            dftMenu = 'websem';
        } else if (pageUrl.indexOf("/agent") >= 0) {
            dftMenu = 'agent';
        } else if (pageUrl.indexOf("/customercenter") >= 0 || pageUrl.indexOf("/faq") >= 0) {
            // dftMenu = 10;
        }
        if (dftMenu) {
            selectNavMenu(dftMenu);
        } else {
            // ѡ����ҳ
            (window.location.pathname == "/" || window.location.pathname == '/default.asp') && selectNavMenu('sy');
        }
    }
});

// ��������
$(function() {
    $("#J_globalNotice .expand").on('click', function() {
        var expand = $(this);
        // ��ǰ�Ѿ�չ����
        if (expand.hasClass('collapse')) {
            expand.removeClass('collapse');
            $("#J_globalNotice .notice-content").removeClass('notice-content-expanded');
            expand.text('չ����ʾ');
        } else {
            expand.addClass('collapse');
            $("#J_globalNotice .notice-content").addClass('notice-content-expanded');
            expand.text('������ʾ');
        }
    });
    $("#J_globalNotice .close").on('click', function() {
        $("#J_globalNotice").fadeOut();
        document.cookie = 'HIDE_G_NOTICE=1;'
    });
});

// ���������
$(function() {
    // �ұ߲�������
    var rightMenuBarContainer = $("#rightMenuBar2016");
    if (!rightMenuBarContainer.length) {
        return;
    }
    // �������ʾ�Ҳ��� �����øñ�ʾΪfalse
    if (typeof(G_SHOW_RIGHT_BAR) != 'undefined' && G_SHOW_RIGHT_BAR === false) {
        rightMenuBarContainer.hide();
        return;
    }
    var minHeight = 100;
    $(window).scroll(function() {
        var s = $(window).scrollTop();
        if (s > minHeight) {
            $("#J_backTop").addClass('back-top-visible');
        } else {
            $("#J_backTop").removeClass('back-top-visible');
        }
    });
    $(window).trigger('scroll');
    $("#J_backTop").on('click', function() {
        $('html,body').stop();
        $('html,body').animate({
            scrollTop: 0
        }, 400, 'swing');
        return false;
    });
    // �������
    var prevLink = null;
    $("#J_rightBarMenuContainer").on('click', 'a', function(event) {
        var currentLink = $(this);
        prevLink && prevLink.removeClass('hover');
        currentLink.addClass('hover');

        var concatPhoneContainer = $("#J_concatPhoneContainer");
        // �绰����
        if (currentLink.hasClass('phone')) {
            if (concatPhoneContainer.hasClass('active-concat-container')) {
                concatPhoneContainer.removeClass('active-concat-container');
                currentLink.removeClass('hover');
            } else {
                concatPhoneContainer.addClass('active-concat-container');
            }
        } else {
            concatPhoneContainer.removeClass('active-concat-container');
        }
        prevLink = currentLink;
    });

    // ��ϵ�绰
    $("#J_concatPhoneContainer").on('click', '.close', function() {
        $('#J_concatPhoneContainer').removeClass('active-concat-container');
        $("#J_rightBarMenuContainer a.phone").removeClass('hover');
    });

    // �رղ���
    $("#J_closeRightBar").on('click', function() {
        rightMenuBarContainer.css('right', '-40px');
        rightMenuBarContainer.addClass('mini-right-menu-bar');
        var date = new Date();
        date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
        document.cookie = '_rbarStatus_=0;expires=' + date.toUTCString() + ';path=/;';
        return false;
    });
    // չ������
    $("#J_expandRightBar").on('click', function() {
        rightMenuBarContainer.removeClass('mini-right-menu-bar');
        rightMenuBarContainer.css('right', '0px');
        var date = new Date();
        date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
        document.cookie = '_rbarStatus_=1;expires=' + date.toUTCString() + ';path=/;';
        return false;
    });
    setTimeout(function() {
        // ��ʼ������
        if (document.cookie.match(/_rbarStatus_=0/) /*|| document.body.clientWidth < 1190*/ ) {
            // ��Ӳ�����С�����
            rightMenuBarContainer.addClass('mini-right-menu-bar');
        } else {
            rightMenuBarContainer.css('right', '0px');
        }
        // ���ڱ�ǲ����ɼ�ʱ��
        rightMenuBarContainer.addClass('menu-bar-enable');
    }, 1000);
});
$(function() {
    // IE 67 ��ʾ��Ϣ
    var appName = navigator.appName,
        appVersion = navigator.appVersion;
    if (appName == "Microsoft Internet Explorer" &&
        (navigator.appVersion.match(/7./i) == "7." || navigator.appVersion.match(/6./i) == "6.")) {
        if (document.cookie.match(/_BW_NOTICE=0/)) {
            return;
        }
        $("#J_browserNotice .close").on('click', function() {
            document.cookie = '_BW_NOTICE=0;path=/;';
            $("#J_browserNotice").hide();
        });
    }
});
// cookie ����
(function () {
    try{
        var cookies = document.cookie.match(/\b(ASPSESSIONID[A-Z]+)(?==)/g);
        if(cookies&&cookies.length>30){
            var myDate=new Date();
            myDate.setTime(-1000);//����ʱ��
            for(var i=0,len=cookies.length;i<len;i++){
                document.cookie=cookies[i]+"=''; expires="+myDate.toUTCString()+'; path=/;';
            }
        }
    }catch(e){}
})();