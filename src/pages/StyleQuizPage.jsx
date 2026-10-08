import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'

const options = [
  { label: 'Everyday polished', search: 'casual' },
  { label: 'Office-ready', search: 'blazer' },
  { label: 'Statement event look', search: 'dress' },
  { label: 'Gift inspiration', search: 'accessories' },
]

export default function StyleQuizPage() {
  const [choice, setChoice] = useState(null)
  return <div className="min-h-screen bg-gray-50 py-16"><div className="container-custom max-w-2xl"><Card className="text-center"><Sparkles className="mx-auto text-accent-500" size={32} /><span className="eyebrow justify-center mt-4">Personal styling</span><h1 className="mt-3 font-display text-3xl sm:text-4xl">Find your next favourite look</h1><p className="mt-3 text-gray-600">Tell us what you are shopping for and we will start you with a curated edit.</p><div className="mt-8 grid gap-3 sm:grid-cols-2">{options.map((option) => <button key={option.label} onClick={() => setChoice(option)} className={`rounded-lg border p-4 text-left font-semibold transition-colors ${choice?.label === option.label ? 'border-primary-600 bg-primary-50 text-primary-800' : 'border-gray-200 hover:border-accent-400'}`}>{option.label}</button>)}</div>{choice && <div className="mt-8"><p className="mb-4 font-medium text-primary-800">Your edit is ready: {choice.label}</p><Link to={`/products?search=${encodeURIComponent(choice.search)}`}><Button variant="accent">See my recommendations</Button></Link></div>}</Card></div></div>
}
