const viewportToPixels = (value) => {
    let parts = value.match(/([0-9\.]+)(vh|vw)/)
    let q = Number(parts[1])
    let side = window[['innerHeight', 'innerWidth'][['vh', 'vw'].indexOf(parts[2])]]
    return side * (q/100)
}

var main_height;
var counter = 0;

const getRandomPosition = (element) => {
	const  x = document.body.offsetHeight-element.clientHeight;
	const y = document.getElementsByClassName('main')[0].offsetWidth-element.clientWidth;
	const randomX = Math.floor(Math.random()*x);
	const randomY = Math.floor(Math.random()*y);
	return [randomX,randomY];
}




const move = (element, direction, distance=20, duration=2000) => {
    let topOrLeft = (direction=="left" || direction=="right") ? "left" : "top";
    let isNegated = (direction=="up" || direction=="left");
    if (isNegated) { distance *= -1; }
    let elStyle = window.getComputedStyle(element);
    let value = elStyle.getPropertyValue(topOrLeft).replace("px", "");
    let destination = Number(value) + distance;
    let frameDistance = distance / (duration / 10);

    

    const moveAFrame = () => {
       elStyle = window.getComputedStyle(element);
       value = elStyle.getPropertyValue(topOrLeft).replace("px", "");
       let newLocation = Number(value) + frameDistance;
       let beyondDestination = ( (!isNegated && newLocation>=destination) || (isNegated && newLocation<=destination) );
       

       if (beyondDestination) {
          element.style[topOrLeft] = destination + "px";
          clearInterval(movingFrames);
          counter++;
          if (counter == 20) {
              alert('Game Over!');
              location.reload();
          }
       }
       else {
          element.style[topOrLeft] = newLocation + "px";
       }
    }

    let movingFrames = setInterval(moveAFrame, 10);
 }



const loading = () => {
    const str_array = ['A' , 'B' , 'C' , 'D' , 'E'];
   
    const str_len = str_array.length;

    const main = document.getElementsByClassName('main');
    main_height = main[0].style.height;
    let j = 0;

    setInterval(() => {
        const number = Math.floor(Math.random() * str_len);
        const color = Math.floor(Math.random()*16777215).toString(16);
        const fontsize = Math.floor(Math.random()*50);
        const str = str_array[number];
        const string = document.createElement('div');

        string.className = 'string';
        string.innerHTML = str;
        string.setAttribute("style", "position:absolute;");

        document.getElementsByClassName('main')[0].appendChild(string);
        
        const [x, y] = getRandomPosition(string);
        
        string.setAttribute("style", `position:absolute; top: ${x}px; left: ${y}px; background-color:#`+color+`; font-size:`+fontsize+`px; padding-left:`+fontsize/3+`px; padding-right:`+fontsize/3+`px;`);
        
        
        const distance = main_height.replace('px','') - string.style.top.replace('px','');
        const duration = distance/main_height.replace('px','')*7000;
        
        move(string , 'down' , distance , duration);
    }, 50);

    
}



document.addEventListener("keydown", (event) => {
    const content = event.code.replace('Key','');
    const score = document.getElementById('score');
    // const content = event.code;
    const allele = document.getElementsByClassName('string');
    removeelement = new Array;

    for (let i = 0; i < allele.length; i++) {
        
        if ((allele[i].innerHTML == content) && (allele[i].style.top != main_height) ) {
           removeelement.push(allele[i]);
        }
    }

    for (let i = 0; i < removeelement.length; i++) {
        
        if ((removeelement.length >= 2) ) {
            
            removeelement[i].remove();
        }
    }

    score.value = Number(score.value) + Number(removeelement.length);

});