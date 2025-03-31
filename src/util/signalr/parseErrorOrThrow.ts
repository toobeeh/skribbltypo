/**
 * Try to parse a SignalR error message from anything, if it fails, throw the error
 * @param error
 */
export const parseSignalRError = (error: unknown) => {
  if(!(error instanceof Error)) throw error;

  const matches = error?.message.match(/.*'(.*)'.*\. (.*): (.*)/);
  if(matches) {
    if(matches.length < 3) throw error;
    const [, hub, exception, message] = matches;

    return {
      hub,
      exception,
      message
    };
  }

  else throw error;
};