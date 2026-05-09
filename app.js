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

// Initialize questions
function initQuiz() {
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
    let totalScore = 0;

    questions.forEach((q, index) => {
        const rawScore = answers[index];
        if (q.isPositive) {
            totalScore += rawScore;
        } else {
            totalScore += (6 - rawScore);
        }
    });

    showResults(totalScore);
});

function showResults(score) {
    quizSection.classList.add('hidden');
    resultSection.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Animate Gauge
    const fill = document.getElementById('gauge-fill');
    const needleGroup = document.getElementById('needle-group');
    const percentage = score / 90;
    
    // Arc length is ~440. Offset = 440 * (1 - percentage)
    const offset = 440 * (1 - percentage);
    fill.style.strokeDashoffset = offset;

    // Needle rotation: from -90deg to 90deg
    const rotation = (percentage * 180) - 90;
    needleGroup.style.transform = `rotate(${rotation}deg)`;

    // Animate score text
    let current = 0;
    const duration = 1500;
    const start = performance.now();

    function animate(time) {
        const elapsed = time - start;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3); // Cubic ease-out
        const value = Math.floor(easeProgress * score);
        finalScoreDisplay.innerText = value;
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }
    requestAnimationFrame(animate);

    // Set result text
    if (score >= 72) {
        resultTitle.innerText = "🎯 高认知需求";
        resultDescription.innerText = "您非常享受深度的智力挑战和复杂的逻辑推演。对他人的观点和周围的世界有着极强的好奇心，倾向于主动处理和分析高难度信息。这种特质使您在解决问题和学习新知识时具有极强的耐力和热情。";
    } else if (score <= 45) {
        resultTitle.innerText = "⚡ 低认知需求";
        resultDescription.innerText = "您更倾向于依赖直觉、经验或简单的启发式线索来做决定。相比于纠结复杂的逻辑，您更偏好直截了当、能迅速看到结果的任务。这并不代表智力差异，而是一种更追求效率、避免过度思考消耗能量的认知风格。";
    } else {
        resultTitle.innerText = "⚖️ 中等认知需求";
        resultDescription.innerText = "您在大多数情况下能够很好地平衡思考的投入。您会根据情境的重要程度和个人兴趣来决定分配多少认知资源。在面对真正重要的问题时，您具备深入思考的能力，但在日常琐事中则更倾向于采用简洁的处理方式。";
    }
}

restartBtn.addEventListener('click', () => {
    currentIndex = 0;
    answers = new Array(questions.length).fill(null);
    form.reset();
    updateProgress();
    resultSection.classList.add('hidden');
    quizSection.classList.remove('hidden');
    renderQuestion(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Start
initQuiz();
