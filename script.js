const canvasEl = document.querySelector("canvas"),
    canvasCtx = canvasEl.getContext("2d"); // Você escolhe qual o contexto que você quer 2d ou 3d
const lineWidth = 15;
const gapX = 10;
const mouse = { x: 0, y : 0}

const field = {
    w: window.innerWidth,
    h: window.innerHeight,
    draw: function () {
        canvasCtx.fillStyle = "#286047"
        canvasCtx.fillRect(0, 0, this.w, this.h)
    }
}

const line = {
    w: 15,
    h: field.h,
    draw: function() {
        canvasCtx.fillStyle = ("#ffffff");
    
        canvasCtx.fillRect(
        field.w / 2 - this.w / 2, // Posição em relação ao eixo x
        0, // Posição em relação ao eixo y
        this.w, // largura da minha linha
        this.h // altura a minha linha 
        );
    }
}

const leftPaddle = {
    x: gapX,
    y: 0,
    w: line.w,
    h: 200,
    _move: function () {
        this.y = mouse.y - this.h / 2;
    },
    draw: function () {
        canvasCtx.fillStyle = ("#ffffff");
        canvasCtx.fillRect(this.x, this.y, this.w, this.h);
        this._move();
    }
}

const rightPaddle = {
    x: field.w - line.w - gapX,
    y: 0,
    w: lineWidth,
    h: 200,
    speed: 5,
    _move: function () {
        if(this.y + this.h / 2 < ball.y + ball.r) {
            this.y += this.speed 
        } else {
            this.y -= this.speed
        }
    },
    speedUp: function () {
        this.speed += 2 
    },
    draw: function () {
        canvasCtx.fillStyle = ("#ffffff");
        canvasCtx.fillRect(this.x, this.y, this.w, this.h);
        this._move();
    }
}

const score = {
    human: 0,
    computer: 0,
    increaseHuman: function() {
        this.human++
    },
    increaseComputer: function() {
        this.computer++
    },
    draw: function () {
        canvasCtx.font = "bold 72px Arial"
        canvasCtx.textAlign = "center"
        canvasCtx.textBaseline = "top"
        canvasCtx.fillStyle = "#01341D"
        canvasCtx.fillText(this.human, field.w / 4, 50)
        canvasCtx.fillText(this.computer, field.w / 1.5, 50)
    }

}

const ball = {
    x: 300,
    y: 300,
    r: 20,
    speed: 5,
    directionX: 1, // A direção em que a bolinha vai, (-) vai para a esquerda
    directionY: 1, // A direção em que a bolinha vai, (-) vai para cima
    _calcPosition: function () {
        // verifica se o jogador número 1 fez um ponto (x > largura da tela)
        if(this.x > field.w - this.r - rightPaddle.w - gapX) {
            if( 
                this.y + this.r > rightPaddle.y &&
                this.y - this.r < rightPaddle.y + rightPaddle.h   
            ) {
              // rebate a bola invertendo o sinal do x  
              this._reverseX();
            } else {
              // Pontuar jogador 1
              score.increaseHuman();
              this._pointUp();
            }
        }

        if(this.x < 0 + this.r + leftPaddle.w + gapX) {
            if(this.y + this.r > leftPaddle.y &&
               this.y - this.r < leftPaddle.y + leftPaddle.h 
            ) {

                this._reverseX();
            } else {
               score.increaseComputer();
               this. _pointUp();
            }
        }
        
        
        
        // verifica as laterais superior e inferior do campo 
        if (
            (this.y > field.h - this.r && this.directionY > 0) || // Quando o tamanho do y for maior do field.h que é o tamanho da tela ele vai redirecionar.  
            (this.y - this.r < 0 && this.directionY < 0) // Quando o tamanho de y for negativo ele vai redirecionar, multiplicando por - 1.
            ) 
        {
        // rebate a bola invertendo o sinal do eixo Y
            this._reverseY();
        }
    },
    _reverseX: function () {
        // 1 * -1 = -1
        // -1 * -1 = 1
        this.directionX *= -1;
    },
    _reverseY: function () {
        this.directionY *= -1; // Multiplica o directionY por -1
    },
    _speedUp: function () {
        this.speed += 1; // Aumentar a velocidade da bola
    },
    _pointUp: function () {
        this._speedUp();
      
        this.x = field.w / 2;
        this.y = field.h / 2;
    },
    _move: function () {
        this.x += this.directionX * this.speed // Adiciona -5 ou mais 5, positivo para ir para frente e negativo para ir para tras  
        this.y += this.directionY * this.speed // Adiciona sempre na posição mais -1 * 5, fazendo assim a direção dele sempre ir pra baixo ou para cima, pois vai começar pra baixo quando for positivo e para cima quando for negativo
    },
    draw: function () {
        canvasCtx.fillStyle = ("#ffffff");
        canvasCtx.beginPath();
        canvasCtx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
        canvasCtx.fill();
        this._calcPosition();
        this._move();
    }
}


function setup() {
    canvasEl.width = canvasCtx.width = field.w; // Seleciono o tamnho do meu elemento no caso é toda a largura
    canvasEl.height = canvasCtx.height = field.h; // Seleciono meu elemento dando o tamanho da altura que no caso é toda a altura
}

function draw() {
    field.draw()
    line.draw()
    leftPaddle.draw()
    rightPaddle.draw()
    score.draw()
    ball.draw() 
    
}

setup() // Chamando minhas funções
draw()

window.animateFrame = (function () { // Cria uma propriedade no window que vai executar uma api para suavizar sua animação
    return (
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback) {
        return window.setTimeout(callback, 1000 / 60) // Executa uma função em um determinado tempo em milesimos de segundo
      }
    )
  })()

  function main() {
    animateFrame(main)
    draw()
  }

  main()
  canvasEl.addEventListener("mousemove", function (e) { // Vai dizer pra onde a raquete vai se mover em relação ao mouse
    mouse.x = e.pageX 
    mouse.y = e.pageY
    
    console.log(mouse)

  })