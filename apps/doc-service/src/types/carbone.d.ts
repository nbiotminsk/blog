declare module 'carbone' {
  interface CarboneOptions {
    tempPath?: string;
    factories?: number;
    startFactory?: boolean;
  }

  interface RenderOptions {
    convertTo?: string;
    complement?: Record<string, unknown>;
    lang?: string;
    translations?: Record<string, string>;
    currencySource?: string;
    currencyTarget?: string;
    currencyRates?: Record<string, number>;
  }

  interface CarboneStatic {
    render(
      templatePath: string,
      data: Record<string, unknown>,
      options: RenderOptions | ((err: Error | null, result: Buffer) => void),
      callback?: (err: Error | null, result: Buffer) => void
    ): void;
    
    set(options: CarboneOptions): void;
    
    reset(): void;
  }

  const carbone: CarboneStatic;
  export default carbone;
}
