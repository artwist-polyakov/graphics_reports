document.addEventListener('DOMContentLoaded', function() {
    // Navigation tabs
    const navLinks = document.querySelectorAll('nav ul li a');
    const sections = document.querySelectorAll('main section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links and sections
            navLinks.forEach(link => link.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Show corresponding section
            const targetId = this.getAttribute('href').substring(1);
            document.getElementById(targetId).classList.add('active');
        });
    });
    
    // Calendar functionality
    const monthNames = ['Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь'];
    const monthViews = document.querySelectorAll('.month-view');
    const currentMonthElement = document.getElementById('current-month');
    const prevMonthButton = document.getElementById('prev-month');
    const nextMonthButton = document.getElementById('next-month');
    let currentMonthIndex = 0;
    
    function updateCalendar() {
        // Hide all month views
        monthViews.forEach(view => view.style.display = 'none');
        
        // Show current month view
        monthViews[currentMonthIndex].style.display = 'block';
        
        // Update month title
        currentMonthElement.textContent = monthNames[currentMonthIndex] + ' 2025';
        
        // Enable/disable navigation buttons
        prevMonthButton.disabled = currentMonthIndex === 0;
        nextMonthButton.disabled = currentMonthIndex === monthNames.length - 1;
    }
    
    prevMonthButton.addEventListener('click', function() {
        if (currentMonthIndex > 0) {
            currentMonthIndex--;
            updateCalendar();
        }
    });
    
    nextMonthButton.addEventListener('click', function() {
        if (currentMonthIndex < monthNames.length - 1) {
            currentMonthIndex++;
            updateCalendar();
        }
    });
    
    // Initialize calendar
    updateCalendar();
    
    // Content preview on calendar day click
    const contentDays = document.querySelectorAll('.day.has-content');
    const contentPreview = document.getElementById('content-preview');
    const previewTitle = document.getElementById('preview-title');
    const previewDescription = document.getElementById('preview-description');
    const previewRubric = document.getElementById('preview-rubric');
    const previewFormat = document.getElementById('preview-format');
    
    contentDays.forEach(day => {
        day.addEventListener('click', function() {
            const title = this.getAttribute('data-content');
            
            // Find article data
            const article = articlesData.find(a => a.title === title);
            
            if (article) {
                previewTitle.textContent = article.title;
                previewDescription.textContent = article.shortDescription;
                previewRubric.textContent = article.rubric;
                previewFormat.textContent = article.format;
                
                contentPreview.style.display = 'block';
            }
        });
    });
    
    // Rubric details modal
    const rubricButtons = document.querySelectorAll('.rubric-details-btn');
    const rubricModal = document.getElementById('rubric-details-modal');
    const rubricModalTitle = document.getElementById('modal-rubric-title');
    const rubricModalDescription = document.getElementById('modal-rubric-description');
    const rubricModalAudience = document.getElementById('modal-rubric-audience');
    const rubricModalFormats = document.getElementById('modal-rubric-formats');
    const rubricModalVisuals = document.getElementById('modal-rubric-visuals');
    const rubricModalArticles = document.getElementById('modal-rubric-articles');
    
    rubricButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            const rubric = rubricsData[index];
            
            rubricModalTitle.textContent = rubric.title;
            rubricModalDescription.textContent = rubric.description;
            rubricModalAudience.textContent = rubric.audience;
            
            // Clear previous formats
            rubricModalFormats.innerHTML = '';
            rubric.formats.forEach(format => {
                const li = document.createElement('li');
                li.textContent = format;
                rubricModalFormats.appendChild(li);
            });
            
            // Clear previous visuals
            rubricModalVisuals.innerHTML = '';
            rubric.visuals.forEach(visual => {
                const li = document.createElement('li');
                li.textContent = visual;
                rubricModalVisuals.appendChild(li);
            });
            
            // Clear previous articles
            rubricModalArticles.innerHTML = '';
            const rubricArticles = articlesData.filter(article => article.rubric === rubric.title);
            rubricArticles.forEach(article => {
                const li = document.createElement('li');
                li.textContent = article.title;
                rubricModalArticles.appendChild(li);
            });
            
            rubricModal.style.display = 'block';
        });
    });
    
    // Close modal
    const closeButtons = document.querySelectorAll('.close-modal');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            modal.style.display = 'none';
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
    
    // Article list functionality
    const articleList = document.querySelector('.articles-container');
    const monthFilter = document.getElementById('month-filter');
    const rubricFilter = document.getElementById('rubric-filter');
    const formatFilter = document.getElementById('format-filter');
    
    function renderArticles() {
        // Clear previous articles
        articleList.innerHTML = '';
        
        // Get filter values
        const monthValue = monthFilter.value.toLowerCase();
        const rubricValue = rubricFilter.value;
        const formatValue = formatFilter.value;
        
        // Filter articles
        let filteredArticles = articlesData;
        
        if (monthValue !== 'all') {
            filteredArticles = filteredArticles.filter(article => {
                const articleMonth = article.date.split(' ')[0].toLowerCase();
                return articleMonth === monthValue;
            });
        }
        
        if (rubricValue !== 'all') {
            filteredArticles = filteredArticles.filter(article => {
                if (rubricValue === 'masterclass') return article.rubric.includes('Мастер-класс');
                if (rubricValue === 'design') return article.rubric.includes('Дизайн-бюро');
                if (rubricValue === 'expert') return article.rubric.includes('Эксперт отвечает');
                return true;
            });
        }
        
        if (formatValue !== 'all') {
            filteredArticles = filteredArticles.filter(article => {
                if (formatValue === 'instruction') return article.format.includes('Инструкция');
                if (formatValue === 'review') return article.format.includes('Обзор');
                if (formatValue === 'guide') return article.format.includes('Руководство');
                if (formatValue === 'comparison') return article.format.includes('Сравнение');
                if (formatValue === 'qa') return article.format.includes('Вопрос-ответ');
                if (formatValue === 'design') return article.format.includes('Дизайн');
                return true;
            });
        }
        
        // Render articles
        if (filteredArticles.length === 0) {
            const noResults = document.createElement('div');
            noResults.className = 'no-results';
            noResults.textContent = 'Нет статей, соответствующих выбранным фильтрам';
            articleList.appendChild(noResults);
        } else {
            filteredArticles.forEach(article => {
                const articleElement = document.createElement('div');
                articleElement.className = 'article-item';
                
                const title = document.createElement('h3');
                title.textContent = article.title;
                
                const description = document.createElement('p');
                description.textContent = article.shortDescription;
                
                const meta = document.createElement('div');
                meta.className = 'article-meta';
                
                const rubric = document.createElement('span');
                rubric.className = 'article-rubric';
                rubric.textContent = article.rubric.split(':')[0];
                
                const format = document.createElement('span');
                format.className = 'article-format';
                format.textContent = article.format;
                
                const date = document.createElement('span');
                date.className = 'article-date';
                date.textContent = article.date;
                
                meta.appendChild(rubric);
                meta.appendChild(format);
                meta.appendChild(date);
                
                articleElement.appendChild(title);
                articleElement.appendChild(description);
                articleElement.appendChild(meta);
                
                articleList.appendChild(articleElement);
            });
        }
    }
    
    // Add event listeners to filters
    monthFilter.addEventListener('change', renderArticles);
    rubricFilter.addEventListener('change', renderArticles);
    formatFilter.addEventListener('change', renderArticles);
    
    // Social media templates
    const platformButtons = document.querySelectorAll('.platform-templates-btn');
    const socialModal = document.getElementById('social-templates-modal');
    const socialModalTitle = document.getElementById('modal-social-title');
    const socialModalContent = document.getElementById('modal-social-content');
    const templateTypeButtons = document.querySelectorAll('.template-type-btn');
    
    platformButtons.forEach(button => {
        button.addEventListener('click', function() {
            const platform = this.getAttribute('data-platform');
            const templateType = 'info'; // Default to info template
            
            updateSocialTemplate(platform, templateType);
            
            socialModal.style.display = 'block';
        });
    });
    
    templateTypeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all type buttons
            templateTypeButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get platform and type
            const platform = document.querySelector('.platform-btn.active').getAttribute('data-platform');
            const templateType = this.getAttribute('data-type');
            
            // Update template
            updateSocialTemplate(platform, templateType);
        });
    });
    
    function updateSocialTemplate(platform, type) {
        // Get template
        const template = socialTemplates[platform][type];
        
        // Update title
        socialModalTitle.textContent = `Шаблон для ${getPlatformName(platform)} (${type === 'info' ? 'информационный' : 'эмоциональный'})`;
        
        // Update content
        socialModalContent.textContent = template;
    }
    
    function getPlatformName(platform) {
        if (platform === 'telegram') return 'Telegram';
        if (platform === 'vk') return 'ВКонтакте';
        if (platform === 'zen') return 'Яндекс Дзен';
        return platform;
    }
    
    // Analytics charts
    function initCharts() {
        // Seasonality chart
        const seasonalityCtx = document.getElementById('seasonalityChart').getContext('2d');
        new Chart(seasonalityCtx, {
            type: 'line',
            data: {
                labels: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
                datasets: [{
                    label: 'Поисковые запросы',
                    data: [60, 65, 75, 90, 100, 95, 85, 95, 70, 65, 60, 55],
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.2)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 120
                    }
                }
            }
        });
        
        // Audience chart
        const audienceCtx = document.getElementById('audienceChart').getContext('2d');
        new Chart(audienceCtx, {
            type: 'pie',
            data: {
                labels: ['DIY-энтузиасты', 'Владельцы новых домов', 'Дачники'],
                datasets: [{
                    data: [45, 30, 25],
                    backgroundColor: [
                        '#3498db',
                        '#2ecc71',
                        '#f1c40f'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
        
        // Traffic chart
        const trafficCtx = document.getElementById('trafficChart').getContext('2d');
        new Chart(trafficCtx, {
            type: 'line',
            data: {
                labels: ['Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен'],
                datasets: [{
                    label: 'Прогноз трафика',
                    data: [100, 110, 115, 120, 125, 130],
                    borderColor: '#2ecc71',
                    backgroundColor: 'rgba(46, 204, 113, 0.2)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 90,
                        max: 140
                    }
                }
            }
        });
        
        // Search chart
        const searchCtx = document.getElementById('searchChart').getContext('2d');
        new Chart(searchCtx, {
            type: 'bar',
            data: {
                labels: ['Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен'],
                datasets: [{
                    label: 'Установка забора',
                    data: [85, 100, 90, 80, 85, 95],
                    backgroundColor: '#3498db'
                }, {
                    label: 'Выбор забора',
                    data: [70, 80, 75, 65, 70, 85],
                    backgroundColor: '#e74c3c'
                }, {
                    label: 'Штакетник',
                    data: [60, 75, 70, 65, 75, 80],
                    backgroundColor: '#f39c12'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
        
        // Formats chart
        const formatsCtx = document.getElementById('formatsChart').getContext('2d');
        new Chart(formatsCtx, {
            type: 'doughnut',
            data: {
                labels: ['Инструкции', 'Обзоры', 'Сравнения', 'Руководства', 'Вопрос-ответ', 'Дизайн'],
                datasets: [{
                    data: [25, 20, 15, 15, 15, 10],
                    backgroundColor: [
                        '#3498db',
                        '#e74c3c',
                        '#2ecc71',
                        '#f39c12',
                        '#9b59b6',
                        '#1abc9c'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            boxWidth: 12,
                            font: {
                                size: 10
                            }
                        }
                    }
                }
            }
        });
        
        // Topics chart
        const topicsCtx = document.getElementById('topicsChart').getContext('2d');
        new Chart(topicsCtx, {
            type: 'pie',
            data: {
                labels: ['Штакетник', 'Жалюзи', 'Монтаж', 'Дизайн'],
                datasets: [{
                    data: [35, 25, 25, 15],
                    backgroundColor: [
                        '#3498db',
                        '#e74c3c',
                        '#2ecc71',
                        '#9b59b6'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            boxWidth: 12,
                            font: {
                                size: 10
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Initialize charts
    initCharts();
    
    // Initial render of articles
    renderArticles();
});

// Data
const rubricsData = [
    {
        title: 'Мастер-класс: Забор своими руками',
        description: 'Рубрика посвящена практическим аспектам самостоятельной установки и обслуживания заборов. Материалы рубрики помогают читателям освоить навыки монтажа, ремонта и модернизации заборов без привлечения специалистов.',
        audience: 'DIY-энтузиасты 30-55 лет с базовыми навыками строительства, владельцы частных домов и дач, стремящиеся к экономии и получению новых практических навыков.',
        formats: [
            'Пошаговые инструкции с фотографиями каждого этапа',
            'Видео-руководства по сложным моментам монтажа',
            'Чек-листы для самопроверки',
            'Советы по выбору инструментов и материалов',
            'Разбор типичных ошибок и способов их предотвращения'
        ],
        visuals: [
            'Детальные фотографии каждого этапа работ',
            'Схемы и чертежи с размерами',
            'Фотографии инструментов с пояснениями',
            'Видео сложных моментов монтажа',
            'Фотографии готовых проектов "до и после"'
        ]
    },
    {
        title: 'Дизайн-бюро: Стильные решения для вашего участка',
        description: 'Рубрика фокусируется на эстетических аспектах оформления заборов и их интеграции в общий ландшафтный дизайн участка. Материалы помогают читателям создать гармоничное и стильное пространство.',
        audience: 'Домовладельцы 25-55 лет, интересующиеся дизайном и эстетикой, стремящиеся к созданию уникального и стильного пространства, следящие за трендами в оформлении участков.',
        formats: [
            'Обзоры трендов с примерами реализации',
            'Подборки дизайнерских решений для разных стилей',
            'Интервью с ландшафтными дизайнерами',
            'Фотогалереи успешных проектов',
            'Советы по цветовым решениям и комбинациям материалов'
        ],
        visuals: [
            'Высококачественные фотографии реализованных проектов',
            'Цветовые палитры и схемы сочетаний',
            'Визуализации ландшафтных решений',
            'Фотографии "до и после" преображения участков',
            'Коллажи с примерами стилевых решений'
        ]
    },
    {
        title: 'Эксперт отвечает: Всё о металлических заборах',
        description: 'Рубрика представляет экспертные ответы на вопросы читателей о выборе, установке и эксплуатации металлических заборов. Материалы помогают принимать обоснованные решения и избегать распространенных ошибок.',
        audience: 'Домовладельцы 25-55 лет на этапе выбора забора, покупатели, сравнивающие различные варианты, владельцы участков с вопросами по эксплуатации и обслуживанию заборов.',
        formats: [
            'Вопрос-ответ с экспертами компании',
            'Сравнительные таблицы характеристик',
            'Разбор типичных проблем и их решений',
            'Мифы и заблуждения о металлических заборах',
            'Калькуляторы и инструменты для расчетов'
        ],
        visuals: [
            'Фотографии экспертов компании',
            'Инфографика с техническими характеристиками',
            'Сравнительные таблицы и графики',
            'Фотографии примеров правильных и неправильных решений',
            'Схемы и чертежи с пояснениями'
        ]
    }
];

const socialTemplates = {
    telegram: {
        info: '🔨 НОВАЯ СТАТЬЯ: [Название статьи]\n\nУзнайте, как [основная польза для читателя]. В нашей новой статье мы рассказываем о [краткое описание содержания].\n\n✅ Вы научитесь:\n- [пункт 1]\n- [пункт 2]\n- [пункт 3]\n\n🔗 Читать полностью: [ссылка]\n\n#металлик #забор #своимируками',
        emotional: '😱 ВЫ ВСЁ ДЕЛАЛИ НЕПРАВИЛЬНО!\n\nОказывается, [интригующий факт о заборах]. Большинство владельцев участков даже не подозревают, что [неожиданная информация].\n\n🤔 А вы знали, что [вопрос, вызывающий интерес]?\n\nВ новой статье раскрываем все секреты: [ссылка]\n\n#металлик #дачныесоветы #ландшафтныйдизайн'
    },
    vk: {
        info: '🏡 НОВЫЙ МАТЕРИАЛ В БЛОГЕ\n\n[Название статьи]\n\nВ этой статье вы узнаете:\n✅ [ключевой момент 1]\n✅ [ключевой момент 2]\n✅ [ключевой момент 3]\n\nНаши эксперты подготовили подробное руководство, которое поможет вам [основная польза для читателя].\n\n👉 Переходите по ссылке и сохраняйте в закладки: [ссылка]\n\n#металлик #забордлядачи #своимируками #штакетник',
        emotional: '😍 ВАУ-ЭФФЕКТ ГАРАНТИРОВАН!\n\nХотите, чтобы соседи завидовали вашему участку? 🏡✨\n\nМы подготовили для вас статью о том, как [интригующее описание]. Вы удивитесь, насколько [эмоциональное обещание результата]!\n\n🔥 Только представьте: [яркое описание результата]\n\n👉 Скорее читайте полную статью: [ссылка]\n\n#металлик #дизайнучастка #красивыйзабор #ландшафтныйдизайн'
    },
    zen: {
        info: 'Как правильно [действие, связанное с темой статьи]: советы от профессионалов\n\nВыбор и установка забора — ответственный этап обустройства участка. От правильного решения зависит не только безопасность и приватность, но и внешний вид вашего дома на долгие годы.\n\nВ новой статье эксперты компании "Металлик и Ко" рассказывают о том, как [основная тема статьи]. Вы узнаете:\n\n• [ключевой момент 1]\n• [ключевой момент 2]\n• [ключевой момент 3]\n\nПрактические советы и рекомендации помогут вам избежать распространенных ошибок и сэкономить время и деньги.\n\nЧитать полностью: [ссылка]',
        emotional: 'Я установил забор сам и вот что из этого вышло: история одного эксперимента\n\nКогда я решил обновить забор на своем участке, я даже не представлял, с какими сюрпризами столкнусь. Это история о том, как обычный городской житель превратился в мастера по установке заборов и что из этого вышло.\n\nПервый день моего "забороустановочного марафона" начался с [интригующее начало истории]...\n\nЧто меня удивило больше всего? [неожиданный поворот или открытие]\n\nВ итоге я не только сэкономил [сумма или процент], но и получил [неожиданный положительный результат].\n\nПолную историю с фотографиями процесса и результата, а также подробную инструкцию для тех, кто решится повторить мой опыт, читайте в статье: [ссылка]'
    }
};

const articlesData = [
    {
        title: "Планирование установки забора: с чего начать в новом сезоне",
        shortDescription: "Подробное руководство по подготовке к установке забора весной: от выбора материалов до расчета бюджета и необходимых инструментов.",
        date: "Апрель 4, 2025",
        rubric: "Мастер-класс: Забор своими руками",
        format: "Руководство",
        audience: "DIY-энтузиасты, новые домовладельцы",
        keywords: ["установка забора своими руками", "подготовка к установке забора", "планирование забора"],
        visuals: "Фотографии инструментов, схемы планирования участка, чек-листы подготовки"
    },
    {
        title: "Тренды 2025: Какие заборы выбирают современные домовладельцы",
        shortDescription: "Обзор актуальных тенденций в дизайне и конструкции заборов: от минималистичных решений до высокотехнологичных систем безопасности.",
        date: "Апрель 11, 2025",
        rubric: "Дизайн-бюро: Стильные решения для вашего участка",
        format: "Обзор",
        audience: "Домовладельцы, интересующиеся дизайном",
        keywords: ["тренды заборов 2025", "современные заборы", "дизайн забора"],
        visuals: "Фотогалерея современных заборов, цветовые палитры сезона, примеры реализованных проектов"
    },
    {
        title: "Металлический штакетник: 7 вопросов, которые задают все покупатели",
        shortDescription: "Эксперты отвечают на самые распространенные вопросы о металлическом штакетнике: от выбора толщины металла до особенностей монтажа.",
        date: "Апрель 18, 2025",
        rubric: "Эксперт отвечает: Всё о металлических заборах",
        format: "Вопрос-ответ",
        audience: "Потенциальные покупатели, сравнивающие варианты",
        keywords: ["штакетник металлический вопросы", "выбор металлического штакетника", "штакетник характеристики"],
        visuals: "Фотографии разных типов штакетника, инфографика с характеристиками, сравнительные таблицы"
    },
    {
        title: "Как правильно подготовить участок к установке забора",
        shortDescription: "Пошаговая инструкция по подготовке территории: от разметки и расчистки до выравнивания и решения проблем со сложным рельефом.",
        date: "Апрель 25, 2025",
        rubric: "Мастер-класс: Забор своими руками",
        format: "Инструкция",
        audience: "DIY-энтузиасты, владельцы новых участков",
        keywords: ["подготовка участка для забора", "разметка забора", "выравнивание участка"],
        visuals: "Фотографии этапов работ, схемы разметки, видео процесса выравнивания"
    },
    {
        title: "Забор-жалюзи: особенности монтажа и эксплуатации",
        shortDescription: "Детальный разбор технологии установки секционного забора-жалюзи, особенности конструкции и рекомендации по обслуживанию.",
        date: "Май 9, 2025",
        rubric: "Мастер-класс: Забор своими руками",
        format: "Инструкция",
        audience: "DIY-энтузиасты с опытом строительства",
        keywords: ["секционный забор жалюзи монтаж", "установка забора жалюзи", "забор-жалюзи своими руками"],
        visuals: "Детальные фотографии этапов монтажа, схемы крепления, видео сложных моментов установки"
    },
    {
        title: "5 способов сделать забор визуально привлекательным",
        shortDescription: "Дизайнерские приемы для улучшения внешнего вида забора: от цветовых решений до интеграции с ландшафтным дизайном участка.",
        date: "Май 17, 2025",
        rubric: "Дизайн-бюро: Стильные решения для вашего участка",
        format: "Дизайн",
        audience: "Домовладельцы, интересующиеся эстетикой",
        keywords: ["красивый забор дизайн", "оформление забора", "декоративный забор"],
        visuals: "Фотографии до и после преображения, цветовые схемы, примеры декоративных элементов"
    },
    {
        title: "Сравнение металлических заборов: штакетник vs жалюзи",
        shortDescription: "Подробное сравнение двух популярных типов металлических заборов по ключевым параметрам: стоимость, долговечность, эстетика, сложность монтажа.",
        date: "Май 23, 2025",
        rubric: "Эксперт отвечает: Всё о металлических заборах",
        format: "Сравнение",
        audience: "Покупатели на этапе выбора типа забора",
        keywords: ["штакетник или жалюзи что лучше", "сравнение заборов", "выбор металлического забора"],
        visuals: "Сравнительные таблицы, фотографии обоих типов заборов, инфографика с преимуществами и недостатками"
    },
    {
        title: "Как выбрать оптимальную высоту забора для частного дома",
        shortDescription: "Рекомендации по выбору высоты забора с учетом функциональных требований, особенностей участка и нормативных ограничений.",
        date: "Май 30, 2025",
        rubric: "Эксперт отвечает: Всё о металлических заборах",
        format: "Руководство",
        audience: "Домовладельцы на этапе планирования",
        keywords: ["высота забора для частного дома", "оптимальная высота забора", "нормы высоты забора"],
        visuals: "Схемы с рекомендуемыми высотами, фотографии заборов разной высоты, инфографика с нормативами"
    },
    {
        title: "Монтаж секционного забора своими руками: пошаговая инструкция",
        shortDescription: "Детальное руководство по самостоятельной установке секционного забора от подготовки материалов до финальной отделки.",
        date: "Июнь 6, 2025",
        rubric: "Мастер-класс: Забор своими руками",
        format: "Инструкция",
        audience: "DIY-энтузиасты с базовыми навыками",
        keywords: ["установка секционного забора", "монтаж забора своими руками", "секционный забор инструкция"],
        visuals: "Фотографии каждого этапа работ, видео сложных моментов, чертежи с размерами"
    },
    {
        title: "Цвет забора: как выбрать оптимальное решение для вашего участка",
        shortDescription: "Рекомендации по выбору цвета забора с учетом архитектуры дома, ландшафта участка и психологического воздействия цветов.",
        date: "Июнь 13, 2025",
        rubric: "Дизайн-бюро: Стильные решения для вашего участка",
        format: "Дизайн",
        audience: "Домовладельцы, интересующиеся эстетикой",
        keywords: ["цвет забора выбор", "сочетание цветов забора и дома", "цветовые решения для забора"],
        visuals: "Цветовые палитры, фотографии удачных сочетаний, визуализации разных вариантов"
    },
    {
        title: "Как правильно ухаживать за металлическим забором",
        shortDescription: "Рекомендации по обслуживанию и уходу за металлическими заборами для продления срока службы и сохранения привлекательного внешнего вида.",
        date: "Июнь 20, 2025",
        rubric: "Эксперт отвечает: Всё о металлических заборах",
        format: "Руководство",
        audience: "Владельцы металлических заборов",
        keywords: ["уход за металлическим забором", "обслуживание забора", "чистка металлического забора"],
        visuals: "Фотографии процесса ухода, инфографика с рекомендуемыми средствами, примеры до и после обслуживания"
    },
    {
        title: "Забор для дачи: 10 критериев выбора идеального варианта",
        shortDescription: "Комплексное руководство по выбору забора для дачного участка с учетом функциональных, эстетических и бюджетных требований.",
        date: "Июнь 27, 2025",
        rubric: "Эксперт отвечает: Всё о металлических заборах",
        format: "Руководство",
        audience: "Владельцы дачных участков",
        keywords: ["выбор забора для дачи", "забор на дачу", "критерии выбора забора"],
        visuals: "Сравнительные таблицы, фотографии различных вариантов, инфографика с критериями выбора"
    },
    {
        title: "Как установить забор на неровном участке: решения для сложного рельефа",
        shortDescription: "Практические рекомендации и технические решения для монтажа забора на участках со сложным рельефом, уклонами и перепадами высот.",
        date: "Июль 4, 2025",
        rubric: "Мастер-класс: Забор своими руками",
        format: "Инструкция",
        audience: "Владельцы участков со сложным рельефом",
        keywords: ["забор на неровном участке", "установка забора на склоне", "забор с перепадом высот"],
        visuals: "Схемы монтажа на склоне, фотографии реализованных проектов, видео процесса установки"
    },
    {
        title: "Интеграция забора в ландшафтный дизайн: 7 креативных идей",
        shortDescription: "Дизайнерские решения для гармоничного сочетания забора с общим ландшафтным дизайном участка: от вертикального озеленения до декоративных элементов.",
        date: "Июль 11, 2025",
        rubric: "Дизайн-бюро: Стильные решения для вашего участка",
        format: "Дизайн",
        audience: "Домовладельцы, интересующиеся ландшафтным дизайном",
        keywords: ["забор и ландшафтный дизайн", "озеленение забора", "декоративный забор в ландшафте"],
        visuals: "Фотографии реализованных проектов, схемы озеленения, визуализации идей"
    },
    {
        title: "Штакетник горизонтальный vs вертикальный: что выбрать для вашего участка",
        shortDescription: "Сравнительный анализ горизонтального и вертикального расположения штакетника: визуальные эффекты, практичность, особенности монтажа.",
        date: "Июль 18, 2025",
        rubric: "Эксперт отвечает: Всё о металлических заборах",
        format: "Сравнение",
        audience: "Покупатели на этапе выбора дизайна забора",
        keywords: ["горизонтальный или вертикальный штакетник", "направление штакетника", "выбор ориентации забора"],
        visuals: "Фотографии обоих вариантов, сравнительные таблицы, визуализации на разных участках"
    },
    {
        title: "Как рассчитать стоимость забора: формулы и примеры",
        shortDescription: "Практическое руководство по расчету бюджета на установку забора с учетом материалов, работ, дополнительных элементов и непредвиденных расходов.",
        date: "Июль 25, 2025",
        rubric: "Мастер-класс: Забор своими руками",
        format: "Руководство",
        audience: "Домовладельцы на этапе планирования бюджета",
        keywords: ["расчет стоимости забора", "бюджет на забор", "цена установки забора"],
        visuals: "Таблицы с расценками, калькуляторы, примеры смет для разных типов заборов"
    },
    {
        title: "Ворота и калитки: как выбрать и установить своими руками",
        shortDescription: "Комплексное руководство по выбору, проектированию и установке ворот и калиток, сочетающихся с основным забором.",
        date: "Август 1, 2025",
        rubric: "Мастер-класс: Забор своими руками",
        format: "Инструкция",
        audience: "DIY-энтузиасты, завершающие установку забора",
        keywords: ["ворота и калитки своими руками", "установка ворот к забору", "выбор калитки"],
        visuals: "Чертежи конструкций, фотографии этапов установки, видео настройки фурнитуры"
    },
    {
        title: "Освещение забора: функциональность и декоративный эффект",
        shortDescription: "Идеи и практические рекомендации по организации освещения забора для повышения безопасности и создания декоративных световых эффектов.",
        date: "Август 8, 2025",
        rubric: "Дизайн-бюро: Стильные решения для вашего участка",
        format: "Дизайн",
        audience: "Домовладельцы, интересующиеся ландшафтным освещением",
        keywords: ["освещение забора", "подсветка ограждения", "декоративное освещение участка"],
        visuals: "Фотографии различных вариантов освещения, схемы расположения светильников, примеры ночных световых эффектов"
    },
    {
        title: "Антивандальные решения для металлических заборов",
        shortDescription: "Обзор технических и дизайнерских решений для защиты забора от вандализма, граффити и механических повреждений.",
        date: "Август 15, 2025",
        rubric: "Эксперт отвечает: Всё о металлических заборах",
        format: "Обзор",
        audience: "Владельцы участков в зонах риска",
        keywords: ["защита забора от вандализма", "антивандальное покрытие", "защита от граффити"],
        visuals: "Фотографии защитных решений, инфографика с характеристиками покрытий, примеры реализованных проектов"
    },
    {
        title: "Автоматизация ворот: от простых решений до умных систем",
        shortDescription: "Обзор технологий автоматизации ворот: от базовых электроприводов до интеграции с системами умного дома и управления со смартфона.",
        date: "Август 22, 2025",
        rubric: "Мастер-класс: Забор своими руками",
        format: "Обзор",
        audience: "Технически ориентированные домовладельцы",
        keywords: ["автоматические ворота", "привод для ворот", "умные ворота"],
        visuals: "Схемы подключения, фотографии компонентов, видео работы различных систем"
    },
    {
        title: "Зимний уход за металлическим забором: защита от снега и наледи",
        shortDescription: "Рекомендации по подготовке металлического забора к зимнему сезону и правильному уходу в условиях снегопадов, наледи и низких температур.",
        date: "Август 29, 2025",
        rubric: "Эксперт отвечает: Всё о металлических заборах",
        format: "Руководство",
        audience: "Владельцы металлических заборов",
        keywords: ["уход за забором зимой", "защита забора от снега", "подготовка забора к зиме"],
        visuals: "Фотографии зимних проблем и их решений, инфографика с рекомендациями, примеры защитных мероприятий"
    },
    {
        title: "Комбинированные заборы: сочетание металла с другими материалами",
        shortDescription: "Дизайнерские идеи и технические решения для создания комбинированных заборов из металла и дерева, камня, стекла или других материалов.",
        date: "Сентябрь 5, 2025",
        rubric: "Дизайн-бюро: Стильные решения для вашего участка",
        format: "Дизайн",
        audience: "Домовладельцы, ищущие нестандартные решения",
        keywords: ["комбинированный забор", "забор металл и дерево", "сочетание материалов в заборе"],
        visuals: "Фотографии реализованных проектов, схемы соединений разных материалов, визуализации дизайнерских решений"
    },
    {
        title: "Экологичность металлических заборов: мифы и реальность",
        shortDescription: "Анализ экологических аспектов производства, эксплуатации и утилизации металлических заборов в сравнении с другими материалами.",
        date: "Сентябрь 12, 2025",
        rubric: "Эксперт отвечает: Всё о металлических заборах",
        format: "Обзор",
        audience: "Экологически сознательные покупатели",
        keywords: ["экологичность металлических заборов", "экологичный забор", "утилизация забора"],
        visuals: "Инфографика с экологическими показателями, сравнительные таблицы материалов, схемы жизненного цикла"
    },
    {
        title: "Как продлить срок службы металлического забора: 5 профессиональных советов",
        shortDescription: "Рекомендации от экспертов по увеличению долговечности металлических заборов: от выбора материалов до регулярного обслуживания.",
        date: "Сентябрь 19, 2025",
        rubric: "Мастер-класс: Забор своими руками",
        format: "Руководство",
        audience: "Владельцы и потенциальные покупатели металлических заборов",
        keywords: ["долговечность металлического забора", "срок службы забора", "защита забора от коррозии"],
        visuals: "Фотографии правильных решений, инфографика с рекомендациями, примеры до и после применения советов"
    },
    {
        title: "Забор для частного дома: как сделать его не только функциональным, но и стильным",
        shortDescription: "Комплексное руководство по созданию забора, который сочетает практичность, безопасность и эстетическую привлекательность.",
        date: "Сентябрь 26, 2025",
        rubric: "Дизайн-бюро: Стильные решения для вашего участка",
        format: "Руководство",
        audience: "Домовладельцы на этапе планирования",
        keywords: ["стильный забор для частного дома", "дизайн забора", "красивый функциональный забор"],
        visuals: "Фотогалерея стильных решений, схемы планирования, визуализации для разных архитектурных стилей"
    }
];
