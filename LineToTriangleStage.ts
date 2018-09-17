const w : number = window.innerWidth, h : number = window.innerHeight
const nodes : number = 5
class LineToTriangleStage {
    canvas : HTMLCanvasElement = document.createElement('canvas')
    context : CanvasRenderingContext2D

    initCanvas() {
        this.canvas.width = w
        this.canvas.height = h
        this.context = this.canvas.getContext('2d')
        document.body.appendChild(this.canvas)
    }

    render() {
        this.context.fillStyle = '#212121'
        this.context.fillRect(0, 0, w, h)
    }

    handleTap() {
        this.canvas.onmousedown = () => {

        }
    }

    static init() {
        const stage : LineToTriangleStage = new LineToTriangleStage()
        stage.initCanvas()
        stage.render()
        stage.handleTap()
    }
}

class State {
    scale : number = 0
    dir : number = 0
    prevScale : number = 0

    update(cb : Function) {
        this.scale += 0.1 * this.dir
        if (Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir
            this.dir = 0
            this.prevScale = this.scale
            cb(this.prevScale)
        }
    }

    startUpdating(cb : Function) {
        if (this.dir == 0) {
            this.dir = 1 - 2 * this.prevScale
            cb()
        }
    }
}

class Animator {
    animated : boolean = false
    interval : number

    start(cb : Function) {
        if (!this.animated) {
            this.animated = true
            this.interval = setInterval(cb, 50)
        }
    }

    stop() {
        if (this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}

class LTSNode {
    state : State = new State()
    next : LTSNode
    prev : LTSNode

    constructor(private i : number) {
        this.addNeighbor()
    }

    addNeighbor() {
        if (this.i < nodes - 1) {
            this.next = new LTSNode(this.i + 1)
            this.next.prev = this
        }
    }

    draw(context : CanvasRenderingContext2D) {
        const gap : number = h / (nodes + 1)
        context.lineWidth = Math.min(w, h) / 60
        context.lineCap = 'round'
        context.strokeStyle = '#0D47A1'
        context.save()
        context.translate(w/2, gap)
        for (var j = 0; j < 2; j++) {
            const sc = Math.min(0.5, Math.max(this.state.scale - 0.5 * j, 0)) * 2
            const sc1 = Math.min(0.5, sc) * 2
            const sc2 = Math.min(0.5, Math.max(sc - 0.5, 0))
            context.save()
            context.translate((w/2) * sc2, 0)
            context.rotate(Math.PI * sc2)
            context.beginPath()
            context.moveTo(0, -gap/3)
            context.lineTo(2 * gap/3 * sc1, 0)
            context.lineTo(0, gap/3)
            context.stroke()
            context.restore()
        }
        context.restore()
    }

    update(cb : Function) {
        this.state.update(cb)
    }

    startUpdating(cb : Function) {
        this.state.startUpdating(cb)
    }

    getNext(dir : number, cb : Function) : LTSNode {
        var curr : LTSNode = this.prev
        if (dir == 1) {
            curr = this.prev
        }
        if (curr) {
            return curr
        }
        cb()
        return this
    }
}

class   LineToTriangle {
    curr : LTSNode = new LTSNode(0)
    dir : number = 1

    draw(context : CanvasRenderingContext2D) {

    }

    update(cb : Function) {
        this.curr.update(() => {
            this.curr = this.curr.getNext(this.dir, () => {
                this.dir *= -1
            })
            cb()
        })
    }

    startUpdating(cb : Function) {
        this.curr.startUpdating(cb)
    }
}
