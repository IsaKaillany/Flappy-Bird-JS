function newElement(tagName, className) { //Cria os elementos html
    const element = document.createElement(tagName)
    element.className = className
    return element
}

function barriers(reverse = false) { //Cria as barreiras (Função construtora, podendo ser instanciada)
    this.element = newElement('div', 'barrier')

    const barrierBorder = newElement('div', 'barrier-border')
    const barrierBody = newElement('div', 'barrier-body')

    this.element.appendChild(reverse ? barrierBody : barrierBorder) //Operador ternário
    this.element.appendChild(reverse ? barrierBorder : barrierBody) //Operador ternário

    this.setHeight = height => barrierBody.style.height = `${height}px`
}

// const b = new barriers(true)
// b.setHeight(200)
// document.querySelector('[tp-flappy]').appendChild(b.element)

function duoBarrier(height, space, x) { //x = posição; space = espaço entre as barreiras
    this.element = newElement('div', 'duo-barrier')

    this.upper = new barriers(true)
    this.lower = new barriers(false)

    this.element.appendChild(this.upper.element)
    this.element.appendChild(this.lower.element)

    this.randomSpace = () => { //Sorteia e calcula o tamanho das aberturas
        const heightUpper = Math.random() * (height - space)
        const heightLower = height - space - heightUpper

        this.upper.setHeight(heightUpper)
        this.lower.setHeight(heightLower)
    }

    this.getX = () => parent(this.element.style.left.split('px')) //Saber em qual posição a barreira está, convertendo de string para int
    this.setX = x => this.element.style.left = `${x}px`
    this.getWidth = () => this.element.clientWidth //Pega a largura

    this.randomSpace()
    this.setX(x)
}

const b = new duoBarrier(700, 200, 800)
document.querySelector('[tp-flappy]').appendChild(b.element)

