// @see: https://www.typescriptlang.org/play?ssl=14&ssc=75&pln=1&pc=1#code/C4TwDgpgBAygdgQwNYQCoHsDCCC2EA22AzhADwxQQAewEcAJkVEcAE4CWcA5gHxQC8AKCixKNOoygADACQBvTgDMIrKKgC+AfXlKVUAKrqpUAPzDp8jfOxh2wBPnYAvMvGRosuAsTL6ePIygALnMYQUFQSChsPHwMNxQfcjFaBiYWDm4+IREKalTJWQU4ZVUrYtKDQLMRItQUiSYbOwdnMlQ+EygAIk1u4J7u9XkAGXQAdxUAYwQSUg7huRiCeMRE2d8A4xDc8MjoZbj0AAVZmcIN5PzG5jZOXgFohFt7RxdyHgjwaFOic4xDkk8uI0rdMg9+AY4DMXq13jBPvsoL9-ugEhAgQ1QRl7tknrFVu4kvpoc8Wm9XP4vlF0RgUQ5MddsXcso9mq82uQ1h5AZcEZ9qdBUABGYWPWmeWJJboACwI+HQ3T4AHplT05fgFd1BWphQAmcXcgFeC5zWXy9CacboVj4ehKqCq9UWgDqNrt2qRIoAzIb3MapZdzZrLcAiFb3faVWrgwrUEQ3bb7TqRQAWP0oAPeIMahURpP9AA+PUU6EtACMEKwHU7Y+hEx6oMXuqX0AAhKue766gCsGZ5JqSONZTuHXB1ADlHqm9SnhQA2ftZ01kKTAOWaBBwIiTViadjh+QTozRnrriAAQW3u4AkkQZ-0ABRIqeQmcASj23dQerFkMOhLrGauaKqedZdlEP4Gv+JqARiOaupGNYxiB+Yeimeq+jBBJoty0ogfGDZRo6KEWpoYZocmKben++IrCcZwMghIZKtR0F0Uc9IrqQdZEaxXrelhHF0ox3F1oRSECl6qa0RKXH4Ra-HfjOS4MX8THAWR1oFoiylCXJokKSG5HhtpHpSd+Pa0Vxy7SgAEopumQT27E2ZK2Zmg5IZ8U5Qo9kJbm8p5FoSTpX6QfO1miXB9mOSm86udFuFEkGXkKj58UBUl6KxSGoXmeF0A3nAYAAK7AKg3aQnI5hENymgzCQmgoCAmjCkEUBwKVODlioAA0tX1Y1EDNRArV6h1Y4DeohVQAA8uVZUVVVUByFAADaADSUCcFALXoIoUDFUtlVRLMsBGu53GbTwAC6HXHeVp0QFtt1QDNyoAFTmEiC3ACdK01SIwPMHhGybWN7Wdd1vWsAA3OYIN1SlJAQyAE1gvcCMiDNn3KuEX3fVAn1QMIJMAKIgkQ7DoHAHWYLTABuKjAJ1EAsBA9BQGArDoJArDAOw7Nk6TxP40ij3LZAE7s7QXPVYN7gNRso2tVDQPA8jKDK01LVtVDY6I6DSvDarbUY4bOMDSIWsjabesWyyXDTbNEpBRAMsc-Q8x4vUTKSOg5YAFYQFMrNdBrW07XAe1jQdahQOdbuDpc20AGSY1k90Xf6V0+J7cvzK9nzqAMqCzX9APS7LnOqe7Bec6QkvPQ39A8EAA

// export type SnakeToCamelCase<S extends string> = S extends `${infer T}_${infer U}`
//   ? `${T}${Capitalize<SnakeToCamelCase<U>>}`
//   : S;

// export type CamelToSnakeCase<S extends string> = S extends `${infer T}${infer U}`
//   ? `${T extends Capitalize<T> ? '_' : ''}${Lowercase<T>}${CamelToSnakeCase<U>}`
//   : S;

const snakeToCamel = (s: string) => s.replace(/(_\w)/g, (k) => k[1].toUpperCase());

/** Remaps a snake_cased object into a camelCased object */
export function snakeToCamelObject<T extends Record<string, unknown>>(obj: T) {
  return Object.fromEntries(Object.entries(obj).map(([key, value]) => [snakeToCamel(key), value]));
}

const camelToSnake = (s: string) => s.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);

/** Remaps a snake_cased object into a camelCased object */
export function camelToSnakeObject(obj: Record<string, unknown>) {
  return Object.entries(obj).reduce<Record<string, unknown>>((result, [key, value]) => {
    result[camelToSnake(key)] = value;
    return result;
  }, {});
}
