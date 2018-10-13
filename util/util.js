const DEBUG = (process.env['DEBUG'] === 'true')

function printDebug(msg, value) {
  if (!DEBUG)
    return;
  console.log('========== DEBUG ==========');
  console.log(`${msg}:`, value);
}

module.exports = {
  printDebug,
};
