const loader = new PageLoader();
const modal = new Modal();
const util = new Util();
const form = new Form();
const auth = new Auth();
const products = new Products();
const cart = new Cart();
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

// Country
$("#country").countrySelect(countrySettings);
$("#country").countrySelect("selectCountry", localStorage.selectedCountryID || countrySettings.defaultCountry);
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

    $('html, body').animate({ scrollTop: 0 });
    return true;
});

// Menu
var menuActive = false;
$('#mobile-menu-button').off().on('click', function() {
    const nav = $('nav.navigation');

    $('#mobile-menu').toggleClass('hidden');
    menuActive = !menuActive;

    if (loader.current == 'home') {
        if (menuActive) {
            return nav.addClass('bg-gray-800')
        } else {
            return nav.removeClass('bg-gray-800')
        }
    } else if ((loader.current !== 'home') && nav.hasClass('bg-gray-800')) {
        return nav.removeClass('bg-gray-800')
    }
})