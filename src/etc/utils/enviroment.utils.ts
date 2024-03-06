export class EnvironmentUtils {
    private readonly environment: string | null | undefined;
  
    constructor() {
      this.environment = process.env.NODE_ENV || 'development';
    }
  
    isProduction(): boolean {
      return this.environment.toLowerCase() === 'production';
    }
  
    getEnvironment(): string {
      return this.environment;
    }
  }