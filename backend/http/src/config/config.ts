export const config = {
    redis : {
        host : process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD || '',
        db: Number(process.env.REDIS_DB) || 0,
    },
    JWT_SECRET : '1234455',
    rabbitmq: {
        url: process.env.RABBITMQ_URL || 'amqp://localhost', 
        signupQueue: 'user_signup_queue',
        addElementQueue: 'admin_add_element_queue',
        updateElementQueue: 'admin_update_element_queue',
        addAvatarQueue: 'admin_add_avatar_queue',
        addMapQueue: 'admin_add_map_queue'
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