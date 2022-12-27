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
    _move: function () {
        this.y = ball.y
    },
    draw: function () {
        canvasCtx.fillStyle = ("#ffffff");
        canvasCtx.fillRect(this.x, this.y, this.w, this.h);
        this._move();
    }
}

const ball = {
    x: 0,
    y: 300,
    r: 20,
    speed: 5,
    directionX: 1,
    directionY: 1,
    _calcPosition: function () {
        if (
            (this.y > field.h - this.r && this.directionY > 0) ||
            (this.y - this.r < 0 && this.directionY < 0)
            ) 
         {
            this._reverseY();
        }
    },
    _reverseX: function () {
        this.directionX *= -1;
    },
    _reverseY: function () {
        this.directionY *= -1;
    },
    _move: function () {
        this.x += this.directionX * this.speed
        this.y += this.directionY * this.speed
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

const score = {
    human: 2,
    computer: 2,
    draw: function () {
        canvasCtx.font = "bold 72px Arial"
        canvasCtx.textAlign = "center"
        canvasCtx.textBaseline = "top"
        canvasCtx.fillStyle = "#01341D"
        canvasCtx.fillText(this.human, field.w / 4, 50)
        canvasCtx.fillText(this.computer, field.w / 1.5, 50)
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