const QuizSystem = {
    renderQuiz: function(quizData, chapterId) {
        const container = document.getElementById('quiz-container');
        if (!quizData || quizData.length === 0) {
            container.style.display = 'none';
            return;
        }

        container.style.display = 'block';
        let html = '<div class="quiz-header"><i data-feather="help-circle"></i><h2>ছোট কুইজ</h2></div>';

        quizData.forEach((q, index) => {
            html += `
                <div class="question-card" id="q-${chapterId}-${index}">
                    <div class="question-text">${index + 1}. ${q.question}</div>
                    <div class="options-list">
                        ${q.options.map((opt, optIndex) => `
                            <button class="option-btn" onclick="QuizSystem.checkAnswer(${index}, ${optIndex}, ${q.answer}, '${chapterId}')">
                                ${opt}
                            </button>
                        `).join('')}
                    </div>
                    <div class="feedback-msg" id="feedback-${chapterId}-${index}"></div>
                </div>
            `;
        });

        container.innerHTML = html;
        if (typeof feather !== 'undefined') feather.replace();
    },

    checkAnswer: function(qIndex, selectedOptIndex, correctOptIndex, chapterId) {
        const questionCard = document.getElementById(`q-${chapterId}-${qIndex}`);
        const options = questionCard.querySelectorAll('.option-btn');
        const feedback = document.getElementById(`feedback-${chapterId}-${qIndex}`);

        // Disable all options so they can't be clicked again
        options.forEach(opt => opt.disabled = true);

        // Mark correct and incorrect
        if (selectedOptIndex === correctOptIndex) {
            options[selectedOptIndex].classList.add('correct');
            feedback.className = 'feedback-msg feedback-success show';
            feedback.innerHTML = '<i data-feather="check-circle"></i> সঠিক উত্তর! চমৎকার!';
        } else {
            options[selectedOptIndex].classList.add('wrong');
            options[correctOptIndex].classList.add('correct');
            feedback.className = 'feedback-msg feedback-error show';
            feedback.innerHTML = '<i data-feather="x-circle"></i> ভুল উত্তর। সঠিক উত্তরটি হলো: ' + options[correctOptIndex].innerText;
        }

        if (typeof feather !== 'undefined') feather.replace();
    }
};
