import { NextResponse } from 'next/server'

const AMAZON_TAG = 'scootmartae-21'

const safetyGear = [
  {
    id: 'helmet',
    name: 'Safety Helmet',
    description: 'RTA-approved certified helmet',
    emoji: '⛑️',
    price: 'AED 89+',
    url: `https://www.amazon.ae/s?k=electric+scooter+helmet+certified&tag=${AMAZON_TAG}`,
    required: true,
    fine: 'AED 200 fine if caught without',
  },
  {
    id: 'lock',
    name: 'U-Lock',
    description: 'Heavy-duty anti-theft lock',
    emoji: '🔒',
    price: 'AED 55+',
    url: `https://www.amazon.ae/s?k=bicycle+u+lock+heavy+duty&tag=${AMAZON_TAG}`,
    required: false,
    fine: null,
  },
  {
    id: 'vest',
    name: 'Reflective Vest',
    description: 'High-visibility vest for night riding',
    emoji: '🦺',
    price: 'AED 25+',
    url: `https://www.amazon.ae/s?k=reflective+safety+vest+cycling&tag=${AMAZON_TAG}`,
    required: false,
    fine: null,
  },
]

export async function GET() {
  return NextResponse.json(safetyGear)
}
