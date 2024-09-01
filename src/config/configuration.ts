//TODO: Enhance implementation, as have implemented
export default () => ({
  port: +process.env.PORT || 3000,
  mongoConnectionString: process.env.MONGO_CONNECTION_STRING,
});
