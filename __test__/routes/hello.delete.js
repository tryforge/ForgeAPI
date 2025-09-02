module.exports = {
    url: '/hello',
    method: 'delete',
    handler: `
        $sendJSON[{ "message": "Triggered DELETE method route!" };200]
    `
}