const patterns: Record<string, string> = {
  '&lt;': '<',
  '&gt;': '>',
  '&amp;': '&',
}

const unescape = (text: string) => text.replace(/&(lt|gt|amp);/g, match => patterns[match])

export { unescape }
