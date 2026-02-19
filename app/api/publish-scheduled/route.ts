import { createServiceClient } from '@/lib/supabase-service'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  // Verify authorization header
  const authHeader = request.headers.get('authorization')
  const expectedAuth = `Bearer ${process.env.CRON_SECRET}`

  if (!authHeader || authHeader !== expectedAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()

  // Fetch posts eligible for publishing
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('id, slug')
    .eq('status', 'scheduled')
    .lte('scheduled_at', new Date().toISOString())

  if (error) {
    console.error('[publish-scheduled] Error fetching scheduled posts:', error)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }

  if (!posts || posts.length === 0) {
    return NextResponse.json({ published: 0, posts: [] })
  }

  // Publish all eligible posts in a single update
  const ids = posts.map((p: { id: string; slug: string }) => p.id)
  const { error: updateError } = await supabase
    .from('blog_posts')
    .update({ status: 'published', published_at: new Date().toISOString() })
    .in('id', ids)

  if (updateError) {
    console.error('[publish-scheduled] Error publishing posts:', updateError)
    return NextResponse.json({ error: 'Failed to publish posts' }, { status: 500 })
  }

  const slugs = posts.map((p: { id: string; slug: string }) => p.slug)
  console.log(`[publish-scheduled] Published ${posts.length} post(s): ${slugs.join(', ')}`)

  return NextResponse.json({ published: posts.length, posts: slugs })
}
