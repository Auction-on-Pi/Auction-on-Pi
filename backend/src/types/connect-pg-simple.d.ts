declare module 'connect-pg-simple' {
  import { Store } from 'express-session';
  import { Pool, PoolConfig } from 'pg';

  function pgSimple(session: any): new (options?: {
    pool?: Pool;
    tableName?: string;
    createTableIfMissing?: boolean;
    ttl?: number;
    pruneSessionInterval?: number;
  }) => Store;

  export = pgSimple;
}
