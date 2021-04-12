module.exports = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '1234',
  database: 'iluvcoffee',
  entities: ['dist/**/*.entity.js'],
  cli: {
    migrationsDir: 'src/migrations',
  },
};
