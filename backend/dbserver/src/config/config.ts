export const config = {
    rabbitmq: {
        url: process.env.RABBITMQ_URL || 'amqp://localhost', 
        signupQueue: 'user_signup_queue',
        signinQueue: 'user_signin_queue'
    },
    DB1 : {
        user : process.env.user || 'postgres',
        host : process.env.host || 'localhost',
        database : process.env.database || 'gatherTown',
        password : process.env.password || 'mysecretpassword',
        port: process.env.DB_PORT || 5432,
    },
    DB2 : {
        host : process.env.host || '127.0.0.1',
        localDataCenter : process.env.localDataCenter || 'datacenter1',
    }
};

