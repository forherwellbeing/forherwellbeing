export const TWEAK_DEFAULTS = {
  accentColor:  '#B05A72',
  sidebarColor: '#3D1A35',
  density:      'comfortable',
}

export const mkT = (tw = {}) => ({
  sidebar:     tw.sidebarColor || '#3D1A35',
  accent:      tw.accentColor  || '#B05A72',
  accentBg:    (tw.accentColor || '#B05A72') + '1A',
  accentLight: '#F4E8EC',
  bg:          '#FAF8F5',
  card:        '#FFFFFF',
  text:        '#1A1A2E',
  muted:       '#7A7A8A',
  border:      '#EDE8E5',
  success:     '#52A67A',
  warning:     '#D4854A',
  info:        '#5B8DD9',
  danger:      '#D45B5B',
  pad:         tw.density === 'compact' ? 16 : 24,
})
