module.exports = {
    url: '/hello',
    method: 'get',
    handler: `
        $if[$getQuery[msg]==;
            $sendJSON[{ "err": "you must provide a msg query" };400]
            $stop
        ]

        $switch[$getQuery[msg];
            $case[yes;
                $sendJSON[{ "msg": "YESSSS BRO, I AGREEE" };200]
            ]
            $case[no;
                $sendJSON[{ "msg": "HELLL NAWWWWWW" };200]
            ]
            $case[default;
                $sendJSON[{ "msg": "UNKNOWN VALUE" };201]
            ]
        ]
    `
}