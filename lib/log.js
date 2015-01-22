var winston = require('winston');

module.exports =
    new(winston.Logger)({
        transports: [
                new(winston.transports.Console)({
                colorize: true,
                prettyPrint: true,
                level: 'info'
            })
        ]
    });
//set color
winston.addColors({
    info: 'green',
    warn: 'cyan',
    error: 'red'
});
winston.handleExceptions(new winston.transports.Console({
    colorize: true,
    json: false
}));
