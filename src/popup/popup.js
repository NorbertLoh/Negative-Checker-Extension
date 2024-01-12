// require tensorflow modules
const tf = require('@tensorflow/tfjs');
const toxicity = require('@tensorflow-models/toxicity');

// list of html ID where prediction values are placed
const VALUE_IDS = ["IAValue", "IValue", "OValue", "STValue", "SEValue", "ThreatValue", "ToxicityValue"]

// on load add listeners
document.addEventListener('DOMContentLoaded', function () {
    // add onclick listener to measure button
    document.getElementById('measureBtn').addEventListener("click", measure);
})

function measure() {
    // query the active tab and window to the user's current selected item
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        var activeTab = tabs[0];
        // send a message to active tab and window's content page to highlighted item
        chrome.tabs.sendMessage(activeTab.id, { "method": "highlight" }, response => {
            // place selected sentence into a variable
            var sentence = response.data
            // trim to ensure that sentence is not " "
            if (sentence.trim()) {
                // place sentence into text area in the popup so users know what they are measuring
                document.getElementById('textarea').value = sentence
                // set value placeholders with loading animation
                VALUE_IDS.forEach(id => {
                    document.getElementById(id).innerHTML = '<div class="loader"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>'
                });
                // pass sentence into predict function where it will run the model
                predict(sentence).then(res => {
                    // res is the result of the predictions
                    // set values into html
                    VALUE_IDS.forEach((id, i) => {
                        // values are returned in decimals with 1 and 0 being the highest and lowest respectively
                        // multiply by 100 and remove decimals
                        let toxicity = (((res[i]['results'][0]['probabilities'][1])*100).toFixed(0))
                        document.getElementById(id).innerHTML = `${toxicity}%`
                    });
                })
            } else {
                // if sentence is empty reset placeholder to default -
                document.getElementById('textarea').value = ""
                VALUE_IDS.forEach(id => {
                    document.getElementById(id).innerHTML = '-'
                });
            }

        });
    });
}

function predict(sentence) {
    // load tensorflow model
    // 0.85 is the minimum confidence that we will accept
    return toxicity.load(0.85).then(model => {
        // with the model's classify method to convert sentence into a vector
        return model.classify([sentence]).then(predictions => {
            // return predicted value generated from the model
            return predictions
        })
    })
}
