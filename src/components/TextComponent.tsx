import React, { PropsWithChildren, useEffect, useState } from 'react'
import { Node, textParser } from '../models/text'
import { Typography, Link } from '@mui/material'
import { unescape } from '../utils/string'
import { sequential } from '../utils/promise'
import { useAsyncEffect } from '../utils/hook'
import { useRecoilState } from 'recoil'
import { User } from '../models/user'
import Slack from '../services/slack'
import { userState } from '../services/state'

interface Props {
  text: string
}
interface ColorProps {
  color: string
}

const Bold = ({ text }: Props) => (
  <span style={{ fontWeight: 'bold' }}>{text}</span>
)
const Italic = ({ text }: Props) => (
  <span style={{ fontStyle: 'italic' }}>{text}</span>
)
const Strikethrough = ({ text }: Props) => (
  <span style={{ textDecoration: 'line-through' }}>{text}</span>
)
export const QuoteBase = ({ color, children }: PropsWithChildren<ColorProps>) => (
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
      backgroundColor: color,
    },
  }}>
    {children}
  </Typography>
)
const Quote = ({ text }: Props) => (
  <QuoteBase color="#ddd">{text}</QuoteBase>
)
const Code = ({ text }: Props) => (
  <span style={{
    color: '#e01e5a',
    backgroundColor: '#1d1c1d0a',
    border: '1px solid #1d1c1d21',
    borderRadius: '2px',
    padding: '2px',
  }}>
    {text}
  </span>
)
export const BlockBase = ({ color, children }: PropsWithChildren<ColorProps>) => (
  <div style={{
    backgroundColor: `${color}`,
    border: '1px solid #1d1c1d21',
    borderRadius: '4px',
    padding: '8px',
    margin: '4px auto',
  }}>
    {children}
  </div>
)
const CodeBlock = ({ text }: Props) => (
  <BlockBase color="#1d1c1d0a">{text}</BlockBase>
)
const Mention = ({ text }: Props) => (
  <span style={{
    color: '#1264a3',
    backgroundColor: '#1d9bd11A',
  }}>
    @{text}
  </span>
)
const UserMention = ({ text }: Props) => {
  const [username, setUsername] = useState(text)
  const [user] = useRecoilState(userState)

  useAsyncEffect(async () => {
    if (!user) return
    const client = new Slack(user)
    const info = await client.fetchUserInfo(text)
    setUsername(info.username)
  }, [user, text])

  return <Mention text={username}/>
}
const TextLink = ({ link, label }: {link: string, label: string}) => {
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
  if (typeof node === 'string') return <>{unescape(node)}</>

  const text = unescape(node.value)
  switch (node.name) {
    case 'bold':
      return <Bold text={text}/>
    case 'italic':
      return <Italic text={text}/>
    case 'strikethrough':
      return <Strikethrough text={text}/>
    case 'code':
      return <Code text={text}/>
    case 'codeBlock':
      return <CodeBlock text={text}/>
    case 'quote':
      return <Quote text={text}/>
    case 'mention':
      return <Mention text={text}/>
    case 'userMention':
      return <UserMention text={text}/>
    case 'link':
      const [link, label] = text.split('|')
      return <TextLink link={link} label={label}/>
    default:
      return <>{node.value}</>
  }
}

const parser = textParser()

const TextComponents = ({ message }: { message: string }) => {
  const [nodes, setNodes] = useState<Node[]>([])
  useEffect(() => {
    const res = parser.parse(message)
    setNodes(res.status ? res.value : [message])
  }, [message])

  return (
    <>
      {nodes.map((node, idx) => <TextComponent key={idx} node={node}/>)}
    </>
  )
}

export default TextComponents
