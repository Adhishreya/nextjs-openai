export async function register() {
    // New Relic's APM agent relies on Node.js core modules. 
    // It is NOT compatible with the Edge runtime, so we must wrap the import.
    if (process.env.NEXT_RUNTIME === 'nodejs') {
      // Dynamically import the agent so it initializes before other modules
      await import('newrelic');
      
      // Note: If you are using a legacy version of the New Relic agent (pre v12.0.0),
      // you will need to use `await import('@newrelic/next');` instead.
    }
  }