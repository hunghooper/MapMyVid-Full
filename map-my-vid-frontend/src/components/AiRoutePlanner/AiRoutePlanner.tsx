import { useState } from 'react'
import { useGenerateRoute, useGenerateRouteWithAudio } from '../../hooks/useAiRoute'
import { useAudioRecorder } from '../../hooks/useAudioRecorder'
import { AudioPlayer } from '../AudioPlayer'
import { RoutePreferences, AudioRouteResponse } from '../../api/ai-agent.api'

export function AiRoutePlanner() {
  const [preferences, setPreferences] = useState<RoutePreferences>({
    timeOfDay: 'morning',
    transportation: 'walking',
    duration: 4,
    maxDistance: 10
  })
  const [isVoiceMode, setIsVoiceMode] = useState(false)
  const [routeData, setRouteData] = useState<AudioRouteResponse | null>(null)

  const generateRouteMutation = useGenerateRoute()
  const generateRouteWithAudioMutation = useGenerateRouteWithAudio()

  const audioRecorder = useAudioRecorder({
    maxDuration: 60,
    onRecordingComplete: (audioBlob) => {
      generateRouteWithAudioMutation.mutate(audioBlob, {
        onSuccess: (response) => {
          setRouteData(response.data)
        }
      })
    },
    onError: (error) => {
      console.error('Recording error:', error)
    }
  })

  const handleGenerateRoute = () => {
    generateRouteMutation.mutate(preferences, {
      onSuccess: (response) => {
        setRouteData(response.data)
      }
    })
  }

  const handleVoiceModeToggle = () => {
    setIsVoiceMode(!isVoiceMode)
    if (isVoiceMode) {
      audioRecorder.resetRecording()
    }
  }

  // Helper functions to get data from either source
  const getRouteData = () => {
    return generateRouteMutation.data?.data || routeData
  }

  const getSummary = () => {
    return getRouteData()?.summary
  }

  const getRoute = () => {
    return getRouteData()?.route || []
  }

  const getRecommendations = () => {
    return getRouteData()?.recommendations || []
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-light text-gray-900 mb-2">AI Route Planner</h2>
          <p className="text-gray-500 text-sm">Plan your perfect journey with AI</p>
        </div>
        
        {/* Voice Mode Toggle */}
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500 font-medium">
            {isVoiceMode ? 'Voice' : 'Text'}
          </span>
          <button
            onClick={handleVoiceModeToggle}
            disabled={!audioRecorder.isSupported}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-200 ${
              isVoiceMode ? 'bg-gray-900' : 'bg-gray-200'
            } ${!audioRecorder.isSupported ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-all duration-200 ${
                isVoiceMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {!audioRecorder.isSupported && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-amber-800 text-sm text-center">
            Voice mode is not supported in your browser. Please use text mode or try Chrome/Firefox.
          </p>
        </div>
      )}

      {isVoiceMode ? (
        /* Voice Mode UI */
        <div className="mb-6">
          <div className="text-center">
            <h3 className="text-xl font-light text-gray-900 mb-3">Speak Your Preferences</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Tell us about your preferences, like "I want to walk around in the morning for about 2 hours"
            </p>
            
            {/* Recording Button */}
            <div className="flex flex-col items-center space-y-6">
              <button
                onClick={audioRecorder.isRecording ? audioRecorder.stopRecording : audioRecorder.startRecording}
                disabled={generateRouteWithAudioMutation.isPending}
                className={`w-24 h-24 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-105 ${
                  audioRecorder.isRecording
                    ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-200'
                    : 'bg-gray-900 hover:bg-gray-800 shadow-lg shadow-gray-200'
                } ${generateRouteWithAudioMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {audioRecorder.isRecording ? (
                  <div className="w-8 h-8 bg-white rounded-sm"></div>
                ) : (
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                    <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                  </svg>
                )}
              </button>
              
              {audioRecorder.isRecording && (
                <div className="text-center space-y-4">
                  <p className="text-sm text-gray-500 font-medium">Recording... {audioRecorder.duration}s</p>
                  <div className="w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-500 transition-all duration-300 ease-out"
                      style={{ width: `${(audioRecorder.duration / 60) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-center space-x-1">
                    {Array.from({ length: 12 }, (_, i) => (
                      <div
                        key={i}
                        className={`w-1 rounded-full transition-all duration-150 ${
                          audioRecorder.audioLevel > i / 12 ? 'bg-red-500' : 'bg-gray-200'
                        }`}
                        style={{
                          height: `${Math.max(8, 24 * audioRecorder.audioLevel)}px`
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {generateRouteWithAudioMutation.isPending && (
                <div className="text-center space-y-3">
                  <div className="w-8 h-8 mx-auto">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-900"></div>
                  </div>
                  <p className="text-sm text-gray-500">AI is analyzing your voice...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Text Mode UI */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Time of Day</label>
              <select
                value={preferences.timeOfDay}
                onChange={(e) => setPreferences(prev => ({
                  ...prev,
                  timeOfDay: e.target.value as any
                }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 bg-white"
              >
                <option value="morning">Morning (6:00 - 12:00)</option>
                <option value="afternoon">Afternoon (12:00 - 18:00)</option>
                <option value="evening">Evening (18:00 - 22:00)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Transportation</label>
              <select
                value={preferences.transportation}
                onChange={(e) => setPreferences(prev => ({
                  ...prev,
                  transportation: e.target.value as any
                }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 bg-white"
              >
                <option value="walking">Walking</option>
                <option value="driving">Driving</option>
                <option value="public_transport">Public Transport</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Duration (hours)</label>
              <input
                type="number"
                min="1"
                max="12"
                value={preferences.duration}
                onChange={(e) => setPreferences(prev => ({
                  ...prev,
                  duration: parseInt(e.target.value)
                }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 bg-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Max Distance (km)</label>
              <input
                type="number"
                min="1"
                max="50"
                value={preferences.maxDistance}
                onChange={(e) => setPreferences(prev => ({
                  ...prev,
                  maxDistance: parseInt(e.target.value)
                }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 bg-white"
              />
            </div>
          </div>
        </div>
      )}

      {!isVoiceMode && (
        <div className="pt-2">
          <button
            onClick={handleGenerateRoute}
            disabled={generateRouteMutation.isPending}
            className="w-full bg-gray-900 text-white py-4 px-6 rounded-xl font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            {generateRouteMutation.isPending ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Generating route...</span>
              </div>
            ) : (
              'Generate AI Route'
            )}
          </button>
        </div>
      )}

      {(generateRouteMutation.data || routeData) && (
        <div className="mt-6 space-y-4">
          <div className="text-center">
            <h3 className="text-2xl font-light text-gray-900 mb-2">Your AI Route</h3>
            <p className="text-gray-500">Optimized based on your preferences</p>
          </div>
          
          {/* Audio Player */}
          {routeData?.audioUrl && (
            <div className="bg-gray-50 rounded-2xl p-4">
              <AudioPlayer
                audioUrl={routeData.audioUrl}
                title="AI Route Guidance"
                onPlay={() => console.log('Audio started')}
                onPause={() => console.log('Audio paused')}
                onEnded={() => console.log('Audio ended')}
              />
            </div>
          )}
          
          <div className="bg-gray-50 rounded-2xl p-4">
            <h4 className="text-lg font-medium text-gray-900 mb-3">Route Summary</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-light text-gray-900">{getSummary()?.totalDuration}</div>
                <div className="text-sm text-gray-500">Duration</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-light text-gray-900">{getSummary()?.totalDistance}</div>
                <div className="text-sm text-gray-500">Distance</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-light text-gray-900">{getSummary()?.transportationMode}</div>
                <div className="text-sm text-gray-500">Transport</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-light text-gray-900">{getSummary()?.bestTimeToStart}</div>
                <div className="text-sm text-gray-500">Start Time</div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {getRoute().map((item: any, index: number) => (
              <div key={index} className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-sm transition-shadow duration-200">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {item.order}
                  </div>
                  <div className="flex-1">
                    <h5 className="text-lg font-medium text-gray-900 mb-2">{item.name}</h5>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">{item.estimatedDuration}</p>
                      <p className="text-sm text-gray-500">{item.transportation}</p>
                      {item.notes && (
                        <p className="text-sm text-gray-600 mt-2 p-3 bg-gray-50 rounded-lg">{item.notes}</p>
                      )}
                      {item.location?.googleMapsUrl && (
                        <a
                          href={item.location.googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200 mt-2"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          View on Google Maps
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {getRecommendations().length > 0 && (
            <div className="bg-gray-50 rounded-2xl p-4">
              <h4 className="text-lg font-medium text-gray-900 mb-3">Recommendations</h4>
              <div className="space-y-3">
                {getRecommendations().map((rec: string, index: number) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-gray-700">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {(generateRouteMutation.error || generateRouteWithAudioMutation.error) && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-600 text-sm text-center">
            Error: {(generateRouteMutation.error || generateRouteWithAudioMutation.error)?.message}
          </p>
        </div>
      )}

      {audioRecorder.error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-600 text-sm text-center">
            Recording error: {audioRecorder.error}
          </p>
        </div>
      )}
    </div>
  )
}
