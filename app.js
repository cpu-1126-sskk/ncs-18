const questions = [
    { text: "1. 我宁愿解决复杂的问题，而不是简单的问题。", isPositive: true },
    { text: "2. 我喜欢承担那些需要大量思考的情况的责任。", isPositive: true },
    { text: "3. 思考并不是我感到乐趣的所在。", isPositive: false },
    { text: "4. 我宁愿做些不需要太多思考的事，也不愿做那些肯定会挑战我思考能力的事。", isPositive: false },
    { text: "5. 我会尽量预测并避免那些可能需要我进行深度思考的情况。", isPositive: false },
    { text: "6. 我能从长时间的努力深思中找到满足感。", isPositive: true },
    { text: "7. 我只做必要程度的思考。", isPositive: false },
    { text: "8. 我更喜欢思考短期的、日常的计划，而不是长远的计划。", isPositive: false },
    { text: "9. 我喜欢那些一旦学会就不再需要太多思考的任务。", isPositive: false },
    { text: "10. 依靠思考来获得成功的想法对我很有吸引力。", isPositive: true },
    { text: "11. 我非常喜欢那些需要想出新方法来解决问题的任务。", isPositive: true },
    { text: "12. 学习新的思考方式并不能让我感到多大兴奋。", isPositive: false },
    { text: "13. 我希望我的生活中充满需要我去解决的难题。", isPositive: true },
    { text: "14. 抽象思考的概念对我很有吸引力。", isPositive: true },
    { text: "15. 我宁愿从事一项智力上的、困难的且重要的任务，而不是一项有些重要但不需要太多思考的任务。", isPositive: true },
    { text: "16. 在完成一项需要大量脑力的任务后，我感到的是如释重负，而不是满足。", isPositive: false },
    { text: "17. 对我来说，只要能把事情做成就行了；我不在乎它是如何运作的，或是为什么能运作。", isPositive: false },
    { text: "18. 即便某些问题与我个人无关，我通常也会去深思熟虑。", isPositive: true }
];

const options = [
    { label: "完全不符合", value: 1 },
    { label: "比较不符合", value: 2 },
    { label: "中立/不确定", value: 3 },
    { label: "比较符合", value: 4 },
    { label: "完全符合", value: 5 }
];

// State
let currentIndex = 0;
let answers = new Array(questions.length).fill(null);
let startTime = Date.now();

// Elements
const container = document.getElementById('questions-container');
const form = document.getElementById('ncs-form');
const submitBtn = document.getElementById('submit-btn');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const quizSection = document.getElementById('quiz-section');
const resultSection = document.getElementById('result-section');
const finalScoreDisplay = document.getElementById('final-score');
const resultTitle = document.getElementById('result-title');
const resultDescription = document.getElementById('result-description');
const restartBtn = document.getElementById('restart-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const stepIndicator = document.getElementById('step-indicator');

// New Elements
const confidenceWarning = document.getElementById('confidence-warning');
const fuzzyDescription = document.getElementById('fuzzy-description');
const timeSpentDisplay = document.getElementById('time-spent');
const radarChart = document.getElementById('radar-chart');
const dimensionDetails = document.getElementById('dimension-details');

// Initialize questions
function initQuiz() {
    startTime = Date.now();
    renderQuestion(0);
    updateProgress();
}

function renderQuestion(index, direction = 'none') {
    const q = questions[index];
    const questionEl = document.createElement('div');
    questionEl.className = 'question-item';
    
    // Add transition classes
    if (direction === 'next') questionEl.classList.add('slide-in-right');
    else if (direction === 'prev') questionEl.classList.add('slide-in-left');

    let optionsHtml = '';
    options.forEach(opt => {
        const isChecked = answers[index] == opt.value ? 'checked' : '';
        optionsHtml += `
            <label class="option-label">
                <input type="radio" name="q${index}" value="${opt.value}" ${isChecked}>
                <div class="option-content">
                    <span class="option-number">${opt.value}</span>
                    <span class="option-text">${opt.label}</span>
                </div>
            </label>
        `;
    });

    questionEl.innerHTML = `
        <span class="question-text">${q.text}</span>
        <div class="options-grid">
            ${optionsHtml}
        </div>
    `;

    // Swap containers with animation
    const oldQuestion = container.querySelector('.question-item');
    if (oldQuestion) {
        oldQuestion.classList.add(direction === 'next' ? 'slide-out-left' : 'slide-out-right');
        setTimeout(() => {
            container.innerHTML = '';
            container.appendChild(questionEl);
            attachOptionListeners(questionEl, index);
        }, 400);
    } else {
        container.appendChild(questionEl);
        attachOptionListeners(questionEl, index);
    }

    // Update nav buttons
    prevBtn.disabled = index === 0;
    nextBtn.disabled = answers[index] === null || index === questions.length - 1;
    stepIndicator.innerText = `${index + 1} / ${questions.length}`;
    
    // Show/hide submit button
    if (index === questions.length - 1 && answers.every(a => a !== null)) {
        submitBtn.parentElement.classList.remove('hidden');
    } else {
        submitBtn.parentElement.classList.add('hidden');
    }
}

function attachOptionListeners(element, index) {
    const radios = element.querySelectorAll('input[type="radio"]');
    radios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            answers[index] = parseInt(e.target.value);
            updateProgress();
            
            // Auto-advance
            if (index < questions.length - 1) {
                setTimeout(() => {
                    goToNext();
                }, 400);
            } else {
                nextBtn.disabled = false;
                if (answers.every(a => a !== null)) {
                    submitBtn.disabled = false;
                    submitBtn.parentElement.classList.remove('hidden');
                }
            }
        });
    });
}

function goToNext() {
    if (currentIndex < questions.length - 1 && answers[currentIndex] !== null) {
        currentIndex++;
        renderQuestion(currentIndex, 'next');
    }
}

function goToPrev() {
    if (currentIndex > 0) {
        currentIndex--;
        renderQuestion(currentIndex, 'prev');
    }
}

function updateProgress() {
    const answeredCount = answers.filter(a => a !== null).length;
    const percentage = (answeredCount / questions.length) * 100;
    
    document.documentElement.style.setProperty('--progress', `${percentage}%`);
    progressText.innerHTML = `<span>进度: ${answeredCount}/${questions.length}</span><span>${Math.round(percentage)}%</span>`;
    
    // Add glow effect to progress bar
    const bar = document.querySelector('.progress-bar');
    if (!bar.querySelector('.progress-glow')) {
        const glow = document.createElement('div');
        glow.className = 'progress-glow';
        bar.appendChild(glow);
    }
}

// Navigation Events
prevBtn.addEventListener('click', goToPrev);
nextBtn.addEventListener('click', goToNext);

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const timeSpentSeconds = (Date.now() - startTime) / 1000;
    
    let totalScore = 0;
    const dimScores = {
        complexity: { sum: 0, count: 6 }, // 1, 2, 11, 13, 14, 15
        persistence: { sum: 0, count: 3 }, // 6, 10, 16
        enjoyment: { sum: 0, count: 9 }    // 3, 4, 5, 7, 8, 9, 12, 17, 18
    };

    const complexityIdx = [0, 1, 10, 12, 13, 14];
    const persistenceIdx = [5, 9, 15];
    const enjoymentIdx = [2, 3, 4, 6, 7, 8, 11, 16, 17];

    questions.forEach((q, index) => {
        const rawScore = answers[index];
        const finalScore = q.isPositive ? rawScore : (6 - rawScore);
        totalScore += finalScore;

        if (complexityIdx.includes(index)) dimScores.complexity.sum += finalScore;
        if (persistenceIdx.includes(index)) dimScores.persistence.sum += finalScore;
        if (enjoymentIdx.includes(index)) dimScores.enjoyment.sum += finalScore;
    });

    showResults(totalScore, dimScores, timeSpentSeconds);
});

function showResults(score, dimScores, timeSpent) {
    quizSection.classList.add('hidden');
    resultSection.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // 1. Time Display
    timeSpentDisplay.innerText = `完成耗时: ${Math.round(timeSpent)}秒`;

    // 2. Animate Gauge & Needle
    const fill = document.getElementById('gauge-fill');
    const needleGroup = document.getElementById('needle-group');
    const percentage = score / 90;
    fill.style.strokeDashoffset = 440 * (1 - percentage);
    needleGroup.style.transform = `rotate(${(percentage * 180) - 90}deg)`;

    // 3. Animate score text
    let current = 0;
    const duration = 1500;
    const start = performance.now();
    function animateText(time) {
        const elapsed = time - start;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        finalScoreDisplay.innerText = Math.floor(easeProgress * score);
        if (progress < 1) requestAnimationFrame(animateText);
    }
    requestAnimationFrame(animateText);

    // 4. Result Title & Description
    if (score >= 72) {
        resultTitle.innerText = "🎯 高认知需求";
        resultDescription.innerText = "您非常享受深度的智力挑战和复杂的逻辑推演。对他人的观点和周围的世界有着极强的好奇心，倾向于主动处理和分析高难度信息。";
    } else if (score <= 45) {
        resultTitle.innerText = "⚡ 低认知需求";
        resultDescription.innerText = "您更倾向于依赖直觉、经验或简单的启发式线索来做决定。相比于纠结复杂的逻辑，您更偏好直截了当、能迅速看到结果的任务。";
    } else {
        resultTitle.innerText = "⚖️ 中等认知需求";
        resultDescription.innerText = "您在大多数情况下能够很好地平衡思考的投入。您会根据情境的重要程度和个人兴趣来决定分配多少认知资源。";
    }

    // 5. Fuzzy Logic
    fuzzyDescription.classList.add('hidden');
    if (score >= 68 && score <= 74) {
        fuzzyDescription.innerText = "您的得分处于临界跃升状态，展现出极强的深度思考意愿，但在面对极度消耗脑力的情境时，依然保留了保护认知资源的本能。";
        fuzzyDescription.classList.remove('hidden');
    } else if (score >= 42 && score <= 48) {
        fuzzyDescription.innerText = "您的得分显示您正处于认知风格的摇摆区。您完全具备处理复杂信息的能力，但在日常情境下更倾向于选择“认知吝啬”（Cognitive Miser）模式，即优先保护心理能量，除非遇到必须解决的智力障碍，否则较少主动进入深度反思。";
        fuzzyDescription.classList.remove('hidden');
    }

    // 6. Confidence Intervention
    confidenceWarning.classList.add('hidden');
    if (timeSpent < 45 && score > 75) {
        confidenceWarning.innerText = "⚠️ 系统检测到您的答题速度极快。高认知需求者通常会花更多时间仔细权衡选项，您当前的结果可能受到直觉作答或社会赞许倾向的影响，建议放慢速度重新评估。";
        confidenceWarning.classList.remove('hidden');
    }

    // 7. Radar Chart & Dimensions
    renderRadarChart(dimScores);
    renderDimensionDetails(dimScores);
}

function renderRadarChart(dimScores) {
    const center = 100;
    const radius = 80;
    
    // Normalize scores (1-5 range)
    const d1 = (dimScores.complexity.sum / dimScores.complexity.count) / 5;
    const d2 = (dimScores.persistence.sum / dimScores.persistence.count) / 5;
    const d3 = (dimScores.enjoyment.sum / dimScores.enjoyment.count) / 5;

    // Triangle vertices (3 axes)
    // d1: Top (0 deg), d2: Bottom Left (120 deg), d3: Bottom Right (240 deg)
    const points = [
        [center, center - radius * d1],
        [center - radius * d2 * Math.sin(Math.PI / 3), center + radius * d2 * Math.cos(Math.PI / 3)],
        [center + radius * d3 * Math.sin(Math.PI / 3), center + radius * d3 * Math.cos(Math.PI / 3)]
    ];

    const pathData = `M${points[0][0]},${points[0][1]} L${points[1][0]},${points[1][1]} L${points[2][0]},${points[2][1]} Z`;
    
    // Draw background grid
    let gridHtml = '';
    for (let i = 1; i <= 5; i++) {
        const r = (radius / 5) * i;
        const p1 = [center, center - r];
        const p2 = [center - r * Math.sin(Math.PI / 3), center + r * Math.cos(Math.PI / 3)];
        const p3 = [center + r * Math.sin(Math.PI / 3), center + r * Math.cos(Math.PI / 3)];
        gridHtml += `<path class="radar-grid" d="M${p1[0]},${p1[1]} L${p2[0]},${p2[1]} L${p3[0]},${p3[1]} Z" />`;
    }

    radarChart.innerHTML = `
        ${gridHtml}
        <line class="radar-axis" x1="100" y1="100" x2="100" y2="20" />
        <line class="radar-axis" x1="100" y1="100" x2="${100 - radius * Math.sin(Math.PI / 3)}" y2="${100 + radius * Math.cos(Math.PI / 3)}" />
        <line class="radar-axis" x1="100" y1="100" x2="${100 + radius * Math.sin(Math.PI / 3)}" y2="${100 + radius * Math.cos(Math.PI / 3)}" />
        <path class="radar-area" d="${pathData}" />
    `;
}

function renderDimensionDetails(dimScores) {
    const labels = {
        complexity: "复杂性偏好",
        persistence: "认知坚持性",
        enjoyment: "思考乐趣"
    };

    dimensionDetails.innerHTML = Object.keys(dimScores).map(key => {
        const avg = (dimScores[key].sum / dimScores[key].count).toFixed(1);
        const percent = (avg / 5) * 100;
        return `
            <div class="dim-row">
                <div class="dim-info">
                    <span class="dim-name">${labels[key]}</span>
                    <span class="dim-val">${avg} / 5.0</span>
                </div>
                <div class="dim-bar-bg">
                    <div class="dim-bar-fill" style="width: 0%" data-percent="${percent}"></div>
                </div>
            </div>
        `;
    }).join('');

    // Animate bars
    setTimeout(() => {
        dimensionDetails.querySelectorAll('.dim-bar-fill').forEach(bar => {
            bar.style.width = bar.dataset.percent + '%';
        });
    }, 100);
}

restartBtn.addEventListener('click', () => {
    currentIndex = 0;
    answers = new Array(questions.length).fill(null);
    form.reset();
    updateProgress();
    resultSection.classList.add('hidden');
    quizSection.classList.remove('hidden');
    renderQuestion(0);
    startTime = Date.now();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Start
initQuiz();
