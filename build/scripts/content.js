// create listener to listen for incoming message from measure function in popup.js
console.log("heelo")
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        // if request fits what is required
        if (request.method === "highlight") {
            // get selection and send response back to measure() in popup.js
            sendResponse({ data: window.getSelection().toString() });
        }
    }
)