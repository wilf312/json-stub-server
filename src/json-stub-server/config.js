module.exports = {
    port: 4321,
    api: {
        req: '/apimock/request',
        res: '/apimock/response',
    },
    db: './db.json',
    backup: './_bk.json',
    isRunSaveServer: false,
    defaultData: {
        id: '',
        version: 1,
        created: 0,
        updated: 0,
        request: {
            body: '',
            headers: {
            },
            method: 'GET',
            params: [
                {
                    key: 'value'
                }
            ]
        },
        response: {
            body: [],
            httpStatus: 200
        }
    }
}
