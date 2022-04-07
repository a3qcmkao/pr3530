var webhosting = {
    initBanner: function() {
        $("#J_webhostingBanner").slide({
            mainCell: ".slide-wrapper ul",
            titCell: '.slide-pagination ul',
            effect: 'fold',
            // ����ͼƬ����
            switchLoad: '_bgimg',
            // ����ͼƬ����
            switchLoadTag: 'a',
            autoPage: true,
            autoPlay: true
        });
        $("#J_khalBanner").slide({
            mainCell: ".slide-wrapper ul",
            titCell: '.slide-pagination ul',
            autoPage: true,
            effect: "left",
            autoPlay: false,
            scroll: 2,
            vis: 2
        });
    },
    // �����û�������Ϣ
    loadGuestTalk: function(page, callback) {
        var self = this;
        var info = "act=LoadGuestTalk&PageNo=" + escape(page) + "&random=" + Math.round(Math.random() * 10000);
        var ajaxurlstr = "/product/webhosting/";
        $.ajax({
            type: "POST",
            url: ajaxurlstr,
            data: info,
            datatype: "json",
            timeout: 30000,
            error: function(XmlHttpRequest, textStatus, errorThrown) {
                layer.alert('����������Ϣʧ�ܣ���ˢ������');
                callback && callback(false);
            },
            success: function(xml) {
                self.hasFetchPJInfo = true;
                var tmpPJContainer = $("#J_customPJTemp");

                // ��ǰ�ӿڲ�����ǰ�˽������� �ʶ�����Ⱦ����ȡ���� ������ʹ���½�����Ⱦ
                tmpPJContainer.html(xml);
                var pjData = {
                    header: {},
                    rows: [],
                    pagerInfo: {}
                };
                // ������
                tmpPJContainer.find('.zongping_div table').addClass('zong-ping-table').find('tr').each(function(index) {
                    if (index == 0) {
                        return;
                    }
                    var tdCell = $(this).find('td');
                    if (index == 1) {
                        pjData.header.speedStarCount = tdCell.eq(1).text();
                        pjData.header.serviceStarCount = tdCell.eq(3).text();
                    }
                    if (index == 2) {
                        pjData.header.priceStarCount = tdCell.eq(1).text();
                        pjData.header.descStarCount = tdCell.eq(3).text();
                    }

                });
                // ��ȡ��������
                var rows = pjData.rows;
                var tables = tmpPJContainer.children('table');
                var len = tables.length;
                tables.each(function(index) {
                    var currTable = $(this);
                    // ���һ��Ϊ��ҳ��
                    if (index == len - 1) {
                        var td = currTable.find('td');
                        var totalPage = td.find('strong').text();
                        var currPage = $("#Select1").val();

                        laypage({
                            cont: 'pager', //������ֵ֧��id����ԭ��dom����jquery���󡣡��������Ϊ����<div id="page1"></div>
                            pages: totalPage, //ͨ����̨�õ�����ҳ��
                            curr: currPage || 1, //��ǰҳ
                            skip: true,
                            // first:false,
                            // last:false,
                            jump: function(obj, first) { //������ҳ��Ļص�
                                if (!first) { //�����ҳ�����������������ݵ�ǰҳ��obj.curr
                                    self.loadGuestTalk(obj.curr);
                                }
                            }
                        });
                        return;
                    }
                    // ������������
                    var row = {};
                    currTable.children('tbody').children('tr').each(function(index, el) {
                        var currTr = $(this);
                        switch (index) {
                            // ����
                            case 0:
                                row['pjTitle'] = currTr.find('td').text();
                                break;
                                // ��վ����
                            case 1:
                                break;
                                // �����ٶȵ�
                            case 2:
                                var tds = currTr.children('td').find('table').find('td');
                                row['speedStarCount'] = tds.eq(1).find('img').filter(function(index) {
                                    if ($(this).attr('src').match(/yellow/)) {
                                        return true;
                                    }
                                    return false;
                                }).length;
                                row['priceStarCount'] = tds.eq(3).find('img').filter(function(index) {
                                    if ($(this).attr('src').match(/yellow/)) {
                                        return true;
                                    }
                                    return false;
                                }).length;
                                row['serviceStarCount'] = tds.eq(5).find('img').filter(function(index) {
                                    if ($(this).attr('src').match(/yellow/)) {
                                        return true;
                                    }
                                    return false;
                                }).length;
                                row['descStarCount'] = tds.eq(7).find('img').filter(function(index) {
                                    if ($(this).attr('src').match(/yellow/)) {
                                        return true;
                                    }
                                    return false;
                                }).length;
                                break;
                                // ��������
                            case 3:
                                row['pjContent'] = currTr.find('td').text();
                                break;
                                // ����ʱ�䡢������
                            case 4:
                                var date_area_etc = currTr.find('td').text();
                                var dateResult = date_area_etc.match(/ʱ�䣺(.+)����/);
                                if (dateResult && dateResult.length) {
                                    row['pjDate'] = $.trim(dateResult[1]);
                                }
                                // ����
                                var areaResult = date_area_etc.match(/������(.+)IP��/);
                                if (areaResult && areaResult.length) {
                                    row['area'] = $.trim(areaResult[1]);
                                }
                                break;
                        }
                    });
                    rows.push(row);
                });

                // ��Ⱦ����ҳ��
                $("#J_PJListContainer").html($("#pingjiaListTpl").render(pjData));
                callback && callback(true);
            }
        });
    },
    bindScroll: function() {
        var anchorNav = $("#J_anchorNavDom");
        $(window).scroll(function(event) {
            if ($(window).scrollTop() >= $("#J_tabContentContainer").offset().top) {
                if (!anchorNav.hasClass('wjf-page-anchor-nav-container-fixed')) {
                    anchorNav.addClass('wjf-page-anchor-nav-container-fixed');
                }
            } else {
                anchorNav.removeClass('wjf-page-anchor-nav-container-fixed');
            }
        });
        $(window).trigger('scroll');
    },
    // ҳ���ʼ��
    init: function() {
        var self = this;
        this.initBanner();
        // ��ʼ��tab
        WJF.uiTool.initTab("J_webhostingTab", {
            onTabChange: function(tabId, currentLiDom, currentContentID, prevContentId, prevActiveTabLink, currentActiveTabLink) {
                if (prevActiveTabLink) {
                    prevActiveTabLink.parent('li').removeClass('active');
                }
                currentActiveTabLink.parent('li').addClass('active');
            }
        });
        $('#J_webhostingTabContainer').on('mouseover', '.webhosting-list li', function(event) {
            if (!$(this).hasClass('column-li-hover')) {
                $(this).addClass('column-li-hover');
            }
        }).on('mouseleave', '.webhosting-list li', function() {
            $(this).removeClass('column-li-hover');
        });
        WJF.uiTool.initTab("J_anchorNavDom", {
            onTabChange: function(tabId, currentLiDom, currentContentID, prevContentId) {
                if (currentContentID == 'J_webPJDom') {
                    // ����Ѿ�����
                    if (self.hasFetchPJInfo) {
                        return;
                    }
                    self.loadGuestTalk(1, function(flag) {
                        if (!flag) {
                            self.hasFetchPJInfo = false;
                        }
                    });
                }
                var targetTop = $("#J_tabContentContainer").offset().top;
                if ($(window).scrollTop() >= targetTop) {
                    $(window).scrollTop(targetTop);
                }
            }
        });
        this.bindScroll();

        // ����URL��ַ �л�tab
        var param = window.location.search.match(/[&]?index=(.+)[&]?/);
        if (param) {
            $("#J_webhostingTab li").eq(param[1]).trigger('click');
        }
    }
}

$(function() {
    webhosting.init();
})
