/**
 * Determine the type of release to create based on a list of commits.
 *
 * @param {Object} pluginConfig The plugin configuration.
 * @param {String} pluginConfig.preset conventional-changelog preset ('angular', 'atom', 'codemirror', 'ember', 'eslint', 'express', 'jquery', 'jscs', 'jshint')
 * @param {String} pluginConfig.config Requirable npm package with a custom conventional-changelog preset
 * @param {String|Array} pluginConfig.releaseRules A `String` to load an external module or an `Array` of rules.
 * @param {Object} pluginConfig.parserOpts Additional `conventional-changelog-parser` options that will overwrite ones loaded by `preset` or `config`.
 * @param {Object} context The semantic-release context.
 * @param {Array<Object>} context.commits The commits to analyze.
 * @param {String} context.cwd The current working directory.
 *
 * @returns {String|null} the type of release to create based on the list of commits or `null` if no release has to be done.
 */
function analyzeCommits(pluginConfig, context) {
  const {env, commits, logger} = context;


  let bumpMajorLabel="bumpMajor";
  let bumpMinorLabel="bumpMinor";

  if(!env.CI_MERGE_REQUEST_LABELS) {
    logger.log('The env variable CI_MERGE_REQUEST_LABELS is not defined');
    return false;
  }

  if(env.GITLAB_MR_BUMP_MAJOR_LABEL) {
    bumpMajorLabel=env.GITLAB_MR_BUMP_MAJOR_LABEL;
  }

  if(env.GITLAB_MR_BUMP_MINOR_LABEL) {
    bumpMinorLabel=env.GITLAB_MR_BUMP_MINOR_LABEL;
  }

  let labels = env.CI_MERGE_REQUEST_LABELS.split(',');
  
  let releaseType = "patch";

  if(labels.includes(bumpMajorLabel)) {
    releaseType="major";
  }

  if(labels.includes(bumpMinorLabel)) {
    releaseType="minor";
  }

  logger.log('Analysis of MR labels complete: %s release', releaseType || 'no');

  return releaseType;
}

module.exports = {analyzeCommits};