
import { formula } from "../input/index.js";


    document.addEventListener('DOMContentLoaded', theory);
    const area = document.querySelector('.area');
    let hash = window.location.hash.charAt(1);
    let answer;
    const sideMenu =document.getElementById('side-menu');
    sideMenu.addEventListener('click', goToNextPage);


    window.addEventListener("hashchange", goToNextPage);

    // function goToNextPage() {
    //     let menu = document.querySelector('.side-menu');
    //     const xhr = new XMLHttpRequest;
    //     hash = window.location.hash.charAt(1);
    //     xhr.open('GET', '' + hash + '.json', true);
    //     xhr.send();
    //     xhr.onreadystatechange = function () {
    //         if (this.readyState === 4 && this.status === 200) {
    //             let text = JSON.parse(this.responseText);
    //             parseText(text);
    //             formula.setData(text["equation"]);
    //             if(!menu.classList.contains('hidden')){
    //                 document.querySelector('.side-menu').classList.add('hidden');
    //                 document.querySelector('.button-burger-menu').classList.toggle('fa-bars');
    //                 document.querySelector('.button-burger-menu').classList.toggle('fa-times');
    //             }
    //         }
    //     }
    // }


function makeRequest (method, url) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        resolve(xhr.response);
      } else {
        reject({
          status: this.status,
          statusText: xhr.statusText
        });
      }
    };
    xhr.onerror = function () {
      reject({
        status: this.status,
        statusText: xhr.statusText
      });
    };
    xhr.send();
  });
}

var renderingText = function(data) {
    let text = JSON.parse(data);
    answer = text.answer;
                parseText(text);
                formula.setData(text["equation"]);
                if(!menu.classList.contains('hidden')){
                    document.querySelector('.side-menu').classList.add('hidden');
                    document.querySelector('.button-burger-menu').classList.toggle('fa-bars');
                    document.querySelector('.button-burger-menu').classList.toggle('fa-times');
                }
};

function goToNextPage() {
        let menu = document.querySelector('.side-menu');
        hash = window.location.hash.charAt(1);
  makeRequest('GET', hash + '.json').then(renderingText)
}




    function theory() {
        if(!window.location.hash){
            window.location.hash = 1;
        }
        const xhr = new XMLHttpRequest;
        xhr.open('GET', ''+hash+'.json', true);
        xhr.send();
        xhr.onreadystatechange = function() {
            if(this.readyState === 4 && this.status === 200) {
                let text = JSON.parse(this.responseText);
                answer = text.answer;
                parseText(text);
                formula.setData(text["equation"]);
            }
        };
    }


export function checkAnswer(e){
    hash = window.location.hash.charAt(1);
    const xhr = new XMLHttpRequest;
    const data = formula.getData();
    xhr.open('GET', ''+hash+'.json', true);
    xhr.send();
    let btn = e.target;
    xhr.onreadystatechange = function() {
        if(this.readyState === 4 && this.status === 200) {
            let text = JSON.parse(this.responseText);
            if( isTrueAnswer(data, answer) ){
                showLike();
                hash++;
                if(hash == 9){
                    hash = 1;
                }
                window.location.hash = hash;
                answer = text.answer;
                parseText(text);
                formula.setData(text["equation"]);
            }
            else{
                showDislike();
            }
            if(btn.id == 'btn-next'){
                showDislike();
                hash++;
                if(hash == 9){
                    hash = 1;
                }
                window.location.hash = hash;
                answer = text.answer;
                parseText(text);
                formula.setData(text["equation"]);
            }
        }
    };

    function isTrueAnswer(result, answer) {
        let answerFromData = getAnswerFromData(result);
        if(answerFromData.length !== answer.length)return false;
        console.log(answerFromData);
        console.log(answer);
        let check = 0;
        for(let i=0;i<answer.length;i++){
            for(let j=0;j<answerFromData.length;j++){
                if(answerFromData[j].localeCompare(answer[i]) === 0){
                    check ++;
                }
            }
            if(!check)return false;
        }
        if(check === answer.length){
            return true;
        }
        else return false;
    }

    function getAnswerFromData(data){
        let result = [];
        for(let i=0;i<data.length;i++){
            let key = Object.keys(data[i]);
            result.push(data[i][key].join(''));
        }
        return result;
    }

}
     function parseText(text) {
         let output = '';
         let arr = text["theory"].split('\n');
         output += '<h2>'+text["title"]+'</h2>';

         arr.forEach(function(i){
             output += '<p>'+i+'</p>';
         });
         let titleTask = '<h2>Выполните задание:</h2>';
         output += titleTask;
         let task = text['task'];
         output += '<p class ="task">' + task + '</p>';
         area.innerHTML = output;
         let btnCheck = document.createElement('input');
         btnCheck.value = "ПРОВЕРИТЬ";
         btnCheck.id = 'btn-check';
         btnCheck.type = 'button';
         area.appendChild(btnCheck);
         btnCheck.addEventListener('click', checkAnswer);
         let btnNext = document.createElement('input');
         btnNext.value = "СДАЮСЬ";
         btnNext.id = 'btn-next';
         btnNext.type = 'button';
         area.appendChild(btnNext);
         btnNext.addEventListener('click', checkAnswer);

     }

//показать галочку за правильное решшение;
function getFontSize() {

    if(window.innerWidth < 1245 && window.innerWidth > 600){
        return  60;
    }
    else if(window.innerWidth < 600){
        return 40;
    }
    else if(window.innerWidth < 300){
        return 25;
    }
    return 100;
}

 function showLike() {
   const like = document.querySelector('.like');
   const message = generateMessage('like');
   let fontSizeForLike = getFontSize();
     like.querySelector('p').innerHTML = message;
    like.style.display = 'flex';
     setTimeout(function () {
         like.querySelector('i').style.fontSize = fontSizeForLike +'px';
         like.style.fontSize = fontSizeForLike +'px';
     },10);
     setTimeout(function () {
         like.querySelector('i').style.fontSize = '1px';
         like.style.display = 'none';
     },1500);
 }

function showDislike() {

    let fontSizeForLike = getFontSize();
    const dislike = document.querySelector('.dislike');
    const message = generateMessage();
    dislike.querySelector('p').innerHTML = message;
    dislike.style.display = 'flex';
    setTimeout(function () {
         dislike.querySelector('i').style.fontSize = fontSizeForLike +'px';
        dislike.style.fontSize = fontSizeForLike +'px';
     },10);
     setTimeout(function () {
         dislike.querySelector('i').style.fontSize = '1px';
         dislike.style.display = 'none';
     },1500);

}

function generateMessage(type) {
    let messages,
        quantityOfMessages,
        number;
     if(type === 'like'){
         messages = ['Молодец!','Правильно!','Так держать!','Отлично!','Верно!','Твои успехи радуют!'];
         quantityOfMessages = messages.length-1;

     }
     else{
         messages = ['В другой раз получиться!','Ты можешь лучше!','Попробуй еще раз!','Надо сосредоточиться!','Мы в тебя верим!','Тяжело в ученье\n легко в бою!'];
         quantityOfMessages = messages.length-1;

     }
    number = getRandomInt(0,quantityOfMessages);
     return messages[number];

}


function getRandomInt(min, max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


//кнопка показать меню
const burger = document.querySelector('.button-burger-menu');
const menu = document.getElementById('side-menu');

function showSideMenu(e){
    let btn = null;
    if(!e){
        btn = document.querySelector('.fa-times');
    }
    else{
        btn = e.target;
    }
    menu.classList.toggle('hidden');
    btn.setAttribute('style', 'transform:translateX(20px);z-index: 1200;');
    btn.classList.toggle('fa-bars');
    btn.classList.toggle('fa-times');
    if(!menu.classList.contain('hidden')){
        console.log('hello')
    }
}

burger.addEventListener('click', showSideMenu);