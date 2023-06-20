!function(){
    document.addEventListener('DOMContentLoaded', (event) => {
        console.log('custom UTM code init');

        function getUTMParams(name) {
            name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
            var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
            var results = regex.exec(location.search);
            return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
        }

        function setCookie(name, value, days) {
            var expires = '';
            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = '; expires=' + date.toUTCString();
            }
            document.cookie = name + '=' + (value || '') + expires + '; path=/';
        }

        function getCookie(cname) {
            let name = cname + "=";
            let decodedCookie = decodeURIComponent(document.cookie);
            let ca = decodedCookie.split(';');
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        }

        function setValueAndHideField(utmSource) {
            console.log('setValueAndHideField init');
            var labels = document.getElementsByTagName('label');
            var targetElement = null;

            for (var i = 0; i < labels.length; i++) {
                if (labels[i].innerHTML.indexOf('hidden-source') > -1) {
                    console.log('hidden-source found');
                    targetElement = labels[i].parentNode;
                    break;
                }
            }

            if (targetElement) {
                var inputElement = targetElement.querySelector('.field-element');
                if (inputElement) {
                    console.log('inputElement found');
                    inputElement.value = utmSource || 'Direct from site';
                    console.log('utmSource value', inputElement.value);
                }
                targetElement.style.display = 'none';
            }
        }

        var newUtmSource = getUTMParams('utm_source');
        var newUtmId = getUTMParams('utm_id');
        var newUtmTerm = getUTMParams('utm_term');
        var existingUtmSource = getCookie('utm_source');

        // Update the cookie if there is a different utm_source, utm_id or utm_term in the URL
        if (newUtmSource && newUtmSource !== existingUtmSource) {
            setCookie('utm_source', newUtmSource, 30);
        } else if (!newUtmSource && (newUtmId || newUtmTerm) && (newUtmId !== existingUtmSource || newUtmTerm !== existingUtmSource)) {
            setCookie('utm_source', newUtmId || newUtmTerm, 30);
        }

        var utmSource = getCookie('utm_source') || 'Direct from site';

        var addToCartButton = document.querySelector('.sqs-add-to-cart-button');
        console.log('addToCartButton', addToCartButton);
        if (addToCartButton) {
            addToCartButton.addEventListener('click', function () {
                console.log('form triggered');
                setTimeout(function () {
                    setValueAndHideField(utmSource);
                }, 500);
            });
        }
    });
}