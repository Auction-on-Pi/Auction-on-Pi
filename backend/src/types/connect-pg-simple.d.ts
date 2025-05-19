declare module 'connect-pg-simple' {
  import { Store } from 'express-session';
  import { Pool } from 'pg';

  interface PGStoreOptions {
    pool?: Pool;
    tableName?: string;
    createTableIfMissing?: boolean;
  }

  function pgSimple(session: any): new (options?: PGStoreOptions) => Store;
  
  export = pgSimple;
}
