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

                    $('[rel="page"]').off().on('click', function() {
                        const page = $(this).attr('href');
                        loader.load(page);
                        modal.close();
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

    subscribe() {
        if (localStorage.lastSubscribe && (Date.now() - localStorage.lastSubscribe < 30 * 60 * 1000)) {
            const subscribeWaitTime = util.millisToMinutesAndSeconds(30 * 60 * 1000 - (Date.now() - localStorage.lastSubscribe));
            notify(`Please wait ${subscribeWaitTime} before subscribing again!`);
        } else {
            const email = $('#home-subscribe-email').val();

            if (!email || !this.validateEmail(email)) {
                notify('Please Provide Valid Email Address!')
            } else {
                request('post', '/api/subscribe', { email }, {
                    success: (response) => {
                        notify(response.message);
                        if (response.status == 200) {
                            $('#home-subscribe-email').val('');
                            localStorage.lastSubscribe = Date.now();
                        }
                    }
                })
            }
        }

        return false;
    }

    auth = (form, endpoint) => {
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

        request('post', `/user/auth/${endpoint}`, formData, {
            success: (response) => {
                notify(response);

                if (response.status == 200) {
                    modal.close();
                }

            }
        })

        return false;
    }
}

class Products {
    constructor() {
        this.currentCategoryID = localStorage.lastCategoryID || false;
        this.products;
    }

    get components() {
        return {
            category: `
                <a id="category-selection-{id}" onclick="products.changeCategory({id})">
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
                    <section class="flex items-start justify-between flex-col-reverse md:flex-row mb-6">
                        <div class="relative z-10">
                            <h1 class="text-xl f-rubik mb-2 font-bold">{name}</h1>
                            <h1 class="text-base f-rubik mb-4 font-light max-w-screen-sm">{description}</h1>
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
                                    <img src="{storeLogo}" class="h-3 pr-1">    
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
                                    <span>{stars}</span>
                                    <p class="pl-2">({stock})</p>
                                </div>
                                <div>
                                    <i class="fa fa-info-circle text-base"></i>
                                </div>
                            </section>
                        </section>
                    </div>
                </div>
            `,
            modalCategoryInfo: `
                <section>
                    <h1 class="text-xl md:text-2xl font-bold">{name}</h1>
                    <h3 class="text-sm md:text-base mt-2 text-gray-500">{description}</h3>
                </section>
            `,
            modalProductInfo: `
                <section>
                    <div class="px-2.5 py-1 mb-2 bg-gray-900 text-white f-rubik flex items-center justify-center rounded-md w-max">
                        <img src="{storeLogo}" class="h-3 pr-1">
                        <p class="text-xs w-full overflow-ellipsis overflow-hidden max-w-full">{store}</p>
                    </div>
                    <h1 class="text-xl md:text-2xl font-bold">{name}</h1>

                    <section class="flex flex-row items-center justify-start mt-1">
                        <h3 id="modal-product-price" class="text-sm md:text-base text-gray-500"></h3>
                        <div id="modal-product-usage" class="f-rubik ml-2 flex flex-row items-center justify-center w-max rounded-md px-1.5 py-0.5 text-xs bg-white text-gray-800">
                            <a href="#0" title="Product Duration" onclick="notify('Product Duration')" class="hover:opacity-70">
                                <i class="fa fa-info-circle h-3 pr-1"></i>
                            </a>
                            <span></span>
                        </div>
                    </section>
                </section>

                <section>
                    <div id="modal-product-setup" class="f-rubik mt-4 w-max rounded-md px-1.5 py-0.5 text-xs text-white">
                        <a rel="page" href="faq#q8" title="Click for Details" class="hover:opacity-70">
                            <i class="fa fa-info-circle h-3 pr-1"></i>
                        </a>
                        <span></span>
                    </div>
                    
                    <section class="flex flex-col sm:flex-row">
                        <div id="modal-product-extendable" class="f-rubik mt-2 w-max rounded-md px-1.5 py-0.5 text-xs text-white">
                            <a rel="page" href="faq#q8" title="Click for Details" class="hover:opacity-70">
                                <i class="fa fa-info-circle h-3 pr-1"></i>
                            </a>
                            <span></span>
                        </div>
                        
                        <div id="modal-product-warranty" class="f-rubik sm:ml-2 mt-2 w-max rounded-md px-1.5 py-0.5 text-xs bg-black text-white">
                            <a href="#0" title="Product Duration" onclick="notify('Product Warranty Duration')" class="hover:opacity-70">
                                <i class="fa fa-info-circle h-3 pr-1"></i>
                            </a>
                            <span></span>
                        </div>
                    </section>

                    <form onsubmit="return cart.add({productID});" class="flex flex-col mt-4 space-y-3 max-w-xs">
                        <select class="bg-white border-none rounded-md flex items-center justify-start mr-1 w-full mt-4 px-2 py-1.5 text-gray-800 text-sm" id="modal-product-variant"></select>

                        <section class="grid grid-cols-3">
                            <input type="number" class="bg-white border-none rounded-md col-span-1 flex items-center justify-start mr-1 w-full px-2 py-1.5 text-gray-800 text-sm" id="modal-product-amount" placeholder="Amount" value="0" min="1" max="{stock}">

                            <div class="w-full pl-3 col-span-2">
                                <button class="w-full px-3 py-1.5 bg-white text-gray-800 text-sm lg:text-base rounded-md font-bold hover:opacity-70">Add to Cart</button>
                            </div>
                        </section>
                    </form>

                    <p class="mt-2 text-sm">Stock: <span class="font-bold" id="modal-product-stock">0</span></p>
                    <p class="mt-1 text-sm">Total Price: <span class="font-bold" id="modal-product-total">${util.formatCurrency(0)}</span></p>
                </section>
            `,
            modalProductReview: `
                <div class=" flex flex-col w-full divide-y rounded-md bg-gray-50 text-gray-800">
                    <div class="flex justify-between p-4">
                        <div class="flex space-x-4">
                            <div class="flex items-center justify-center">
                                <img src="{userImage}" alt="" class="object-cover w-12 h-12 rounded-full">
                            </div>
                            <div class="flex items-start justify-center flex-col">
                                <h4 class="font-bold">{username}</h4>
                                <span class="text-xs text-gray-600">{date}</span>
                            </div>
                        </div>
                        <div class="flex items-center space-x-2 text-yellow-500">
                            <span class="h-full flex items-center justify-center">
                                <i class="fa fa-star text-yellow-500 w-5 h-5"></i>
                            </span>
                            <span class="text-xl font-bold h-full flex items-center justify-center">{score}</span>
                        </div>
                    </div>
                    <div class="p-4 space-y-2 text-sm text-gray-600">
                        <p>{content}</p>
                    </div>
                </div>
            `
        }
    }

    INIT() {
        request("get", "/api/products", {}, {
            success: (products) => {
                this.products = products;
                this.CTAPRODUCT();
                $('#product-category, #product-container').empty();

                util.shuffleArray(Object.keys(products)).map((categoryID) => {
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
                        .replace(/{description}/g, category.description)
                        .replace(/{banner}/g, category.banner)

                    $('#product-container').append(containerHTML)

                    // Products
                    Object.keys(category.list).map((productID) => {
                        const product = category.list[productID];
                        if (product.variants.length === 0) return;

                        const itemHTML = this.components.item
                            .replace(/{category}/g, category.name)
                            .replace(/{categoryID}/g, category.id)
                            .replace(/{hidden}/g, (!product.totalStock) ? 'hidden' : '')
                            .replace(/{id}/g, product.id)
                            .replace(/{name}/g, product.name)
                            .replace(/{stock}/g, product.totalStock)
                            .replace(/{stock_color}/g, (product.totalStock <= 10) ? 'red-500' : 'gray-500')
                            .replace(/{store}/g, product.store.name)
                            .replace(/{storeLogo}/g, product.store.logo)
                            .replace(/{banner}/g, product.banner)
                            .replace(/{label_hidden}/g, (product.label == 'No Label') ? 'hidden' : '')
                            .replace(/{label_name}/g, product.label)
                            .replace(/{label_color}/g, setLabel())
                            .replace(/{stars}/g, setStars())
                            .replace(/{realprice}/g, product.variants[0].price)
                            .replace(/{price}/g, util.formatCurrency(product.variants[0].price))

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

                        function setStars() {
                            var stars = "";

                            for (var i = 0; i < product.score; i++) {
                                stars += `<i class="fa fa-star text-yellow-500"></i>`
                            }

                            for (var i = 0; i < (5 - product.score); i++) {
                                stars += `<i class="fa fa-star"></i>`
                            }

                            return stars;
                        }

                        $(`#category-${category.id}`).append(itemHTML);
                    });
                });
            }
        })
    }

    CTAPRODUCT() {
        const randomCategoryID = Math.round(Math.random() * (Object.keys(this.products).length));
        const randomCategory = this.products[Object.keys(this.products)[randomCategoryID]];

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
        $('#home-cta-banner-button').off().on('click', () => this.changeCategory(randomCategory.id));
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

    openProductDocument(categoryID, productID) {
        const product = this.products[categoryID].list[productID];
        const text = product.description;

        const converted = converter.makeHtml(text);
        const infoHTML = this.components.modalProductInfo
            .replace(/{productID}/g, productID)
            .replace(/{name}/g, product.name)
            .replace(/{storeLogo}/g, product.store.logo)
            .replace(/{store}/g, product.store.name)
            .replace(/{stock}/g, product.variants[0].stock)

        $('#modal-product-banner').attr('src', product.banner);
        $('#modal-product-description').html(converted);
        $('#modal-product-variant').empty();
        $('#modal-product-info').html(infoHTML);

        $('#modal-product-review')
            .css('display', 'block')
            .empty();

        if (product.reviews.length > 0) {
            for (const review of product.reviews) {
                const reviewHTML = this.components.modalProductReview
                    .replace(/{userImage}/g, `https://avatars.dicebear.com/api/initials/${review.username}.svg`)
                    .replace(/{username}/g, review.username)
                    .replace(/{date}/g, review.date)
                    .replace(/{content}/g, review.review)
                    .replace(/{score}/g, review.score);

                $('#modal-product-review').append(reviewHTML);
            }
        } else {
            $('#modal-product-review').append("No Reviews Available");
        }

        modal.open('more-info');
        for (const variant of product.variants) {
            $('#modal-product-variant').append(`<option value="${variant.id}">${variant.name}</option>`);
        }


        $('#modal-product-variant').change(() => this.setupLabel(product));
        $("#modal-product-amount").bind('keyup change click', (e) => {
            const variantID = $('#modal-product-variant').val();
            const variant = product.variants.find(x => x.id == variantID);
            this.sumPrice(variant.price, variant.setupPrice);
        });

        return this.setupLabel(product);
    }

    setupLabel(product) {
        const variantID = $('#modal-product-variant').val();
        const variant = product.variants.find(x => x.id == variantID);

        $('#modal-product-stock').html(variant.stock)
        $('#modal-product-price').html(util.formatCurrency(variant.price));
        $('#modal-product-usage > span').html(`${variant.usageDuration} Days`);
        $('#modal-product-warranty > span').html(`${variant.warrantyDuration} Days Warranty`);

        if (variant.setupPrice) {
            $('#modal-product-setup').addClass('bg-red-500').removeClass('bg-green-500');
            $('#modal-product-setup > span').html(`Setup Price: ${util.formatCurrency(variant.setupPrice)}`)
        } else {
            $('#modal-product-setup').removeClass('bg-red-500').addClass('bg-green-500');
            $('#modal-product-setup > span').html(`No Setup Price`)
        }

        if (variant.extendable) {
            $('#modal-product-extendable').removeClass('bg-yellow-500').addClass('bg-green-500');
            $('#modal-product-extendable > span').html(`Extendable`)
        } else {
            $('#modal-product-extendable').addClass('bg-yellow-500').removeClass('bg-green-500');
            $('#modal-product-extendable > span').html(`Not Extendable`)
        }

        return this.sumPrice(variant.price, variant.setupPrice);
    }

    sumPrice(price, setupPrice = 0) {
        setTimeout(() => {
            const amount = $('#modal-product-amount').val();
            const total = util.formatCurrency(amount * (price + setupPrice));
            $('#modal-product-total').html(total)
        }, 10);

        return true;
    }
}

class Auth {
    constructor() {}

    open(callback) {
        request("post", "/user/session", {}, {
            success: (session) => {
                if (session.status == 401) {
                    return this.openLoginForm();
                } else if (callback && typeof callback == 'function') {
                    return callback();
                } else {
                    return location.href = '/member'
                }
            }
        })
    }

    openLoginForm() {
        request("get", `/components/forms/login.html`, {}, {
            success: (html) => {
                $('#auth').html(html);
                return modal.open('auth');
            }
        });
    }

}

class Util {
    constructor() {
        request('get', '/api/payments', {}, {
            success: (data) => {
                data.map(x => {
                    $('#payment-method').append(`<img src="assets/img/payments/${x.code}.png" class="max-h-11 mr-2 mt-2">`)
                })
            }
        })
    }

    millisToMinutesAndSeconds(millis) {
        var minutes = Math.floor(millis / 60000);
        var seconds = ((millis % 60000) / 1000).toFixed(0);
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
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
        const currency = localStorage.selectedCurrency || currencySettings.base;
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

    shuffleArray(array) {
        return array.sort(() => Math.random() - 0.5);
    }
}

class Cart {
    constructor() {}

    get components() {
        return {
            cartList: `
            <section class="w-full flex flex-col">
                <div class="flex flex-wrap justify-between items-center mt-6 pt-6" id="cart-{cartId}">
                    <div class="flex items-center"> 
                        <img src="{banner}" width="60" class="rounded-full h-12 w-12 object-cover">
                        <div class="flex flex-col ml-3"> 
                            <span class="md:text-md font-medium">{name}</span> 
                            <span class="text-xs font-light text-gray-400">{variant}</span>
                        </div>
                    </div>

                    <div class="flex justify-center items-center mt-4 sm:mt-0">
                        <div class="pr-4 sm:pr-8 flex"> 
                            <p class="f-rubik">
                                <span class="text-xs text-gray-400 font-bold">Qty:</span> 
                                {quantity}
                            </p>
                        </div>
                        <div class="pr-4 sm:pr-8"> 
                            <span class="text-sm f-rubik font-medium" data-cartprice="{realPrice}">{price}</span> 
                        </div>
                        <div> 
                            <a href="#0" title="Edit Additional Information" onclick="$('#info-{cartId}').toggleClass('hidden')">
                                <i class="fa fa-edit text-base font-medium"></i> 
                            </a>
                            <a href="#0" title="Remove Product" onclick="cart.remove({cartId})">
                                <i class="fa fa-times-circle text-base font-medium"></i> 
                            </a>
                        </div>
                    </div>
                </div>

                <form class="mt-4 space-y-2 hidden" id="info-{cartId}" onsubmit="return cart.updateInfo({cartId})">
                    <span class="text-xs font-light text-gray-400">Additional Information</span>
                    <textarea class="resize-y border w-full rounded-md mb-4">{information}</textarea>
                    <button class="bg-yellow-500 rounded text-white hover:bg-yellow-600 h-12 w-full cursor-pointer">
                        Update Information
                    </button>
                </form>
            </section>
            `
        }
    }

    open() {
        request('post', '/user/cart', {}, {
            success: (response) => {
                if (response.status == 200) {
                    return this.openCart(response.data);
                } else {
                    return notify(response);
                }
            }
        })
    }

    openCart(data) {
        request("get", `/components/util/cart.html`, {}, {
            success: (html) => {
                $('#cart').html(html);
                this.listProducts(data);
                return modal.open('cart');
            }
        });
    }

    listProducts(products) {
        for (const product of products) {
            const price = product.quantity * (product.variant.price + product.variant.setupPrice);

            const listHTML = this.components.cartList
                .replace(/{cartId}/g, product.cartId)
                .replace(/{banner}/g, product.banner)
                .replace(/{name}/g, product.name)
                .replace(/{variant}/g, product.variant.name)
                .replace(/{quantity}/g, product.quantity)
                .replace(/{price}/g, util.formatCurrency(price))
                .replace(/{realPrice}/g, price)
                .replace(/{information}/g, product.information)

            $('#cart-list').append(listHTML)
            $('#cart-empty-prompt').css('display', 'none');
        }

        return this.listPayments();
    }

    listPayments() {
        request('get', '/api/payments', {}, {
            success: (data) => {
                if (Array.isArray(data)) {
                    for (const payment of data) {
                        $('#cart-payments-options').append(`<option value="${payment.code}">${payment.name}</option>`)
                    }

                    $('#cart-payments-options').change(() => {
                        const payment = data.find((payment) => payment.code == $('#cart-payments-options').val());
                        this.setPayment(payment);
                    });

                    return this.setPayment(data[0]);
                } else {
                    return notify(data);
                }
            }
        })
    }

    updateInfo(id) {
        const info = $(`#info-${id} > textarea`).val() || "No Additional Information";

        if (info.length > 355) {
            notify('Information is too Long!');
            return false;
        }

        request('post', '/user/cart/updateInfo', {
            cartId: id,
            additional_info: info
        }, {
            success: (response) => {
                notify(response);
            }
        })

        return false;
    }

    setPayment(payment) {
        $('#cart-payments-options-logo').prop('src', `assets/img/payments/${payment.code}.png`);
        $('#fee-flat')
            .data('fee', payment.total_fee.flat)
            .html(util.formatCurrency(payment.total_fee.flat))

        return this.setPrice();
    }

    setPrice() {
        var totalPrice = 0;
        $('[data-cartprice]').each(function() {
            totalPrice += $(this).data('cartprice');
        })

        const fee = $('#fee-flat').data('fee');
        const total = totalPrice + fee;

        $('#subtotal').html(util.formatCurrency(totalPrice));
        $('#total-price').html(util.formatCurrency(total));

        $('#cart-payments-options, #pay')
            .prop('disabled', (totalPrice == 0) ? true : false)
            .css('cursor', (totalPrice == 0) ? 'not-allowed' : 'pointer');

        return totalPrice;
    }

    add(productID) {
        const quantity = $('#modal-product-amount').val();
        const variantID = $('#modal-product-variant').val();
        request('post', '/user/cart/add', { productID, quantity, variantID }, {
            success: (response) => {
                const config = new Object;

                if (response.status == 200) {
                    config.onActionClick = (el) => cart.open();
                    config.actionText = 'Open Cart';
                    config.actionTextColor = '#F59E0B';
                }

                notify(response, config)
            }
        })

        return false;
    }

    remove(id) {
        request('post', '/user/cart/remove', { cartId: id }, {
            success: (response) => {
                notify(response)

                if (response.status == 200) {
                    $(`#cart-${id}`).remove();
                    this.setPrice();
                }
            }
        })
    }

    buy() {
        if (this.setPrice() === 0) {
            notify('You don\'t have any products in your cart!')
            return false;
        }

        if (this.setPrice() < 10000) {
            notify(`Minimum Purchase is ${util.formatCurrency(10000)}`)
            return false;
        }

        request('post', '/user/transaction/buy', {
            method: $('#cart-payments-options').val()
        }, {
            success: (response) => {
                if (response.status == 200) {
                    location.href = response.message;
                    return notify('Redirecting to payment gateway . . .');
                } else {
                    notify(response);
                    return modal.close();
                }
            }
        })
    }
}