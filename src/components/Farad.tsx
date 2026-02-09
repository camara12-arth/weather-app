import type React from "react"

const Farad = ({ temp }: { temp: number }): React.JSX.Element => (
  <>
    <span>
      {Math.round(temp*9/5 + 32)}
      <sup>o</sup>F
    </span>
  </>
)

export default Farad
