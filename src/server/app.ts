import express from "express";
import app from "./appInit";

import index from "./routes/index";
// import api from "./routes/api";

// app.use('/pages', express.static('./public/index.html'));
app.use('/', index);
// app.use('/api', api);

export default app;
