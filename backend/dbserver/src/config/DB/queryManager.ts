import { QueryResult } from "pg";
import { PGClient } from "./PGClient";
import { query } from "./query";
import { CassandraClient } from "./CassandraClient";

class QueryManager {
    private static instance: QueryManager;
    private dbclient: PGClient;
    private cassandraClient: CassandraClient;


    private constructor() {
        this.dbclient = PGClient.getInstance(
            'your_db_name', 
            'your_db_user', 
            'your_db_password', 
            'localhost', 
            5000, 
            10, 
            100
        );

        this.cassandraClient = CassandraClient.getInstance(
            ['127.0.0.1'], 
            'your_db_user'
        );
        this.initializeTables();
    }

    private initializeTables(): void {
        const tables = [
            query.createTable.users,
            query.createTable.elements,
            query.createTable.avatars,
            query.createTable.userSpace,
         
        ];

        const tablesCassandra = [
            query.createTable.space,
            query.createTable.map
        ];

        tables.forEach(async (table) => {
            try {
                await this.dbclient.executeQuery(table);
            } catch (error) {
                console.error('Error initializing table: PG', error);
            }
        });
        tablesCassandra.forEach(async (table) => {
            try {
                await this.cassandraClient.executeQuery(table);
            } catch (error) {
                console.error('Error initializing table: Cassandra', error);
            }
        });
    }

    public static getInstance(): QueryManager {
        if (!QueryManager.instance) {
            QueryManager.instance = new QueryManager();
        }
        return QueryManager.instance;
    }

    public async fetchData(query: string, params: any[] = []): Promise<QueryResult | null> {
        try {
            return await this.dbclient.executeQuery(query, params);
        } catch (error) {
            console.error('Error fetching data:', error);
            return null;
        }
    }

    public async userSignupMessage(messageContent: string | undefined): Promise<void> {
        if (!messageContent) {
            console.error('No message content provided');
            return;
        }
        try {
            const data = JSON.parse(messageContent);

            if (!data.id || !data.username || !data.password || !data.type) {
                console.error('Invalid user data provided:', data);
                return;
            }
            
            await this.executeInsert(query.insertQuery.addUser, [data.id, data.username, data.password, data.type], 'User Added');

        } catch (error) {
            console.error('Error processing user message:', error);
        }
    }

    // public async processElementMessage(messageContent: string | undefined, partition: number): Promise<void> {
    //     if (!messageContent) {
    //         console.error('No message content provided');
    //         return;
    //     }

    //     try {
    //         const data = JSON.parse(messageContent);

    //         switch (partition) {
    //             case 1: // Add Element Admin
    //                 await this.executeInsert(
    //                     query.insertQuery.addElementAdmin,
    //                     [data.id, data.url, data.size, data.staticElement, data.name],
    //                     'Element'
    //                 );
    //                 break;
    //             case 2: // Update Element Admin
    //                 await this.executeInsert(query.insertQuery.updateElementAdmin, [data.id, data.url], 'Element');
    //                 break;
    //             case 3: // Add Avatar
    //                 await this.executeInsert(query.insertQuery.addAvatar, [data.id, data.name, data.url], 'Avatar');
    //                 break;
    //             case 4: // Add Map
    //                 await this.executeInsert(
    //                     query.insertQuery.addMap,
    //                     [data.id, data.url, data.name, data.dimensions],
    //                     'Map'
    //                 );
    //                 break;
    //             default:
    //                 console.log('Unknown partition:', partition);
    //                 break;
    //         }
    //     } catch (error) {
    //         console.error('Error processing element message:', error);
    //     }
    // }

    private async executeInsert(query: string, params: any[], entityName: string): Promise<void> {
        try {
            const result = await this.dbclient.executeQuery(query, params);
            if (result && result.rows && result.rows.length > 0) {
                console.log(`${entityName} operation successful:`, result.rows);
            } else {
                console.error(`Failed to execute operation for ${entityName}`);
            }
        } catch (error) {
            console.error(`Error executing operation for ${entityName}:`, error);
        }
    }
}

// Usage
const queryManager = QueryManager.getInstance();

export { queryManager };
