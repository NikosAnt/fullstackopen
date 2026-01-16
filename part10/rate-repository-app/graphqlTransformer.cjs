const { getDefaultConfig } = require('expo/metro-config')
const gqlLoader = require('graphql-tag/loader')

const gqlTransform = gqlLoader.bind({
  cacheable: () => null
})

// Resolve the upstream Babel transformer that Expo would normally use.
// We delegate to it after turning .graphql/.gql files into JS modules.
const defaultConfig = getDefaultConfig(process.cwd())
const upstreamTransformer = require(
  defaultConfig.transformer.babelTransformerPath
)

function transformGraphQL(src) {
  return gqlTransform(src)
}

module.exports.transform = function transform(props) {
  // Metro may pass either (src, filename, options) or a single object
  // depending on version/config.
  let filename
  let src
  let options
  let plugins

  if (typeof props === 'object' && props && 'filename' in props) {
    ;({ filename, src, options, plugins } = props)
  } else {
    // Older signature (rare in modern Expo/Metro)

    ;[src, filename, options] = arguments
  }

  let code = src
  if (filename.endsWith('.graphql') || filename.endsWith('.gql')) {
    code = transformGraphQL(src)
  }

  return upstreamTransformer.transform({
    filename,
    src: code,
    options,
    plugins
  })
}
