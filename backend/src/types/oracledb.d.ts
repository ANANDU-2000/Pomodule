declare module 'oracledb' {
  interface Pool {
    getConnection(): Promise<Connection>;
    close(drainTime: number): Promise<void>;
  }

  interface Connection {
    execute<T = unknown>(
      sql: string,
      binds?: Record<string, unknown>,
      options?: Record<string, unknown>,
    ): Promise<T>;
    close(): Promise<void>;
  }

  function createPool(config: Record<string, unknown>): Promise<Pool>;

  const oracledb: {
    createPool: typeof createPool;
    OUT_FORMAT_OBJECT: number;
    BIND_OUT: number;
    CURSOR: number;
    NUMBER: number;
    Pool: Pool;
    Connection: Connection;
  };

  export type { Pool, Connection };
  export default oracledb;
}
