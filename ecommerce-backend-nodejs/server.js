var app = require("./src/app");
const LoggerService = require("./src/logger/logger.service");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


