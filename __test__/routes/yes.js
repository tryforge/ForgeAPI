module.exports = {
    url: '/yes',
    method: 'get',
    handler: function(ctx) {
        ctx.res.status(200).send({
            nyan: true
        })
    }
}