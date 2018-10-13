const DEBUG = (process.env['DEBUG'] === 'true')

function debug(msg, value) {
  if (!DEBUG)
    return;
  console.log('========== DEBUG ==========');
  console.log(`${msg}:`, value);
}

module.exports = {
  debug,
};
