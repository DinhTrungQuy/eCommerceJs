var app = require("./src/app");
const LoggerService = require("./src/v1/Logger/logger.service");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


