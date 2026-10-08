import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, Shirt, Loader } from 'lucide-react'
import Card from '../ui/Card'
import api from '../../lib/api'

/**
 * Shows two AI-powered sections for a product page:
 * - "You might also like" (recommendations)
 * - "Complete the look" (style advice)
 * Both fail silently (render nothing) if the AI service errors, so a slow
 * or down AI backend never breaks the product page itself.
 */
const ProductAiInsights = ({ productId }) => {
  const navigate = useNavigate()
  const [recommendations, setRecommendations] = useState(null)
  const [style, setStyle] = useState(null)
  const [loadingRecs, setLoadingRecs] = useState(true)
  const [loadingStyle, setLoadingStyle] = useState(true)

  useEffect(() => {
    if (!productId) return
    setLoadingRecs(true)
    setLoadingStyle(true)

    api.post('/ai/recommendations', { productId })
      .then(res => setRecommendations(res.data?.recommendations || []))
      .catch(() => setRecommendations([]))
      .finally(() => setLoadingRecs(false))

    api.post('/ai/style-advice', { productId })
      .then(res => setStyle({ advice: res.data?.advice, picks: res.data?.picks || [] }))
      .catch(() => setStyle(null))
      .finally(() => setLoadingStyle(false))
  }, [productId])

  const showRecs = loadingRecs || (recommendations && recommendations.length > 0)
  const showStyle = loadingStyle || (style && (style.advice || style.picks.length > 0))

  if (!showRecs && !showStyle) return null

  return (
    <div className="space-y-6 mt-6">
      {showRecs && (
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={20} className="text-primary-600" />
            <h3 className="text-lg font-semibold">You might also like</h3>
          </div>
          {loadingRecs ? (
            <Loader size={18} className="animate-spin text-primary-600" />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {recommendations.map((p) => (
                <button
                  key={p.id}
                  onClick={() => navigate(`/products/${p.id}`)}
                  className="text-left border border-gray-200 rounded-lg p-3 hover:border-primary-500 transition-colors"
                >
                  <p className="font-medium text-sm truncate">{p.name}</p>
                  <p className="text-primary-600 font-semibold text-sm">₵{p.price}</p>
                  {p.reason && <p className="text-xs text-gray-500 mt-1">{p.reason}</p>}
                </button>
              ))}
            </div>
          )}
        </Card>
      )}

      {showStyle && (
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Shirt size={20} className="text-primary-600" />
            <h3 className="text-lg font-semibold">Complete the look</h3>
          </div>
          {loadingStyle ? (
            <Loader size={18} className="animate-spin text-primary-600" />
          ) : (
            <>
              {style.advice && <p className="text-gray-700 mb-4">{style.advice}</p>}
              {style.picks.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {style.picks.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => navigate(`/products/${p.id}`)}
                      className="text-left border border-gray-200 rounded-lg p-3 hover:border-primary-500 transition-colors"
                    >
                      <p className="font-medium text-sm truncate">{p.name}</p>
                      <p className="text-primary-600 font-semibold text-sm">₵{p.price}</p>
                      {p.reason && <p className="text-xs text-gray-500 mt-1">{p.reason}</p>}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </Card>
      )}
    </div>
  )
}

export default ProductAiInsights
