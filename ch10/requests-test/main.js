const request = require('request').defaults({
    url: 'http://api.github.com/gists',
    headers: { 'User-Agent': 'Request tests' }
})

const toJSON = (clippingText) => {
    return {
        body: JSON.stringify({
            description: "Created with request-tests",
            public: true,
            files: {
                "clipping.txt": { content: clippingText }
            }
        })
    }
}

const publishClipping = (clippingText) => {
    request.post(toJSON(clippingText), (error, response, body) => {
        console.log(`ERR:\n${error}\nRESP:\n${response}\nBODY:\n${body}\n`)
        console.log("BODY:\n")
        console.log(JSON.stringify(body))
        if (error) { return console.log("ERROR WAS HERE: " + JSON.parse(error).message) }
        const gistUrl = JSON.parse(body).html_url
        console.log(gistUrl)
    })
}

console.log(publishClipping("hello world!"))

