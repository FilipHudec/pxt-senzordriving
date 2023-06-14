// na každé 5 měření dole => 1 měření US senzoru 50 - 10 Hz reakcemi za sekundu
// nevolat digitalReadPin víckrát

const _turn = 80
interface senzors {
    c: number;
    l: number;
    r: number;
}
radio.setGroup(112)

let s1 = new Servo(PCAmotor.Servos.S1, 550, 2700, 1650, 10)
let spidx = 0.5
let autoModeEnabled = true
let whiteLine = 0

const pinC = DigitalPin.P15
const pinL = DigitalPin.P14 // zkontrolovat piny
const pinR = DigitalPin.P13

pins.setPull(pinC, PinPullMode.PullNone)
pins.setPull(pinL, PinPullMode.PullNone)
pins.setPull(pinR, PinPullMode.PullNone)

s1.stop()

function forward() {
    PCAmotor.MotorRun(PCAmotor.Motors.M1, 128)
    PCAmotor.MotorRun(PCAmotor.Motors.M4, -128)
}

function left(x: number) {
    PCAmotor.MotorRun(PCAmotor.Motors.M1, x)
    PCAmotor.MotorRun(PCAmotor.Motors.M4, 0) 
}

function right(x: number) {
    PCAmotor.MotorRun(PCAmotor.Motors.M1, 0)
    PCAmotor.MotorRun(PCAmotor.Motors.M4, -x)
}

function rotate(m1: number, m2: number) {
    PCAmotor.MotorRun(PCAmotor.Motors.M1, m1)
    PCAmotor.MotorRun(PCAmotor.Motors.M4, m2)
}


let go = 0
let paused = false

function crossRotate (go: number) {
    paused = true
    PCAmotor.MotorStopAll()
    if (go == 1) 
    {
        rotate(-108, -128)
    }
    else if (go == 2) 
    {
        rotate(128, 108)
    }
    else {
        PCAmotor.MotorStopAll()
        rotate(60, -60)
    }
    basic.pause(550)
    paused = false
}

radio.onReceivedValue(function(name: string, value: number) {
    if (name == "gocross") 
    {
        go = value
    }
    if (name == "forcego") {
        crossRotate(go)
    }
})

function getSenzors () : senzors {
    let c = (whiteLine ^ pins.digitalReadPin(pinC)) == 0 ? 0 : 1
    let l = (whiteLine ^ pins.digitalReadPin(pinL)) == 0 ? 0 : 1
    let r = (whiteLine ^ pins.digitalReadPin(pinR)) == 0 ? 0 : 1
    return {c,l,r}
}

basic.forever(function () {
    if (paused) return
    if (autoModeEnabled) { 
        let s = getSenzors()
        let c = s.c
        let l = s.l
        let r = s.r
        console.log([c,r,l])
        if (!l && !r) {
            forward()
            console.log("center")
        } else if (!l) {
            left(_turn)
            console.log("left")
        } else if (!r) {
            right(_turn)
            console.log("right")
        } else if (l && r){
            crossRotate(go)
        }
} 

})