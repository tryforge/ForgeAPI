module.exports = {
    url: '/hello',
    method: 'get',
    handler: '$sendJSON[{ "yes": "whatever" };200]'
}