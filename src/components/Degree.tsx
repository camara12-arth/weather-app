import type React from "react"

const Degree = ({ temp }: { temp: number }): React.JSX.Element => (
  <>
    <span>
      {temp}
      <sup>o</sup>C
    </span>
  </>
)

export default Degree
