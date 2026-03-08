const EUROPEAN = new Set(['C', 'E', 'F'])
const UK = new Set(['G'])
const AMERICAN = new Set(['A', 'B'])
const AUSTRALIAN = new Set(['I'])

function getAdapterNote(types: string[]): string {
  const isOnlyUK = types.every(t => UK.has(t))
  const isOnlyAustralian = types.every(t => AUSTRALIAN.has(t))
  const isOnlyAmerican = types.every(t => AMERICAN.has(t))
  const isOnlyEuropean = types.every(t => EUROPEAN.has(t))

  if (isOnlyUK) return 'UK-style adapter'
  if (isOnlyAustralian) return 'Australian adapter'
  if (isOnlyAmerican) return 'North American adapter'
  if (isOnlyEuropean) return 'Type C/F adapter'

  return `Type ${types.join(', ')} adapter`
}

function getVoltageNote(voltage: number): string {
  if (voltage >= 220) {
    return `${voltage}V — most modern electronics handle this automatically.`
  }
  return `${voltage}V — check your devices support ${voltage}V before plugging in.`
}

export function getElectricityTip(plugTypes: string | null, voltage: number | null): string | null {
  if (!plugTypes || voltage === null) return null

  const types = plugTypes.split(',').map(t => t.trim()).filter(Boolean)
  if (types.length === 0) return null

  const adapter = getAdapterNote(types)
  const voltageNote = getVoltageNote(voltage)

  return `Bring a ${adapter}. ${voltageNote}`
}
