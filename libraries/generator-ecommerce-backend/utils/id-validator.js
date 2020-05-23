const idRegex = /^[a-z0-9](?:\-?[a-z0-9])*$/

module.exports.validator = (value, name = "id") => {
  return idRegex.test(value) || `${name} must be lowercase alphanumeric, words may be optionally separated by dashes`
}