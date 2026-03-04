'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { PostEditor } from '@/components/admin/PostEditor'

function NewPostContent() {
  const searchParams = useSearchParams()
  const translationGroupId = searchParams.get('translation_group_id') || undefined
  const locale = searchParams.get('locale') || undefined

  return (
    <PostEditor
      mode="create"
      initialTranslationGroupId={translationGroupId}
      initialLocale={locale}
    />
  )
}

export default function NewPostPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
        </div>
      }
    >
      <NewPostContent />
    </Suspense>
  )
}
