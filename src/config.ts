export default () => ({
  RawSqlHerokuConfig: {
    type: 'postgres' as const,
    host: process.env.HEROKU_HOST,
    port: 5432,
    username: process.env.HEROKU_USER,
    password: process.env.HEROKU_PASSWORD,
    database: process.env.HEROKU_DATABASE,
    autoLoadEntities: true,
    synchronize: false,
    ssl: { rejectUnauthorized: false },
  },
});
