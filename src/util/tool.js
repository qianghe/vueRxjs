/**
 * use for mock fetch waiting time
 * 
 * @param {*} timer delay time
 */
export const delay = (timer = 1000) => new Promise(resolve => setTimeout(() => resolve(), timer))
