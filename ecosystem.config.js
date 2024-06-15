module.exports = {
  apps: [
    {
      name: "my-node-app",
      script: "./app.js",
      instances: "max",
      exec_mode: "cluster",
      env: {
        DB_USER: "thecorrectsteps",
        DB_NAME: "VirtualOffice",
        JWT_KEY: "ERP_Correct_Steps_Consultancy",
        REDIS_PASSWORD: "4444",
        DB_PASSWORD: "sajaljain%40390",
      },
      env_production: {
        DB_USER: "thecorrectsteps",
        DB_NAME: "VirtualOffice",
        JWT_KEY: "ERP_Correct_Steps_Consultancy",
        REDIS_PASSWORD: "4444",
        DB_PASSWORD: "sajaljain%40390",
      },
    },
  ],
};
