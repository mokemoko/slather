import {
  Parser,
  regex,
  alt,
  string,
  letters,
  newline,
  makeFailure,
  makeSuccess, whitespace, Node as PNode,
} from 'parsimmon'

export type NodeNames = 'mention' | 'quote' | 'link' | 'bold' | 'code' | 'codeBlock' | 'italic' | 'strikethrough'
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
    newline,
    whitespace,
    regex(/[^ \n]+/),
  )
}

const mention = () => {
  return alt(
    userMention(),
    groupMention(),
  )
}

const userMention = () => {
  return regex(/[0-9A-Z]+/)
    .wrap(string('<@'), string('>'))
    .node('mention')
}

const groupMention = () => {
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
  return regex(/^```([\s\S]+)```\n?/, 1)
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

const bol = () => {
  return Parser((input, index) => {
    if (index === 0 || input.charAt(index - 1) === '\n') {
      return makeSuccess(index, '')
    } else {
      return makeFailure(index, 'current position is not beginning of line')
    }
  })
}
