import { useCallback, useEffect, useRef, useState } from 'react'

type Screen = 'start' | 'playing' | 'ended'

const HOLE_COUNT = 9
const MAX_MISSES = 3

function Mole({ visible, active, whacked, onHit }: { visible: boolean; active: boolean; whacked: boolean; onHit: () => void }) {
  return (
    <>
      <button
        type="button"
        className={`mole-hitbox ${visible ? 'is-visible' : ''} ${active ? 'is-active' : ''} ${whacked ? 'is-whacked' : ''}`}
        disabled={!active}
        onClick={(event) => {
          event.stopPropagation()
          if (active && !whacked) onHit()
        }}
        aria-label={active ? '打地鼠！' : '地鼠洞'}
        tabIndex={active ? 0 : -1}
      >
        <span className="mole">
          <span className="mole-ear mole-ear-left" />
          <span className="mole-ear mole-ear-right" />
          <span className="mole-face">
            <i className="mole-eye eye-left" /><i className="mole-eye eye-right" />
            <i className="mole-blush blush-left" /><i className="mole-blush blush-right" />
            <i className="mole-nose" /><i className="mole-mouth" />
          </span>
        </span>
      </button>
      {whacked && <span className="hit-pop" aria-hidden="true">+1</span>}
    </>
  )
}

function OfficeScene({
  screen, score, misses, activeHole, whackedHole, onHit, onMiss, onStart, onRestart,
}: {
  screen: Screen; score: number; misses: number; activeHole: number | null; whackedHole: number | null
  onHit: (index: number) => void; onMiss: () => void; onStart: () => void; onRestart: () => void
}) {
  return (
    <main className="app-shell">
      <div className="ambient ambient-one" /><div className="ambient ambient-two" />
      <header className="topbar">
        <a className="brand" href="#top" aria-label="桌邊小鼠首頁"><span className="brand-mark">✿</span><span>桌邊小鼠</span></a>
        <div className="top-note"><span className="status-dot" /> 辦公室休息時間</div>
        <div className="top-actions"><span className="tiny-chip">DESK BREAK</span><span className="avatar">M</span></div>
      </header>

      <section className="game-layout" id="top">
        <div className="intro-column">
          <div className="eyebrow"><span className="eyebrow-line" /> 午後小小放風</div>
          <h1>桌邊小鼠<span>出沒中！</span></h1>
          <p className="intro-copy">文件先放一邊，來玩一局再回去工作吧。<br />盯緊桌面，別讓小傢伙溜走！</p>

          <div className="score-card">
            <div className="score-label">本局得分 <span className="sparkle">✦</span></div>
            <div className="score-number">{score.toString().padStart(2, '0')}</div>
            <div className="score-divider" />
            <div className="miss-label">失誤次數 <span className="miss-count">{misses}<small> / {MAX_MISSES}</small></span></div>
            <div className="miss-pips" aria-label={`失誤 ${misses} 次，共 ${MAX_MISSES} 次`}>{Array.from({ length: MAX_MISSES }, (_, i) => <span key={i} className={i < misses ? 'pip pip-filled' : 'pip'} />)}</div>
          </div>

          <div className="howto"><span className="howto-icon">⌖</span><div><strong>怎麼玩</strong><p>點擊探頭的小鼠得分<br />點空桌扣分；小鼠縮回不算失誤</p></div></div>
          <div className="keyboard-note"><span>✦</span> 不限時間，三次失誤就結束</div>
        </div>

        <div className="scene-column">
          <div className="scene-label"><span className="scene-label-icon">☀</span><span>MY LITTLE OFFICE</span><span className="scene-label-dots">•••</span></div>
          <div
            className="office-scene"
            onClick={(event) => {
              if (screen !== 'playing') return

              const target = event.target as HTMLElement
              // The holes are a playable area even where their top row overlaps the wall.
              // Elsewhere, only clicks on the desktop count; wall and monitor clicks are ignored.
              if (target.closest('.wall, .monitor')) return
              const bounds = event.currentTarget.getBoundingClientRect()
              const clickY = event.clientY - bounds.top
              if (target.closest('.holes-grid') || clickY >= bounds.height * 0.6) onMiss()
            }}
          >
            <div className="wall">
              <div className="wall-shelf"><span className="shelf-book book-one" /><span className="shelf-book book-two" /><span className="shelf-book book-three" /><span className="shelf-plant">♧</span></div>
              <div className="window"><div className="window-sky"><span className="cloud cloud-one" /><span className="cloud cloud-two" /><span className="sun" /><span className="far-building building-one" /><span className="far-building building-two" /><span className="far-building building-three" /><span className="window-mullion" /></div><div className="window-sill" /></div>
              <div className="pinned-note note-one">今天也要<br />好好休息！<span>♡</span></div>
              <div className="pinned-note note-two"><span className="note-check">✓</span><br />記得喝水</div>
              <div className="wall-clock"><span>10</span><i>•</i><b>2</b></div>
            </div>
              <div className="plant plant-left"><span className="plant-leaves">♣</span><span className="plant-pot" /></div>
              <div className="desk-lamp"><span className="lamp-shade" /><span className="lamp-neck" /><span className="lamp-base" /></div>
              <div className="monitor"><div className="monitor-frame"><div className="monitor-screen"><div className="screen-top"><i /><i /><i /></div><div className="screen-code"><span /><span /><span /><span /><span /></div><div className="screen-sticker">♡</div></div><span className="monitor-rgb" /></div><span className="monitor-neck" /><span className="monitor-foot" /></div>
              <div className="mug"><span>☕</span><i /></div>
              <div className="desk-edge"><div className="desk-top" /><div className="desk-front"><span className="drawer" /><span className="drawer-handle" /><span className="desk-leg leg-left" /><span className="desk-leg leg-right" /></div></div>
              <div className="keyboard"><div className="key-row">▦ ▦ ▦ ▦ ▦ ▦ ▦ ▦</div><div className="keyboard-rgb" /></div>
              <div className="mouse"><span className="mouse-wheel" /><span className="mouse-rgb" /></div>
              <div className="paper-stack"><i /><i /><i /><span>TO-DO</span></div>
              <div className="desk-calendar"><span>OCT</span><b>19</b><i>MON</i></div>
              <div className="desk-mat" />

      <div className="holes-grid" aria-label="打地鼠遊戲區">
                {Array.from({ length: HOLE_COUNT }, (_, index) => <div className="hole-cell" key={index}><div className="hole"><Mole active={activeHole === index} visible={activeHole === index || whackedHole === index} whacked={whackedHole === index} onHit={() => onHit(index)} /></div></div>)}
              </div>

              {screen === 'start' && <div className="screen-overlay"><div className="overlay-card start-card"><div className="overlay-flower">✿</div><div className="overlay-kicker">A LITTLE DESK BREAK</div><h2>抓到你了！</h2><p>小鼠趁你工作時跑到桌上，<br />快來把牠們抓回去吧！</p><button className="primary-button" onClick={onStart}>開始遊戲 <span>→</span></button><div className="overlay-hint">點小鼠得分 · 點空桌扣分 · 三次失誤結束</div></div></div>}
              {screen === 'ended' && <div className="screen-overlay"><div className="overlay-card result-card"><div className="overlay-flower">☕</div><div className="overlay-kicker">BREAK TIME IS OVER</div><h2>辛苦啦！</h2><p>小鼠已經回到牠的洞裡，<br />準備好再挑戰一次了嗎？</p><div className="result-score"><span>本局得分</span><strong>{score}</strong></div><button className="primary-button" onClick={onRestart}>再玩一次 <span>↻</span></button><div className="overlay-hint">本次失誤 {misses} 次</div></div></div>}
              <div className="scene-caption"><span className="caption-dot" /> OFFICE 01 <span>・</span> 小鼠出沒中</div>
            </div>
            <div className="scene-shadow" />
          <footer className="game-footer"><span>TAKE A BREATH, YOU’RE DOING GREAT.</span><span className="footer-stars">✦ ✧ ✦</span></footer>
        </div>
      </section>
      <div className="page-footnote">MADE WITH A LITTLE BREAK <span>♡</span></div>
    </main>
  )
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('start')
  const [score, setScore] = useState(0)
  const [misses, setMisses] = useState(0)
  const [activeHole, setActiveHole] = useState<number | null>(null)
  const [whackedHole, setWhackedHole] = useState<number | null>(null)
  const spawnTimeoutRef = useRef<number | undefined>(undefined)
  const hideTimeoutRef = useRef<number | undefined>(undefined)

  const clearTimers = useCallback(() => {
    window.clearTimeout(spawnTimeoutRef.current)
    window.clearTimeout(hideTimeoutRef.current)
  }, [])

  const spawnMole = useCallback(() => {
    setActiveHole((previous) => {
      let next = Math.floor(Math.random() * HOLE_COUNT)
      if (HOLE_COUNT > 1 && next === previous) next = (next + 1 + Math.floor(Math.random() * (HOLE_COUNT - 1))) % HOLE_COUNT
      return next
    })
    setWhackedHole(null)
    hideTimeoutRef.current = window.setTimeout(() => {
      setActiveHole(null)
      spawnTimeoutRef.current = window.setTimeout(spawnMole, 420 + Math.random() * 520)
    }, 1050 + Math.random() * 500)
  }, [])

  useEffect(() => () => clearTimers(), [clearTimers])

  const startGame = () => {
    clearTimers()
    setScore(0); setMisses(0); setActiveHole(null); setWhackedHole(null)
    setScreen('playing')
    spawnTimeoutRef.current = window.setTimeout(spawnMole, 550)
  }

  const endGame = useCallback(() => {
    clearTimers()
    setActiveHole(null)
    setScreen('ended')
  }, [clearTimers])

  const hitMole = (index: number) => {
    if (screen !== 'playing' || activeHole !== index) return
    clearTimers()
    setScore((value) => value + 1)
    setWhackedHole(index)
    setActiveHole(null)
    spawnTimeoutRef.current = window.setTimeout(spawnMole, 430 + Math.random() * 430)
  }

  const miss = () => {
    if (screen !== 'playing') return
    setScore((value) => Math.max(0, value - 1))
    const nextMisses = misses + 1
    setMisses(nextMisses)
    if (nextMisses >= MAX_MISSES) endGame()
  }

  return <OfficeScene screen={screen} score={score} misses={misses} activeHole={activeHole} whackedHole={whackedHole} onHit={hitMole} onMiss={miss} onStart={startGame} onRestart={startGame} />
}
