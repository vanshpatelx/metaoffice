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
    DB : {
        user : process.env.user || 'user',
        host : process.env.host || 'host',
        database : process.env.database || 'database',
        password : process.env.password || 'password',
        port: process.env.DB_PORT || 5432,
    }
};