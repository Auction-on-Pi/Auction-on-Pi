// Temporary type declaration until the package gets properly installed
declare module 'connect-pg-simple' {
  import { Store } from 'express-session';
  import { Pool, PoolConfig } from 'pg';

  function pgSimple(session: any): new (options?: any) => Store;

  export = pgSimple;
}
