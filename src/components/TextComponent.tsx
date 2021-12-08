import React from 'react'
import { Node as PNode } from 'parsimmon'
import { Node, NodeNames } from '../models/text'
import { Typography, Link } from '@mui/material'

const Bold = ({ node }: { node: PNode<NodeNames, string> }) => (
  <span style={{ fontWeight: 'bold' }}>{node.value}</span>
)
const Italic = ({ node }: { node: PNode<NodeNames, string> }) => (
  <span style={{ fontStyle: 'italic' }}>{node.value}</span>
)
const Strikethrough = ({ node }: { node: PNode<NodeNames, string> }) => (
  <span style={{ textDecoration: 'line-through' }}>{node.value}</span>
)
const Quote = ({ node }: { node: PNode<NodeNames, string> }) => (
  <Typography sx={{
    position: 'relative',
    paddingLeft: 2,
    '&:before': {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      display: 'block',
      content: '""',
      width: 4,
      backgroundColor: '#ddd',
    },
  }}>
    {node.value}
  </Typography>
)
const Code = ({ node }: { node: PNode<NodeNames, string> }) => (
  <span style={{
    color: '#e01e5a',
    backgroundColor: '#1d1c1d0a',
    border: '1px solid #1d1c1d21',
    borderRadius: '2px',
    padding: '2px',
  }}>
    {node.value}
  </span>
)
const CodeBlock = ({ node }: { node: PNode<NodeNames, string> }) => (
  <div style={{
    backgroundColor: '#1d1c1d0a',
    border: '1px solid #1d1c1d21',
    borderRadius: '4px',
    padding: '8px',
    margin: '4px auto',
  }}>
    {node.value}
  </div>
)
const Mention = ({ node }: { node: PNode<NodeNames, string> }) => (
  <span style={{
    color: '#1264a3',
    backgroundColor: '#1d9bd11A',
  }}>
    @{node.value}
  </span>
)
const TextLink = ({ node }: { node: PNode<NodeNames, string> }) => {
  const [link, label] = node.value.split('|')
  return (
    <Link
      target="_blank"
      rel="noreferrer"
      href={link}
    >
      {label || link}
    </Link>
  )
}

const TextComponent = ({ node }: { node: Node }) => {
  if (typeof node === 'string') return <>{node}</>
  switch (node.name) {
    case 'bold':
      return <Bold node={node}/>
    case 'italic':
      return <Italic node={node}/>
    case 'strikethrough':
      return <Strikethrough node={node}/>
    case 'code':
      return <Code node={node}/>
    case 'codeBlock':
      return <CodeBlock node={node}/>
    case 'quote':
      return <Quote node={node}/>
    case 'mention':
      return <Mention node={node}/>
    case 'link':
      return <TextLink node={node}/>
    default:
      return <>{node.value}</>
  }
}

export default TextComponent
