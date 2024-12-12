export const config = {
    rabbitmq: {
        url: process.env.RABBITMQ_URL, 
        signupQueue: process.env.signupQueue,
        addElementQueue: process.env.addElementQueue,
        updateElementQueue: process.env.updateElementQueue,
        addAvatarQueue: process.env.addAvatarQueue,
        addMapQueue: process.env.addMapQueue
    },
    DB1 : {
        user : process.env.user,
        host : process.env.host,
        database : process.env.database,
        password : process.env.password,
        port: process.env.DB_PORT
    },
    DB2 : {
        host : process.env.host,
        localDataCenter : process.env.localDataCenter,
    }
};

