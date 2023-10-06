export const handler = async (event, context) => {
  const time = new Date();
  console.log(`Your handler function "${context.functionName}" ran at ${time}`);
};
