class PageLoader {
    constructor() {
        this.loading = false;
        this.waitTime = 0;
        this.current;

        this.config = {
            index: 'home',
            baseFolder: {
                components: 'components',
            },
            elementClass: {
                dynamicStylesheet: '#dynamic-style',
                dynamicJS: '#dynamic-JS',
                loadingBar: '.loader .loaded'
            }
        }

        if (location.pathname == '/') {
            const lastPage = this.config.index;
            this.load(lastPage, true, true);
        } else {
            this.load(location.pathname.slice(1), true, true);
        }

        window.onpopstate = () => {
            const page = location.pathname.slice(1);
            return this.load(page, false);
        };
    }

    load = (page, next = true, init = false) => {
        if ((init == false) && (page == localStorage.lastPage)) return;

        if (Date.now() - this.waitTime < 1000) {
            history.replaceState({}, "", localStorage.lastPage);
            return notify('Please wait before changing page.')
        }

        if (!this.loading) {
            this.loadingBar.start();
            this.waitTime = Date.now();

            $('section.body').toggleClass('animate__fadeOutLeft');
            $('html, body').animate({ scrollTop: '0px' });

            setTimeout(() => {
                $('section.body').load(`${this.config.baseFolder.components}/${page}.html`, (res, status) => {
                    localStorage.lastPage = page;
                    this.current = page;
                    $('section.body').toggleClass('animate__fadeOutLeft');

                    const pageTitle = page.toLowerCase().replace(/\b[a-z]/g, function(letter) {
                        return letter.toUpperCase();
                    });
                    document.title = `Foxxy - Hosting & Service | ${pageTitle}`

                    if (next == true) {
                        history.pushState({}, "", page);
                    }

                    $('[data-page]').off().on('click', function() {
                        const page = this.dataset.page;
                        return loader.load(page);
                    });

                    $('[rel="page"]').off().on('click', function() {
                        const page = $(this).attr('href');
                        loader.load(page);
                        return false;
                    });

                    setTimeout(() => { this.loadingBar.stop() }, 1000);

                    if (status == 'error') {
                        notify('Error while loading the page');
                        return this.load('home');
                    }
                })
            }, 1000);
        } else {
            this.loadingBar.stop();
            return this.load(page);
        }
    }

    loadingBar = {
        start: () => {
            const element = $(this.config.elementClass.loadingBar);
            const loadTime = Math.round(Math.random() * 300) + 200;
            element.css('opacity', 1)

            this.loading = setInterval(() => {
                const documentWidth = $(document).width();
                const currentWidth = element.width();
                if (currentWidth < documentWidth) {
                    element.css('width', (currentWidth + 100))
                } else {
                    clearInterval(this.loading);
                    element.css('width', 0);
                    this.loading = false;
                }
            }, loadTime);
        },
        stop: () => {
            const element = $(this.config.elementClass.loadingBar);

            clearInterval(this.loading);
            element.css('width', $(document).width());
            setTimeout(() => {
                element.css('opacity', 0)
                setTimeout(() => element.css('width', 0), 500)
            }, 500)
            this.loading = false;
        }
    }
}

class Modal {
    constructor() {}

    open = (ID) => {
        $(`#${ID}`).modal({
            fadeDuration: 400
        });
        return true;
    }

    close = () => {
        return $.modal.close()
    }

    getCurrent = () => {
        return $.modal.getCurrent()
    }

    isActive = () => {
        return $.modal.isActive()
    }
}

class Form {
    constructor() {}

    validateEmail(mail) {
        if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail)) {
            return true
        }
        return false
    }

    validatePassword(password) {
        // Validate lowercase letters
        if (!password.match(/[a-z]/g)) {
            notify("Password must contain lowercase character!");
            return false;
        }

        // Validate capital letters
        if (!password.match(/[A-Z]/g)) {
            notify("Password must contain uppercase character!");
            return false;
        }

        // Validate numbers
        if (!password.match(/[0-9]/g)) {
            notify("Password must contain numbers!");
            return false;
        }

        // Validate length
        if (!(password.length >= 8)) {
            notify('Password must have at least 8 character!');
            return false;
        }

        return true;
    }

    send = (form, endpoint, options) => {
        const formData = new Object;
        $(form).serializeArray().map(x => formData[x.name] = x.value);

        if (formData.password && formData.confirm_password) {
            if (!this.validatePassword(formData.password)) {
                return false;
            }

            if (formData.password !== formData.confirm_password) {
                notify('The passwords are not the same');
                return false;
            }
        }

        if (formData.email && !this.validateEmail(formData.email)) {
            notify("You have entered an invalid email address!")
            return false;
        }

        if (formData.phone_number) {
            if (!iti.isValidNumber()) {
                notify("You have entered an invalid phone number!")
                return false;
            }

            formData.phone_number = iti.getNumber();
        }

        request('post', `/user/${endpoint}`, formData, {
            success: (data) => {
                if (data !== true) {
                    notify(data, {
                        pos: 'bottom-center',
                        textColor: '#FF6666',
                        actionTextColor: '#FF6666'
                    });
                } else {
                    loader.load(options.redirect);
                    notify(options.alert);
                    modal.close();
                }
            }
        })

        return true;
    }
}

class Products {
    constructor() {
        this.currentCategoryID = localStorage.lastCategoryID || false;
        this.products;

        this.INIT();
    }

    get components() {
        return {
            category: `
                <a onclick="products.changeCategory({id})">
                    <div class="w-48 h-32 bg-gray-700 rounded-lg relative flex-shrink-0 hover:opacity-80 cursor-pointer">
                        <section class="absolute rounded-lg h-full w-full bg-gray-900 bg-opacity-50 flex flex-col items-center justify-end f-rubik text-white pb-6">
                            <h1 class="pl-2 text-sm line-clamp-1 font-normal">{name}</h1>
                        </section>
                        <img src="{banner}" class="rounded-lg object-cover h-full w-full">
                    </div>
                </a>
            `,
            container: `
                <section id="category-container-{id}" class="relative my-12 {hidden}">
                    <section class="flex items-start justify-between flex-col-reverse md:flex-row">
                        <div class="relative z-10">
                            <h1 class="text-xl f-rubik mb-2 font-bold">{name}</h1>
                            <h1 class="text-base f-rubik mb-4 font-light max-w-screen-sm">{shortDescription}</h1>
                            <button class="mb-6 text-white bg-gray-800 font-normal rounded-md py-2.5 px-6 shadow-lg f-rubik transition hover:bg-opacity-80 duration-300 ease-in-out" onclick="products.openCategoryDocument({id})">
                                Learn More
                            </button>
                        </div>

                        <div class="absolute top-0 right-0 md:relative h-8 md:h-24">
                            <img src="{banner}" class="h-full rounded-md">
                            <section class="absolute w-full h-full top-0 left-0 bg-gradient-to-r from-gray-900 blend-screen to-gray-300 z-10 opacity-100">
                        </div>
                    </section>

                    <section class="flex flex-row w-full items-center justify-start overflow-auto relative mx-auto noscrollbar md:grid md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 md:gap-4" id="category-{id}">
                    </section>
                </section>
            `,
            item: `
                <div class="rounded relative w-44 md:w-auto cursor-pointer hover:bg-gray-200 duration-500 hover:opacity-80 flex-shrink-0 mr-2 mt-2 md:m-0 {hidden}" onclick="products.openProductDocument({categoryID}, {id})">
                    <div class="group relative flex items-center justify-center w-full overflow-hidden">
                        <img class="h-32 w-full object-cover rounded-md" src="{banner}">
                        <span class="absolute f-rubik rounded-md bottom-2 right-2 px-1.5 py-0.5 {label_color} text-xs {label_hidden}">{label_name}</span>
                    </div>

                    <div class="py-2.5 text-left">
                        <section class="h-28">
                            <span class="w-full flex items-center justify-start pb-2">
                                <div class="px-2.5 py-1 bg-gray-900 text-white w-auto f-rubik flex items-center justify-center rounded-md">
                                    <img src="../../assets/img/stores/{store}.png" class="h-3 pr-1">    
                                    <p class="text-xs w-full overflow-ellipsis overflow-hidden max-w-full">{store}</p>
                                </div>
                            </span>

                            <span class="text-gray-500 text-xs f-rubik line-clamp-1 opacity-80">{category}</span>
                            <h3 class="text-gray-900 text-base f-rubik font-bold line-clamp-1">{name}</h3>
                            <p class="text-gray-500 f-rubik text-sm" data-price="{realprice}">{price}</p>
                        </section>

                        <section>
                            <p class="text-{stock_color} f-rubik text-xs">Stock: {stock}</p>
                            <section class="text-gray-500 f-rubik text-xs pt-1 flex flex-row justify-between items-end">
                                <div class="text-xs pt-1 flex flex-row items-end">
                                    <span>
                                        <i class="fa fa-star text-yellow-500"></i>
                                        <i class="fa fa-star text-yellow-500"></i>
                                        <i class="fa fa-star text-yellow-500"></i>
                                        <i class="fa fa-star text-yellow-500"></i>
                                        <i class="fa fa-star"></i>
                                    </span>
                                    <p class="pl-2">({stock})</p>
                                </div>
                                <div>
                                    <i class="fa fa-info-circle text-base"></i>
                                </div>
                            </section>
                        </section>
                    </div>
                </div>
            `
        }
    }

    INIT() {
        request("get", "/api/products", {}, {
            done: () => $('main #loading').hide(),
            fail: () => $('main #loading h1').html('Failed to Load! Please Contact Admin.'),
            success: (products) => {
                this.products = products;
                this.CTAPRODUCT();

                Object.keys(products).map((categoryID) => {
                    const category = products[categoryID];

                    if ((Object.keys(category.list).length > 0) && (!this.currentCategoryID)) {
                        this.currentCategoryID = category.id;
                    }

                    // Category List
                    const categoryHTML = this.components.category
                        .replace(/{id}/g, category.id)
                        .replace(/{name}/g, category.name)
                        .replace(/{banner}/g, category.banner);

                    $('#product-category').append(categoryHTML);

                    // Container
                    const containerHTML = this.components.container
                        .replace(/{hidden}/g, (category.id == this.currentCategoryID) ? '' : 'hidden')
                        .replace(/{id}/g, category.id)
                        .replace(/{name}/g, category.name)
                        .replace(/{shortDescription}/g, category.shortDescription)
                        .replace(/{banner}/g, category.banner)

                    $('#product-container').append(containerHTML)

                    // Products
                    Object.keys(category.list).map((productID) => {
                        const product = category.list[productID];

                        function setLabel() {
                            switch (product.label) {
                                case 'No Label':
                                default:
                                    return 'bg-white text-white';
                                case 'Discount':
                                    return 'bg-red-200 text-red-700'
                                case 'Preorder':
                                    return 'bg-gray-700 text-gray-200'
                                case 'Instant':
                                    return 'bg-blue-200 text-blue-700'
                            }
                        }

                        const itemHTML = this.components.item
                            .replace(/{category}/g, category.name)
                            .replace(/{categoryID}/g, category.id)
                            .replace(/{hidden}/g, (!product.stock) ? 'hidden' : '')
                            .replace(/{id}/g, product.id)
                            .replace(/{name}/g, product.name)
                            .replace(/{stock}/g, product.stock)
                            .replace(/{stock_color}/g, (product.stock <= 10) ? 'red-500' : 'gray-500')
                            .replace(/{store}/g, product.store)
                            .replace(/{banner}/g, product.banner)
                            .replace(/{label_hidden}/g, (product.label == 'No Label') ? 'hidden' : '')
                            .replace(/{label_name}/g, product.label)
                            .replace(/{label_color}/g, setLabel())
                            .replace(/{realprice}/g, product.price)
                            .replace(/{price}/g, util.formatCurrency(product.price))
                            .replace(/{shortDescription}/g, product.shortDescription)
                            .replace(/{longDescription}/g, product.fullDescription);

                        $(`#category-${category.id}`).append(itemHTML);
                    });

                });
            }
        })
    }

    CTAPRODUCT() {
        const randomCategoryID = Math.round(Math.random() * (Object.keys(this.products).length));
        const randomCategory = this.products[Object.keys(this.products)[randomCategoryID]];

        console.log(randomCategory)
        if (!randomCategory || randomCategory == 'undefined') {
            return this.CTAPRODUCT();
        }

        const randomProductID = Math.round(Math.random() * (Object.keys(randomCategory.list).length));
        const randomProduct = randomCategory.list[Object.keys(randomCategory.list)[randomProductID]];

        if (!randomProduct || randomProduct == 'undefined') {
            return this.CTAPRODUCT();
        }


        const titleList = [
            `Get Your ${randomCategory.name} Now!`,
            `Need ${randomCategory.name}?`,
            `Looking Out For ${randomCategory.name}?`,
            `Don't Miss ${randomCategory.name}!`,
        ]
        const selectedTitle = titleList[Math.round(Math.random() * titleList.length)];
        $('#home-cta-banner-title').html(selectedTitle);

        const selectedProductTitle = `${randomProduct.name} starts at ${util.formatCurrency(randomProduct.price)}`
        $('#home-cta-banner-text').html(selectedProductTitle);
        $('#home-cta-banner-container').css('background-image', `url(${randomProduct.banner})`);
    }

    changeCategory(newID) {
        const currentID = this.currentCategoryID;
        if (newID == currentID) return;

        $(`#category-container-${currentID}, #category-container-${newID}`).toggleClass('hidden');
        this.currentCategoryID = newID;
        localStorage.lastCategoryID = newID;
    }

    searchProduct() {
        const input = $('#search-input').val().toLowerCase();
        if (!input) return;

        for (const name of Object.keys(allProducts)) {
            const cat = allProducts[name];
            const find = cat.tags.find(x => util.similar(x.toLowerCase(), input) >= 50);

            if (typeof find != 'undefined') {
                $('#search-input').val('');
                return openCategory(cat.id)
            }
        }
        return notify('Cannot find that product!')
    }

    openCategoryDocument(id) {
        const text = this.products[id].fullDescription;
        const modalContent = $('#markdown');

        if (!text) {
            return notify('No Info Available');
        }

        const converted = converter.makeHtml(text);

        modal.open('more-info');
        modalContent.html(converted);
    }

    openProductDocument(categoryID, productID) {
        const text = this.products[categoryID].list[productID].fullDescription;
        const modalContent = $('#markdown');

        if (!text) {
            return notify('No Info Available');
        }

        const converted = converter.makeHtml(text) + `<button class="w-full f-rubik font-bold py-2 text-center">Add to Cart</button>`

        modal.open('more-info');
        modalContent.html(converted);
    }
}

class Account {
    constructor() {}

    session() {
        notify('Please Wait . . .');
        $('form').addClass('hidden');

        request("post", "/user/session", {}, {
            success: (data) => {
                $('form').removeClass('hidden');
                if (data) {
                    location.href = '/account'
                }
            }
        })
    }
}

class Util {
    constructor() {
        if (localStorage.isTranslating) {
            $('#translate').prop('checked', (localStorage.isTranslating == 'false') ? false : true);
        }

        $("#translate").change(() => {
            localStorage.isTranslating = $('#translate').prop('checked');
            this.setGoogleTranslate(localStorage.selectedCountryID || 'id');
        });

        request('get', '/api/payments', {}, {
            success: (data) => {
                data.map(x => {
                    $('#payment-method').append(`<img src="assets/img/payments/${x.code}.png" class="max-h-11 mr-2 mt-2">`)
                })
            }
        })
    }

    setGoogleTranslate(langID) {
        if (!($('#translate').prop('checked'))) {
            googleTranslate('English');
        } else {
            switch (langID.toLowerCase()) {
                case 'id':
                    googleTranslate('Indonesian');
                    break;
                case 'de':
                    googleTranslate('German');
                    break;
                default:
                    googleTranslate('English');
                    break;
            }
        }

        function googleTranslate(lang) {
            $('#google_translate_element select option').each(function() {
                if ($(this).text().indexOf(lang) > -1) {
                    $(this).parent().val($(this).val());
                    var container = document.getElementById('google_translate_element');
                    var select = container.getElementsByTagName('select')[0];
                    triggerHtmlEvent(select, 'change');
                    triggerHtmlEvent(select, 'change');
                }
            });
        }
    }

    similar(a, b) {
        var equivalency = 0;
        var minLength = (a.length > b.length) ? b.length : a.length;
        var maxLength = (a.length < b.length) ? b.length : a.length;
        for (var i = 0; i < minLength; i++) {
            if (a[i] == b[i]) {
                equivalency++;
            }
        }

        var weight = equivalency / maxLength;
        return (weight * 100);
    }

    formatCurrency(amount) {
        const currency = localStorage.selectedCurrency || 'IDR';
        amount = fx.convert(amount, { to: currency });
        return OSREC.CurrencyFormatter.format(amount, { currency: currency });
    }

    isMobile() {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) ||
            /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
            return true;
        }
        return false;
    }
}