const Gpio = require('onoff').Gpio;
const power = new Gpio(17, 'out');
const brewing = new Gpio(18, 'out');
const smartCoffee = require('../models/smartCoffee');
const activities = require('../models/activities');

function turnPower() {
    return new Promise(resolve => {
        power.write(1, function () {
            power.writeSync(0);

            smartCoffee.findOne({}, {}, { sort: { 'created_at' : 1 } }, function(err, result) {
                let status ;
                console.log(result)
                if(result.isOn){
                    status = false;
                }
                else {
                    status = true
                }

                smartCoffee.update({_id: result._id}, {
                    $set: {
                        isOn: status
                    }
                }).then(result => {

                    if(status){
                        logActivity('Power on').then(function () {
                            resolve(result);

                        })
                    }
                    else {
                        logActivity('Power off').then(function () {
                            resolve(result);

                        })
                    }
                })
            });
        })
    });

}

function makeCoffee() {
    return new Promise(resolve => {
        brewing.write(1, function () {
            console.log("Make Coffee");
            brewing.writeSync(0);
            logActivity('Coffee made').then(function () {
                resolve();
            })

        })
    });
}

function getStatus(){
    return new Promise((resolve, reject) => {
        smartCoffee.findOne({}, {}, { sort: { 'created_at' : 1 } }, function(err, result) {
            resolve(result);
        });
    })
}

function logActivity(type){

    return new Promise((resolve, reject) => {

        new activities({
            action: type
        }).save().then(function () {
            resolve();
        });

    })
}

function getActivities() {
    return new Promise((resolve, reject) => {
        activities.find().then(results => {
            resolve(results);
        })
    })
}
function countCoffees(){

    return new Promise((resolve, reject) => {

        activities.find({action: 'Coffee made'}).then(results => {
            console.log(results);

            let json = {
                drunkenCoffees: results.length,
                coffees: results
            };
            resolve(json)
        })
    })
}
module.exports = {
    turnPower,
    makeCoffee,
    getStatus,
    getActivities,
    countCoffees
};