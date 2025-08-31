module.exports = {
    url: '/hello',
    method: 'get',
    handler: `
        $sendJSON[{ "message": "Triggered GET method route!" };200]
    `
}