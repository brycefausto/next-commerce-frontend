import { PathParams } from '@/types'
import { redirect, useParams, useRouter } from 'next/navigation'

export default function useSlug() {
  const { slug } = useParams<PathParams>()
  const router = useRouter()

  const addSlug = (url: string) => `/${slug}${url}`

  return {
    slug,
    addSlug,
    slugRedirect: (url: string) => redirect(addSlug(url)),
    slugRouterPush: (url: string) => router.push(addSlug(url)),
  }
}
