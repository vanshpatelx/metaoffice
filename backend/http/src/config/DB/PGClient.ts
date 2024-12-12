import { Pool, QueryResult } from 'pg';

class PGClient {
    private static instance: PGClient;
    private pool: Pool;

    private constructor(
        dbname: string,
        user: string,
        password: string,
        host: string,
        port: number,
        minconn: number,
        maxconn: number
    ) {
        this.pool = new Pool({
            user,
            host,
            database: dbname,
            password,
            port,
            min: minconn,
            max: maxconn,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
        });
        console.log('PG started');
    }

    public static getInstance(
        dbname: string,
        user: string,
        password: string,
        host: string,
        port: number,
        minconn: number,
        maxconn: number
    ): PGClient {
        if (!PGClient.instance) {
            PGClient.instance = new PGClient(dbname, user, password, host, port, minconn, maxconn);
        }
        return PGClient.instance;
    }

    public async executeQuery(query: string, params?: any[]): Promise<false | QueryResult<any>> {
        const client = await this.pool.connect();
        try {
            const result = await client.query(query, params);
            if(result.rowCount === 0) return false;
            return result;
        } catch (error) {
            return false;
        } finally {
            client.release(); 
        }
    }
    

    public async closePool(): Promise<void> {
        try {
            await this.pool.end();
            console.log('Connection pool closed');
        } catch (error) {
            console.error('Error closing connection pool:', error);
        }
    }
}

export { PGClient };
