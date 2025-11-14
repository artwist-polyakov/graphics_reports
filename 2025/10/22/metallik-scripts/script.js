// Конфигурация ситуаций и скриптов
const situations = {
    1: {
        title: '❄️ Холодный или подвисший региональный клиент',
        description: 'Клиент интересовался, но сделка не движется. Например: "Магазин Омск"',
        scripts: [
            {
                id: 'situation1_script1',
                title: 'Скрипт 1: Фокус на "готовое решение"',
                description: 'Акцент на готовом сайте и рекламе без вложений со стороны клиента',
                file: 'scripts/situation1_script1.txt'
            }
        ]
    },
    2: {
        title: '🔥 Существующий (теплый) клиент',
        description: 'Клиент уже покупает, но нерегулярно или небольшими объемами',
        scripts: [
            {
                id: 'situation2_script1',
                title: 'Скрипт 1: Фокус на лояльность и рост',
                description: 'Предложение для существующих партнеров, инструмент для увеличения продаж',
                file: 'scripts/situation2_script1.txt'
            },
            {
                id: 'situation2_script2',
                title: 'Скрипт 2: Работа с возражением "У меня есть свой сайт"',
                description: 'Дополнительный канал лидов, не замена существующего сайта',
                file: 'scripts/situation2_script2.txt'
            }
        ]
    },
    3: {
        title: '🔧 Монтажник или строительная бригада',
        description: 'Не магазин, а установщик. Продажа товара + услуги "под ключ"',
        scripts: [
            {
                id: 'situation3_script1',
                title: 'Скрипт 1: Продажа "под ключ"',
                description: 'Клиент получает и товар, и монтаж в одном месте',
                file: 'scripts/situation3_script1.txt'
            },
            {
                id: 'situation3_script2',
                title: 'Скрипт 2: Ответ на "Я работаю по сарафанному радио"',
                description: 'Дополнительный поток клиентов из интернета к существующим',
                file: 'scripts/situation3_script2.txt'
            }
        ]
    },
    4: {
        title: '📋 Запрос информации после заключения',
        description: 'Бриф дилера для установки сайта и запуска рекламной кампании',
        scripts: [
            {
                id: 'post_deal_brief',
                title: 'Бриф дилера: полный чек-лист',
                description: 'Какую информацию запросить у клиента и как это аргументировать',
                file: 'scripts/post_deal_brief.md'
            }
        ]
    }
};

// Получаем базовый путь (для работы в субдиректории GitHub Pages)
const basePath = window.location.pathname.endsWith('/')
    ? window.location.pathname
    : window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);

// Элементы DOM
const situationCards = document.querySelectorAll('.situation-card');
const situationSelector = document.querySelector('.situation-selector');
const scriptsSection = document.getElementById('scriptsSection');
const backButton = document.getElementById('backButton');
const situationTitle = document.getElementById('situationTitle');
const situationDescription = document.getElementById('situationDescription');
const scriptsGrid = document.getElementById('scriptsGrid');
const scriptViewer = document.getElementById('scriptViewer');
const scriptTitle = document.getElementById('scriptTitle');
const scriptContent = document.getElementById('scriptContent');
const closeButton = document.getElementById('closeButton');
const copyButton = document.getElementById('copyButton');

let currentSituation = null;

// Обработчики выбора ситуации
situationCards.forEach(card => {
    card.addEventListener('click', () => {
        const situationId = card.dataset.situation;
        showScripts(situationId);
    });
});

// Показать скрипты для выбранной ситуации
function showScripts(situationId) {
    currentSituation = situations[situationId];

    // Обновляем заголовок и описание
    situationTitle.textContent = currentSituation.title;
    situationDescription.textContent = currentSituation.description;

    // Очищаем и заполняем сетку скриптов
    scriptsGrid.innerHTML = '';
    currentSituation.scripts.forEach(script => {
        const scriptCard = createScriptCard(script);
        scriptsGrid.appendChild(scriptCard);
    });

    // Переключаем видимость секций
    situationSelector.style.display = 'none';
    scriptsSection.classList.add('active');

    // Скрываем просмотрщик скрипта если был открыт
    scriptViewer.classList.remove('active');
}

// Создать карточку скрипта
function createScriptCard(script) {
    const card = document.createElement('div');
    card.className = 'script-card';
    card.innerHTML = `
        <h4>${script.title}</h4>
        <p>${script.description}</p>
    `;

    card.addEventListener('click', () => {
        loadScript(script);
    });

    return card;
}

// Загрузить и показать скрипт
async function loadScript(script) {
    try {
        scriptTitle.textContent = script.title;
        scriptContent.textContent = 'Загрузка...';
        scriptViewer.classList.add('active');

        const response = await fetch(script.file);

        if (!response.ok) {
            throw new Error('Не удалось загрузить скрипт');
        }

        const content = await response.text();
        scriptContent.textContent = content;

        // Плавная прокрутка к просмотрщику
        scriptViewer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    } catch (error) {
        scriptContent.textContent = `Ошибка: ${error.message}. Убедитесь, что файл ${script.file} существует.`;
    }
}

// Кнопка "Назад"
backButton.addEventListener('click', () => {
    scriptsSection.classList.remove('active');
    situationSelector.style.display = 'block';
    scriptViewer.classList.remove('active');
});

// Закрыть просмотрщик скрипта
closeButton.addEventListener('click', () => {
    scriptViewer.classList.remove('active');
});

// Копировать скрипт в буфер обмена
copyButton.addEventListener('click', async () => {
    const text = scriptContent.textContent;

    try {
        await navigator.clipboard.writeText(text);

        // Визуальная обратная связь
        const originalText = copyButton.textContent;
        copyButton.textContent = '✅ Скопировано!';
        copyButton.style.background = '#10b981';

        setTimeout(() => {
            copyButton.textContent = originalText;
            copyButton.style.background = '';
        }, 2000);

    } catch (error) {
        alert('Не удалось скопировать текст. Попробуйте выделить и скопировать вручную.');
    }
});

// Обработка клавиши Escape для закрытия просмотрщика
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && scriptViewer.classList.contains('active')) {
        scriptViewer.classList.remove('active');
    }
});
