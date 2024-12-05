export const config = {
    rabbitmq: {
        url: process.env.RABBITMQ_URL || 'amqp://localhost', 
        signupQueue: 'user_signup_queue',
        signinQueue: 'user_signin_queue'
    },
    DB : {
        user : process.env.user || 'user',
        host : process.env.host || 'host',
        database : process.env.database || 'database',
        password : process.env.password || 'password',
        port: process.env.DB_PORT || 5432,
    }
};