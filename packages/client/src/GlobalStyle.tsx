import {Global, css} from "@emotion/react"

const globalStyle = css`
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400&display=swap');

  body {
    margin: 0;
    font-family: 'Noto Sans KR', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    padding: 0;
    color: #333;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }
`

export const GlobalStyle:React.FC = () => {
  return <Global styles={globalStyle} />
}

export default GlobalStyle;