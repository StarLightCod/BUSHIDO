
    document.addEventListener('DOMContentLoaded', function() {

        const backToTopButton = document.getElementById('backToTop');
        
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });
        
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });

        const animateOnScroll = function() {
            const elements = document.querySelectorAll('.fade-in');
            
            elements.forEach(element => {
                const elementPosition = element.getBoundingClientRect().top;
                const screenPosition = window.innerHeight / 1.2;
                
                if (elementPosition < screenPosition) {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }
            });
        };
        
        window.addEventListener('scroll', animateOnScroll);
        animateOnScroll();

        const questions = document.querySelectorAll('.question-container');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const submitBtn = document.getElementById('submitBtn');
        const progressText = document.getElementById('progressText');
        const progressBar = document.getElementById('progressBar');
        const resultDiv = document.getElementById('result');
        
        let currentQuestion = 0;
        
        function showQuestion(index, scrollToQuestion = true) {

            questions.forEach(question => {
                question.classList.remove('active');
            });
            
            questions[index].classList.add('active');
            currentQuestion = index;
            
            updateProgress();
            
            if (scrollToQuestion) {
                questions[index].scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'nearest'
                });
            }
        }
        
        function updateProgress() {
            const progress = ((currentQuestion + 1) / questions.length) * 100;
            progressText.textContent = `Вопрос ${currentQuestion + 1} из ${questions.length}`;
            progressBar.style.width = `${progress}%`;
            
            prevBtn.disabled = currentQuestion === 0;
            nextBtn.style.display = currentQuestion === questions.length - 1 ? 'none' : 'flex';
            submitBtn.style.display = currentQuestion === questions.length - 1 ? 'flex' : 'none';
        }
        
        nextBtn.addEventListener('click', function() {
            if (currentQuestion < questions.length - 1) {
                showQuestion(currentQuestion + 1);
            }
        });
        
        prevBtn.addEventListener('click', function() {
            if (currentQuestion > 0) {
                showQuestion(currentQuestion - 1);
            }
        });
        
        submitBtn.addEventListener('click', calculateResult);
    
        document.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowRight' && !nextBtn.disabled) {
                nextBtn.click();
            } else if (e.key === 'ArrowLeft' && !prevBtn.disabled) {
                prevBtn.click();
            }
        });
        
        showQuestion(0, false);

        function calculateResult() {
            const preference = document.querySelector('input[name="preference"]:checked');
            const fitness = document.querySelector('input[name="fitness"]:checked');
            const learningStyle = document.querySelector('input[name="learningStyle"]:checked');
            const competition = document.querySelector('input[name="competition"]:checked');
            const weapon = document.querySelector('input[name="weapon"]:checked');
            const motivation = document.querySelector('input[name="motivation"]:checked');

            if (!preference || !fitness || !learningStyle || !competition || !weapon || !motivation) {
                resultDiv.textContent = "Пожалуйста, ответьте на все вопросы.";
                resultDiv.classList.add('show');
                
                let unansweredIndex = 0;
                if (!preference) unansweredIndex = 0;
                else if (!fitness) unansweredIndex = 1;
                else if (!learningStyle) unansweredIndex = 2;
                else if (!competition) unansweredIndex = 3;
                else if (!weapon) unansweredIndex = 4;
                else if (!motivation) unansweredIndex = 5;
                
                showQuestion(unansweredIndex);
                return;
            }

            let result = "";
            let description = "";
            
            if ((preference.value === "dynamic" && weapon.value === "bamboo") || 
                (competition.value === "like" && fitness.value !== "beginner")) {
                result = "Кендо";
                description = "Вам подходит кендо - динамичное искусство фехтования с бамбуковым мечом. Кендо отлично развивает реакцию, выносливость и стратегическое мышление.";
            } else if ((preference.value === "kata" && weapon.value === "katana") || 
                      (learningStyle.value === "visual" || learningStyle.value === "kinesthetic")) {
                result = "Иайдо";
                description = "Иайдо - искусство мгновенного обнажения меча - идеально вам подходит. Это медитативная практика, требующая точности, концентрации и самоконтроля.";
            } else if (weapon.value === "jo" || motivation.value === "selfDefense") {
                result = "Дзёдо";
                description = "Дзёдо - искусство владения палкой против меча - ваш оптимальный выбор. Эта дисциплина учит эффективной защите и контратаке.";
            } else {
                result = "Попробуйте все направления!";
                description = "Исходя из ваших ответов, мы рекомендуем попробовать все три направления.";
            }

            resultDiv.innerHTML = `
                <h3>Рекомендуемое направление: <strong>${result}</strong></h3>
                <p>${description}</p>
                <p>Приходите на пробное занятие и ощутите дух настоящего самурая!</p>
            `;
            resultDiv.classList.add('show');
            
            resultDiv.scrollIntoView({ behavior: 'smooth' });
        }
    });