function PixelIcon(props) {
  return (
    <svg width="40" height="40" viewBox="0 0 12 12" shapeRendering="crispEdges">
      {props.rects.map((r, i) => (
        <rect
          key={i}
          x={r[0]}
          y={r[1]}
          width={r[2]}
          height={r[3]}
          fill={r[4] ? '#0a0a0a' : props.color}
        />
      ))}
    </svg>
  )
}

export function IconBolt(props) {
  const rects = [[6,0,3,1],[5,1,3,1],[4,2,3,1],[3,3,6,1],[5,4,4,1],[5,5,3,1],[4,6,3,1],[3,7,3,1],[3,8,2,1],[2,9,2,1]]
  return <PixelIcon color={props.color} rects={rects} />
}

export function IconCircle(props) {
  const rects = [[0,3,1,1],[1,4,1,1],[2,5,1,1],[3,6,1,1],[4,7,1,1],[4,3,1,1],[3,4,1,1],[1,6,1,1],[0,7,1,1],[8,3,3,1],[7,4,1,3],[11,4,1,3],[8,7,3,1]]
  return <PixelIcon color={props.color} rects={rects} />
}

export function IconGrid(props) {
  const rects = [[1,1,4,4],[7,1,4,4],[1,7,4,4],[7,7,4,4]]
  return <PixelIcon color={props.color} rects={rects} />
}

export function IconCards(props) {
  const rects = [[1,3,5,8],[5,1,1,8,1],[6,1,5,8],[8,3,1,3,1],[7,4,3,1,1]]
  return <PixelIcon color={props.color} rects={rects} />
}

export function IconBrick(props) {
  const rects = [[0,0,3,2],[4,0,4,2],[9,0,3,2],[1,3,4,2],[6,3,5,2],[5,7,2,2],[3,10,6,1]]
  return <PixelIcon color={props.color} rects={rects} />
}

export function IconSnake(props) {
  const rects = [[3,1,7,2],[3,3,2,2],[3,5,7,2],[8,7,2,2],[2,9,8,2],[8,1,1,1,1],[0,5,2,2]]
  return <PixelIcon color={props.color} rects={rects} />
}

export function IconWing(props) {
  const rects = [[3,3,5,1],[2,4,7,5],[3,9,5,1],[9,5,3,2],[7,4,1,1,1],[3,6,3,2,1]]
  return <PixelIcon color={props.color} rects={rects} />
}

export function IconFootprint(props) {
  const rects = [[6,1,5,3],[9,2,1,1,1],[3,4,6,4],[0,5,3,2],[9,6,2,1],[4,8,2,3],[7,8,2,3]]
  return <PixelIcon color={props.color} rects={rects} />
}

export function IconBlocks(props) {
  const rects = [[0,0,3,3],[3,0,3,3],[6,0,3,3],[3,3,3,3],[6,7,3,3],[9,7,3,3],[3,10,3,2],[6,10,3,2]]
  return <PixelIcon color={props.color} rects={rects} />
}

export function IconTower(props) {
  const rects = [[5,0,2,2],[4,3,4,2],[3,6,6,2],[1,9,10,2]]
  return <PixelIcon color={props.color} rects={rects} />
}

export function IconAlien(props) {
  const rects = [[3,0,1,1],[8,0,1,1],[4,1,1,1],[7,1,1,1],[3,2,6,1],[2,3,8,1],[1,4,10,2],[1,6,1,3],[10,6,1,3],[3,6,6,1],[3,7,1,1],[8,7,1,1],[4,8,2,1],[6,8,2,1],[3,4,2,1,1],[7,4,2,1,1]]
  return <PixelIcon color={props.color} rects={rects} />
}

export function IconUser(props) {
  return (
    <svg width="24" height="24" viewBox="0 0 12 12" shapeRendering="crispEdges">
      <rect x="4" y="1" width="4" height="4" fill={props.color} />
      <rect x="3" y="6" width="6" height="1" fill={props.color} />
      <rect x="2" y="7" width="8" height="4" fill={props.color} />
    </svg>
  )
}