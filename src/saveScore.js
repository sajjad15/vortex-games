import { supabase } from './supabaseClient'

export async function saveScore(game, score, userId, playerName) {
  const result = await supabase
    .from('leaderboard')
    .insert([{ game: game, score: score, user_id: userId, player_name: playerName }])
  return result
}

export async function getBestScore(game, userId, higherIsBetter) {
  const result = await supabase
    .from('leaderboard')
    .select('score')
    .eq('user_id', userId)
    .eq('game', game)
    .order('score', { ascending: !higherIsBetter })
    .limit(1)
  if (result.data && result.data.length > 0) {
    return result.data[0].score
  }
  return null
}