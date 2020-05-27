module.exports = config = {
    authentication: {
      options: {
        userName: "book-storage",
        password: "B00kB00k123"
      },
      type: "default"
    },
    server: "book-storage.database.windows.net",
    options: {
      database: "BookDB",
      encrypt: true
    }
  };