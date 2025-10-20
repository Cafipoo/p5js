class QCMApp {
    constructor() {
        this.currentQuiz = null;
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.startTime = null;
        this.timerInterval = null;
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Quiz selection buttons
        document.querySelectorAll('.quiz-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const quizType = e.target.dataset.quiz;
                this.loadQuiz(quizType);
            });
        });

        // Control buttons
        document.getElementById('prev-btn').addEventListener('click', () => {
            this.previousQuestion();
        });

        document.getElementById('next-btn').addEventListener('click', () => {
            this.nextQuestion();
        });

        document.getElementById('submit-btn').addEventListener('click', () => {
            this.submitQuiz();
        });

        // Results buttons
        document.getElementById('restart-btn').addEventListener('click', () => {
            this.restartQuiz();
        });

        document.getElementById('new-quiz-btn').addEventListener('click', () => {
            this.showQuizSelector();
        });
    }

    async loadQuiz(quizType) {
        try {
            const response = await fetch(`data/${quizType}.json`);
            this.currentQuiz = await response.json();
            
            this.currentQuestionIndex = 0;
            this.userAnswers = [];
            this.startTime = Date.now();
            
            this.showQuiz();
            this.startTimer();
            this.displayQuestion();
        } catch (error) {
            console.error('Erreur lors du chargement du quiz:', error);
            alert('Erreur lors du chargement du quiz. Veuillez réessayer.');
        }
    }

    showQuiz() {
        document.querySelector('.quiz-selector').style.display = 'none';
        document.getElementById('quiz-container').style.display = 'block';
        document.getElementById('results-container').style.display = 'none';
        
        document.getElementById('quiz-title').textContent = this.currentQuiz.title;
        this.updateProgress();
    }

    showQuizSelector() {
        document.querySelector('.quiz-selector').style.display = 'block';
        document.getElementById('quiz-container').style.display = 'none';
        document.getElementById('results-container').style.display = 'none';
        
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
    }

    displayQuestion() {
        const question = this.currentQuiz.questions[this.currentQuestionIndex];
        
        // Update question text
        document.getElementById('question-text').textContent = question.question;
        
        // Update question counter
        document.getElementById('question-counter').textContent = 
            `Question ${this.currentQuestionIndex + 1} sur ${this.currentQuiz.questions.length}`;
        
        // Create options
        const optionsContainer = document.getElementById('options-container');
        optionsContainer.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            
            const input = document.createElement('input');
            input.type = 'radio';
            input.name = 'answer';
            input.value = index;
            input.id = `option-${index}`;
            
            const label = document.createElement('label');
            label.htmlFor = `option-${index}`;
            label.textContent = option;
            
            optionElement.appendChild(input);
            optionElement.appendChild(label);
            
            // Add click event to select option
            optionElement.addEventListener('click', () => {
                this.selectAnswer(index);
            });
            
            optionsContainer.appendChild(optionElement);
        });
        
        // Update control buttons
        this.updateControlButtons();
        this.updateProgress();
    }

    selectAnswer(answerIndex) {
        // Remove previous selection
        document.querySelectorAll('.option').forEach(option => {
            option.classList.remove('selected');
        });
        
        // Add selection to clicked option
        document.querySelectorAll('.option')[answerIndex].classList.add('selected');
        
        // Store answer
        this.userAnswers[this.currentQuestionIndex] = answerIndex;
        
        // Update next button
        this.updateControlButtons();
    }

    updateControlButtons() {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const submitBtn = document.getElementById('submit-btn');
        
        // Previous button
        prevBtn.disabled = this.currentQuestionIndex === 0;
        
        // Next/Submit button
        const hasAnswer = this.userAnswers[this.currentQuestionIndex] !== undefined;
        const isLastQuestion = this.currentQuestionIndex === this.currentQuiz.questions.length - 1;
        
        if (isLastQuestion) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = hasAnswer ? 'inline-block' : 'none';
        } else {
            nextBtn.style.display = 'inline-block';
            submitBtn.style.display = 'none';
            nextBtn.disabled = !hasAnswer;
        }
    }

    updateProgress() {
        const progress = ((this.currentQuestionIndex + 1) / this.currentQuiz.questions.length) * 100;
        document.getElementById('progress').style.width = `${progress}%`;
    }

    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.displayQuestion();
        }
    }

    nextQuestion() {
        if (this.currentQuestionIndex < this.currentQuiz.questions.length - 1) {
            this.currentQuestionIndex++;
            this.displayQuestion();
        }
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            const elapsed = Date.now() - this.startTime;
            const minutes = Math.floor(elapsed / 60000);
            const seconds = Math.floor((elapsed % 60000) / 1000);
            
            document.getElementById('timer').textContent = 
                `⏱️ ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    submitQuiz() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        this.calculateResults();
        this.showResults();
    }

    calculateResults() {
        let correctAnswers = 0;
        const totalQuestions = this.currentQuiz.questions.length;
        
        this.currentQuiz.questions.forEach((question, index) => {
            const userAnswer = this.userAnswers[index];
            const correctAnswer = question.correct;
            
            if (Array.isArray(correctAnswer)) {
                // Multiple correct answers
                if (correctAnswer.includes(userAnswer)) {
                    correctAnswers++;
                }
            } else {
                // Single correct answer
                if (userAnswer === correctAnswer) {
                    correctAnswers++;
                }
            }
        });
        
        this.results = {
            correct: correctAnswers,
            total: totalQuestions,
            percentage: Math.round((correctAnswers / totalQuestions) * 100),
            timeElapsed: Date.now() - this.startTime
        };
    }

    showResults() {
        document.getElementById('quiz-container').style.display = 'none';
        document.getElementById('results-container').style.display = 'block';
        
        // Update score display
        document.getElementById('score-percentage').textContent = `${this.results.percentage}%`;
        document.getElementById('score-text').textContent = `${this.results.correct} / ${this.results.total}`;
        
        // Update score message
        let message = '';
        if (this.results.percentage >= 90) {
            message = '🎉 Excellent ! Vous maîtrisez parfaitement le sujet !';
        } else if (this.results.percentage >= 80) {
            message = '👏 Très bien ! Bonne maîtrise du sujet.';
        } else if (this.results.percentage >= 70) {
            message = '👍 Bien ! Quelques révisions recommandées.';
        } else if (this.results.percentage >= 60) {
            message = '📚 Correct. Des révisions sont nécessaires.';
        } else {
            message = '📖 Des révisions approfondies sont recommandées.';
        }
        document.getElementById('score-message').textContent = message;
        
        // Update answers summary
        this.displayAnswersSummary();
    }

    displayAnswersSummary() {
        const summaryContainer = document.getElementById('answers-summary');
        summaryContainer.innerHTML = '';
        
        this.currentQuiz.questions.forEach((question, index) => {
            const userAnswer = this.userAnswers[index];
            const correctAnswer = question.correct;
            const isCorrect = Array.isArray(correctAnswer) ? 
                correctAnswer.includes(userAnswer) : 
                userAnswer === correctAnswer;
            
            const answerItem = document.createElement('div');
            answerItem.className = `answer-item ${isCorrect ? 'correct' : 'incorrect'}`;
            
            const questionText = document.createElement('div');
            questionText.className = 'answer-question';
            questionText.textContent = `${index + 1}. ${question.question}`;
            
            const answerDetails = document.createElement('div');
            answerDetails.className = 'answer-details';
            
            const status = document.createElement('span');
            status.className = `answer-status ${isCorrect ? 'correct' : 'incorrect'}`;
            status.textContent = isCorrect ? '✓ Correct' : '✗ Incorrect';
            
            const userAnswerText = document.createElement('span');
            userAnswerText.textContent = userAnswer !== undefined ? 
                `Votre réponse: ${question.options[userAnswer]}` : 
                'Aucune réponse';
            
            answerDetails.appendChild(status);
            answerDetails.appendChild(userAnswerText);
            
            const explanation = document.createElement('div');
            explanation.className = 'answer-explanation';
            explanation.textContent = question.explanation;
            
            answerItem.appendChild(questionText);
            answerItem.appendChild(answerDetails);
            answerItem.appendChild(explanation);
            
            summaryContainer.appendChild(answerItem);
        });
    }

    restartQuiz() {
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.startTime = Date.now();
        
        this.showQuiz();
        this.startTimer();
        this.displayQuestion();
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new QCMApp();
});
