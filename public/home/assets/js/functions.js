const notify = (text, config = {}) => {
    if (typeof text == 'object') {
        if (text.status == 401) {
            config.onActionClick = (el) => auth.open();
            config.actionText = 'Login';
            config.actionTextColor = '#EF4444';
        }

        text = text.message
    }

    const conf = Object.assign({
        pos: 'bottom-center',
        text
    }, config)

    return Snackbar.show(conf);
}

const triggerHtmlEvent = (element, eventName) => {
    var event;
    if (document.createEvent) {
        event = document.createEvent('HTMLEvents');
        event.initEvent(eventName, true, true);
        element.dispatchEvent(event);
    } else {
        event = document.createEventObject();
        event.eventType = eventName;
        element.fireEvent('on' + event.eventType, event);
    }
}

const request = (method, url, data = {}, handler = {}) => {
    if (!method) {
        notify('Error Happened, Please Contact Web Administrator!', {
            pos: 'bottom-center',
            textColor: '#FF6666',
            actionTextColor: '#FF6666'
        });
        throw new Error('Request Method Must Be Specified!')
    }

    if (!url) {
        notify('Error Happened, Please Contact Web Administrator!', {
            pos: 'bottom-center',
            textColor: '#FF6666',
            actionTextColor: '#FF6666'
        });
        throw new Error('Request URL Must Be Specified!')
    }

    if (typeof handler !== 'object') {
        notify('Error Happened, Please Contact Web Administrator!', {
            pos: 'bottom-center',
            textColor: '#FF6666',
            actionTextColor: '#FF6666'
        });
        throw new Error('Data Must Be an Object Data!')
    }

    if (typeof handler !== 'object') {
        notify('Error Happened, Please Contact Web Administrator!', {
            pos: 'bottom-center',
            textColor: '#FF6666',
            actionTextColor: '#FF6666'
        });
        throw new Error('Handler Must Be an Object Contain Functions!');
    }


    notify('Please Wait . . .', {
        customClass: 'loadingNotificiationAlert',
        pos: 'bottom-center',
        showAction: false
    });
    $('#page-blocker').toggleClass('hidden');

    $[method](url, data, (result) => {
            validateHandler('success', result)
        })
        .done(() => {
            $('.loadingNotificiationAlert').css('opacity', 0);
            validateHandler('done')
        })
        .fail((error) => {
            console.log(error)
            validateHandler('fail')
        })
        .always(() => {
            setTimeout(() => $('#page-blocker').toggleClass('hidden'), 500)
            validateHandler('always')
        });

    function validateHandler(name, result) {
        if (!handler[name] && (name == 'fail')) {
            return notify('Error Happened');
        }

        if (handler[name] && typeof handler[name] == "function") {
            return handler[name](result);
        } else if (handler[name]) {
            throw new Error(`Handler "${name}" Must be a Function!`);
        }
    }
}