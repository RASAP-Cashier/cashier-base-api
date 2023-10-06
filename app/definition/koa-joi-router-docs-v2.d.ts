declare module "koa-joi-router-docs-v2" {
  interface Route {
    // Define the shape of a route object here, or use any if it's not known
  }

  interface Router {
    routes: Route[];
    opts?: {
      prefix: string;
    };
  }

  interface BaseSpec {
    info: {
      title: string;
      version: string;
      description: string;
    };
    tags?: {
      name: string;
      description: string;
    }[];
    basePath: string;
    definitions?: Record<string, any>;
    paths?: Record<string, any>;
  }

  interface Options {
    warnFunc?: (...args: any[]) => void;
    defaultResponses?: {
      200?: {
        description: string;
      };
      400?: {
        description: string;
      };
      500?: {
        description: string;
      };
    };
    definitions?: Record<string, any>;
  }

  export class SwaggerAPI {
    apiRoutes: any[];

    constructor();

    addJoiRouter(router: Router, options?: string | { prefix?: string }): void;

    generateSpec(baseSpec: BaseSpec, options: Options, renameKeys?: any): Record<string, any>;
  }
}
