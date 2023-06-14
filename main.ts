// na každé 5 měření dole => 1 měření US senzoru 50 - 10 Hz reakcemi za sekundu
// nevolat digitalReadPin víckrát
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
    PCAmotor.MotorRun(PCAmotor.Motors.M1, 100)
    PCAmotor.MotorRun(PCAmotor.Motors.M4, -100)
}

function left(x: number) {
    PCAmotor.MotorRun(PCAmotor.Motors.M1, x)
    PCAmotor.MotorRun(PCAmotor.Motors.M4, 0) // Adjust the right motor speed as needed
}

function right(x: number) {
    PCAmotor.MotorRun(PCAmotor.Motors.M1, 0) // Adjust the left motor speed as needed
    PCAmotor.MotorRun(PCAmotor.Motors.M4, -x)
}
function rotate(m1: number, m2: number) {
    PCAmotor.MotorRun(PCAmotor.Motors.M1, m1) // Adjust the left motor speed as needed
    PCAmotor.MotorRun(PCAmotor.Motors.M4, m2)
}

// fwd = 0; left = 1; r = 2
let go = 0

radio.onReceivedValue(function(name: string, value: number) {
    if (name == "gocross") go = value
})
basic.forever(function () {
    if (autoModeEnabled) {
        let c = (whiteLine ^ pins.digitalReadPin(pinC)) == 0 ? 0 : 1
        let l = (whiteLine ^ pins.digitalReadPin(pinL)) == 0 ? 0 : 1
        let r = (whiteLine ^ pins.digitalReadPin(pinR)) == 0 ? 0 : 1
    console.log([c,r,l])
        if (!l && !r) {
            forward()
            console.log("center")
        } else if (!l) {
            left(69)
            console.log("left")
        } else if (!r) {
            right(69)
            console.log("right")
        } else if (l && r){
            PCAmotor.MotorStopAll()
            if (go == 1) rotate(-100, -128)
            else if (go == 2) rotate(128, 100)
            else rotate(50, -50)
            basic.pause(550)
        }
        
} 

})