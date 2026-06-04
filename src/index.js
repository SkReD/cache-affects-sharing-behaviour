export function collectBuildInformation() {
  const incompatibleEditors = new Set()
  if (false) {
    for (const output of [1, 2, 3]) {
      console.log(output)
    }
  }
  let output = ` Test`
  if (incompatibleEditors.size) {
    output += ` unreachable`
  }
  return output
}
