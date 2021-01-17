$('.languageSelect div button').click(function(e) {
    const lang = e.target.value;
    $('.languageSelect').hide();
    $('body')
        .css('overflow-y', 'auto')
        .find("[class]").each(function() {
            try {
                if (this.className.includes('locale')) {
                    const ID = this.className.split(' ').find(x => x.includes('locale')).replace('locale-', '');
                    if (locale[lang] && locale[lang][ID]) {
                        $(`.locale-${ID}`).html(locale[lang][ID]);
                    } else {
                        $(`.locale-${ID}`).html(`${lang}-${ID}`);
                    }
                }
            } catch (e) {
                return;
            }
        });
})



const locale = {
    en: {
        header_title: "Discover <span>Everything</span>.",
        header_description: "Need a <u>Domain</u>? <u>Server</u>? <u>Game Server</u>? or others such as <u>Streaming Accounts</u>, <u>Premium Accounts</u>, <u>Game Voucher</u>, and so on? We have everything here.",
        header_btn: "Check Our Product"
    },
    id: {
        header_title: "Temukan <span>Segalanya</span>.",
        header_description: "Butuh <u>Domain</u>? <u>Server</u>? <u>Server Game</u>? atau lainnya seperti <u>Akun Streaming</u>, <u>Akun Premium</u>, <u>Voucher Game</u>, dan lainnya? Kita punya semuanya disini.",
        header_btn: "Cek Produk Kita"
    }
}