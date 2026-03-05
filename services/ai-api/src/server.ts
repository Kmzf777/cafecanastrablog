import express from 'express'
import cors from 'cors'
import { generateRoute } from './routes/generate.js'
import { scrapeRoute } from './routes/scrape.js'
import { healthRoute } from './routes/health.js'
import { authMiddleware } from './middleware/auth.js'

const app = express()
const PORT = parseInt(process.env.PORT || '3100', 10)

// Allow requests from the Vercel frontend
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['POST', 'GET'],
}))

app.use(express.json())

// Public
app.get('/health', healthRoute)

// Protected routes — require AI_API_SECRET
app.post('/api/generate', authMiddleware, generateRoute)
app.post('/api/scrape', authMiddleware, scrapeRoute)

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[ai-api] Running on port ${PORT}`)
})
