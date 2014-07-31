(function(){
	'use strict';
	
	/**
	* получить случайное число
	*/
	var getRandomInt = function(min, max){
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	
	/**
	* проверка результата
	*/
	var check = function(context){
			
		context.sum = 0;
		
		context.$buttons.find('.button').each(function(index, el){
			
			if($(el).hasClass('active')){
				context.sum += Number($(el).text());
			}
		});
		
		context.$score.text(context.sum);
		
		if(context.sum === context.randomNumber){
			
			//выигрыш
			context.stopFlag = true;
			
			//увеличить уровень
			if(context.level === context.MAX_LEVELS_NUM -1){
				context.level = 0;
			}
			else{
				context.level++;
			}
			context.TIME = context.TIME + 10;
			
			stop(context);
		}		
	};
	
	/**
	* рекурсивный алгоритм вычисления слагаемых цели
	*/
	var helper = function(context, goalNum, buttonsNum, arr){
		
		var random,
			max;
		
		if(buttonsNum>1){
			max = Math.round(goalNum/buttonsNum);
			random = getRandomInt(1, max);			
			arr.push(random);
		
			helper(context, goalNum-random, buttonsNum-1, arr);
		}
		else{
			arr.push(goalNum);
		}		
	};
	
	/**
	* создать кнопки с числами
	*/
	var initButton = function(context){
		
		var buttonsNum = context.level + 3,
			arr = [],
			html = '',
			randNumValue,
			randomIndex;
				
		helper(context, context.randomNumber, buttonsNum, arr);
		console.log(arr.join());
		//сгенерировать случайные числа для запутывания игрока и поставить их на случайные места в массиве
		for(var i=0; i<context.level + 1; i++){
			randNumValue = getRandomInt(context.MIN, context.randomNumber/2);
			randomIndex = getRandomInt(0, arr.length);
			arr.splice(randomIndex, 0, randNumValue);
		}
		
		for(var i=0; i<arr.length; i++){
			html += '<div class="button">' + arr[i] + '</div>';
		}
		
		context.$buttons.html(html);		
	};
	
	/**
	* остановить игру
	*/
	var stop = function(context){
				
		window.clearInterval(context.handler);
		
		context.$time.addClass('hidden');
		context.$labels.addClass('hidden');
		context.$buttons.addClass('hidden');
		context.$choose.addClass('hidden');
		
		context.$msg.removeClass('hidden');
		
		//показать выигрыш или проигрыш
		if(context.sum === context.randomNumber){
			context.$msg.find('.win').removeClass('hidden');
			context.$msg.find('.losing').addClass('hidden');			
		}
		else{
			context.$msg.find('.win').addClass('hidden');
			context.$msg.find('.losing').removeClass('hidden');
		}
	};

	/**
	* запустить игру
	*/
	var start = function(context){
		
		//остановить игру
		stop(context);
		
		var seconds = context.TIME
			,width;
		
		//создать случайное число и отпечатать его
		context.randomNumber = getRandomInt(context.MIN, context.MAX);
		context.$labels.removeClass('hidden');
		context.$buttons.removeClass('hidden');
		context.$choose.removeClass('hidden');
		context.$msg.addClass('hidden');
		context.$goal.text(context.randomNumber);
		context.stopFlag = false;
		context.$score.text(0);
		context.$levels.removeClass('active');
		context.$levels.filter('[data-level="' + context.level + '"]').addClass('active');
		context.$choose.find('span').text(context.level + 3);
		
		//динамически определить ширину контейнера кнопок
		width = (50 + 15 + 2)*(2*context.level + 4);
		context.$buttons.css({
			width: width
		});
		context.$game.css({
			width: width
		});
		
		//создать кнопки с числами
		initButton(context);
		
		//определить начальное время
		context.startTime = (new Date()).getTime();
		
		//показать время
		context.$time.removeClass('hidden');
		context.$seconds.text(seconds);
		
		//главный цикл игры
		context.handler = window.setInterval(function(){
			
			context.$seconds.text(seconds);
			
			if((new Date()).getTime() - context.startTime >= context.TIME*1000 || context.stopFlag){				
				stop(context);
			}
			
			seconds--;
			
		}, 1000);	
	};
	
	/**
	* initEvents - определить события
	*/
	var initEvents = function(context){
		
		/**
		* обработчик нажатия кнопки старт
		*/
		context.$start.on('click', function(){
			start(context);
		});
		
		/**
		* обработчик нажатия кнопок выбора чисел
		*/
		context.$buttons.on('click', '.button', function(){
			$(this).toggleClass('active');
			check(context);
		});
	
	};
	
	/**
	* entry point - точка входа
	*/
	$(document).ready(function(){
		
		var context = {
			$start: $('#start'),
			$goal: $('#goal'),
			$score: $('#score'),
			$buttons: $('#buttons'),
			$msg: $('#msg'),
			$time: $('#time'),
			$seconds: $('#seconds'),
			$labels: $('#labels'),
			$levels: $('.level'),
			$game: $('#game'),
			$choose: $('#choose-numbers'),
			
			//константы
			TIME: 20,
			MIN: 30,
			MAX: 100,
			MAX_LEVELS_NUM: 5,
			
			startTime: 0,			
			handler: null,
			stopFlag: false,
			randomNumber: 0,
			sum: 0,
			level: 0
		};
		
		initEvents(context);
		
		
		
	});	
	
})();