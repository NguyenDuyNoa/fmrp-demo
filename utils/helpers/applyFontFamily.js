const applyFontFamily = (customStyles = {}) => {
  const font = `'Lexend Deca', sans-serif`

  const patchStyle = (fn) => (base, state) => ({
    ...(typeof fn === 'function' ? fn(base, state) : base),
    fontFamily: font,
  })

  const styleKeys = ['placeholder', 'menuPortal', 'control', 'option', 'multiValue', 'singleValue']

  const newStyles = {}
  for (const key of styleKeys) {
    newStyles[key] = patchStyle(customStyles[key])
  }

  return newStyles
}

export default applyFontFamily
