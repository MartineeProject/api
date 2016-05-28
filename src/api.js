import _ from 'lodash';
import hapi from 'hapi';
import path from 'path';
import file from 'file';
import logger from './logger';

export default class API {
    constructor(options) {
        this.logger = new logger();
        this.server = new hapi.Server();

        this.server.connection({
            host: options.host,
            port: options.port
        });

        this.loadRoutes();
    }

    loadRoutes() {
        let routes = [];

        file.walkSync(path.join(__dirname, "routes"), (folder, innerFolders, files) => {
            for(let file of files) {
                if(path.extname(file) !== '.js') {
                    continue;
                }
                routes.push.apply(routes, require(path.join(folder, file)));
            }
        });
        this.logger.debug(`Loaded ${routes.length} routes`)
        this.server.route(routes);
    }

    startServer() {
        this.server.start((err) => {
            if (err) {
                throw err;
            }
            this.logger.info(`Server running at: ${this.server.info.uri}`);
        });
    }
}