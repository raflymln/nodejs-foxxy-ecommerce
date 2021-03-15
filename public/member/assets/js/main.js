const transaction = new Transaction();
const util = new Util();
const page = new Page();
const form = new Form();
const converter = new showdown.Converter({
    underline: true,
    tasklists: true,
    tables: true,
    strikethrough: true
});

// Currency
fx.base = currencySettings.base;
fx.settings = currencySettings.settings;
fx.rates = currencySettings.rates;

// INIT
$.post('/user/session', {}, (response) => {
    if (response.status == 200) {
        return page.INIT(response.data);
    }

    alert(response.message);
    return location.href = '/'
})