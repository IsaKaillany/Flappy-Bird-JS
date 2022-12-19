function newElement(tagName, className) { //Cria os elementos html
    const element = document.createElement(tagName)
    element.className = className
    return element
}

function barrier(reverse = false) { //Cria as barreiras (Função construtora, podendo ser instanciada)
    this.element = newElement('div', 'barrier')

    const barrierBorder = newElement('div', 'barrier-border')
    const barrierBody = newElement('div', 'barrier-body')

    this.element.appendChild(reverse ? barrierBody : barrierBorder) //Operador ternário
    this.element.appendChild(reverse ? barrierBorder : barrierBody) //Operador ternário

    this.setHeight = height => barrierBody.style.height = `${height}px`
}

// const b = new barrier(true)
// b.setHeight(200)
// document.querySelector('[tp-flappy]').appendChild(b.element)

function duoBarrier(height, gap, x) { //x = posição; gap = espaço entre as barreiras
    this.element = newElement('div', 'duo-barrier')

    this.upper = new barrier(true)
    this.lower = new barrier(false)

    this.element.appendChild(this.upper.element)
    this.element.appendChild(this.lower.element)

    this.randomGap = () => { //Sorteia e calcula o tamanho das aberturas
        const heightUpper = Math.random() * (height - gap)
        const heightLower = height - gap - heightUpper

        this.upper.setHeight(heightUpper)
        this.lower.setHeight(heightLower)
    }

    this.getX = () => parseInt(this.element.style.left.split('px')[0]) //Saber em qual posição a barreira está, convertendo de string para int
    this.setX = x => this.element.style.left = `${x}px`
    this.getWidth = () => this.element.clientWidth //Pega a largura

    this.randomGap()
    this.setX(x)
}

// const b = new duoBarrier(700, 200, 800)
// document.querySelector('[tp-flappy]').appendChild(b.element)

function barriers(height, width, gap, space, notifyPoint){ //height = altura da barreira; width = dimensões do jogo; gap = abertura entre as barreiras; space = espaço entre as barreiras; notifyPoint = saber quando uma barreira cruzou o centro do jogo (contagem de pontos)
    this.pairs = [
        new duoBarrier(height, gap, width),
        new duoBarrier(height, gap, width + space),
        new duoBarrier(height, gap, width + space * 2),
        new duoBarrier(height, gap, width + space * 3)
    ]

    const movement = 3 //Responsável pelo deslocamento

    this.animate = () => { //Animar as barreiras
        this.pairs.forEach(pair => {
            pair.setX(pair.getX() - movement)

            if (pair.getX() < -pair.getWidth()) { //Reutilizar a barreira que saiu da área do jogo e mudar seu gap
                pair.setX(pair.getX() + space * this.pairs.length)
                pair.randomGap()
            }

            const middle = width / 2
            const crossedMiddle = pair.getX() + movement >= middle && pair.getX() < middle
            if (crossedMiddle) notifyPoint()             
        })
    }
}

// const barriersVar = new barriers(700, 1200, 200, 400)
// const areaGame = document.querySelector('[tp-flappy]')
// barriersVar.pairs.forEach(pair => areaGame.appendChild(pair.element))

// setInterval(() =>{
//     barriersVar.animate()
// }, 20)

function bird(heightGame) {
    let flying = false //Flag para indicar se o pássaro está voando ou não

    this.element = newElement('img', 'bird')
    this.element.src = './img/passaro.png'
    
    this.getX = () => parseInt(this.element.style.bottom.split('px')[0]) //Captura a posição do pássaro
    this.setY = y => this.element.style.bottom = `${y}px` //Seta a posição p/ o pássaro fazer a animação em cima da altura

    window.onkeydown = e => flying = true
    window.onkeyup = e => flying = false

    this.animate= () => {
        const newY = this.getX() + (flying ? 8 : -5) //Se estiver voando soma 8, se tiver caindo soma -5
        const heightMax = heightGame - this.element.clientHeight //Para não passar do campo de visão

        //Validações
        if (newY <= 0) {
            this.setY(0)
        } else if (newY >= heightMax) {
            this.setY(heightMax)
        } else {
            this.setY(newY)
        }
    }
    this.setY(heightGame / 2)
}

function progress() {
    this.element = newElement('span', 'progress') //<span class="progress"></span>

    this.updatePoints = points => { //Recebe e atribui os pontos
        this.element.innerHTML = points
    }
    this.updatePoints(0)
}

// const barriersVar = new barriers(700, 1200, 200, 400)
// const birdVar = new bird(700)
// const areaGame = document.querySelector('[tp-flappy]')

// areaGame.appendChild(new progress().element)
// areaGame.appendChild(birdVar.element)
// barriersVar.pairs.forEach(pair => areaGame.appendChild(pair.element))

// setInterval(() =>{
//     barriersVar.animate()
//     birdVar.animate()
// }, 20)

function flappyBird() {
    let points = 0

    const areaGame = document.querySelector('[tp-flappy]')
    const height = areaGame.clientHeight
    const width = areaGame.clientWidth

    const progressVar = new progress()
    const barriersVar = new barriers(height, width, 200, 400, () => progressVar.updatePoints(++points))
        
    const birdVar = new bird(height)

    areaGame.appendChild(progressVar.element)
    areaGame.appendChild(birdVar.element)

    barriersVar.pairs.forEach(pair => areaGame.appendChild(pair.element))

    this.start = () => {
        const timer = setInterval(() => {
            barriersVar.animate()
            birdVar.animate()
        }, 20) //Temporizador
    }
}

new flappyBird().start()