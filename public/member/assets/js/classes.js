class Page {
    constructor() {
        this.mainMenu = [{
                name: "Home",
                page: "home.html",
                icon: 'tachometer-alt',
                rel: 'page'
            },
            {
                name: "Account",
                page: "account.html",
                icon: 'user',
                rel: 'page'
            }
        ];

        this.additionalMenu = [{
            name: "Home",
            page: "/",
            icon: 'home',
            rel: ''
        }, {
            name: "Support",
            page: "/contact-us",
            icon: 'cogs',
            rel: ''
        }, {
            name: "Sign Out",
            page: "/user/auth/logout",
            icon: 'sign-out-alt',
            rel: ''
        }];
    }

    INIT(data) {
        for (const menu of this.mainMenu) {
            $('#desktop-mainmenu').append(`
                <a href="${menu.page}" rel="${menu.rel}" class="flex items-center text-white py-4 pl-6 nav-item">
                    <i class="fas fa-${menu.icon} mr-3"></i> ${menu.name}
                </a>
            `)

            $('#mobile-menu').append(`
                <a href="${menu.page}" rel="${menu.rel}" class="flex items-center text-white py-2 pl-4 nav-item">
                    <i class="fa fa-${menu.icon} mr-3"></i> ${menu.name}
                </a>
            `)
        }

        for (const menu of this.additionalMenu) {

            $('#desktop-additionalmenu').append(`
                <a href="${menu.page}" rel="${menu.rel}" class="block px-4 py-2 account-link hover:text-white">
                    <i class="fa fa-${menu.icon} mr-3"></i> ${menu.name}
                </a>
            `)

            $('#mobile-menu').append(`
                <a href="${menu.page}" rel="${menu.rel}" class="flex items-center text-white py-2 pl-4 nav-item">
                    <i class="fa fa-${menu.icon} mr-3"></i> ${menu.name}
                </a>
            `)
        }

        const load = this.load;
        $('a[rel="page"]').off().on('click', function() {
            const page = $(this).attr('href').replace('.html', '');
            load(page);
            return false;
        });

        $('#user-image').prop('src', `https://avatars.dicebear.com/api/initials/${data.first_name}.svg`);
        return load('home');
    }

    load(page) {
        $('#body').load(`/member/pages/${page}.html`, (res, status) => {})
        return true;
    }
}

class Transaction {
    constructor() {
        this.data = new Object;
        this.analyticsData = new Object;
        this.reloadTimeout = 0;
    }

    list() {
        $.post('/user/transaction/list', (response) => {
            if (response.status == 200) {
                $('#transaction-list').empty();

                for (const transaction of response.data) {
                    this.data[transaction.id] = transaction;

                    $('#transaction-list').append(`
                        <tr>
                            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                <div class="flex items-center">
                                    <div class="flex-shrink-0 w-10 h-10">
                                        <img class="w-full h-full rounded-full object-cover" src="${transaction.product.banner}" alt="" />
                                    </div>
                                    <div class="ml-3">
                                        <p class="text-gray-900 whitespace-no-wrap">
                                            ${transaction.product.name}
                                        </p>
                                    </div>
                                </div>
                            </td>
                            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                <span class="relative inline-block px-3 py-1 font-semibold text-${this.setLabelColor(transaction.paymentStatus)}-900 leading-tight">
                                    <span aria-hidden class="absolute inset-0 bg-${this.setLabelColor(transaction.paymentStatus)}-200 opacity-50 rounded-full"></span>
                                    <span class="relative">${transaction.paymentStatus}</span>
                                </span>
                            </td>
                            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                <span class="relative inline-block px-3 py-1 font-semibold text-${this.setLabelColor(transaction.productStatus)}-900 leading-tight">
                                    <span aria-hidden class="absolute inset-0 bg-${this.setLabelColor(transaction.productStatus)}-200 opacity-50 rounded-full"></span>
                                    <span class="relative">${transaction.productStatus}</span>
                                </span>
                            </td>
                            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                <span class="relative inline-block px-3 py-1 font-semibold text-white leading-tight opacity-50 hover:opacity-100 cursor-pointer" onclick="transaction.info(${transaction.id})">
                                    <span aria-hidden class="absolute inset-0 bg-gray-800 rounded-full"></span>
                                    <span class="relative">${transaction.paymentStatus == "UNPAID" ? "Pay Now" : "More Info"}</span>
                                </span>
                            </td>
                        </tr>
                    `)
                }

                return this.analyst(response.data)
            } else {
                if (response.status == 401) {
                    location.href = '/'
                }
                return alert(response.message);
            }
        })
    }

    reload() {
        if ((Date.now() - this.reloadTimeout) < (60 * 1000)) {
            const waitTime = util.millisToMinutesAndSeconds(60 * 1000 - (Date.now() - this.reloadTimeout));
            return alert(`Please wait ${waitTime} before reloading again!`);
        }

        this.reloadTimeout = Date.now();
        this.list();
        return alert('Finished Reloading.')
    }

    info(id) {
        const transaction = this.data[id];
        const product = transaction.product;
        var description = transaction.productDescription;

        if (transaction.paymentStatus == "UNPAID") {
            description = `Please Proceed to Pay on: [${transaction.paymentGateway}](${transaction.paymentGateway})`
        }

        const additionalData = [
            `**Transaction ID:** ${transaction.transactionId}`,
            `**Product Name:** ${product.name}`,
            `**Store:** ${product.store}`,
            `**Amount:** ${transaction.productAmount}`,
            `**Total Price:** ${util.formatCurrency(transaction.productPrice)}`,
            `**Payment Method:** ${transaction.paymentMethod}`,
            `**Additional Info:** ${transaction.transactionAdditionalInformation}`,
        ].join('<br/>');

        const info = [
            "## Transaction Information:",
            '\n',
            additionalData,
            '\n',
            "## Product Information:",
            '\n',
            description
        ].join('\n');

        const converted = converter.makeHtml(info);

        if (transaction.paymentStatus == "PAID") {
            $('#review-section').css('display', 'block');
            $('#review-form').attr('onsubmit', `return transaction.review(${transaction.id}, ${product.id});`)
            if (transaction.review) {
                $('#review-stars').val(transaction.review.stars)
                $('#review-message').val(transaction.review.reviews)
            } else {
                $('#review-stars').val('5')
                $('#review-message').val(' ');
            }
        } else {
            $('#review-section').css('display', 'none');
        }

        $("#transaction-details").html(converted)
        $('#transaction-modal').modal({
            fadeDuration: 400
        });
    }

    review(transactionID, productID) {
        if (localStorage.reviewTimeout && (Date.now() - localStorage.reviewTimeout) < (60 * 1000)) {
            const waitTime = util.millisToMinutesAndSeconds(60 * 1000 - (Date.now() - localStorage.reviewTimeout));
            return alert(`Please wait ${waitTime} before reloading again!`);
        }

        const stars = parseInt($('#review-stars').val());

        if (!stars || !!isNaN(stars)) {
            return res.send({
                message: 'Please Leave Stars Review',
                status: 400
            })
        }

        if (stars > 5 || stars < 1) {
            return res.send({
                message: 'Please Leave a Valid Stars Review',
                status: 400
            })
        }

        const reviews = $('#review-message').val();

        if (!reviews) {
            return res.send({
                message: 'Please Leave A Review Message',
                status: 400
            })
        }

        if (!reviews.length > 200) {
            return res.send({
                message: 'Review Message is Too Long!',
                status: 400
            })
        }


        $.post('/user/transaction/review', {
            transaction_id: transactionID,
            product_id: productID,
            reviews,
            stars
        }, (response) => {
            alert(response.message);

            if ((response.status == 200)) {
                if (response.updating) {
                    localStorage.reviewTimeout = Date.now();
                }
                $.modal.close();
            }
        })

        return false;
    }

    analyst(data) {
        const transactions = {
            thisDay: {
                filter: (x) => new Date(x.datePurchased).toDateString() === new Date(Date.now()).toDateString(),
                compare: 'yesterday'
            },
            yesterday: {
                filter: (x) => new Date(x.datePurchased).toDateString() === new Date(Date.now()).toDateString(),
                compare: false
            },
            thisMonth: {
                filter: (x) => getFilterMonth(x.datePurchased) === getFilterMonth(),
                compare: 'lastMonth'
            },
            lastMonth: {
                filter: (x) => getFilterMonth(x.datePurchased, 1) === getFilterMonth(),
                compare: false
            },
            allTime: {
                filter: false,
                compare: false
            }
        }

        function getFilterMonth(param = Date.now(), subtraction = 0) {
            return `${new Date(param).getMonth() - subtraction}/${new Date(Date.now()).getFullYear()}`
        }

        function getData(filter) {
            const source = (filter) ? data.filter(filter) : data;
            const processed = {
                totalProductStock: 0,
                totalProduct: 0,
                totalSpend: 0,
            };


            const mostPurchasedStore = util.getPopularArray(source, 'productStore');
            if (mostPurchasedStore) {
                processed.mostPurchasedStore = mostPurchasedStore[0];
            }

            const mostPurchasedProduct = util.getPopularArray(source, 'productId');
            if (mostPurchasedProduct) {
                const product = source.find(x => x.product.id == mostPurchasedProduct[0]).product;
                processed.mostPurchasedProduct = {
                    productId: product.id,
                    productName: product.name,
                    productPrice: product.price,
                    productSetupPrice: product.setupPrice
                };
            }

            const mostPurchasedCategory = util.getPopularArray(source, 'product', 'categoryId');
            if (mostPurchasedCategory) {
                const category = source.find(x => x.product.categoryId == mostPurchasedCategory[0]).product;
                processed.mostPurchasedCategory = {
                    categoryId: category.categoryId,
                    categoryName: category.categoryName
                };
            }

            processed.totalStore = [];
            processed.totalProduct = source.length;

            for (const transaction of source) {
                processed.totalSpend += transaction.productPrice;
                if (processed.totalStore.find((x) => x == transaction.productStore) == undefined) {
                    processed.totalStore.push(transaction.productStore)
                }
            }


            return processed;
        }

        function compareData(now, before) {
            now[`Comparison With ${util.normalizeKey(now.compare)}`] = {
                totalProductPercentage: util.percentage(now.totalProduct, before.totalProduct) + '%',
                totalProductStockPercentage: util.percentage(now.totalProductStock, before.totalProductStock) + '%',
                totalSpendPercentage: util.percentage(now.totalSpend, before.totalSpend) + '%'
            }

            return now;
        }

        for (const key in transactions) {
            const transaction = transactions[key];
            transactions[key] = getData(transaction.filter);
            transactions[key].compare = transaction.compare
        }

        for (const key in transactions) {
            const transaction = transactions[key];

            if (!!transaction.compare) {
                transactions[key] = compareData(transaction, transactions[transaction.compare])
            }

            transactions[key].totalSpend = util.formatCurrency(transactions[key].totalSpend);
            delete transactions[key].compare;
        }

        this.analyticsData = transactions;
        this.setChart();
        return transactions;
    }

    setChart() {
        $('#graph').empty();
        const data = this.analyticsData.thisMonth;
        setGraph('totalProduct', data.totalProduct);
        setGraph('totalProductStock', data.totalProductStock);
        setGraph('totalSpend', data.totalProduct);
        setGraph('totalStore', data.totalStore.length);

        function setGraph(name, amount) {
            const percentage = data["Comparison With Last Month"][`${name}Percentage`] || 0;

            function setSpan() {
                if (String(percentage).startsWith('-')) {
                    return {
                        color: "red",
                        path: "M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z"
                    }
                } else {
                    return {
                        color: 'green',
                        path: "M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                    }
                }
            }

            return $('#graph').append(`
                <div class="p-6 card">
                    <div class="flex items-start justify-between">
                        <h2 class="mb-2 font-mono text-2xl font-light leading-none text-gray-900 truncate">
                            ${amount}
                        </h2>
                        <span class="flex items-center space-x-1 text-sm font-medium leading-none text-${setSpan().color}-600">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                                class="flex-none w-4 h-4">
                                <path fill-rule="evenodd" d="${setSpan().path}" clip-rule="evenodd" />
                            </svg>
                            <span>${percentage}</span>
                        </span>
                    </div>
                    <p class="text-sm leading-none text-gray-600">${util.normalizeKey(name)}</p>
                </div>
            `)
        }

        return true;
    }

    openAnalytics() {
        var md = '';
        var i = 1;

        for (const key in this.analyticsData) {
            md += `## ${i}. ` + util.normalizeKey(key) + '\n';
            i += 1;

            var y = 1;
            for (const objKey in this.analyticsData[key]) {
                md += `##### ${String.fromCharCode(y + 64)}. ` + util.normalizeKey(objKey) + '\n\n';
                y += 1;

                const data = this.analyticsData[key][objKey];
                if (Array.isArray(data)) {
                    if (data.length === 0) {
                        md += '- ' + 'No Data' + '\n';
                    } else {
                        for (const val of data) {
                            md += '- ' + util.normalizeKey(val) + '\n';
                        }
                    }
                } else if (typeof data === 'object') {
                    for (const dataKey in this.analyticsData[key][objKey]) {
                        md += '- **' + util.normalizeKey(dataKey) + ":** " + util.normalizeKey(this.analyticsData[key][objKey][dataKey]) + '\n\n';
                    }
                } else {
                    md += util.normalizeKey(data) + '\n';
                }
            }

            md += '\n-------\n\n-------\n'
        }

        const converted = converter.makeHtml(md);
        $('#chart-modal')
            .html(converted)
            .modal({
                fadeDuration: 400
            });
    }

    setLabelColor(status) {
        switch (status.toLowerCase()) {
            case 'unpaid':
            case 'pending':
            case 'refund':
                return 'yellow';
            case 'active':
            case 'paid':
                return 'green';
            default:
                return 'red';
        }
    }
}

class Form {
    constructor() {}

    validatePassword(password) {
        // Validate lowercase letters
        if (!password.match(/[a-z]/g)) {
            alert("Password must contain lowercase character!");
            return false;
        }

        // Validate capital letters
        if (!password.match(/[A-Z]/g)) {
            alert("Password must contain uppercase character!");
            return false;
        }

        // Validate numbers
        if (!password.match(/[0-9]/g)) {
            alert("Password must contain numbers!");
            return false;
        }

        // Validate length
        if (!(password.length >= 8)) {
            alert('Password must have at least 8 character!');
            return false;
        }

        return true;
    }

    auth = (form, endpoint) => {
        const formData = new Object;
        $(form).serializeArray().map(x => formData[x.name] = x.value);

        if (formData.password && formData.confirm_password) {
            if (!this.validatePassword(formData.password)) {
                return false;
            }

            if (formData.password !== formData.confirm_password) {
                alert('The passwords are not the same');
                return false;
            }

            if (formData.current_password) {
                if (formData.password == formData.current_password) {
                    alert('You cannot use the same password as before');
                    return false;
                }
            }
        }

        $.post(`/user/auth/${endpoint}`, formData, (response) => {
            alert(response.message);
            if (response.status == 200) {
                return page.load('index.html');
            }
        })

        return false;
    }
}

class Util {
    constructor() {}

    normalizeKey(str) {
        if (typeof str !== 'string') {
            str = String(str);
        }

        return str
            .replace(/[A-Z]/g, (letter) => ` ${letter}`)
            .replace(/(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g, (s) => s.toUpperCase());
    }

    percentage(b, a) {
        let percent;
        if (b !== 0) {
            if (a !== 0) {
                percent = (b - a) / a * 100;
            } else {
                percent = b * 100;
            }
        } else {
            percent = -a * 100;
        }
        return Math.floor(percent);
    }

    getPopularArray(array, uniqueID1 = 'id', uniqueID2 = false) {
        const data = new Object;
        for (const arr of array) {
            if (typeof arr == 'string') {
                if (!data[arr]) {
                    data[arr] = 0;
                }
                data[arr] += 1;
            } else if (typeof arr == 'object') {
                if (!uniqueID2) {
                    if (!data[arr[uniqueID1]]) {
                        data[arr[uniqueID1]] = 0;
                    }
                    data[arr[uniqueID1]] += 1;
                } else {
                    if (!data[arr[uniqueID1][uniqueID2]]) {
                        data[arr[uniqueID1][uniqueID2]] = 0;
                    }
                    data[arr[uniqueID1][uniqueID2]] += 1;
                }
            }
        }

        const processed = Object.entries(data).sort((a, b) => a[1] - b[1]).reverse()[0];
        return (processed && processed.length > 0) ? processed : false;
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
}