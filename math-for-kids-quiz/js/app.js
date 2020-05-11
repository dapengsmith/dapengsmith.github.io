document.addEventListener('DOMContentLoaded',function() {
	const quiz = document.querySelector('#quiz');
	const score = document.querySelector('#score');
	const level = quiz.querySelector('#level');
	const question = quiz.querySelector('#question');
	let userScore = 0, totalQuestions = 0, userLevel = 1, operators = [], range = [], result = 0, focus = true, num1, num2, randomOperator;

	function setOperatorsAndRange() {
		switch (userLevel) {
			case 1:
				operators = ['+', '-'];
				range = [1,10];
				break;
			case 2:
				operators = ['+', '-'];
				range = [11,30];
				break;
			case 3:
				operators = ['+', '-'];
				range = [31,50];
				break;
			case 4:
				operators = ['*', '/'];
				range = [1,10];
				break;
			case 5:
				operators = ['+', '-', '*', '/'];
				range = [1,10];
				break;
		}
	}

	function calculateResult(x,y,operator) {
		switch (operator) {
			case '+': return x + y;
			case '-': return x - y;
			case '*': return x * y;
			case '/': return x / y;
		}
	}

	function randomNumber(min,max) {
		return Math.floor(Math.random() * (max - min) + min);
	}

	function generateQuestion() {
		score.innerHTML = `分数 :- ${userScore} / ${totalQuestions}`;
		level.innerHTML = `级别 ${userLevel}`;
		setOperatorsAndRange();
		num1 = randomNumber(range[0],range[1]);
		num2 = randomNumber(range[0],range[1]);
		randomOperator = operators[randomNumber(0,operators.length)];
		if(randomOperator === '/') {
			while(num1 % num2 !== 0) {
				num1 = randomNumber(range[0],range[1]);
				num2 = randomNumber(range[0],range[1]);
			}
		}
		result = calculateResult(num1, num2, randomOperator);
		question.innerHTML = `${num1} ${randomOperator} ${num2} = `;
	}

	generateQuestion();

	quiz.querySelector('[name=answer]').addEventListener('keyup', function(e) {
		const ans = e.target.value;
		if(focus && e.which === 13) {
			if(ans.length === 0) {
				this.blur();
				swal({
					  title: '笨蛋',
					  text: '输入答案!!',
					  type: 'warning'
					}).then(function() {
						this.focus();
						focus = false;
					}.bind(this));
			}
			else {
				e.target.value = '';
				if(+ans === result) {
					userScore++;
				}
				else {
					this.blur();
					swal({
					  title: '傻瓜，答错了！',
					  html: `<span id='correct_ans'>正确答案 ${num1} ${randomOperator} ${num2} = ${result}</span>`,
					  type: 'error'
					}).then(function() {
						this.focus();
						focus = false;
					}.bind(this));
				}
				totalQuestions++;
				const currentLevel = userLevel;
				userLevel = Math.floor(userScore / 10) + 1;
				if(currentLevel !== userLevel) {
					this.blur();
					swal(
					  '你真棒!',
					  `过关级别 ${userLevel}!`,
					  'info'
					).then(function() {
						this.focus();
						focus = false;
					}.bind(this));
				}
				if(userLevel === 6) {
					this.blur();
					swal({
					  title: '恭喜你!',
					  text: `通过测试!`,
					  type: 'success',
					  confirmButtonText: '再玩一次 !!'
					}).then(function () {
					  userScore = 0;
					  userLevel = 1;
					  totalQuestions = 0;
					  generateQuestion();
					  this.focus();
					  focus = false;
					}).bind(this);
				}
				else generateQuestion();
			}
		}
		focus = true;
	});
});
