interface ProcessWithDelayOptions {
  delayMs: number;
  signal?: AbortSignal;
}

async function processWithDelay(
  numbers: number[],
  options = {
    delayMs: 1000,
    signal: undefined,
  } as ProcessWithDelayOptions,
): Promise<void> {

  // handle invalid input
  if (!Array.isArray(numbers)) {
    throw new Error('numbers must be an array');
  }

  // validate all elements are numbers
  for (const num of numbers) {
    if (typeof num !== 'number' || isNaN(num)) {
      throw new Error('numbers must be an array of numbers');
    }
  }

  // handle empty arrays gracefully
  if (numbers.length === 0) {
    return;
  }

  // track progress
  let processed = 0;
  const totalNumbers = numbers.length;

  for (const number of numbers) {
    if (options.signal?.aborted) {
      throw new Error('aborted');
    }

    console.log('Processing: ', number);

    await new Promise<void>((resolve) => {
      const timeoutId = setTimeout(resolve, options.delayMs);

      if (options.signal) {
        options.signal.addEventListener('abort', () => {
          clearTimeout(timeoutId);
          resolve();
        }, { once: true });
      }
    });

    processed += 1;
    const progressPercent = (processed / totalNumbers) * 100;
    console.log(`Progress: ${progressPercent.toFixed(1)}% (${processed}/${totalNumbers})`);
  }
}

async function homePage() {
  // 1. test with default options
  await processWithDelay([1, 2, 3, 4]);

  // 2. test with custom options
  await processWithDelay([1, 2, 3], {
    delayMs: 500,
  });

  // 3. test with signal
  const controller = new AbortController();

  // abort after 1.5 seconds
  setTimeout(() => {
    controller.abort();
  }, 1500)

  await processWithDelay([1, 2, 3], {
    delayMs: 1000,
    signal: controller.signal,
  });
}

homePage();

