import {
  Parser, regex, alt, string, newline, whitespace, Node as PNode, letters, oneOf,
} from 'parsimmon'

export type NodeNames = 'mention' | 'userMention' | 'quote' | 'link' | 'bold' | 'code' | 'codeBlock' | 'italic' | 'strikethrough'
export type Node = string | PNode<NodeNames, string>

export const textParser = (): Parser<Node[]> => {
  return element().many()
}

const element = () => {
  return alt(
    quote(),
    codeBlock(),
    mention(),
    link(),
    bold(),
    code(),
    italic(),
    strikethrough(),
    separateChar(),
    leftChars(),
  )
}

const mention = () => {
  return alt(
    userMention(),
    teamMention(),
    reservedMention(),
  )
}

const userMention = () => {
  return regex(/[0-9A-Z]+/)
    .wrap(string('<@'), string('>'))
    .node('userMention')
}

const teamMention = () => {
  // 一旦IDは捨てる
  return regex(/[0-9A-Z]+\|@([^>]+)/, 1)
    .wrap(string('<!subteam^'), string('>'))
    .node('mention')
}

// ex) here / channel / everyone
const reservedMention = () => {
  return letters
    .wrap(string('<!'), string('>'))
    .node('mention')
}

const link = () => {
  return regex(/[^>]+/)
    .wrap(string('<'), string('>'))
    .node('link')
}

const quote = () => {
  return string('&gt; ')
    .then(regex(/.*\n?/))
    .node('quote')
}

const bold = () => {
  return regex(/[^*]+/)
    .wrap(string('*'), string('*'))
    .node('bold')
}

const code = () => {
  return regex(/[^`]+/)
    .wrap(string('`'), string('`'))
    .node('code')
}

const codeBlock = () => {
  // TODO: link考慮
  return regex(/^```([\s\S]+?)```\n?/, 1)
    .node('codeBlock')
}

const italic = () => {
  return regex(/[^_]+/)
    .wrap(string('_'), string('_'))
    .node('italic')
}

const strikethrough = () => {
  return regex(/[^~]+/)
    .wrap(string('~'), string('~'))
    .node('strikethrough')
}

const separateChar = () => {
  return alt(
    newline,
    whitespace,
    string('<'),
  )
}

const leftChars = () => {
  return regex(/[^\n <]+/)
}
