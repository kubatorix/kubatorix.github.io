/* Sendsay member.set — подписка на анонсы, «получить исследование» (popup + PDF-модалка). */
(function () {
    'use strict';

    var API_URL = 'https://api.sendsay.ru/general/api/v100/json/mdoo';
    var API_KEY = '19GX7ORKgYbHjCVsIdpgip6xdgO9S1kj8wE8Hx3PSacTpw9_MwLDcu92POg';

    var PRESETS = {
        announces: function (name) {
            return [
                ['-group.pl49303', 'set', '1'],
                ['anketa.base.firstName', 'set', name],
                ['custom.q123', 'set', 'Фандрайзинг']
            ];
        },
        research: function (name) {
            return [
                ['-group.pl99047', 'set', '1'],
                ['base.firstName', 'set', name],
                ['custom.q123', 'set', 'Получить исследование']
            ];
        }
    };

    function buildPayload(email, name, preset) {
        return {
            apikey: API_KEY,
            action: 'member.set',
            email: email,
            addr_type: 'email',
            'newbie.confirm': '0',
            datakey: PRESETS[preset](name)
        };
    }

    function isSuccessResult(result) {
        if (!result || typeof result !== 'object') return true;
        if (Array.isArray(result.errors) && result.errors.length) return false;
        if (result.error) return false;
        return true;
    }

    async function submitMember(email, name, preset) {
        var response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(buildPayload(email, name, preset))
        });

        var result = null;
        try {
            result = await response.json();
        } catch (e) {
            result = null;
        }

        if (!response.ok || !isSuccessResult(result)) {
            var err = new Error('Sendsay API error');
            err.status = response.status;
            err.result = result;
            throw err;
        }

        return result;
    }

    function readContactFields(form) {
        var fd = new FormData(form);
        var email = String(fd.get('email') || '').trim();
        var name = String(fd.get('name') || '').trim();
        return { email: email, name: name };
    }

    function requiredCheckboxesChecked(form) {
        var boxes = form.querySelectorAll('input[type="checkbox"][required]');
        for (var i = 0; i < boxes.length; i++) {
            if (!boxes[i].checked) return false;
        }
        return boxes.length > 0;
    }

    function wireForm(form, preset, options) {
        if (!form || form.dataset.sendsayBound === '1') return;
        form.dataset.sendsayBound = '1';

        form.addEventListener('submit', async function (event) {
            event.preventDefault();

            var fields = readContactFields(form);
            if (!fields.email || !fields.name) {
                alert('Пожалуйста, заполните все обязательные поля.');
                return;
            }

            if (!requiredCheckboxesChecked(form)) {
                alert('Пожалуйста, примите условия пользовательского соглашения и согласие на обработку персональных данных.');
                return;
            }

            var submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) submitBtn.disabled = true;

            try {
                await submitMember(fields.email, fields.name, preset);
                if (options.onSuccess) {
                    options.onSuccess(form, fields);
                } else {
                    alert(options.successMessage || 'Заявка отправлена. Спасибо!');
                    form.reset();
                }
            } catch (error) {
                console.error('Sendsay error:', error);
                var code = error && error.status ? error.status : '';
                alert(
                    code
                        ? 'Произошла ошибка при отправке. Код: ' + code
                        : 'Произошла сетевая ошибка. Пожалуйста, попробуйте позже.'
                );
            } finally {
                if (submitBtn) submitBtn.disabled = false;
            }
        });
    }

    function wireSubscribe() {
        wireForm(document.querySelector('.subscribe'), 'announces', {
            successMessage: 'Вы успешно подписались!',
            onSuccess: function (form) {
                alert('Вы успешно подписались!');
                form.reset();
            }
        });
    }

    function wirePopupResearch() {
        var form = document.querySelector('.popup-research--form');
        if (!form) return;

        var successEl = document.querySelector('.popup-research__success');
        var defaultText = document.querySelector('.popup-research__text__default');

        wireForm(form, 'research', {
            onSuccess: function (submittedForm) {
                submittedForm.style.display = 'none';
                if (defaultText) defaultText.style.display = 'none';
                if (successEl) successEl.style.display = 'block';
                submittedForm.reset();
            }
        });
    }

    function wirePdfModal() {
        var form = document.querySelector('.pdf-modal__form');
        if (!form) return;

        wireForm(form, 'research', {
            onSuccess: function (submittedForm) {
                submittedForm.reset();
                var modal = document.getElementById('pdf-modal');
                if (modal) {
                    modal.classList.remove('pdf-modal--open');
                    modal.setAttribute('aria-hidden', 'true');
                    document.body.style.overflow = '';
                }
                alert('Спасибо! Мы отправим исследование на указанный адрес.');
            }
        });
    }

    function init() {
        wireSubscribe();
        wirePopupResearch();
        wirePdfModal();
    }

    /* modal.js injects .pdf-modal__form after this file may have run */
    window.kubatorixWirePdfModal = wirePdfModal;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
