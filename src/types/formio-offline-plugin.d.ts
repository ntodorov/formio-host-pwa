declare module '@formio/offline-plugin' {
  export interface OfflinePluginOptions {
    notToShowDeletedOfflineSubmissions?: boolean;
  }

  export interface OfflinePluginInstance {
    submissionQueueLength(): number;
    dequeueSubmissions(
      skipError?: boolean,
      fromIndex?: number,
      forceDequeue?: boolean,
      predicate?: any
    ): void;
    getNextQueuedSubmission(): any;
    setNextQueuedSubmission(request: any): void;
    skipNextQueuedSubmission(): void;
    forceOffline(offline: boolean): void;
    isForcedOffline(): boolean;
    clearOfflineData(): void;
  }

  export function OfflinePlugin(
    name: string,
    projectUrl: string,
    projectJsonPath?: string,
    options?: OfflinePluginOptions
  ): any;
}
