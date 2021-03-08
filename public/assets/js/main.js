const loader = new PageLoader();
const modal = new Modal();
const util = new Util();
const form = new Form();
const account = new Account();

const colorThief = new ColorThief();
const converter = new showdown.Converter({
    underline: true,
    tasklists: true,
    tables: true,
    strikethrough: true
});

fx.base = "IDR";
fx.settings = { from: "IDR" };
fx.rates = {
    "IDR": 1,
    "USD": 0.0000714726,
    "EUR": 0.0000589960,
    "GBP": 0.0000517475,
}

$("#country").countrySelect({
    defaultCountry: "id",
    preferredCountries: [],
    onlyCountries: ['id', 'us', 'gb', 'de']
});
$("#country").countrySelect("selectCountry", localStorage.selectedCountryID || 'id');
$('#country').change(function() {
    const opt = $(this).countrySelect("getSelectedCountryData");
    const cID = opt.iso2.toUpperCase();
    const selectedCountry = countryData[cID];

    localStorage.selectedCountryID = cID;
    localStorage.selectedCurrency = selectedCountry.currency;

    $('[data-price]').each(function() {
        const price = $(this).data('price')
        $(this).html(util.formatCurrency(price));
    });

    util.setGoogleTranslate(cID);
    // $('html, body').animate({ scrollTop: 0 });
});

var menuActive = false;
$('#mobile-menu-button').off().on('click', function() {
    const nav = $('nav.navigation');
    $('#mobile-menu').toggleClass('hidden');
    menuActive = !menuActive;

    if (loader.current == 'home') {
        if (menuActive) {
            nav.addClass('bg-gray-800')
        } else {
            nav.removeClass('bg-gray-800')
        }
    } else if ((loader.current !== 'home') && nav.hasClass('bg-gray-800')) {
        nav.removeClass('bg-gray-800')
    }
})